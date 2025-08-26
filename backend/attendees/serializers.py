# attendees/serializers.py
from rest_framework import serializers
from .models import Attendee, Attendee_Response
from events.models import Reg_Form_Question, Question_Option

class AttendeeResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee_Response
        fields = ["question", "response_value"]

# attendees/serializers.py
class AttendeeSerializer(serializers.ModelSerializer):
    responses = AttendeeResponseSerializer(many=True, required=False)

    class Meta:
        model = Attendee
        fields = [
            "id",
            "fullName",
            "email",
            "contactNumber",
            "attendee_code",
            "event",            
            "ticket_type",
            "ticket_quantity",
            "price_at_purchase",
            "attendee_status",
            "responses",
        ]

    def create(self, validated_data):
        responses_data = validated_data.pop("responses", [])
        
        # auto-generate attendee_code if not provided
        event_code = validated_data["event"].event_code  # since FK has to_field='event_code'
        email = validated_data["email"]
        validated_data["attendee_code"] = f"{event_code}_{email}"

        attendee = Attendee.objects.create(**validated_data)
        for resp in responses_data:
            Attendee_Response.objects.create(attendee=attendee, **resp)
        return attendee

