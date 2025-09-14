#comments/serializers.py
from rest_framework import serializers
from .models import Comment
from api.models import CustomUser

class CommenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'org_logo', 'email', 'verification_status', 'company_name']

class ReplySerializer(serializers.ModelSerializer):
    user = CommenterSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at', 'replies']

    def get_replies(self, obj):
        # A workaround to recursively serialize replies
        return ReplySerializer(obj.replies.all(), many=True).data

class CommentSerializer(serializers.ModelSerializer):
    user = CommenterSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    replied_to = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(),
        required=False,
        allow_null=True,
        write_only=True
    )
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at', 'replies', 'replied_to']