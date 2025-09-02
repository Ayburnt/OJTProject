#attendees/models.py
import os
from django.db import models
from django.core.files import File
from io import BytesIO
from django.utils import timezone
import qrcode
from django.db import transaction
from django.conf import settings
class Attendee(models.Model):
    STATUS_CHOICES = (
        ('registered', 'Registered'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
        ('checked-in', 'Checked-in'),
    )
    
    transaction = models.ForeignKey(
        "transactions.Transaction",
        on_delete=models.CASCADE,
        to_field='payment_ref',
        related_name="attendees"
    )

    fullName = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    attendee_code = models.CharField(max_length=100, unique=True, null=True, blank=True)
    event = models.ForeignKey(
        'events.Event',
        on_delete=models.CASCADE,
        related_name='attendees',
        to_field='event_code'
    )
    ticket_type = models.ForeignKey(
        'events.Ticket_Type',
        on_delete=models.CASCADE,
        related_name='attendees'
    )
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    ticket_qr_data = models.TextField(null=True, blank=True, unique=True)
    ticket_qr_image = models.ImageField(upload_to="event/attendees_qr/", blank=True, null=True)
    attendee_status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='registered')
    ticket_quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.fullName} - {self.event}"

    def save(self, *args, **kwargs):
        # --- Auto-set attendee_status if free ticket ---
        if self.ticket_type and (self.price_at_purchase == 0 or self.ticket_type.price == 0):
            self.attendee_status = "paid"

        # --- Generate QR code if not already set ---
        if self.attendee_code and not self.ticket_qr_image:
            self.ticket_qr_data = f"https://event.sari-sari.com/attendee/{self.attendee_code}"

            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(self.ticket_qr_data)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            img.save(buffer, format="PNG")

            safe_attendee_code = self.attendee_code.replace(" ", "_")
            file_name = f"qr_event_{safe_attendee_code}.png"

            self.ticket_qr_image.save(file_name, File(buffer), save=False)

        # --- Deduct ticket quantity (atomic to prevent race conditions) ---
        with transaction.atomic():
            if self._state.adding:  # only deduct when creating, not updating
                if (
                    self.ticket_type.quantity_available is not None
                    and self.ticket_type.quantity_available >= self.ticket_quantity
                ):
                    self.ticket_type.quantity_available -= self.ticket_quantity
                    self.ticket_type.save()


        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Restore ticket quantity when deleting attendee
        if self.ticket_type and self.ticket_type.quantity_available is not None:
            self.ticket_type.quantity_available += self.ticket_quantity
            self.ticket_type.save()

        if self.ticket_qr_image:
            self.ticket_qr_image.delete(save=False)
        super().delete(*args, **kwargs)



class Attendee_Response(models.Model):
    attendee = models.ForeignKey(Attendee, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey('events.Reg_Form_Question', on_delete=models.CASCADE, related_name='responses')
    response_value = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Response by {self.attendee.fullName} to '{self.question}'"


class Event_Attendance(models.Model):
    attendee = models.ForeignKey(Attendee, on_delete=models.CASCADE, related_name='attendance_records', to_field='attendee_code')
    check_in_time = models.DateTimeField(auto_now_add=True)
    checked_in_by_organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='checked_in_attendances',
        to_field='user_code'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attendance for {self.attendee.fullName} at {self.check_in_time}"