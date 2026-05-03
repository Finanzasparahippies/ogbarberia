from django.contrib import admin
from .models import ExpenseCategory, Expense, BarberCommission

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'category', 'amount', 'date')
    list_filter = ('category', 'date')
    search_fields = ('description',)
    date_hierarchy = 'date'

@admin.register(BarberCommission)
class BarberCommissionAdmin(admin.ModelAdmin):
    list_display = ('barber', 'percentage')
    search_fields = ('barber__first_name', 'barber__last_name', 'barber__email')
