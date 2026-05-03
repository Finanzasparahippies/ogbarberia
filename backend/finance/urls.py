from django.urls import path
from .views import FinanceDashboardView

urlpatterns = [
    path('dashboard/', FinanceDashboardView.as_view(), name='finance-dashboard'),
]
