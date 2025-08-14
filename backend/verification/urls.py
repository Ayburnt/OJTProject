# verifications/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizerApplicationViewSet

router = DefaultRouter()
router.register(r'organizer-applications', OrganizerApplicationViewSet, basename='organizer-application')

urlpatterns = [
    path('', include(router.urls)),
]