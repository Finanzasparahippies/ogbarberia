from rest_framework import viewsets, permissions, filters, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.shortcuts import redirect
from django.conf import settings
from .models import Service, Appointment
from .serializers import ServiceSerializer, AppointmentSerializer
from .utils import send_appointment_email

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date', 'time']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # Los barberos ven todas sus citas
            return Appointment.objects.filter(barber=user)
        # Los clientes ven solo sus citas
        return Appointment.objects.filter(client=user)

    def perform_create(self, serializer):
        # El cliente logueado es el que crea la cita
        appointment = serializer.save(client=self.request.user)
        # Enviar correo de confirmación inicial
        send_appointment_email(appointment, email_type='creation')

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def confirm(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Token missing'}, status=status.HTTP_400_BAD_REQUEST)
        
        signer = TimestampSigner()
        try:
            # El token expira en 24 horas (aunque solo lo mandamos 5h antes)
            appointment_id = signer.unsign(token, max_age=86400)
            appointment = Appointment.objects.get(id=appointment_id)
            appointment.is_confirmed_by_client = True
            appointment.status = 'CONFIRMED' # Auto-confirmamos al hacer click
            appointment.save()
            
            # Redirigir al frontend con un mensaje de éxito
            return redirect(f"{settings.FRONTEND_URL}/dashboard/client?confirmed=true")
        except (BadSignature, SignatureExpired, Appointment.DoesNotExist):
            return redirect(f"{settings.FRONTEND_URL}/dashboard/client?confirmed=false")

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def availability(self, request):
        # Retornamos solo fecha y hora para indicar espacios ocupados
        appointments = Appointment.objects.all().values('date', 'time', 'barber__first_name')
        return Response(appointments)

class DashboardReportsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_appointments = Appointment.objects.count()
        total_earnings = Appointment.objects.filter(status='COMPLETED').aggregate(Sum('service__price'))['service__price__sum'] or 0
        
        status_counts = Appointment.objects.values('status').annotate(count=Count('status'))
        service_popularity = Appointment.objects.values('service__name').annotate(count=Count('service')).order_by('-count')[:5]
        
        return Response({
            'total_appointments': total_appointments,
            'total_earnings': total_earnings,
            'status_counts': {item['status']: item['count'] for item in status_counts},
            'top_services': service_popularity
        })
