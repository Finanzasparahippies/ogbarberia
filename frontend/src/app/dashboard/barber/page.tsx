'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Clock, Check, X, User as UserIcon, Calendar as CalendarIcon, Tag } from 'lucide-react';

interface Appointment {
  id: number;
  client_details: { first_name: string; last_name: string; email: string; phone_number: string };
  service_details: { name: string; duration_minutes: number; price: string };
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  payment_method: string;
  is_confirmed_by_client: boolean;
}

export default function BarberDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/booking/appointments/');
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/booking/appointments/${id}/`, { status });
      fetchAppointments();
    } catch (err) {
      alert("Error al actualizar estado");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'CONFIRMED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'COMPLETED': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold outfit gold-text-gradient uppercase tracking-tighter">
            Agenda de {user?.first_name}
          </h1>
          <p className="text-gray-500 text-sm">Gestiona tus citas y servicios del día</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-900 border border-gold/10 p-4 rounded-xl text-center min-w-[120px]">
            <div className="text-2xl font-bold text-white">{appointments.length}</div>
            <div className="text-[10px] text-gold uppercase font-bold tracking-widest">Total Citas</div>
          </div>
          <div className="bg-zinc-900 border border-gold/10 p-4 rounded-xl text-center min-w-[120px]">
            <div className="text-2xl font-bold text-white">
              {appointments.filter(a => a.status === 'PENDING').length}
            </div>
            <div className="text-[10px] text-gold uppercase font-bold tracking-widest">Pendientes</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {appointments.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/10 rounded-2xl">
              <CalendarIcon size={48} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-gray-500">No tienes citas agendadas por ahora.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-gold/20 transition-all"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="hidden md:flex flex-col items-center justify-center bg-black border border-gold/20 w-20 h-20 rounded-xl">
                    <span className="text-gold font-bold text-xl">{apt.time}</span>
                    <span className="text-[10px] text-gray-500 uppercase">{apt.date.split('-')[2]} / {apt.date.split('-')[1]}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                      {apt.is_confirmed_by_client && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-500 uppercase flex items-center gap-1">
                          <Check size={10} /> Email Confirmado
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                      <UserIcon size={16} className="text-gold" />
                      {apt.client_details.first_name} {apt.client_details.last_name}
                    </h3>
                    <div className="text-gray-400 text-sm flex items-center gap-4">
                      <span className="flex items-center gap-1"><Tag size={14} className="text-gold" /> {apt.service_details.name}</span>
                      <span className="flex items-center gap-1"><Clock size={14} className="text-gold" /> {apt.service_details.duration_minutes} min</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">Tel: {apt.client_details.phone_number || 'No provisto'}</div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-white/5">
                  {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                    <>
                      <button
                        onClick={() => updateStatus(apt.id, 'COMPLETED')}
                        className="flex-1 md:flex-none p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold"
                      >
                        <Check size={18} /> <span className="md:hidden lg:inline">Completar</span>
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, 'CANCELLED')}
                        className="flex-1 md:flex-none p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold"
                      >
                        <X size={18} /> <span className="md:hidden lg:inline">Cancelar</span>
                      </button>
                    </>
                  )}
                  {apt.status === 'COMPLETED' && (
                    <div className="text-green-500 flex items-center gap-2 text-sm font-bold bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                      <Check size={18} /> SERVICIO REALIZADO
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
