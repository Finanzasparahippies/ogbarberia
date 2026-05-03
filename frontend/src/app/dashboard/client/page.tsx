'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Scissors, User as UserIcon, Calendar as CalendarIcon, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import Calendar from '@/components/Calendar';

interface Service { id: number; name: string; price: string; duration_minutes: number; }
interface Barber { id: number; first_name: string; last_name: string; email: string; }
interface Appointment { id: number; date: string; time: string; service_details: Service; }

export default function ClientDashboard() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, barbRes, aptRes, allAptRes] = await Promise.all([
          api.get('/booking/services/'),
          api.get('/users/barbers/'),
          api.get('/booking/appointments/'),
          api.get('/booking/appointments/availability/')
        ]);
        setServices(servRes.data);
        setBarbers(barbRes.data);
        setUserAppointments(aptRes.data);
        setAllAppointments(allAptRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleBooking = async () => {
    setLoading(true);
    try {
      await api.post('/booking/appointments/', {
        barber: selectedBarber?.id,
        service: selectedService?.id,
        date,
        time,
        payment_method: paymentMethod
      });
      setSuccess(true);
    } catch (err) {
      alert("Error al agendar. Verifica que el horario esté disponible.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-zinc-900 rounded-2xl border border-gold/30">
        <CheckCircle2 size={64} className="text-gold mx-auto mb-4" />
        <h2 className="text-2xl font-bold outfit text-white mb-2">¡CITA AGENDADA!</h2>
        <p className="text-gray-400 mb-8 text-sm">Te esperamos en la fecha y hora seleccionada. Hemos enviado un correo con los detalles.</p>
        <button onClick={() => window.location.reload()} className="btn-gold w-full">Agendar otra</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold outfit gold-text-gradient mb-8 uppercase tracking-tighter">
        Hola, {user?.first_name}
      </h1>

      {/* Progress Stepper */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s ? 'bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'bg-zinc-900 text-gray-500 border border-zinc-800'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/40 border border-gold/10 p-8 rounded-2xl backdrop-blur-sm">
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Scissors className="text-gold" /> SELECCIONA EL SERVICIO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <button 
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep(2); }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedService?.id === s.id ? 'border-gold bg-gold/5' : 'border-white/5 hover:border-gold/50'
                  }`}
                >
                  <div className="font-bold text-white uppercase">{s.name}</div>
                  <div className="text-gold text-sm font-bold mt-1">${s.price} MXN</div>
                  <div className="text-gray-500 text-xs mt-1">{s.duration_minutes} min</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <UserIcon className="text-gold" /> SELECCIONA TU BARBERO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barbers.map((b) => (
                <button 
                  key={b.id}
                  onClick={() => { setSelectedBarber(b); setStep(3); }}
                  className="p-4 rounded-xl border border-white/5 text-left hover:border-gold/50 transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                    {b.first_name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white uppercase">{b.first_name} {b.last_name}</div>
                    <div className="text-gray-500 text-xs">Maestro Barbero</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CalendarIcon className="text-gold" /> FECHA Y HORA
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <label className="block text-xs text-gold font-bold mb-4 uppercase tracking-widest">Selecciona el día</label>
                <Calendar 
                  selectedDate={date} 
                  onDateSelect={(d) => setDate(d)} 
                  totalCapacity={barbers.length * 9}
                  appointments={allAppointments.map(apt => ({
                    date: apt.date,
                    time: apt.time,
                    title: 'Ocupado',
                    type: userAppointments.some(ua => ua.date === apt.date && ua.time === apt.time) ? 'user' : 'occupied'
                  }))}
                />
              </div>
              <div>
                <label className="block text-xs text-gold font-bold mb-4 uppercase tracking-widest">Selecciona la hora</label>
                <div className="grid grid-cols-2 gap-2">
                  {["10:00", "11:00", "12:00", "13:00", "14:00", "16:00", "17:00", "18:00", "19:00"].map(t => {
                    const appointmentsAtTime = allAppointments.filter(a => a.date === date && a.time === t).length;
                    const isFull = appointmentsAtTime >= barbers.length;
                    
                    if (isFull) return null;

                    return (
                      <button 
                        key={t}
                        onClick={() => setTime(t)}
                        className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                          time === t ? 'bg-gold text-black border-gold' : 'bg-black/50 border-white/10 text-gray-400 hover:border-gold/50'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                {date && time === '' && (
                   <p className="text-[10px] text-gray-500 mt-4 italic">* Solo se muestran horarios con barberos disponibles.</p>
                )}
              </div>
            </div>
            <button 
              disabled={!date || !time}
              onClick={() => setStep(4)} 
              className="mt-8 btn-gold w-full py-4 uppercase font-bold tracking-widest disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="text-gold" /> MÉTODO DE PAGO
            </h3>
            <div className="space-y-4">
              {[
                { id: 'CASH', name: 'Efectivo en Sucursal' },
                { id: 'CARD', name: 'Tarjeta (Terminal)' },
                { id: 'TRANSFER', name: 'Transferencia Electrónica' }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === m.id ? 'border-gold bg-gold/5' : 'border-white/5'
                  }`}
                >
                  <div className="font-bold text-white uppercase">{m.name}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Servicio:</span>
                <span className="text-white font-bold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Barbero:</span>
                <span className="text-white font-bold">{selectedBarber?.first_name}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-gray-400">Cita:</span>
                <span className="text-gold font-bold">{date} a las {time}</span>
              </div>
              
              <button 
                disabled={loading}
                onClick={handleBooking}
                className="btn-gold w-full py-4 uppercase font-bold tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? 'Procesando...' : 'Confirmar Reservación'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {step > 1 && (
        <button 
          onClick={() => setStep(step - 1)} 
          className="mt-4 text-gray-500 text-xs hover:text-white transition-all uppercase tracking-widest"
        >
          ← Volver al paso anterior
        </button>
      )}

      {/* Monthly Appointments Calendar */}
      <div className="mt-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold outfit text-white uppercase tracking-tighter">Tu Agenda Mensual</h2>
          <p className="text-gray-500 text-sm">Visualiza gráficamente todas tus citas programadas.</p>
        </div>
        <Calendar 
          totalCapacity={barbers.length * 9}
          appointments={allAppointments.map(apt => {
            const isUserApt = userAppointments.find(ua => ua.date === apt.date && ua.time === apt.time);
            return {
              date: apt.date,
              time: apt.time,
              title: isUserApt ? isUserApt.service_details.name : 'Ocupado',
              type: isUserApt ? 'user' : 'occupied'
            };
          })}
        />
      </div>
    </div>
  );
}
