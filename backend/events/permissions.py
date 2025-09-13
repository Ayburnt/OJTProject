# events/permissions.py

from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow organizers and co-organizers to edit an event.
    """
    def has_object_permission(self, request, view, obj):
        # Read-only permissions are always allowed for safe methods (GET, HEAD, OPTIONS).
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user is the primary organizer.
        is_owner = obj.created_by == request.user

        # Check if the user is a co-organizer (if they have an 'added_by' parent)
        is_co_organizer = (
            hasattr(request.user, 'added_by') and
            request.user.added_by == obj.created_by
        )

        return is_owner or is_co_organizer