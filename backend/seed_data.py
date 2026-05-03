import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from appointments.models import Service

User = get_user_model()

def seed():
    print("Seeding data...")
    
    # Create Admin
    if not User.objects.filter(email='admin@ogbarberia.com').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@ogbarberia.com',
            password='adminpassword',
            first_name='Admin',
            last_name='OG'
        )
        print("Admin created: admin@ogbarberia.com / adminpassword")

    # Create Barber
    barber, created = User.objects.get_or_create(
        email='barbero@ogbarberia.com',
        defaults={
            'username': 'barbero',
            'first_name': 'Juan',
            'last_name': 'Pérez',
            'is_barber': True,
            'is_staff': True
        }
    )
    if created:
        barber.set_password('barberopassword')
        barber.save()
        print("Barber created: barbero@ogbarberia.com / barberopassword")

    # Create Services
    services = [
        {
            'name': 'Corte Signature',
            'description': 'Corte personalizado con acabado a navaja y lavado premium con productos de alta gama.',
            'price': 350.00,
            'duration_minutes': 45
        },
        {
            'name': 'Barba Royal',
            'description': 'Perfilado con toalla caliente, aceites esenciales, masaje facial y acabado impecable.',
            'price': 250.00,
            'duration_minutes': 30
        },
        {
            'name': 'Combo OG',
            'description': 'Nuestra experiencia completa: Corte Signature + Barba Royal + Ritual de relajación.',
            'price': 500.00,
            'duration_minutes': 75
        },
        {
            'name': 'Limpieza Facial',
            'description': 'Tratamiento revitalizante para la piel del caballero, incluye exfoliación y mascarilla.',
            'price': 400.00,
            'duration_minutes': 40
        }
    ]

    for s_data in services:
        service, created = Service.objects.get_or_create(
            name=s_data['name'],
            defaults=s_data
        )
        if created:
            print(f"Service created: {service.name}")

    print("Seeding completed!")

if __name__ == '__main__':
    seed()
