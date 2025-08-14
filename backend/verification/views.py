# verifications/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import OrganizerApplication
from .serializers import OrganizerApplicationSerializer

class OrganizerApplicationViewSet(viewsets.ModelViewSet):
    queryset = OrganizerApplication.objects.all()
    serializer_class = OrganizerApplicationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'pending', 'accept', 'decline']:
            permission_classes = [IsAdminUser]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        # Check if a user already has a pending application
        if OrganizerApplication.objects.filter(user=request.user, status='pending').exists():
            return Response(
                {'error': 'You already have a pending application.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # The serializer handles validation for the rest of the fields
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """
        Returns a list of all organizer applications with 'pending' status.
        Accessible only by admin.
        """
        queryset = self.queryset.filter(status='pending').order_by('-submitted_at')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def accept(self, request, pk=None):
        """
        Accept an organizer application and update the user's verification status.
        """
        application = self.get_object()
        
        # This is the new, crucial logic
        user = application.user
        user.verification_status = 'verified' # Set user's status to 'verified'
        user.save()
        
        # Then, update the application status
        application.status = 'accepted'
        application.save()

        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def decline(self, request, pk=None):
        """
        Decline an organizer application and update the user's verification status.
        """
        application = self.get_object()
        
        # This is the new, crucial logic
        user = application.user
        user.verification_status = 'declined' # Set user's status to 'declined'
        user.save()
        
        # Then, update the application status
        application.status = 'declined'
        application.save()

        serializer = self.get_serializer(application)
        return Response(serializer.data)