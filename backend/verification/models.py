# verifications/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class OrganizerApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    )

    # Assuming user is authenticated and this is a one-to-one relationship
    # with an existing user account.
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organizer_application')
    organizer_name = models.CharField(max_length=255)
    business_name = models.CharField(max_length=255)
    dti_registration_number = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_number = models.CharField(max_length=50)
    business_address = models.TextField()

    # FileFields require a media root to be set in settings.py
    dti_file = models.FileField(upload_to='organizer_documents/dti/')
    govt_id_file = models.FileField(upload_to='organizer_documents/govt_id/')
    business_permit_file = models.FileField(upload_to='organizer_documents/business_permit/')
    tin_file = models.FileField(upload_to='organizer_documents/tin/')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application by {self.organizer_name} ({self.status})"