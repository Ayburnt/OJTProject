# transactions/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from django.db import transaction as db_transaction
from .models import Transaction
from .serializers import TransactionSerializer
from attendees.models import Attendee, Attendee_Response
from attendees.serializers import AttendeeSerializer
from events.models import Event
from django.conf import settings
import uuid
import requests
import os

class TransactionCreateView(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def create(self, request, *args, **kwargs):
        # ✅ 1. Get captcha token
        captcha_token = request.data.get("captcha")
        print("📌 Captcha token from frontend:", captcha_token)  # Debug

        if not captcha_token:
            return Response(
                {"error": "Captcha token missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ 2. Verify with Google
        secret_key = os.getenv("RECAPTCHA_SECRET_KEY", settings.RECAPTCHA_SECRET_KEY)
        print("📌 Using secret key (first 6 chars):", secret_key[:6], "******")  # Debug

        verify_url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {"secret": secret_key, "response": captcha_token}

        try:
            r = requests.post(verify_url, data=payload)
            result = r.json()
            print("📌 Google verification result:", result)  # Debug

            if not result.get("success"):
                return Response(
                    {
                        "error": "Invalid reCAPTCHA. Please try again.",
                        "details": result,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response(
                {"error": f"Error verifying reCAPTCHA: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        data = request.data.copy()  # Create a mutable copy of the request data
        
        # --- 🐛 FIX: Remove 'captcha' before creating the Transaction object 🐛 ---
        if 'captcha' in data:
            data.pop('captcha')
        # -------------------------------------------------------------------------
        
        attendees_data = data.pop("attendees", [])
        
        with db_transaction.atomic():
            event_code = data.pop("event", None)
            event = None
            if event_code:
                try:
                    event = Event.objects.get(event_code=event_code)
                except Event.DoesNotExist:
                    return Response({"error": "Invalid event_code"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create Transaction
            # The 'event' key is also popped, so it won't be passed to create().
            tx = Transaction.objects.create(**data)

            # Create Attendees under this Transaction
            attendee_objs = []
            for att_data in attendees_data:
                responses_data = att_data.pop("responses", [])
                attendee_code = f"{tx.related_event.event_code}_{uuid.uuid4().hex[:8]}"
                att = Attendee.objects.create(
                    attendee_code=attendee_code,
                    transaction=tx,
                    **att_data
                )
                for resp in responses_data:
                    Attendee_Response.objects.create(attendee=att, **resp)
                attendee_objs.append(att)

        return Response({
            "transaction": TransactionSerializer(tx).data,
            "attendees": AttendeeSerializer(attendee_objs, many=True).data
        }, status=status.HTTP_201_CREATED)