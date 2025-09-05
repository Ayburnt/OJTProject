# api/views.py
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.core.cache import cache
import random
import boto3
from botocore.exceptions import ClientError
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
import requests


# Import all necessary serializers
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    GoogleLoginSerializer,
    GoogleRegisterSerializer,
    EmailCheckSerializer,
    OTPSendSerializer,
    OTPVerifySerializer,
    ProfileUpdateSerializer, # Import the new serializer
    UserSerializer,
    
)
from .models import CustomUser

# Helper function to get tokens for a user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'role': user.role,
        'phone_number': user.phone_number,
        'birthday': user.birthday.isoformat() if user.birthday else None,
        'gender': user.gender,
        'company_name': user.company_name, # Include company info in tokens
        'company_website': user.company_website, # Include company info in tokens
        'user_code': user.user_code,
    }

# Configure AWS SES client using settings from settings.py
try:
    ses_client = boto3.client(
        'ses',
        region_name=settings.AWS_SES_REGION_NAME,
        aws_access_key_id=settings.AWS_SES_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SES_SECRET_ACCESS_KEY
    )
    print("AWS SES client initialized successfully.")
except Exception as e:
    print(f"Error initializing AWS SES client: {e}")
    ses_client = None


class UserRegistrationView(APIView):
    """
    API endpoint for user registration with email and password.
    """
    authentication_classes = [] # No authentication needed for registration
    permission_classes = [] # No permissions needed for registration

    def post(self, request):
        # ✅ 1. Get captcha token
        captcha_token = request.data.get("captcha")
        print("📌 Captcha token from frontend:", captcha_token)  # Debug

        if not captcha_token:
            return Response(
                {"error": "Captcha token missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ 2. Verify with Google
        secret_key = os.getenv("RECAPTCHA_SECRET_KEY", settings.RECAPTCHA_SECRET_KEY)
        print("📌 Using secret key (first 6 chars):", secret_key[:6], "******")  # Debug

        verify_url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {"secret": secret_key, "response": captcha_token}

        try:
            r = requests.post(verify_url, data=payload)
            result = r.json()
            print("📌 Google verification result:", result)  # Debug

            if not result.get("success"):
                return Response(
                    {
                        "error": "Invalid reCAPTCHA. Please try again.",
                        "details": result,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response(
                {"error": f"Error verifying reCAPTCHA: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        data = request.data.copy()
        if 'captcha' in data:
            data.pop('captcha')
        
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save() # This calls the create method in the serializer
                tokens = get_tokens_for_user(user)

                # Determine if profile completion is needed based on role
                needs_profile_completion = user.role == 'organizer'

                # --- Send Account Confirmation Email ---
                sender_email = settings.DEFAULT_FROM_EMAIL
                subject = "Welcome to Sari-Sari Events! Your Account is Ready"
                
                context = {
                    'first_name': user.first_name,
                    'email': user.email,
                }
                html_confirmation_body = render_to_string('api/emails/account_confirmation.html', context)
                text_confirmation_body = strip_tags(html_confirmation_body)

                if ses_client:
                    try:
                        ses_client.send_email(
                            Source=sender_email,
                            Destination={
                                'ToAddresses': [user.email],
                            },
                            Message={
                                'Subject': {'Data': subject},
                                'Body': {
                                    'Html': {'Data': html_confirmation_body},
                                    'Text': {'Data': text_confirmation_body},
                                },
                            }
                        )
                        print(f"Account confirmation email sent to {user.email}")
                    except ClientError as e:
                        print(f"SES Error sending confirmation email: {e.response['Error']['Message']}")
                    except Exception as e:
                        print(f"General Error sending confirmation email: {e}")
                else:
                    print("SES client not initialized. Cannot send confirmation email.")
                # --- END NEW ---

                return Response({
                    'message': 'User registered successfully.',
                    'user': {
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'profile_picture': user.profile_picture,
                        'org_logo': request.build_absolute_uri(user.org_logo.url) if user.org_logo else None,
                        'role': user.role,
                        'phone_number': user.phone_number,
                        'birthday': user.birthday.isoformat() if user.birthday else None,
                        'gender': user.gender,
                        'company_name': user.company_name,
                        'company_website': user.company_website,
                        'needs_profile_completion': needs_profile_completion, # Flag for frontend
                        'user_code': user.user_code,
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
        # Add this line to print serializer errors when validation fails
        print("UserRegistrationView serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    """
    API endpoint for user login with email and password.
    Returns JWT tokens upon successful authentication.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)

            # Determine if profile completion is needed based on role and missing fields
            # For login, if they are a client and any required fields are missing, flag it.
            needs_profile_completion = user.role == 'organizer' and (
                not user.phone_number or
                not user.birthday or
                not user.gender or
                not user.company_name or # Assuming company_name is required for clients
                not user.company_website or# Assuming company_website is required for clients
                not user.user_code
            )

            return Response({
                'message': 'Login successful.',
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': user.profile_picture,
                    'org_logo': request.build_absolute_uri(user.org_logo.url) if user.org_logo else None,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'needs_profile_completion': needs_profile_completion, # Flag for frontend
                    'user_code': user.user_code,
                    'verification_status': user.verification_status,
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
        # ✅ 1. Get captcha token
        captcha_token = request.data.get("captcha")
        print("📌 Captcha token from frontend:", captcha_token)  # Debug

        if not captcha_token:
            return Response(
                {"error": "Captcha token missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ 2. Verify with Google
        secret_key = os.getenv("RECAPTCHA_SECRET_KEY", settings.RECAPTCHA_SECRET_KEY)
        print("📌 Using secret key (first 6 chars):", secret_key[:6], "******")  # Debug

        verify_url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {"secret": secret_key, "response": captcha_token}

        try:
            r = requests.post(verify_url, data=payload)
            result = r.json()
            print("📌 Google verification result:", result)  # Debug

            if not result.get("success"):
                return Response(
                    {
                        "error": "Invalid reCAPTCHA. Please try again.",
                        "details": result,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response(
                {"error": f"Error verifying reCAPTCHA: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        data = request.data.copy()
        if 'captcha' in data:
            data.pop('captcha')

        serializer = GoogleRegisterSerializer(data=request.data) # Use GoogleRegisterSerializer
        if serializer.is_valid():
            google_user_info = serializer.get_user_info()
            email = google_user_info.get('email')
            first_name = google_user_info.get('given_name', '')
            last_name = google_user_info.get('family_name', '')
            profile_picture = google_user_info.get('picture', None)
            
            # Get role from serializer's validated_data
            role = serializer.validated_data.get('role', 'organizer')

            print(f"VIEWS: Attempting Google registration for email: {email}")
            print(f"VIEWS: Role received from GoogleRegisterSerializer: {role}")

            try:
                user = CustomUser.objects.get(email=email)
                print(f"VIEWS: User with email {email} found. Updating details and role.")

                user.first_name = first_name
                user.last_name = last_name
                user.profile_picture = profile_picture
                user.role = role # This is where the role from frontend is applied
                # Do NOT overwrite phone_number, birthday, gender, company_name, company_website here
                # They will be filled in the separate profile completion step.
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
                        # Set these to None as they are not provided by Google at this stage
                        phone_number=None,
                        birthday=None,
                        gender=None,
                        company_name=None, # Explicitly set to None for new Google users
                        company_website=None, # Explicitly set to None for new Google users
                        is_active=True,
                        user_code=None
                    )
                    user.set_unusable_password() # Google users don't have a password
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
            needs_profile_completion = user.role == 'organizer' # Flag for frontend

            return Response({
                'message': message,
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': user.profile_picture,
                    'org_logo': request.build_absolute_uri(user.org_logo.url) if user.org_logo else None,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'needs_profile_completion': needs_profile_completion, # Flag for frontend
                    'user_code': user.user_code,
                    'verification_status': user.verification_status,
                },
                'tokens': tokens,
            }, status=status_code)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleAuthLoginView(APIView):
    """
    API endpoint for Google OAuth login.
    Receives Google ID token, verifies it, and logs in the existing user.
    If the user does not exist, it returns an error prompting them to sign up.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        print(f"Incoming request data to GoogleAuthLoginView: {request.data}")
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        google_user_info = serializer.get_user_info()
        email = google_user_info.get('email')

        if not email:
            return Response({"detail": "Google token did not contain an email address."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            print(f"VIEWS: User with email {email} found for Google login. Updating details.")

            user.first_name = google_user_info.get('given_name', user.first_name)
            user.last_name = google_user_info.get('family_name', user.last_name)
            user.profile_picture = google_user_info.get('picture', user.profile_picture)
            
            # Do NOT overwrite phone_number, birthday, gender, company_name, company_website during login from Google
            # They should retain existing values or remain None.
            user.save()
            
            tokens = get_tokens_for_user(user)
            
            # Determine if profile completion is needed based on role and missing fields
            needs_profile_completion = user.role == 'organizer' and (
                not user.phone_number or
                not user.birthday or
                not user.gender or
                not user.company_name or # Assuming company_name is required for clients
                not user.company_website or # Assuming company_website is required for clients
                not user.user_code
            )

            return Response({
                'message': 'Logged in via Google successfully.',
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': user.profile_picture,
                    'org_logo': request.build_absolute_uri(user.org_logo.url) if user.org_logo else None,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'user_code': user.user_code,
                    'needs_profile_completion': needs_profile_completion, # Flag for frontend  
                    'verification_status': user.verification_status,                  
                },
                'tokens': tokens,
            }, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            print(f"VIEWS: User with email {email} does not exist for Google login. Prompting sign up.")
            return Response({"detail": "User with this Google account does not exist. Please sign up first."},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"VIEWS: Error during Google login process: {e}")
            return Response({"detail": "An unexpected error occurred during login."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- NEW: Profile Completion View ---
class ProfileCompletionView(APIView):
    """
    API endpoint for users to complete their profile information.
    Requires authentication.
    """
    # Uncomment and configure these if you have JWT authentication set up
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        # In a real app, you'd ensure the user is authenticated.
        # For this example, we'll assume request.user is available via middleware.
        # If not using JWTAuthentication, you'd need a different way to get the user.
        user = request.user 
        if not user.is_authenticated: # Fallback if authentication_classes/permission_classes are not used
             return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)


        # Use the new ProfileUpdateSerializer
        serializer = ProfileUpdateSerializer(instance=user, data=request.data, partial=True) 
        if serializer.is_valid():
            # The serializer's save method will handle updating the instance
            serializer.save()

            # Re-fetch user to ensure all fields are up-to-date in the response
            user.refresh_from_db()

            return Response({
                'message': 'Profile updated successfully.',
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': user.profile_picture,
                    'org_logo': request.build_absolute_uri(user.org_logo.url) if user.org_logo else None,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'needs_profile_completion': False, # Profile is now complete
                    'user_code': user.user_code,
                    'verification_status': user.verification_status,
                }
            }, status=status.HTTP_200_OK)

        if 'user_code' in serializer.errors:
            if any(err.code == 'unique' for err in serializer.errors['user_code']):
                return Response(
                    {'user_code' : ['The provided organization code is already taken. Please choose a different one.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
        print("ProfileCompletionView serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- API Views for Email Check and OTP ---
class CheckEmailExistsView(APIView):
    """
    API endpoint to check if an email is already registered.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = EmailCheckSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            if CustomUser.objects.filter(email=email).exists():
                return Response({'exists': True, 'message': 'This email is already registered.'}, status=status.HTTP_200_OK)
            return Response({'exists': False, 'message': 'Email is available.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(APIView):
    """
    API endpoint to send a 6-digit OTP to the provided email.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = OTPSendSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Generate a 6-digit OTP
            otp = str(random.randint(100000, 999999))
            
            # Store OTP in cache with a 5-minute expiry
            # Key format: 'otp_<email>'
            cache.set(f'otp_{email}', otp, timeout=300) # 300 seconds = 5 minutes

            # Render HTML email from template
            context = {'otp': otp}
            html_body = render_to_string('api/emails/otp_verification.html', context)
            
            # Plain text fallback (good practice for email clients that don't render HTML)
            text_body = strip_tags(html_body) # Automatically generate plain text from HTML

            sender_email = settings.DEFAULT_FROM_EMAIL
            subject = "Your Sari-Sari Events Verification Code"

            if not ses_client:
                return Response({'detail': 'Email service not configured. Cannot send OTP.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                response = ses_client.send_email(
                    Source=sender_email,
                    Destination={
                        'ToAddresses': [
                            email,
                        ],
                    },
                    Message={
                        'Subject': {
                            'Data': subject,
                        },
                        'Body': {
                            'Html': { # Use 'Html' for HTML content
                                'Data': html_body,
                            },
                            'Text': { # Provide a plain text fallback
                                'Data': text_body,
                            },
                        },
                    }
                )
                print(f"SES Email sent! Message ID: {response['MessageId']}")
                return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)
            except ClientError as e:
                error_message = e.response.get('Error', {}).get('Message', 'An AWS SES error occurred.')
                print(f"SES Error: {error_message}")
                return Response({'detail': f'Failed to send verification code: {error_message}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                print(f"General Error sending OTP: {e}")
                return Response({'detail': 'An unexpected error occurred while sending OTP.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """
    API endpoint to verify the provided OTP for an email.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            entered_otp = serializer.validated_data['otp']

            stored_otp = cache.get(f'otp_{email}')

            if stored_otp and stored_otp == entered_otp:
                # Optionally, you can clear the OTP from cache after successful verification
                cache.delete(f'otp_{email}')
                # You might want to mark the user's email as verified in your CustomUser model here
                # user = CustomUser.objects.get(email=email)
                # user.email_verified = True # Assuming you have this field
                # user.save()
                return Response({'detail': 'Email verified successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid or expired verification code.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ResetOTPView(APIView):
    """
    API endpoint to send a 6-digit OTP to the provided email for password reset.
    Includes a check to ensure the email belongs to a registered user.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = OTPSendSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            # --- IMPORTANT: Add user existence check here ---
            User = get_user_model()
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Return a 400 Bad Request to avoid user enumeration
                # This tells the user "we can't process this request"
                # without confirming if the email exists or not.
                return Response(
                    {"detail": "No account found with that email address."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # --- End of user existence check ---

            # Generate a 6-digit OTP
            otp = str(random.randint(100000, 999999))

            # Store OTP in cache with a 5-minute expiry
            cache.set(f'otp_{email}', otp, timeout=300) # 300 seconds = 5 minutes

            # Render HTML email from template
            context = {'otp': otp}
            html_body = render_to_string('api/emails/resetpassword_confirmation.html', context)

            # Plain text fallback
            text_body = strip_tags(html_body)

            sender_email = settings.DEFAULT_FROM_EMAIL
            subject = "Your Sari-Sari Events Verification Code"

            # Ensure ses_client is configured and available
            # You might need to import boto3 and initialize ses_client at the top of views.py
            # For example:
            # import boto3
            # ses_client = boto3.client('ses', region_name=settings.AWS_SES_REGION)
            # Make sure settings.AWS_SES_REGION is defined in your settings.py
            global ses_client # If ses_client is defined globally outside the class
            if not ses_client:
                return Response({'detail': 'Email service not configured. Cannot send OTP.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                response = ses_client.send_email(
                    Source=sender_email,
                    Destination={
                        'ToAddresses': [
                            email,
                        ],
                    },
                    Message={
                        'Subject': {
                            'Data': subject,
                        },
                        'Body': {
                            'Html': {
                                'Data': html_body,
                            },
                            'Text': {
                                'Data': text_body,
                            },
                        },
                    }
                )
                print(f"SES Email sent! Message ID: {response['MessageId']}")
                return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)
            except ClientError as e:
                error_message = e.response.get('Error', {}).get('Message', 'An AWS SES error occurred.')
                print(f"SES Error: {error_message}")
                return Response({'detail': f'Failed to send verification code: {error_message}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                print(f"General Error sending OTP: {e}")
                return Response({'detail': 'An unexpected error occurred while sending OTP.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        if not email or not new_password:
            return Response(
                {"detail": "Email and new password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist: # <--- This catches the error if the user doesn't exist
            return Response(
                {"detail": "User with this email does not exist."},
                status=status.HTTP_404_NOT_FOUND # <--- Returns a 404 status
            )

        # Basic password validation (you should add more robust validation here)
        if len(new_password) < 6:
            return Response(
                {"detail": "New password must be at least 6 characters long."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.password = make_password(new_password)
        user.save()

        return Response(
            {"detail": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )

class CurrentUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            # Handle both ImageField and CharField cases
            'profile_picture': (
                request.build_absolute_uri(user.profile_picture.url)
                if hasattr(user.profile_picture, "url") else
                (request.build_absolute_uri(user.profile_picture) if user.profile_picture else None)
            ),
            'org_logo': request.build_absolute_uri(user.org_logo.url) if user.org_logo else None,
            'role': user.role,
            'phone_number': user.phone_number,
            'birthday': user.birthday.isoformat() if user.birthday else None,
            'gender': user.gender,
            'company_name': user.company_name,
            'company_website': user.company_website,
            'user_code': user.user_code,
            'qr_code_image': (
                request.build_absolute_uri(user.qr_code_image.url)
                if user.qr_code_image else None
            ),
            'qr_profile_link': user.qr_profile_link,
            'verification_status': user.verification_status,
        })

    def patch(self, request):
        user = request.user
        data = request.data

        # Only update editable fields
        editable_fields = ["first_name", "last_name", "phone_number", "company_name", "company_website"]
        for field in editable_fields:
            if field in data:
                setattr(user, field, data[field])

        user.save()

        return Response({
            "message": "Profile updated successfully",
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "company_name": user.company_name,
            "company_website": user.company_website,
        }, status=status.HTTP_200_OK)
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not current_password or not new_password:
        return Response({"detail": "Both current and new passwords are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({"detail": "Current password is incorrect."},
                        status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({"detail": "New password must be at least 6 characters."},
                        status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)

from rest_framework.permissions import AllowAny

class OrganizerListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role="organizer")
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                first_name__icontains=search
            ) | queryset.filter(
                last_name__icontains=search
            ) | queryset.filter(
                email__icontains=search
            )
        return queryset