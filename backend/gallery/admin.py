from django.contrib import admin
from django.utils.html import format_html
from .models import WorkPhoto

@admin.register(WorkPhoto)
class WorkPhotoAdmin(admin.ModelAdmin):
    list_display = ('preview', 'title', 'media_type', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    list_filter = ('media_type', 'is_active', 'created_at')
    search_fields = ('title', 'description')
    
    def preview(self, obj):
        if obj.media_type == 'IMAGE' and obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />', obj.image.url)
        elif obj.media_type == 'VIDEO' and obj.video:
            return format_html('<div style="width: 50px; height: 50px; background: #000; border-radius: 5px; display: flex; items-center; justify-content: center; color: gold; font-weight: bold; font-size: 10px;">VIDEO</div>')
        return "No media"
    
    preview.short_description = 'Previsualización'
