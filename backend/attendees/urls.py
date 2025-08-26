from django.urls import path
from .views import AttendeeListView, UploadCSVView, ExportCSVView, AttendeeCreateView

urlpatterns = [
    path("", AttendeeListView.as_view(), name="attendee-list"),
    path("buy-ticket/", AttendeeCreateView.as_view(), name="attendee-create"),
    path("upload-csv/", UploadCSVView.as_view(), name="upload-csv"),
    path("export-csv/", ExportCSVView.as_view(), name="export-csv"),
]
