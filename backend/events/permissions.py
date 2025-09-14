# events/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allow event owners and their co-organizers to edit;
    everyone else has read-only access.
    """
    def has_object_permission(self, request, view, obj):
        # Allow GET/HEAD/OPTIONS for all
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user
        owner = obj.created_by
        co_organizer = getattr(user, "added_by", None)

        return user == owner or co_organizer == owner