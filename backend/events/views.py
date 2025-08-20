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
            created_by=user
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
        events = Event.objects.filter(status='published')
        serializer = EventSerializer(events, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class EventListCreateAPIView(APIView):
    # Use the new custom parser
    parser_classes = [NestedMultiPartParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        events = Event.objects.filter(created_by=request.user)
        serializer = EventSerializer(events, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        
        print("FILES:", request.FILES)
        print("DATA:", request)

        # The custom parser will handle the nested data reconstruction
        
        serializer = EventSerializer(
            data=request.data,
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("SERIALIZER ERRORS:", serializer.errors)  # <-- Add this
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventRetrieveUpdateDestroyAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        # Check permissions for this object
        self.check_object_permissions(request, event)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        self.check_object_permissions(request, event)
        
        with transaction.atomic():
            serializer = EventSerializer(event, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        self.check_object_permissions(request, event)
        
        with transaction.atomic():
            serializer = EventSerializer(event, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, event_code, *args, **kwargs):
        event = get_object_or_404(Event, event_code=event_code)
        self.check_object_permissions(request, event)
        
        with transaction.atomic():
            event.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
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