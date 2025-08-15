# verifications/urls.py
from django.urls import path
from .views import OrganizerApplicationViewSet

organizer_applications = OrganizerApplicationViewSet.as_view({
    'post': 'create',
})

pending = OrganizerApplicationViewSet.as_view({
    'get': 'pending',
})

accept = OrganizerApplicationViewSet.as_view({
    'patch': 'accept',
})

decline = OrganizerApplicationViewSet.as_view({
    'patch': 'decline',
})

urlpatterns = [
    path('organizer-applications/', organizer_applications, name='organizerapplications-create'),
    path('organizer-applications/pending/', pending, name='organizerapplications-pending'),
    path('organizer-applications/<int:pk>/accept/', accept, name='organizerapplications-accept'),
    path('organizer-applications/<int:pk>/decline/', decline, name='organizerapplications-decline'),
]
