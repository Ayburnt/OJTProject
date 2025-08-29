#attendees/views.py
import csv
from io import TextIOWrapper
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Attendee
from .serializers import AttendeeSerializer
from events.models import Event, Ticket_Type

class AttendeeCreateView(generics.CreateAPIView):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer

class AttendeeListView(generics.ListAPIView):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer


class UploadCSVView(APIView):
    def post(self, request, format=None):
        csv_file = request.FILES.get("file")

        if not csv_file or not csv_file.name.endswith(".csv"):
            return Response({"error": "File is not CSV"}, status=status.HTTP_400_BAD_REQUEST)

        file_data = TextIOWrapper(csv_file.file, encoding="utf-8")
        reader = csv.reader(file_data)
        next(reader, None)  # skip headers

        created = []
        for row in reader:
            if len(row) < 5:
                continue

            event_code = row[2].strip()
            ticket_name = row[4].strip()

            try:
                event = Event.objects.get(event_code=event_code)
                ticket_type = Ticket_Type.objects.get(ticket_name=ticket_name, event=event)
            except (Event.DoesNotExist, Ticket_Type.DoesNotExist):
                continue  # skip if invalid

            attendee = Attendee.objects.create(
                name=row[0].strip(),
                email=row[1].strip(),
                event=event,
                reg_date=row[3].strip(),
                ticket_type=ticket_type,
            )
            created.append(attendee)

        return Response({"message": f"{len(created)} attendees uploaded"}, status=status.HTTP_201_CREATED)


class ExportCSVView(APIView):
    def get(self, request, format=None):
        attendees = Attendee.objects.all()
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="attendees.csv"'

        writer = csv.writer(response)
        writer.writerow(["Name", "Email", "Event Code", "Registration Date", "Ticket Type"])

        for a in attendees:
            writer.writerow([
                a.name,
                a.email,
                a.event.event_code if a.event else "",
                a.reg_date,
                a.ticket_type.ticket_name if a.ticket_type else "",
            ])

        return response

class AttendeeDetailView(APIView):
    def get(self, request, attendee_code):
        try:
            attendee = Attendee.objects.get(attendee_code=attendee_code)
        except Attendee.DoesNotExist:
            return Response({"error": "Attendee not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AttendeeSerializer(attendee, context={"request": request})
        return Response(serializer.data)
