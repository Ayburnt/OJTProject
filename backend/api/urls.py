# api/urls.py
from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    GoogleAuthRegisterView,
    GoogleAuthLoginView,
    CheckEmailExistsView, # Use the correct view name
    SendOTPView,          # Use the correct view name
    VerifyOTPView,        # Use the correct view name
    ProfileCompletionView, # Import the new view
    ResetPasswordView,
    ResetOTPView,
    CurrentUserView,
    change_password,
    OrganizerListView,
)

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/google/register/', GoogleAuthRegisterView.as_view(), name='google_register'),
    path('auth/google/login/', GoogleAuthLoginView.as_view(), name='google_login'),
    path('auth/email-check/', CheckEmailExistsView.as_view(), name='email_check'), # Corrected URL path
    path('auth/otp-send/', SendOTPView.as_view(), name='otp_send'), # Corrected URL path
    path('auth/otp-verify/', VerifyOTPView.as_view(), name='otp_verify'), # Corrected URL path
    path('auth/complete-profile/', ProfileCompletionView.as_view(), name='complete_profile'), # New URL
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'), # <--- Use the imported class directly and call .as_view()
    path('auth/change-password/', change_password, name='change-password'),
    path('auth/resetotp-password/', ResetOTPView.as_view(), name='reset-password'), # <--- Use the imported class directly and call .as_view()
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path('organizers/', OrganizerListView.as_view(), name='organizer-list'),

]