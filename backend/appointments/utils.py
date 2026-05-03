import logging
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.core.signing import Signer, TimestampSigner

logger = logging.getLogger(__name__)

def send_appointment_email(appointment, email_type='creation'):
    """
    Sends an email to the client about their appointment.
    email_type: 'creation' or 'reminder'
    """
    signer = TimestampSigner()
    token = signer.sign(str(appointment.id))
    confirmation_url = f"{settings.BACKEND_URL}/api/booking/appointments/confirm/?token={token}"
    
    subject = ""
    if email_type == 'creation':
        subject = f"Cita Agendada - OG Barbería"
        title = "¡Tu cita ha sido agendada!"
        message = f"Hola {appointment.client.first_name}, tu cita para {appointment.service.name} ha sido registrada con éxito."
        button_text = "Ver detalles de mi cita"
        link = f"{settings.FRONTEND_URL}/dashboard/client"
    else:
        subject = f"Recordatorio de tu Cita - OG Barbería"
        title = "¿Confirmas tu asistencia?"
        message = f"Hola {appointment.client.first_name}, te recordamos tu cita de hoy a las {appointment.time}. Por favor, confirma tu asistencia haciendo clic en el botón de abajo."
        button_text = "CONFIRMAR ASISTENCIA"
        link = confirmation_url

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body {{ font-family: 'Outfit', sans-serif; background-color: #000; color: #fff; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #c5a05922; background-color: #09090b; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 24px; font-weight: bold; color: #c5a059; letter-spacing: 2px; text-transform: uppercase; }}
            .content {{ line-height: 1.6; text-align: center; }}
            .title {{ font-size: 28px; margin-bottom: 20px; color: #fff; text-transform: uppercase; }}
            .details {{ background: #18181b; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #ffffff08; }}
            .detail-item {{ margin: 10px 0; color: #a1a1aa; }}
            .highlight {{ color: #c5a059; font-weight: bold; }}
            .button {{ display: inline-block; padding: 16px 32px; background-color: #c5a059; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 30px; text-transform: uppercase; letter-spacing: 1px; }}
            .footer {{ text-align: center; margin-top: 40px; font-size: 12px; color: #71717a; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">OG BARBERÍA</div>
            </div>
            <div class="content">
                <h1 class="title">{title}</h1>
                <p>{message}</p>
                <div class="details">
                    <div class="detail-item">Servicio: <span class="highlight">{appointment.service.name}</span></div>
                    <div class="detail-item">Fecha: <span class="highlight">{appointment.date}</span></div>
                    <div class="detail-item">Hora: <span class="highlight">{appointment.time}</span></div>
                    <div class="detail-item">Barbero: <span class="highlight">{appointment.barber.get_full_name() or appointment.barber.email}</span></div>
                </div>
                <a href="{link}" class="button">{button_text}</a>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                <p>&copy; 2026 OG Barbería. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = strip_tags(html_content)
    
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [appointment.client.email])
    msg.attach_alternative(html_content, "text/html")
    
    try:
        msg.send()
        return True
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return False
