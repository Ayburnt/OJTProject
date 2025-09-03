# attendees/urls.py
from django.urls import path
from .views import (
    AttendeeListView,
    UploadCSVView,
    ExportCSVView,
    AttendeeCreateView,
    AttendeeDetailView,
    OrganizerEventsView,
    EventAttendanceView,
    TransactionDetailView,
)

urlpatterns = [
    path("", AttendeeListView.as_view(), name="attendee-list"),
    path("buy-ticket/", AttendeeCreateView.as_view(), name="attendee-create"),
    path('<str:event_code>/upload-csv/', UploadCSVView.as_view(), name='upload-csv'),
    path('<str:event_code>/export-csv/', ExportCSVView.as_view(), name='export-csv'),
    path("organizer-events/<str:userCode>/", OrganizerEventsView.as_view(), name="organizer-events"),
    path("check-in/", EventAttendanceView.as_view(), name="check-in"),
    path('<str:event_code>/', AttendeeListView.as_view(), name='attendee-list'),    
    path("booking-info/<str:attendee_code>/", AttendeeDetailView.as_view(), name="attendee-detail"),  # ✅ fixed
    path("transaction-info/<str:payment_ref>/", TransactionDetailView.as_view(), name="transaction-detail"),  # ✅ fixed
]
