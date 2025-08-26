from django.db import models

class Attendee(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    event = models.CharField(max_length=255)
    reg_date = models.DateField()
    ticket_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} - {self.event}"
