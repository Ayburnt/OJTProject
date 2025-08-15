# verifications/views.py
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import OrganizerApplication
from .serializers import OrganizerApplicationSerializer


class OrganizerApplicationViewSet(viewsets.GenericViewSet):

    queryset = OrganizerApplication.objects.all().select_related('user')
    serializer_class = OrganizerApplicationSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['create']:
            return [IsAuthenticated()]
        if self.action in ['pending', 'accept', 'decline', 'list', 'retrieve']:
            return [IsAdminUser()]
        return super().get_permissions()

    # CREATE = submit OR resubmit (OneToOne)
    def create(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        existing = OrganizerApplication.objects.filter(user=user).first()
        if existing:
            self.check_object_permissions(request, existing)
            application = serializer.update(existing, serializer.validated_data)
        else:
            application = serializer.save(user=user)

        # Always set status to pending on submission
        user.verification_status = 'pending'
        user.save(update_fields=['verification_status'])

        return Response(
    {"detail": "Application submitted successfully.", "id": application.id},
    status=status.HTTP_201_CREATED
)
    @action(detail=False, methods=['get'])
    def pending(self, request):
        qs = self.get_queryset().filter(status='pending')
        data = self.get_serializer(qs, many=True).data
        return Response(data)

    @action(detail=True, methods=['patch'])
    def accept(self, request, pk=None):
        app = self.get_object()
        app.status = 'accepted'
        app.save(update_fields=['status'])

        user = app.user
        user.verification_status = 'verified'
        user.save(update_fields=['verification_status'])

        return Response({
            "detail": "Application accepted, user verified.",
            "verification_status": user.verification_status
        })

    @action(detail=True, methods=['patch'])
    def decline(self, request, pk=None):
        app = self.get_object()
        app.status = 'declined'
        app.save(update_fields=['status'])

        user = app.user
        user.verification_status = 'declined'
        user.save(update_fields=['verification_status'])

        return Response({
            "detail": "Application declined, user marked as declined.",
            "verification_status": user.verification_status
        })
