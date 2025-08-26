from django.urls import path
from .views import AttendeeListView, UploadCSVView, ExportCSVView

urlpatterns = [
    path("", AttendeeListView.as_view(), name="attendee-list"),
    path("upload-csv/", UploadCSVView.as_view(), name="upload-csv"),
    path("export-csv/", ExportCSVView.as_view(), name="export-csv"),
]
