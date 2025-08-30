# attendees/urls.py
from django.urls import path
from .views import (
    AttendeeListView,
    UploadCSVView,
    ExportCSVView,
    AttendeeCreateView,
    AttendeeDetailView,
    OrganizerEventsView
)

urlpatterns = [
    path("", AttendeeListView.as_view(), name="attendee-list"),
    path("buy-ticket/", AttendeeCreateView.as_view(), name="attendee-create"),
    path("upload-csv/", UploadCSVView.as_view(), name="upload-csv"),
    path("export-csv/", ExportCSVView.as_view(), name="export-csv"),
    path("organizer-events/<str:userCode>/", OrganizerEventsView.as_view(), name="organizer-events"),

    path("booking-info/<str:attendee_code>/", AttendeeDetailView.as_view(), name="attendee-detail"),  # ✅ fixed
]
