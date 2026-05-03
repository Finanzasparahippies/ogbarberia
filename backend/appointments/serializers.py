from rest_framework import serializers
from .models import Service, Appointment
from users.serializers import UserSerializer

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    client_details = UserSerializer(source='client', read_only=True)
    barber_details = UserSerializer(source='barber', read_only=True)
    service_details = ServiceSerializer(source='service', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'client', 'barber', 'service', 'date', 'time', 
            'status', 'payment_method', 'notes', 'created_at',
            'client_details', 'barber_details', 'service_details',
            'is_confirmed_by_client'
        ]
        read_only_fields = ['client'] # Se asignará automáticamente al usuario logueado

    def validate(self, data):
        # Aquí podemos agregar validaciones extra (ej: no agendar en el pasado)
        return data
