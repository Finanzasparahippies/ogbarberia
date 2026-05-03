from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, AppointmentViewSet, DashboardReportsView

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
    path('reports/', DashboardReportsView.as_view(), name='dashboard-reports'),
]
