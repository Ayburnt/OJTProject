# transactions/serializers.py
from rest_framework import serializers
from .models import Transaction
from attendees.models import Attendee
from events.models import Ticket_Type

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket_Type
        fields = "__all__"

class AttendeeSerializer(serializers.ModelSerializer):
    ticket_read = TicketTypeSerializer(source='ticket_type',read_only=True)
    class Meta:
        model = Attendee
        fields = "__all__"

class TransactionSerializer(serializers.ModelSerializer):
    attendees = AttendeeSerializer(many=True, read_only=True)  
    class Meta:
        model = Transaction
        fields = "__all__"