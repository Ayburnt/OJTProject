# events/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Event
from .serializers import EventSerializer
from .permissions import IsOwnerOrReadOnly # Assuming you've created this file

class EventListCreateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # The 'created_by' field is set within the serializer's create method
        with transaction.atomic():
            serializer = EventSerializer(data=request.data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            # This line won't be reached if raise_exception=True, but it's good practice
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
        
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)