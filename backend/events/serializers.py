# events/serializers.py
from rest_framework import serializers
from .models import Event, Ticket_Type, Reg_Form_Template, Reg_Form_Question, Question_Option
from django.db import transaction
from api.models import CustomUser

# Serializer for Question_Option
class QuestionOptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Question_Option
        fields = ['id', 'option_value']

# Serializer for Reg_Form_Question
class RegFormQuestionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    options = QuestionOptionSerializer(many=True, required=False)

    class Meta:
        model = Reg_Form_Question
        fields = ['id', 'question_label', 'question_type', 'is_required', 'options']

# Serializer for Reg_Form_Template
class RegFormTemplateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    questions = RegFormQuestionSerializer(many=True, required=False)

    class Meta:
        model = Reg_Form_Template
        fields = ['id', 'is_active', 'questions']

    def validate_questions(self, value):
        """
        Allow multiple questions with the same question_type.
        Skip any duplicate validation.
        """
        # Optionally: you can still enforce that each question has a label
        for q in value:
            if not q.get('question_label'):
                raise serializers.ValidationError("Each question must have a label.")
        return value

# Serializer for Ticket_Type
class TicketTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Ticket_Type
        fields = '__all__'
        extra_kwargs = {'event': {'required': False}}
        
        
class userserializer(serializers.ModelSerializer):
    org_logo = serializers.SerializerMethodField()
    qr_code_image = serializers.SerializerMethodField()
    class Meta:
        model= CustomUser
        fields = ["first_name", "last_name", "email", "profile_picture", "org_logo", "company_name", "company_website", "user_code", "qr_code_image", "verification_status"] 
    
    def get_org_logo(self, obj):
        request = self.context.get("request")
        if obj.org_logo:
            url = obj.org_logo.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_qr_code_image(self, obj):
        request = self.context.get("request")
        if obj.qr_code_image:
            url = obj.qr_code_image.url
            return request.build_absolute_uri(url) if request else url
        return None


class EventSerializer(serializers.ModelSerializer):
    created_by = userserializer(read_only=True)
    ticket_types = TicketTypeSerializer(many=True)
    reg_form_templates = RegFormTemplateSerializer(many=True, required=False)    
    event_poster = serializers.ImageField(required=False, allow_null=True)
    seating_map = serializers.ImageField(required=False, allow_null=True)

        # Use SerializerMethodField for absolute URLs
    event_poster_url = serializers.SerializerMethodField(read_only=True)
    seating_map_url = serializers.SerializerMethodField(read_only=True)
    event_qr_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['created_by']
        
    def get_event_poster_url(self, obj):
        request = self.context.get('request')
        if obj.event_poster:
            return request.build_absolute_uri(obj.event_poster.url)
        return None

    def get_seating_map_url(self, obj):
        request = self.context.get('request')
        if obj.seating_map:
            return request.build_absolute_uri(obj.seating_map.url)
        return None

    def get_event_qr_image_url(self, obj):
        request = self.context.get('request')
        if obj.event_qr_image:
            return request.build_absolute_uri(obj.event_qr_image.url)
        return None
    
    def validate(self, data):
        if data.get("status") != "draft":
            # enforce required fields only if not draft
            required_fields = ["ticket_types", "event_code", "event_type"]
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({field: "This field is required."})
        return data

    def update(self, instance, validated_data):
        tickets_data = validated_data.pop("ticket_types", None)
        templates_data = validated_data.pop("reg_form_templates", None)

        with transaction.atomic():
            # --- Update normal fields ---
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            # --- Handle tickets ---
            if tickets_data is not None:
                existing_ticket_ids = [t.id for t in instance.ticket_types.all()]
                sent_ticket_ids = []

                for ticket_data in tickets_data:
                    ticket_id = ticket_data.get("id")
                    if ticket_id and ticket_id in existing_ticket_ids:
                        # Update existing ticket
                        ticket = Ticket_Type.objects.get(id=ticket_id, event=instance)
                        for attr, value in ticket_data.items():
                            if attr != "id":
                                setattr(ticket, attr, value)
                        ticket.save()
                        sent_ticket_ids.append(ticket_id)
                    else:
                        # Create new ticket
                        new_ticket = Ticket_Type.objects.create(event=instance, **ticket_data)
                        sent_ticket_ids.append(new_ticket.id)

                # Delete tickets not in payload
                instance.ticket_types.exclude(id__in=sent_ticket_ids).delete()

            # --- Handle reg form templates + questions + options ---
            if templates_data is not None:
                existing_template_ids = [t.id for t in instance.reg_form_templates.all()]
                sent_template_ids = []

                request = self.context.get('request')
                user = request.user if request and request.user.is_authenticated else None

                for template_data in templates_data:
                    template_id = template_data.get("id")
                    questions_data = template_data.pop("questions", [])

                    if template_id and template_id in existing_template_ids:
                        # Update existing template
                        template = Reg_Form_Template.objects.get(id=template_id, event=instance)
                        template.is_active = template_data.get("is_active", template.is_active)
                        template.save()
                        sent_template_ids.append(template_id)
                    else:
                        # Create new template
                        template = Reg_Form_Template.objects.create(
                            event=instance,
                            created_by=user,
                            **template_data
                        )
                        sent_template_ids.append(template.id)

                    # --- Handle questions ---
                    existing_question_ids = [q.id for q in template.questions.all()]
                    sent_question_ids = []

                    for question_data in questions_data:
                        question_id = question_data.get("id")
                        options_data = question_data.pop("options", [])

                        if question_id and question_id in existing_question_ids:
                            # Update existing question
                            question = Reg_Form_Question.objects.get(id=question_id, regForm_template=template)
                            for attr, value in question_data.items():
                                if attr != "id":
                                    setattr(question, attr, value)
                            question.save()
                            sent_question_ids.append(question_id)
                        else:
                            # Create new question
                            question = Reg_Form_Question.objects.create(
                                regForm_template=template,
                                **question_data
                            )
                            sent_question_ids.append(question.id)

                        # --- Handle options ---
                        existing_option_ids = [o.id for o in question.options.all()]
                        sent_option_ids = []

                        for option_data in options_data:
                            option_id = option_data.get("id")
                            if option_id and option_id in existing_option_ids:
                                # Update existing option
                                option = Question_Option.objects.get(id=option_id, question=question)
                                option.option_value = option_data.get("option_value", option.option_value)
                                option.save()
                                sent_option_ids.append(option_id)
                            else:
                                # Create new option
                                new_option = Question_Option.objects.create(question=question, **option_data)
                                sent_option_ids.append(new_option.id)

                        # Delete options not in payload
                        question.options.exclude(id__in=sent_option_ids).delete()

                    # Delete questions not in payload
                    template.questions.exclude(id__in=sent_question_ids).delete()

                # Delete templates not in payload
                instance.reg_form_templates.exclude(id__in=sent_template_ids).delete()

        return instance

    
    def create(self, validated_data):
        print("validated_data before file assignment:", validated_data)
        # Extract nested data
        ticket_types_data = validated_data.pop('ticket_types', [])
        reg_form_templates_data = validated_data.pop('reg_form_templates', [])

        # get the value passed from view, if any
        created_by = validated_data.pop("created_by", None)

        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None

        # fallback if view didn’t send created_by
        if created_by is None and user:
            created_by = user

        # add it back before creating the Event
        validated_data["created_by"] = created_by

        # Handle file uploads
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

        print("validated_data after file assignment:", validated_data)

        # --- Status logic ---
        all_free = all(
            (str(ticket.get('price', 0)) == '0' or str(ticket.get('price', 0)) == '0.00')
            for ticket in ticket_types_data
        )

        is_verified = getattr(user, "verification_status", "unverified") == "verified"

        if all_free:
            validated_data['status'] = 'published'
        elif not all_free and not is_verified:
            validated_data['status'] = 'draft'      # paid tickets but organizer not verified
        else:
            validated_data['status'] = 'pending'    # paid tickets + verified organizer

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
                    created_by=user,
                    **template_data
                )

                # Create related Reg_Form_Question and its nested options
                for question_data in questions_data:
                    options_data = question_data.pop('options', [])
                    reg_form_question = Reg_Form_Question.objects.create(
                        regForm_template=reg_form_template,
                        **question_data
                    )
                    for option_data in options_data:
                        Question_Option.objects.create(question=reg_form_question, **option_data)

        return event