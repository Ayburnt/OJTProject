# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings # To access GOOGLE_CLIENT_ID from settings

# For Google ID token verification
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with email, password, and role.
    Includes password confirmation, phone number, and birthday.
    """
    company_name = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True)
    company_website = serializers.URLField(max_length=500, required=False, allow_blank=True, allow_null=True)
    # Added min_length to password fields
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, min_length=8)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, default='guest') # Updated default role
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True) # New field
    birthday = serializers.DateField(required=False, allow_null=True) # New field
    gender = serializers.CharField(max_length=10, required=False, allow_blank=True, allow_null=True) # Added gender field
    profile_picture = serializers.URLField(max_length=500, required=False, allow_blank=True, allow_null=True) # New field for profile picture

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'company_name', 'company_website', 'password', 'confirm_password', 'role', 'phone_number', 'birthday', 'gender', 'profile_picture') # Added gender
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True}, # Made optional for initial registration
            'last_name': {'required': False, 'allow_blank': True},  # Made optional for initial registration
            'email': {'required': True},
        }

    def validate(self, data):
        """
        Check that the two password fields match.
        This validation runs only if 'password' is present in data.
        """
        if 'password' in data and 'confirm_password' in data:
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        """
        Create and return a new `CustomUser` instance, given the validated data.
        """
        validated_data.pop('confirm_password') # Remove confirm_password as it's not a model field
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            company_name=validated_data.get('company_name', ''),
            company_website=validated_data.get('company_website', ''),
            role=validated_data.get('role', 'guest'), # Ensure role is set, default to 'guest'
            phone_number=validated_data.get('phone_number', None), # Save new field
            birthday=validated_data.get('birthday', None), # Save new field
            gender=validated_data.get('gender', None), # Save new field
            profile_picture=validated_data.get('profile_picture', 'https://ik.imagekit.io/cafedejur/sari-sari-events/default-profile.jpg?updatedAt=1753685867575') # Save new field
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login with email and password.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, data):
        """
        Validate user credentials and authenticate the user.
        """
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid login credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        data['user'] = user # Store the authenticated user in validated_data
        return data

# --- Base Serializer for Google Token Verification ---
class BaseGoogleAuthSerializer(serializers.Serializer):
    """
    Base serializer to handle Google ID token verification.
    Contains common logic for verifying the token.
    """
    token = serializers.CharField(required=True)

    def validate(self, data):
        token = data.get('token')
        if not token:
            raise serializers.ValidationError({"token": "Google ID token is required."})

        try:
            # IMPORTANT: Ensure settings.GOOGLE_CLIENT_ID is correctly set in your Django settings.py
            # It must match the client_id used in your frontend.
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID, clock_skew_in_seconds=10)

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                print(f"DEBUG: Google token verification failed - Wrong issuer: {idinfo.get('iss')}")
                raise ValueError('Wrong issuer.')

            # Check if the audience (aud) matches your client ID
            if idinfo['aud'] != settings.GOOGLE_CLIENT_ID:
                print(f"DEBUG: Google token verification failed - Audience mismatch. Expected: {settings.GOOGLE_CLIENT_ID}, Got: {idinfo.get('aud')}")
                raise ValueError('Audience mismatch.')

            self.google_user_info = idinfo
            print(f"DEBUG: Google token successfully verified. Email: {idinfo.get('email')}")
            return data
        except ValueError as ve:
            print(f"DEBUG: Google token verification ValueError: {ve}")
            raise serializers.ValidationError(f"Invalid Google ID token: {ve}")
        except Exception as e:
            print(f"DEBUG: Google token verification general Exception: {e}")
            raise serializers.ValidationError(f"Google token verification failed: {e}")

    def get_user_info(self):
        return self.google_user_info

# --- Google Login Serializer (no 'role' field) ---
class GoogleLoginSerializer(BaseGoogleAuthSerializer):
    """
    Serializer for Google login.
    Only expects the 'token'. The user's role is determined from the database.
    """
    pass # Inherits 'token' and 'validate' from BaseGoogleAuthSerializer

# --- Google Registration Serializer (with 'role' field) ---
class GoogleRegisterSerializer(BaseGoogleAuthSerializer):
    """
    Serializer for Google registration.
    Expects 'token' and 'role' from the frontend.
    """
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, default='guest', required=False)
    # Add other fields here if your Google registration process collects them
    # e.g., phone_number = serializers.CharField(required=False, allow_blank=True)
    # e.g., birthday = serializers.DateField(required=False, allow_null=True)
    # e.g., gender = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        # Call the parent validate to verify the token
        data = super().validate(data)
        # Add any additional validation specific to Google registration here
        return data

# --- NEW: Serializer for Profile Update ---
class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile information.
    Does NOT include password fields.
    """
    class Meta:
        model = CustomUser
        fields = (
            'first_name', 'last_name', 'phone_number', 'birthday', 'gender',
            'company_name', 'company_website'
        )
        # Make all fields optional for partial updates
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False, 'allow_blank': True, 'allow_null': True},
            'birthday': {'required': False, 'allow_null': True},
            'gender': {'required': False, 'allow_blank': True, 'allow_null': True},
            'company_name': {'required': False, 'allow_blank': True, 'allow_null': True},
            'company_website': {'required': False, 'allow_blank': True, 'allow_null': True},
        }
        read_only_fields = ('email', 'role') # Email and role should not be updated via this serializer


# --- NEW: Serializers for Email Check and OTP ---
class EmailCheckSerializer(serializers.Serializer):
    """
    Serializer for checking if an email exists.
    """
    email = serializers.EmailField()

class OTPSendSerializer(serializers.Serializer):
    """
    Serializer for sending OTP to an email.
    """
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    """
    Serializer for verifying OTP.
    """
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6) # Ensure 6 digits
