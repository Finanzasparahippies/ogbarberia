'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  appointments?: Array<{ date: string; title: string; time: string; type?: 'user' | 'occupied' }>;
  totalCapacity?: number;
}

const Calendar = ({ selectedDate, onDateSelect, appointments = [], totalCapacity = 10 }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty spaces for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-white/5 opacity-20"></div>);
    }

    // Days of the current month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const dayAppointments = appointments.filter(a => a.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div 
          key={d} 
          onClick={() => onDateSelect && onDateSelect(dateStr)}
          className={`h-24 p-2 border border-white/5 cursor-pointer transition-all hover:bg-gold/5 group relative ${
            isSelected ? 'bg-gold/10 border-gold/50' : ''
          }`}
        >
          <div className={`text-xs font-bold mb-1 ${isSelected || isToday ? 'text-gold' : 'text-gray-500'}`}>
            {d} {isToday && <span className="text-[8px] bg-gold text-black px-1 rounded ml-1">HOY</span>}
          </div>
          
          <div className="mt-auto">
            {dayAppointments.length > 0 ? (
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      dayAppointments.length >= totalCapacity ? 'bg-red-500' : 'bg-gold'
                    }`}
                    style={{ width: `${Math.min((dayAppointments.length / totalCapacity) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-500 font-bold uppercase">
                    {dayAppointments.filter(a => a.type === 'user').length > 0 ? 'Mis citas' : 'Ocupación'}
                  </span>
                  <span className={`text-[9px] font-bold ${dayAppointments.length >= totalCapacity ? 'text-red-500' : 'text-gold'}`}>
                    {dayAppointments.length}/{totalCapacity}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[8px] text-zinc-700 font-medium uppercase tracking-tighter">Disponible</div>
            )}
          </div>
          
          {isSelected && <div className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full shadow-[0_0_8px_#d4af37]"></div>}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="bg-zinc-900/30 rounded-3xl border border-gold/10 overflow-hidden backdrop-blur-xl">
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <h3 className="text-xl font-bold outfit uppercase tracking-widest text-white">
          {monthNames[currentMonth.getMonth()]} <span className="text-gold">{currentMonth.getFullYear()}</span>
        </h3>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-gold transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-gold transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center border-b border-white/5 bg-black/20">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="py-3 text-[10px] font-bold uppercase tracking-widest text-gold/50">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
