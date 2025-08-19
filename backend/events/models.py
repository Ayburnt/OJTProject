# events/models.py
from django.db import models
from django.conf import settings
import os
from datetime import datetime
from django.core.files import File
from io import BytesIO
import qrcode

def unique_event_poster_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.event_code}_poster_{datetime.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    return os.path.join("event/event_posters/", filename)

def unique_seating_map_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.event_code}_seating_{datetime.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    return os.path.join("event/seating_maps/", filename)


class Event(models.Model):
    """
    A model to store information about a product.
    """
    AUDIENCE_CHOICES = (
        ('public', 'Public'),
        ('private', 'Private'),
    )

    DURATION_CHOICES = (
        ('single', 'Single'),
        ('multiple', 'Multiple'),
    )

    AGE_RESTRICTION_CHOICES = (
        ('all', 'All'),
        ('restricted', 'Restricted'),
        ('guardian_needed', 'Guardian Needed'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('ongoing', 'Ongoing'),
    )

    # Use settings.AUTH_USER_MODEL for the custom user model
    # and specify 'user_code' in the to_field argument.
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='events',
        to_field='user_code'
    )
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    event_code= models.CharField(unique=True, blank=True, null=True)
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='public')
    private_code = models.CharField(max_length=20, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    event_type = models.CharField(max_length=50, blank=True, null=True)
    meeting_platform = models.CharField(max_length=100, blank=True, null=True)
    meeting_link = models.URLField(max_length=500, blank=True, null=True)
    event_poster = models.ImageField(upload_to=unique_event_poster_path, blank=True, null=True)
    duration_type = models.CharField(max_length=50, choices=DURATION_CHOICES)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    venue_place_id = models.CharField(max_length=255, blank=True, null=True)
    venue_name = models.CharField(max_length=500, blank=True, null=True)
    venue_address = models.CharField(max_length=500, blank=True, null=True)
    age_restriction = models.CharField(max_length=100, choices=AGE_RESTRICTION_CHOICES)
    age_allowed = models.CharField(max_length=20, blank=True, null=True)
    parking = models.CharField(max_length=100, blank=True, null=True)
    event_qr_link = models.URLField(max_length=500, blank=True, null=True)
    event_qr_image = models.ImageField(upload_to="event/qr_codes/", blank=True, null=True)
    posting_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    isFee_paid = models.BooleanField(default=False)
    seating_map = models.ImageField(upload_to=unique_seating_map_path, blank=True, null=True)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='pending')    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
        ordering = ['-created_at']

    def __str__(self):
        """
        Returns the product's name as a string representation.
        """
        return f"{self.title} event, created by {self.created_by.user_code}."
    
    def save(self, *args, **kwargs):
        # Only generate QR if event_code exists and QR image doesn't exist yet
        if self.event_code and not self.event_qr_image:
            self.event_qr_link = f"https://event.sari-sari.com/events/{self.event_code}"

            qr = qrcode.QRCode(
                version=1,
                box_size=10,
                border=5
            )
            qr.add_data(self.event_qr_link)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")

            buffer = BytesIO()
            img.save(buffer, format="PNG")

            # Use event_code in filename to make it unique per event
            safe_event_code = self.event_code.replace(" ", "_")  # avoid spaces
            file_name = f"qr_event_{safe_event_code}.png"

            self.event_qr_image.save(file_name, File(buffer), save=False)

        super().save(*args, **kwargs)


    
class Ticket_Type(models.Model):
    """
    A model to store information about a product.
    """    

    # Use settings.AUTH_USER_MODEL for the custom user model
    # and specify 'user_code' in the to_field argument.
    event = models.ForeignKey(
        'Event',  # Refers to the Events model in the same file
        on_delete=models.CASCADE,
        related_name='ticket_types',
        to_field='event_code',
    )

    ticket_name = models.CharField(max_length=100, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    quantity_total = models.IntegerField(null=True, blank=True)
    quantity_available = models.IntegerField(null=True, blank=True)
    is_selling = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)


    class Meta:
        verbose_name = 'Ticket Type'
        verbose_name_plural = 'Ticket Types'
        ordering = ['-created_at']

    def __str__(self):
        """
        Returns the product's name as a string representation.
        """
        return self.ticket_name

class Reg_Form_Template(models.Model):
    event = models.ForeignKey(
        'Event',  # Refers to the Events model in the same file
        on_delete=models.CASCADE,
        related_name='reg_form_template',
        to_field='event_code',
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='event_template',
        to_field='user_code'
    )
    is_active = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        verbose_name = 'Reg Form Template'
        verbose_name_plural = 'Reg Form Templates'
        ordering = ['-created_at']

    def __str__(self):
        return f"Template for {self.event.title} created by {self.created_by.user_code}"
    
class Reg_Form_Question(models.Model):
    QUESTION_TYPE_CHOICES = (
        ('short', 'Short'),
        ('long', 'Long'),
        ('radio', 'Radio'),
        ('checkbox', 'Checkbox'),
        ('rating', 'Rating'),
    )

    regForm_template = models.ForeignKey(
        'Reg_Form_Template',
        on_delete=models.CASCADE,
        related_name='questions',
    )
    question_label = models.CharField(max_length=200, null=True, blank=True)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES, default='short', null=True, blank=True)
    is_required = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        verbose_name = 'Reg Form Question'
        verbose_name_plural = 'Reg Form Questions'
        ordering = ['-created_at']

    def __str__(self):
        return self.question_label

class Question_Option(models.Model):
    question = models.ForeignKey(
        'Reg_Form_Question',
        on_delete=models.CASCADE,
        related_name='options',        
    )
    option_value = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = 'Question Option'
        verbose_name_plural = 'Question Options'

    def __str__(self):
        return self.option_value or "No value"