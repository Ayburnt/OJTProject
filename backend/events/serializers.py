# events/serializers.py
from rest_framework import serializers
from .models import Event, Ticket_Type, Reg_Form_Template, Reg_Form_Question, Question_Option
from django.db import transaction

# Serializer for Question_Option
class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question_Option
        fields = ['option_value']

# Serializer for Reg_Form_Question
class RegFormQuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, required=False)

    class Meta:
        model = Reg_Form_Question
        fields = ['question_label', 'question_type', 'is_required', 'options']

# Serializer for Reg_Form_Template
class RegFormTemplateSerializer(serializers.ModelSerializer):
    questions = RegFormQuestionSerializer(many=True, required=False)

    class Meta:
        model = Reg_Form_Template
        fields = ['is_active', 'questions']

# Serializer for Ticket_Type
class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket_Type
        fields = ['ticket_name', 'price', 'seating_map', 'quantity_total', 'quantity_available', 'is_selling']

# Main Event Serializer
class EventSerializer(serializers.ModelSerializer):
    ticket_types = TicketTypeSerializer(many=True, required=False)
    reg_form_templates = RegFormTemplateSerializer(many=True, required=False)
    
    created_by = serializers.CharField(source='created_by.user_code', read_only=True)

    class Meta:
        model = Event
        fields = [
            'event_code', 'title', 'description', 'audience', 'private_code',
            'category', 'event_type', 'meeting_platform', 'meeting_link',
            'event_poster', 'duration_type', 'start_date', 'end_date',
            'start_time', 'end_time', 'venue_place_id', 'venue_name',
            'venue_address', 'age_restriction', 'age_allowed', 'parking',
            'event_qr_link', 'event_qr_image', 'posting_fee', 'isFee_paid',
            'status', 'created_by', 'created_at', 'updated_at',
            'ticket_types', 'reg_form_templates'
        ]
        read_only_fields = ('created_by', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Use a database transaction to ensure atomicity
        with transaction.atomic():
            # Pop nested data before creating the parent Event
            ticket_types_data = validated_data.pop('ticket_types', [])
            reg_form_templates_data = validated_data.pop('reg_form_templates', [])

            # Get the authenticated user from the context
            user = self.context['request'].user
            
            # Create the Event instance
            event = Event.objects.create(created_by=user, **validated_data)

            # Create related Ticket_Type instances
            for ticket_data in ticket_types_data:
                Ticket_Type.objects.create(event=event, **ticket_data)

            # Create related Reg_Form_Template and its children
            for template_data in reg_form_templates_data:
                questions_data = template_data.pop('questions', [])
                reg_form_template = Reg_Form_Template.objects.create(
                    event=event, 
                    created_by=user, 
                    **template_data
                )
                
                # Create related Reg_Form_Question and its options
                for question_data in questions_data:
                    options_data = question_data.pop('options', [])
                    reg_form_question = Reg_Form_Question.objects.create(
                        reg_form_template=reg_form_template, 
                        **question_data
                    )
                    
                    # Create related Question_Option instances
                    for option_data in options_data:
                        Question_Option.objects.create(question=reg_form_question, **option_data)

            return event

    def update(self, instance, validated_data):
        # This is a basic update method that doesn't handle nested updates for simplicity.
        # For a full implementation, you'd need to handle updating existing nested objects, 
        # creating new ones, and deleting old ones.
        return super().update(instance, validated_data)