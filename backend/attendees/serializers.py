# attendees/serializers.py
from rest_framework import serializers
from .models import Attendee, Attendee_Response
from events.models import Reg_Form_Question, Question_Option
import uuid
from django.db import IntegrityError

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
            "attendee_code",
            "event",            
            "ticket_type",
            "ticket_quantity",
            "ticket_qr_data",
            "ticket_qr_image",
            "price_at_purchase",
            "attendee_status",
            "responses",
        ]

    def create(self, validated_data):
        responses_data = validated_data.pop("responses", [])
        event_code = validated_data["event"].event_code  

        # ✅ retry until unique attendee_code is found
        for _ in range(5):  # small retry loop
            random_code = uuid.uuid4().hex[:8]
            attendee_code = f"{event_code}_{random_code}"
            validated_data["attendee_code"] = attendee_code
            try:
                attendee = Attendee.objects.create(**validated_data)
                break
            except IntegrityError:
                continue  # try again if collision
        else:
            raise serializers.ValidationError("Could not generate a unique ticket code.")

        for resp in responses_data:
            Attendee_Response.objects.create(attendee=attendee, **resp)

        return attendee
