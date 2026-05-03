from django.db import models

class WorkPhoto(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('IMAGE', 'Imagen'),
        ('VIDEO', 'Video'),
    ]

    title = models.CharField(max_length=100, blank=True, verbose_name="Título")
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='IMAGE', verbose_name="Tipo de Media")
    image = models.FileField(upload_to='gallery/images/', blank=True, null=True, verbose_name="Imagen (Soporta HEIC, JPG, PNG)")
    video = models.FileField(upload_to='gallery/videos/', blank=True, null=True, verbose_name="Video (Solo si es tipo Video)")
    description = models.TextField(blank=True, verbose_name="Descripción")
    order = models.PositiveIntegerField(default=0, verbose_name="Orden")
    is_active = models.BooleanField(default=True, verbose_name="Activa")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Contenido de Galería"
        verbose_name_plural = "Contenidos de Galería"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"[{self.get_media_type_display()}] {self.title or f'Elemento {self.id}'}"

