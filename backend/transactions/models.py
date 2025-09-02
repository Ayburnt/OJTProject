# transactions/models.py
import uuid
from django.db import models
from django.utils import timezone
from events.models import Event

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('EventPostingFee', 'Event Posting Fee'),
        ('TicketPurchase', 'Ticket Purchase'),
        ('Refund', 'Refund'),
    )

    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Success', 'Success'),
        ('Failed', 'Failed'),
    )    
    payer_code = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='transactions',
        to_field='event_code',
        null=True,
        blank=True
    )
    payment = models.CharField(max_length=100, null=True, blank=True)  # GCash, Metrobank, Cash...
    payment_ref = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.payment_ref:
            self.payment_ref = uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type} - {self.payer_code} - {self.amount}"
