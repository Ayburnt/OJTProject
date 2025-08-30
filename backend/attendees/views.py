#attendees/views.py
import csv
from io import TextIOWrapper
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Attendee, Event_Attendance
from .serializers import AttendeeSerializer, OrganizerEventSerializer, EventAttendanceSerializer
from events.models import Event, Ticket_Type
from rest_framework.generics import ListAPIView
from django.db.models import Count
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth import get_user_model

User = get_user_model()

class AttendeeCreateView(generics.CreateAPIView):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer

from rest_framework import generics
from .models import Attendee
from .serializers import AttendeeSerializer
from events.models import Event

class AttendeeListView(generics.ListAPIView):
    serializer_class = AttendeeSerializer

    def get_queryset(self):
        event_code = self.kwargs.get('event_code')  # get event_code from URL
        try:
            event = Event.objects.get(event_code=event_code)
        except Event.DoesNotExist:
            return Attendee.objects.none()
        return Attendee.objects.filter(event=event)



class UploadCSVView(APIView):
    def post(self, request, event_code):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded.'}, status=400)

        try:
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            for row in reader:
                # adjust these fields to match your Attendee model
                Attendee.objects.create(
                    event=Event.objects.get(event_code=event_code),
                    fullName=row.get('Name'),
                    email=row.get('Email'),
                    ticket_read=Ticket_Type.objects.filter(ticket_name=row.get('Ticket Type')).first()
                )

            return Response({'message': 'CSV uploaded successfully!'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class ExportCSVView(APIView):
    def get(self, request, event_code):
        attendees = Attendee.objects.filter(event__event_code=event_code)

        if not attendees.exists():
            return Response({"error": "No attendees found for this event."}, status=400)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{event_code}_attendees.csv"'

        writer = csv.writer(response)
        writer.writerow(['Registration Date', 'Full Name', 'Email', 'Ticket Type'])

        for a in attendees:
            writer.writerow([
                a.created_at.strftime("%Y-%m-%d"),
                a.fullName,
                a.email,
                a.ticket_type.ticket_name if a.ticket_type else ""
            ])

        return response

class AttendeeDetailView(APIView):
    def get(self, request, attendee_code):
        print("🔍 Incoming request for attendee_code:", attendee_code)
        try:
            attendee = Attendee.objects.get(attendee_code=attendee_code)
            print("✅ Attendee object retrieved:", attendee)
        except Attendee.DoesNotExist:
            print("❌ Attendee not found:", attendee_code)
            return Response({"error": "Attendee not found"}, status=status.HTTP_404_NOT_FOUND)            
        
        serializer = AttendeeSerializer(attendee, context={"request": request})
        print("📦 Serialized data:", serializer.data)
        return Response(serializer.data)


class OrganizerEventsView(APIView):
    def get(self, request, userCode):
        try:
            print(f"🔎 OrganizerEventsView called with userCode: {userCode}")
            
            events = Event.objects.filter(created_by__user_code=userCode) \
                .annotate(attendees_count=Count('attendees')) \
                .values('id', 'title', 'event_code', 'attendees_count')

            return Response(events, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"❌ Error in OrganizerEventsView: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EventAttendeesView(ListAPIView):
    serializer_class = AttendeeSerializer

    def get_queryset(self):
        event_code = self.kwargs.get("eventcode")
        return Attendee.objects.filter(event__event_code=event_code)

class EventAttendanceView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("🔍 Incoming request for attendee_code:", request.data)
        attendee_code = request.data.get("attendee_code")
        user_code = request.data.get("user_code")

        if not attendee_code or not user_code:
            return Response({"error": "attendee_code and user_code required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            attendee = Attendee.objects.get(attendee_code=attendee_code)
        except Attendee.DoesNotExist:
            return Response({"error": "Attendee not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            organizer = User.objects.get(user_code=user_code)
        except User.DoesNotExist:
            return Response({"error": "Organizer not found"}, status=status.HTTP_404_NOT_FOUND)

        # Prevent double check-in
        existing = Event_Attendance.objects.filter(attendee=attendee).first()
        if existing:
            return Response(EventAttendanceSerializer(existing).data, status=status.HTTP_200_OK)

        # Create attendance record
        attendance = Event_Attendance.objects.create(
            attendee=attendee,
            checked_in_by_organizer=organizer
        )

        # Update attendee status
        attendee.attendee_status = "checked-in"
        attendee.save()

        serializer = EventAttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)