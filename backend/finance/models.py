from django.db import models
from django.conf import settings
from django.utils import timezone

class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Expense(models.Model):
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name} - ${self.amount} ({self.date})"

class BarberCommission(models.Model):
    barber = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to={'is_barber': True},
        related_name='commission_config'
    )
    percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=50.00,
        help_text="Porcentaje que se lleva el barbero del total del servicio."
    )

    def __str__(self):
        return f"{self.barber.get_full_name()} - {self.percentage}%"
