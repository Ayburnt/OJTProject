#comments/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Comment
from events.models import Event
from .serializers import CommentSerializer

class CommentListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, event_id, format=None):
        """
        List all comments for a post.
        """
        comments = Comment.objects.filter(event_id=event_id, replied_to=None).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True, context={"request": request})
        return Response(serializer.data)
    
    def post(self, request, event_id, format=None):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            event = Event.objects.get(id=event_id)
            serializer.save(user=request.user, event=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
