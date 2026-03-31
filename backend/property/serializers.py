from rest_framework import serializers
from .models import Property, Agent


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = "__all__"


class PropertySerializer(serializers.ModelSerializer):
    agent_detail = serializers.SerializerMethodField()
    internal_notes = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = "__all__"

    def get_image(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url

    def get_agent_detail(self, obj):
        return AgentSerializer(obj.agent).data

    def get_internal_notes(self, obj):
        request = self.context.get("request")

        if (
            request
            and request.user
            and request.user.is_authenticated
            and request.user.is_staff
        ):
            return obj.internal_notes

        return None
