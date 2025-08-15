# verifications/serializers.py
from rest_framework import serializers
from .models import OrganizerApplication

class OrganizerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerApplication
        fields = [
            'id',
            'organizer_name', 'business_name', 'dti_registration_number',
            'contact_email', 'contact_number', 'business_address',
            'dti_file', 'govt_id_file', 'business_permit_file', 'tin_file',
            'status', 'submitted_at', 'user'
        ]
        read_only_fields = ['id', 'status', 'submitted_at', 'user']

    def update(self, instance, validated_data):
        """
        Allow resubmission by updating the existing OneToOne application
        and forcing status back to 'pending'.
        """
        for field in [
            'organizer_name', 'business_name', 'dti_registration_number',
            'contact_email', 'contact_number', 'business_address',
            'dti_file', 'govt_id_file', 'business_permit_file', 'tin_file'
        ]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.status = 'pending'
        instance.save()
        return instance
