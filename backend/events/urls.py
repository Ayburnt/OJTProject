from django.urls import path
from .views import (
    EventRetrieveUpdateDestroyAPIView,
    EventListCreateAPIView
)

urlpatterns = [
    # URL for listing all events and creating a new one
    path('list-create/', EventListCreateAPIView.as_view(), name='event-list-create'),

    # URL for retrieving, updating, and deleting a specific event by its event_code
    path('update/<str:event_code>/', EventRetrieveUpdateDestroyAPIView.as_view(), name='event-retrieve-update-destroy'),
]
