from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_client = models.BooleanField(default=True)
    is_barber = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    loyalty_points = models.IntegerField(default=0)
    last_visit = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Profile of {self.user.email}"
