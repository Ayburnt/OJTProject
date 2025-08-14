# verifications/serializers.py
from rest_framework import serializers
from .models import OrganizerApplication

class OrganizerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerApplication
        fields = [
            'id',
            'user',
            'organizer_name',
            'business_name',
            'dti_registration_number',
            'contact_email',
            'contact_number',
            'business_address',
            'dti_file',
            'govt_id_file',
            'business_permit_file',
            'tin_file',
            'status',
            'submitted_at',
        ]
        read_only_fields = ['id', 'user', 'status', 'submitted_at']