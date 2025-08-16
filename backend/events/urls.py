from django.urls import path
from .views import (
    EventRetrieveUpdateDestroyAPIView,
    EventListCreateAPIView,
    EventPublicView
)

urlpatterns = [
    # URL for listing all events and creating a new one
    path('list-create/', EventListCreateAPIView.as_view(), name='event-list-create'),
    path('event-public-view/', EventPublicView.as_view(), name='event-public-view'),

    # URL for retrieving, updating, and deleting a specific event by its event_code
    path('update/<str:event_code>/', EventRetrieveUpdateDestroyAPIView.as_view(), name='event-retrieve-update-destroy'),
]
