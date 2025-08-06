# api/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        # --- DEBUG PRINT: See what extra_fields are passed ---
        print(f"DEBUG: create_user extra_fields: {extra_fields}")
        # --- END DEBUG PRINT ---

        user = self.model(email=email, **extra_fields)
        # Only set password if provided (for manual signup)
        if password:
            user.set_password(password)
        else: # For Google signup, set an unusable password
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        Superusers are automatically assigned the 'admin' role.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin') # Superusers are admins by default

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with email as the unique identifier and additional fields
    for first name, last name, profile picture, and role.
    """
    ROLE_CHOICES = (
        ('guest', 'Guest'), # Added 'guest' role
        ('client', 'Client'), # Added 'client' role (for organizers)
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True) # Updated max_length
    last_name = models.CharField(max_length=150, blank=True) # Updated max_length
    profile_picture = models.URLField(max_length=500, blank=True, null=True, default='https://ik.imagekit.io/cafedejur/sari-sari-events/default-profile.jpg?updatedAt=1753685867575')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='guest') # Updated max_length and default
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True) # Changed default to auto_now_add

    # --- ADDED NEW FIELDS (with null=True, blank=True) ---
    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_website = models.URLField(max_length=500, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    # --- END ADDED NEW FIELDS ---

    objects = CustomUserManager()

    USERNAME_FIELD = 'email' # Use email for login
    REQUIRED_FIELDS = [] # No required fields other than USERNAME_FIELD and password for create_superuser

    def __str__(self):
        return self.email

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user.
        """
        return self.first_name
