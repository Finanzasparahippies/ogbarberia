from django.conf import settings
from django.db import models

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('HAIRCUT', 'Cortes de Cabello'),
        ('BEARD', 'Barba & Grooming'),
        ('PACKAGE', 'Paquetes & Combos'),
        ('OTHER', 'Otros Servicios'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='HAIRCUT', verbose_name="Categoría")
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=30)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    order = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['category', 'order', 'name']

    def __str__(self):
        return self.name

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('CONFIRMED', 'Confirmada'),
        ('COMPLETED', 'Completada'),
        ('CANCELLED', 'Cancelada'),
    ]
    
    PAYMENT_METHODS = [
        ('CASH', 'Efectivo'),
        ('CARD', 'Tarjeta'),
        ('TRANSFER', 'Transferencia'),
    ]

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='client_appointments'
    )
    barber = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='barber_appointments'
    )
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='CASH')
    notes = models.TextField(blank=True)
    
    # Nuevos campos para confirmaciones
    is_confirmed_by_client = models.BooleanField(default=False)
    reminder_sent = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']
        unique_together = ['barber', 'date', 'time'] # Evita colisiones para el mismo barbero

    def __str__(self):
        return f"{self.date} {self.time} - {self.client.email} con {self.barber.email}"
