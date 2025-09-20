# subscriptions/serializers.py
from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"
        read_only_fields = ["subscriber"]  # client never sends this

    def create(self, validated_data):
        # always use the authenticated organizer as subscriber
        return Subscription.objects.create(
            subscriber=self.context["request"].user,
            **validated_data
        )
