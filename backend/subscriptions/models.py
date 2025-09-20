from django.db import models
from django.conf import settings

class Subscription(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    tier_name = models.CharField(max_length=100)
    event = models.OneToOneField('events.Event', on_delete=models.CASCADE, related_name="subscription")
    subscriber = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions',      
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment = models.CharField(max_length=100, null=True, blank=True)
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # 👇 Automatically mark Free tier as paid
        if self.tier_name.lower() == "free":
            self.payment_status = "paid"
            self.price = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tier_name} - {self.event_id}"