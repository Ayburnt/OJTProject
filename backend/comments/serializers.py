#comments/serializers.py
from rest_framework import serializers
from .models import Comment
from api.models import CustomUser

class CommenterSerializer(serializers.ModelSerializer):
    org_logo = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'org_logo', 'email', 'verification_status', 'company_name']
    
    def get_org_logo(self, obj):
        """
        Return absolute URI of org_logo if present.
        """
        request = self.context.get("request")
        if obj.org_logo:
            url = obj.org_logo.url if hasattr(obj.org_logo, "url") else obj.org_logo
            return request.build_absolute_uri(url) if request else url
        return None

class ReplySerializer(serializers.ModelSerializer):
    user = CommenterSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at', 'replies']

    def get_replies(self, obj):
        return ReplySerializer(
            obj.replies.all(),
            many=True,
            context=self.context   # <-- important
        ).data


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