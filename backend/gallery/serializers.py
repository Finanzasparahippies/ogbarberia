from rest_framework import serializers
from .models import WorkPhoto

class WorkPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkPhoto
        fields = ('id', 'title', 'media_type', 'image', 'video', 'description', 'order')
