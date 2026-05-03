from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from appointments.models import Appointment
from appointments.utils import send_appointment_email
import pytz

class Command(BaseCommand):
    help = 'Envía recordatorios de citas 5 horas antes del inicio'

    def handle(self, *args, **options):
        # Usar la zona horaria de México configurada en settings
        tz = pytz.timezone('America/Mexico_City')
        now = timezone.now().astimezone(tz)
        
        # Ventana de tiempo: Citas que ocurren entre 4.5 y 5.5 horas a partir de ahora
        # Esto nos da margen si el cron corre cada 30 min
        start_window = now + timedelta(hours=4.5)
        end_window = now + timedelta(hours=5.5)
        
        self.stdout.write(f"Buscando citas entre {start_window} y {end_window}...")

        # Filtramos citas del día de hoy o mañana (dependiendo de la hora actual)
        # que estén en la ventana y no hayan recibido recordatorio
        appointments = Appointment.objects.filter(
            reminder_sent=False,
            status__in=['PENDING', 'CONFIRMED']
        )

        sent_count = 0
        for apt in appointments:
            # Combinamos fecha y hora para comparar
            apt_datetime = datetime.combine(apt.date, apt.time)
            apt_datetime = tz.localize(apt_datetime)
            
            if start_window <= apt_datetime <= end_window:
                self.stdout.write(f"Enviando recordatorio para cita ID {apt.id} ({apt.time})")
                success = send_appointment_email(apt, email_type='reminder')
                if success:
                    apt.reminder_sent = True
                    apt.save()
                    sent_count += 1
        
        self.stdout.write(self.style.SUCCESS(f"Se enviaron {sent_count} recordatorios."))
