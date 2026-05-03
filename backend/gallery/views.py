from rest_framework import viewsets, permissions
from .models import WorkPhoto
from .serializers import WorkPhotoSerializer

class GalleryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para ver las fotos del trabajo.
    """
    queryset = WorkPhoto.objects.filter(is_active=True)
    serializer_class = WorkPhotoSerializer
    permission_classes = [permissions.AllowAny]
