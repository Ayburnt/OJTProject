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
        fields = '__all__'
        extra_kwargs = {'event': {'required': False}}

class EventSerializer(serializers.ModelSerializer):
    ticket_types = TicketTypeSerializer(many=True)
    reg_form_templates = RegFormTemplateSerializer(many=True, required=False)
    reg_form_questions = RegFormQuestionSerializer(many=True, required=False)    
    event_poster = serializers.ImageField(required=False, allow_null=True)
    seating_map = serializers.ImageField(required=False, allow_null=True)


    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['created_by']

    # ...existing code...
    def create(self, validated_data):
        print("validated_data before file assignment:", validated_data)
        # Extract nested data
        ticket_types_data = validated_data.pop('ticket_types', [])
        reg_form_templates_data = validated_data.pop('reg_form_templates', [])

        # Assign the authenticated user as the creator
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        if request and request.FILES.get('event_poster'):
            validated_data['event_poster'] = request.FILES['event_poster']
        if request and request.FILES.get('seating_map'):
            validated_data['seating_map'] = request.FILES['seating_map']

        files = self.context.get('files', None)
        print("FILES IN CONTEXT:", files)
        if files:
            if files.get('event_poster'):
                validated_data['event_poster'] = files['event_poster']
            if files.get('seating_map'):
                validated_data['seating_map'] = files['seating_map']
        elif request:
            if request.FILES.get('event_poster'):
                validated_data['event_poster'] = request.FILES['event_poster']
            if request.FILES.get('seating_map'):
                validated_data['seating_map'] = request.FILES['seating_map']   
        print("validated_data after file assignment:", validated_data)

        # --- Status logic ---
        all_free = all(
            (str(ticket.get('price', 0)) == '0' or str(ticket.get('price', 0)) == '0.00')
            for ticket in ticket_types_data
        )
        if all_free:
            validated_data['status'] = 'published'
        # else: status remains default ('pending')

        # Use a database transaction for atomicity
        with transaction.atomic():
            event = Event.objects.create(**validated_data)

            # Create related Ticket_Type objects
            for ticket_data in ticket_types_data:
                Ticket_Type.objects.create(event=event, **ticket_data)

            # Create related Reg_Form_Template and its nested objects
            for template_data in reg_form_templates_data:
                questions_data = template_data.pop('questions', [])
                reg_form_template = Reg_Form_Template.objects.create(
                    event=event,
                    created_by=request.user,  # <-- Add this line
                    **template_data
                )

                # Create related Reg_Form_Question and its nested options
                for question_data in questions_data:
                    options_data = question_data.pop('options', [])
                    reg_form_question = Reg_Form_Question.objects.create(
                        regForm_template=reg_form_template,  # <-- Make sure this matches your model field name
                        **question_data
                    )

                    # Create related Question_Option objects
                    for option_data in options_data:
                        Question_Option.objects.create(question=reg_form_question, **option_data)

        return event
    # ...existing code...