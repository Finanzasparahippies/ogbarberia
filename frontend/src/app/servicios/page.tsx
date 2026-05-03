'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Scissors, Star, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/booking/services/');
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <h2 className="text-gold font-bold uppercase tracking-[0.3em] mb-4">Nuestra Carta</h2>
          <h1 className="text-5xl md:text-7xl font-bold outfit mb-8">SERVICIOS DE AUTOR</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Cada servicio es un ritual diseñado para resaltar tu mejor versión. Utilizamos productos de la más alta calidad y técnicas tradicionales.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-zinc-900/50 rounded-3xl animate-pulse border border-gold/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.id} className="group relative p-8 rounded-3xl bg-zinc-900/30 border border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                   {index % 3 === 0 ? <Scissors size={80} /> : index % 3 === 1 ? <Star size={80} /> : <Clock size={80} />}
                </div>
                
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest mb-6">
                    {service.duration_minutes} MINUTOS
                  </span>
                  <h3 className="text-2xl font-bold mb-4 outfit uppercase group-hover:text-gold transition-colors">{service.name}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed min-h-[60px]">
                    {service.description || "Un servicio excepcional adaptado a tus necesidades y estilo personal."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gold/10">
                    <div className="text-2xl font-bold text-white">
                      <span className="text-gold text-sm mr-1">$</span>{service.price}
                    </div>
                    <Link href="/reservar" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-white transition-colors">
                      Reservar Ahora <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && services.length === 0 && (
          <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-gold/20">
            <p className="text-gray-500 font-medium">No se encontraron servicios disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
