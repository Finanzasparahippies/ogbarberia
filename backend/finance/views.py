from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .analytics import BusinessAnalytics
import matplotlib.pyplot as plt
import io
import base64

class FinanceDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        analytics = BusinessAnalytics()
        
        summary = analytics.get_financial_summary(days=days)
        prediction = analytics.predict_next_month_revenue()

        # Generar gráfico con Matplotlib
        if "error" not in summary:
            plt.figure(figsize=(8, 4))
            plt.bar(['Ingresos', 'Gastos', 'Utilidad'], 
                    [summary['total_revenue'], summary['total_expenses'], summary['net_utility']],
                    color=['#D4AF37', '#e74c3c', '#2ecc71'])
            plt.title(f'Balance Financiero - Últimos {days} días')
            plt.grid(axis='y', linestyle='--', alpha=0.7)
            
            # Guardar gráfico en buffer
            buf = io.BytesIO()
            plt.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            img_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close()
        else:
            img_base64 = None

        return Response({
            "summary": summary,
            "prediction_next_month": prediction,
            "chart": img_base64
        })
