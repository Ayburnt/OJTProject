# events/views.py
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event, Ticket_Type, Reg_Form_Template, Reg_Form_Question, Question_Option
from .serializers import EventSerializer, userserializer
from .permissions import IsOwnerOrReadOnly # Assuming you've created this file
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ParseError
from .parsers import NestedMultiPartParser
from django.db.models import Q
from api.models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
import requests
import os
from django.conf import settings



@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def toggle_ticket_selling(request, event_code):
    try:
        event = Event.objects.get(event_code=event_code, created_by=request.user)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

    is_selling = request.data.get("is_selling", True)

    Ticket_Type.objects.filter(event=event).update(is_selling=is_selling)

    return Response(
        {"detail": f"Ticket selling set to {is_selling} for event {event_code}"},
        status=status.HTTP_200_OK,
    )

# events.py
class OrganizerProfilePublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_code):
        # Step 1: Get the user
        try:
            user = CustomUser.objects.get(user_code=user_code)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Organizer not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 2: Get published/completed events (if any)
        events = Event.objects.filter(
            created_by=user, is_broadcast='broadcast'
        ).filter(
            Q(status='published') | Q(status='completed')
        )

        # Step 3: Serialize user + events
        user_data = userserializer(user).data
        event_data = EventSerializer(events, many=True, context={"request": request}).data

        return Response(
            {
                "organizer": user_data,
                "events": event_data
            },
            status=status.HTTP_200_OK
        )


class EventPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        events = Event.objects.filter(
            status='published',
            is_broadcast='broadcast'
        )        
        serializer = EventSerializer(events, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class EventListCreateAPIView(APIView):
    parser_classes = [NestedMultiPartParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        events = Event.objects.filter(created_by=request.user)
        serializer = EventSerializer(events, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
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

        # ✅ 3. Proceed with saving event if captcha is valid
        serializer = EventSerializer(
            data=request.data,
            context={"request": request},
        )
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("📌 Serializer errors:", serializer.errors)  # Debug
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventRetrieveUpdateDestroyAPIView(APIView):
    parser_classes = [NestedMultiPartParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        self.check_object_permissions(request, event)
        serializer = EventSerializer(event, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        self.check_object_permissions(request, event)
        
        with transaction.atomic():
            serializer = EventSerializer(event, data=request.data, context={"request": request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        self.check_object_permissions(request, event)
        
        with transaction.atomic():
            serializer = EventSerializer(event, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        self.check_object_permissions(request, event)
        
        with transaction.atomic():
            event.delete()
        return Response({"detail": "Event deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    
class EventDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, event_code):
        try:
            event = Event.objects.get(event_code=event_code)
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = EventSerializer(event, context={"request": request})
        return Response(serializer.data)
    
def verify_captcha(token: str) -> dict:
    """
    Verify Google reCAPTCHA token with Google's API
    Returns the full response dict.
    """
    secret_key = getattr(settings, "RECAPTCHA_SECRET_KEY", None)

    if not secret_key:
        return {"success": False, "error": "Missing secret key"}

    url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {
        "secret": secret_key,
        "response": token
    }

    try:
        response = requests.post(url, data=payload, timeout=5)
        result = response.json()
        return result
    except requests.RequestException as e:
        return {"success": False, "error": str(e)}