from django.urls import path
from .views import (
    EventRetrieveUpdateDestroyAPIView,
    EventListCreateAPIView,
    EventPublicView,
    EventDetailView,
    OrganizerProfilePublicView,
    toggle_ticket_selling,
)

urlpatterns = [
    # URL for listing all events and creating a new one
    path('list-create/', EventListCreateAPIView.as_view(), name='event-list-create'),
    path('event-public-view/', EventPublicView.as_view(), name='event-public-view'),

    # URL for retrieving, updating, and deleting a specific event by its event_code
    path("events/<str:event_code>/", EventDetailView.as_view(), name="event-detail"),
    path('update/<str:event_code>/', EventRetrieveUpdateDestroyAPIView.as_view(), name='event-retrieve-update-destroy'),
    path('profile/<str:user_code>/', OrganizerProfilePublicView.as_view(), name='organizer-public-profile'),
    path("events/<str:event_code>/toggle-selling/", toggle_ticket_selling, name="toggle_ticket_selling"),
]
