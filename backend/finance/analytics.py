import pandas as pd
import numpy as np
from django.db.models import Sum
from appointments.models import Appointment
from .models import Expense, BarberCommission
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

class BusinessAnalytics:
    @staticmethod
    def get_financial_summary(days=30):
        start_date = timezone.now() - timedelta(days=days)
        
        # 1. Obtener datos de Citas (Ingresos)
        appointments = Appointment.objects.filter(date__gte=start_date, status='COMPLETED')
        df_appointments = pd.DataFrame(list(appointments.values('date', 'service__price', 'barber_id')))
        
        if df_appointments.empty:
            return {"error": "No hay datos suficientes para el análisis"}

        total_revenue = df_appointments['service__price'].sum()

        # 2. Calcular Comisiones
        # Aquí cruzamos con las comisiones configuradas
        commissions = BarberCommission.objects.all()
        comm_dict = {c.barber_id: float(c.percentage) / 100 for c in commissions}
        
        def calculate_net(row):
            perc = comm_dict.get(row['barber_id'], 0.5) # Default 50%
            return float(row['service__price']) * (1 - perc)

        df_appointments['net_for_owner'] = df_appointments.apply(calculate_net, axis=1)
        gross_profit = df_appointments['net_for_owner'].sum()

        # 3. Obtener Gastos
        expenses = Expense.objects.filter(date__gte=start_date)
        total_expenses = float(expenses.aggregate(Sum('amount'))['amount__sum'] or 0)

        # 4. Utilidad Neta
        net_utility = float(gross_profit) - total_expenses

        return {
            "total_revenue": float(total_revenue),
            "gross_profit": float(gross_profit),
            "total_expenses": total_expenses,
            "net_utility": net_utility,
            "roi": (net_utility / total_expenses * 100) if total_expenses > 0 else 0
        }

    @staticmethod
    def predict_next_month_revenue():
        # Obtenemos ingresos diarios de los últimos 90 días
        start_date = timezone.now() - timedelta(days=90)
        appointments = Appointment.objects.filter(date__gte=start_date, status='COMPLETED')
        
        df = pd.DataFrame(list(appointments.values('date', 'service__price')))
        if df.empty or len(df['date'].unique()) < 5:
            return 0

        df['date'] = pd.to_datetime(df['date'])
        daily_rev = df.groupby('date')['service__price'].sum().reset_index()
        
        # Preparar modelo para Scikit-Learn
        daily_rev['day_index'] = (daily_rev['date'] - daily_rev['date'].min()).dt.days
        X = daily_rev[['day_index']].values
        y = daily_rev['service__price'].values

        model = LinearRegression()
        model.fit(X, y)

        # Predecir los próximos 30 días
        future_days = np.array([[i] for i in range(X.max() + 1, X.max() + 31)])
        predictions = model.predict(future_days)
        
        return float(np.sum(predictions))

from django.utils import timezone
