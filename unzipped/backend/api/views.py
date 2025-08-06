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

# For authentication and permissions (uncomment and configure if needed)
# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.authentication import JWTAuthentication

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
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save() # This calls the create method in the serializer
                tokens = get_tokens_for_user(user)

                # Determine if profile completion is needed based on role
                needs_profile_completion = user.role == 'client'

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
                        'role': user.role,
                        'phone_number': user.phone_number,
                        'birthday': user.birthday.isoformat() if user.birthday else None,
                        'gender': user.gender,
                        'company_name': user.company_name,
                        'company_website': user.company_website,
                        'needs_profile_completion': needs_profile_completion, # Flag for frontend
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
            needs_profile_completion = user.role == 'client' and (
                not user.phone_number or
                not user.birthday or
                not user.gender or
                not user.company_name or # Assuming company_name is required for clients
                not user.company_website # Assuming company_website is required for clients
            )

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
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'needs_profile_completion': needs_profile_completion, # Flag for frontend
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
        serializer = GoogleRegisterSerializer(data=request.data) # Use GoogleRegisterSerializer
        if serializer.is_valid():
            google_user_info = serializer.get_user_info()
            email = google_user_info.get('email')
            first_name = google_user_info.get('given_name', '')
            last_name = google_user_info.get('family_name', '')
            profile_picture = google_user_info.get('picture', None)
            
            # Get role from serializer's validated_data
            role = serializer.validated_data.get('role', 'guest')

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
                        is_active=True
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
            needs_profile_completion = user.role == 'client' # Flag for frontend

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
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'needs_profile_completion': needs_profile_completion, # Flag for frontend
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
            needs_profile_completion = user.role == 'client' and (
                not user.phone_number or
                not user.birthday or
                not user.gender or
                not user.company_name or # Assuming company_name is required for clients
                not user.company_website # Assuming company_website is required for clients
            )

            return Response({
                'message': 'Logged in via Google successfully.',
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': user.profile_picture,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'needs_profile_completion': needs_profile_completion, # Flag for frontend
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
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'birthday': user.birthday.isoformat() if user.birthday else None,
                    'gender': user.gender,
                    'company_name': user.company_name,
                    'company_website': user.company_website,
                    'needs_profile_completion': False, # Profile is now complete
                }
            }, status=status.HTTP_200_OK)
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
