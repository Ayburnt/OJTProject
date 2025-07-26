# api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # You can use this for a simple JWT login if not using custom login view
    TokenRefreshView,
)
from .views import (
    UserRegistrationView, UserLoginView,
    GoogleAuthRegisterView, GoogleAuthLoginView,
    CheckEmailExistsView, SendOTPView, VerifyOTPView
)

urlpatterns = [
    # Standard email/password authentication
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),

    # JWT token refresh endpoint (useful for keeping users logged in)
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Google OAuth authentication
    path('auth/google/register/', GoogleAuthRegisterView.as_view(), name='google_register'),
    path('auth/google/login/', GoogleAuthLoginView.as_view(), name='google_login'),


    path('auth/check-email/', CheckEmailExistsView.as_view(), name='check_email_exists'),
    path('auth/send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
]
