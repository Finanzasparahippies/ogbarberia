from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ClientProfile

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_staff', 'is_barber', 'is_client']
    fieldsets = UserAdmin.fieldsets + (
        ('Roles', {'fields': ('is_barber', 'is_client', 'phone')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Roles', {'fields': ('is_barber', 'is_client', 'phone')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(ClientProfile)
