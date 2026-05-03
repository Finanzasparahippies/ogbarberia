"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Calendar,
  AlertCircle,
  BrainCircuit,
  ArrowUpRight
} from "lucide-react";

interface FinanceSummary {
  total_revenue: number;
  gross_profit: number;
  total_expenses: number;
  net_utility: number;
  roi: number;
  error?: string;
}

interface DashboardData {
  summary: FinanceSummary;
  prediction_next_month: number;
  chart: string | null;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/finance/dashboard/?days=${days}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [days]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  const summary = data?.summary;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold outfit tracking-tight mb-2">
              FINANZAS <span className="text-gold">OG BARBERÍA</span>
            </h1>
            <p className="text-gray-400">Inteligencia de negocios y proyecciones AI</p>
          </div>
          
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-gold/10">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  days === d ? "bg-gold text-black shadow-lg shadow-gold/20" : "text-gray-400 hover:text-white"
                }`}
              >
                {d} DÍAS
              </button>
            ))}
          </div>
        </div>

        {summary?.error ? (
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl flex items-center gap-4 text-red-200">
            <AlertCircle className="w-8 h-8" />
            <div>
              <p className="font-bold">Datos insuficientes</p>
              <p className="text-sm opacity-80">{summary.error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Ingresos Totales" 
                value={`$${summary?.total_revenue.toLocaleString()}`} 
                icon={<DollarSign className="text-gold" />}
                trend="+12%"
              />
              <StatCard 
                title="Gastos Operativos" 
                value={`$${summary?.total_expenses.toLocaleString()}`} 
                icon={<TrendingDown className="text-red-500" />}
                trend="-5%"
                isNegative
              />
              <StatCard 
                title="Utilidad Neta" 
                value={`$${summary?.net_utility.toLocaleString()}`} 
                icon={<TrendingUp className="text-green-500" />}
                trend="+18%"
              />
              <StatCard 
                title="R.O.I." 
                value={`${summary?.roi.toFixed(1)}%`} 
                icon={<PieChartIcon className="text-purple-500" />}
                trend="Saludable"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-zinc-900/30 border border-gold/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-gold/80">Balance Visual</h3>
                  <Calendar className="text-gray-600 w-5 h-5" />
                </div>
                {data?.chart && (
                  <img 
                    src={`data:image/png;base64,${data.chart}`} 
                    alt="Financial Chart" 
                    className="w-full h-auto rounded-xl shadow-2xl border border-gold/5"
                  />
                )}
              </div>

              {/* AI Prediction Section */}
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-br from-gold/20 to-zinc-900 border border-gold/30 rounded-3xl p-8 relative overflow-hidden group">
                  <BrainCircuit className="absolute -right-4 -bottom-4 w-32 h-32 text-gold/5 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gold p-2 rounded-lg">
                        <BrainCircuit className="w-5 h-5 text-black" />
                      </div>
                      <h3 className="font-bold text-lg">PROYECCIÓN AI</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 italic">
                      Basado en tu historial, scikit-learn predice que tus ingresos el próximo mes serán de:
                    </p>
                    <div className="text-4xl font-bold outfit text-gold mb-4">
                      ${data?.prediction_next_month.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-400 font-bold uppercase tracking-widest">
                      <ArrowUpRight className="w-4 h-4" /> Crecimiento Estimado
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-gold/10 rounded-3xl p-8">
                  <h3 className="font-bold mb-4 uppercase tracking-tighter text-sm text-gray-500">Acciones Recomendadas</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      Optimizar horarios de baja demanda.
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      Revisar margen de servicios de barba.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isNegative = false }: any) {
  return (
    <div className="bg-zinc-900/40 border border-gold/10 p-6 rounded-2xl hover:border-gold/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-black rounded-xl border border-gold/5 group-hover:border-gold/20 transition-all">
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
          isNegative ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
        }`}>
          {trend}
        </span>
      </div>
      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
      <div className="text-2xl font-bold outfit">{value}</div>
    </div>
  );
}
