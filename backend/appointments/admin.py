from django.contrib import admin
from .models import Service, Appointment

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_minutes', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('date', 'time', 'client', 'barber', 'service', 'status', 'payment_method')
    list_filter = ('status', 'payment_method', 'date', 'barber')
    search_fields = ('client__email', 'barber__email', 'service__name')
    date_hierarchy = 'date'
