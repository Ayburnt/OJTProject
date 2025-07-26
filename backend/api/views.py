# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist

# Import the NEW serializers
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    GoogleLoginSerializer, # NEW
    GoogleRegisterSerializer # NEW
)
from .models import CustomUser

# Helper function to get tokens for a user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'role': user.role, # Include role in the response
        'phone_number': user.phone_number, # Include new field
        'birthday': user.birthday.isoformat() if user.birthday else None, # Include new field, format as ISO string
        'gender': user.gender, # Include new field
    }

class UserRegistrationView(APIView):
    """
    API endpoint for user registration with email and password.
    """
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save() # This calls the create method in the serializer
                tokens = get_tokens_for_user(user)
                return Response({
                    'message': 'User registered successfully.',
                    'user': {
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'profile_picture': user.profile_picture,
                        'role': user.role,
                        'phone_number': user.phone_number,
                        'birthday': user.birthday.isoformat() if user.birthday else None,
                        'gender': user.gender,
                    },
                    'tokens': tokens,
                }, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response(
                    {'email': ['A user with that email already exists.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                print(f"Error during manual user registration: {e}")
                return Response(
                    {'detail': 'An unexpected error occurred during registration.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    """
    API endpoint for user login with email and password.
    Returns JWT tokens upon successful authentication.
    """
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Login successful.',
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': user.profile_picture,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                },
                'tokens': tokens,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleAuthRegisterView(APIView):
    """
    API endpoint for Google OAuth registration.
    Receives Google ID token, verifies it, and creates/updates user.
    If the user already exists, it logs them in.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        # Use the NEW GoogleRegisterSerializer here
        serializer = GoogleRegisterSerializer(data=request.data) # <--- Changed to GoogleRegisterSerializer
        if serializer.is_valid():
            google_user_info = serializer.get_user_info()
            email = google_user_info.get('email')
            first_name = google_user_info.get('given_name', '')
            last_name = google_user_info.get('family_name', '')
            profile_picture = google_user_info.get('picture', None)
            
            # Get role from serializer's validated_data (will have default if not provided)
            role = serializer.validated_data.get('role', 'guest')

            print(f"VIEWS: Attempting Google registration for email: {email}")
            print(f"VIEWS: Role received from GoogleRegisterSerializer: {role}")

            try:
                user = CustomUser.objects.get(email=email)
                print(f"VIEWS: User with email {email} found. Updating details and role.")

                # Only update fields that Google provides or are meant to be updated
                user.first_name = first_name
                user.last_name = last_name
                user.profile_picture = profile_picture
                # Update role with the role provided during Google registration (if different)
                user.role = role
                user.save()
                print(f"VIEWS: Role after saving existing user: {user.role}")
                message = "User already exists and details updated. Logging in."
                status_code = status.HTTP_200_OK

            except CustomUser.DoesNotExist:
                print(f"VIEWS: User with email {email} does not exist. Creating new user.")
                try:
                    user = CustomUser.objects.create_user(
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        profile_picture=profile_picture,
                        role=role, # This applies the role for new users
                        phone_number=None, # Explicitly set to None for new Google users
                        birthday=None,     # Explicitly set to None for new Google users
                        gender=None,       # Explicitly set to None for new Google users
                        is_active=True
                    )
                    user.set_unusable_password() # Google users don't have a password set directly
                    user.save()
                    print(f"VIEWS: Role after saving new user: {user.role}")
                    message = "User registered via Google successfully."
                    status_code = status.HTTP_201_CREATED

                except IntegrityError as e:
                    print(f"VIEWS: IntegrityError CAUGHT during Google user creation for email {email}: {e}")
                    return Response(
                        {'detail': 'A user with this Google account email already exists. Please log in instead.'},
                        status=status.HTTP_409_CONFLICT
                    )
                except Exception as e:
                    print(f"VIEWS: Error creating Google user: {e}")
                    return Response(
                        {'detail': 'An unexpected error occurred during Google registration.'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            tokens = get_tokens_for_user(user)
            return Response({
                'message': message,
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': user.profile_picture,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                },
                'tokens': tokens,
            }, status=status_code)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleAuthLoginView(APIView):
    """
    Handles Google login by verifying the ID token and logging in the user.
    If the user doesn't exist, it indicates they need to register.
    """
    permission_classes = [] # Allow unauthenticated access for login

    def post(self, request, *args, **kwargs):
        # Use the NEW GoogleLoginSerializer here
        print(f"Incoming request data to GoogleAuthLoginView: {request.data}")
        serializer = GoogleLoginSerializer(data=request.data) # <--- Changed to GoogleLoginSerializer
        serializer.is_valid(raise_exception=True) # This will raise 400 if token is invalid

        google_user_info = serializer.get_user_info()
        email = google_user_info.get('email')

        if not email:
            return Response({"detail": "Google token did not contain an email address."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Try to find the user by email in your database
            user = CustomUser.objects.get(email=email)

            # If the user exists, log them in and generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful!",
                "user": {
                    "email": user.email,
                    "role": user.role, # Return the role from your database (e.g., 'client')
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "profile_picture": user.profile_picture,
                    "phone_number": user.phone_number,
                    "birthday": user.birthday.isoformat() if user.birthday else None,
                    "gender": user.gender,
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            }, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            # If the user does not exist, they need to register first
            return Response({"detail": "User not found. Please register first using Google Sign-Up."},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error during Google login process: {e}")
            return Response({"detail": "An unexpected error occurred during login."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)