'use client';

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Scissors, Calendar, MapPin, Star, Clock, ChevronRight } from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-900 animate-pulse flex items-center justify-center text-gold text-sm font-bold tracking-widest uppercase">Cargando Mapa...</div>
});

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'HAIRCUT': 'Cortes de Cabello',
  'BEARD': 'Barba & Grooming',
  'PACKAGE': 'Paquetes & Combos',
  'OTHER': 'Otros Servicios',
};

interface GalleryPhoto {
  id: number;
  title: string;
  image: string;
  description: string;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/booking/services/');
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services", err);
      } finally {
        setLoadingServices(false);
      }
    };

    const fetchPhotos = async () => {
      try {
        const res = await api.get('/gallery/photos/');
        setPhotos(res.data);
      } catch (err) {
        console.error("Error fetching gallery photos", err);
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchServices();
    fetchPhotos();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/hero.png"
          alt="OG Barbería Hero"
          fill
          className="object-cover opacity-60 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-gold uppercase tracking-[0.3em] font-bold mb-4 animate-fade-in-up">
            Estilo • Tradición • Excelencia
          </h2>
          <h1 className="text-5xl md:text-8xl font-bold mb-8 outfit tracking-tight leading-tight animate-fade-in-up delay-100">
            EL ARTE DE LA <br />
            <span className="gold-text-gradient">BARBERÍA CLÁSICA</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Más que un corte, una experiencia de lujo diseñada para el caballero moderno que valora el detalle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <a href="/reservar" className="bg-gold text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gold-light transition-all transform hover:scale-105">
              Agendar Cita
            </a>
            <a href="#servicios" className="border-2 border-gold/50 text-gold px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:border-gold hover:bg-gold/5 transition-all">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gold font-bold uppercase tracking-widest mb-2">Nuestros Servicios</h2>
            <h3 className="text-4xl font-bold outfit">CALIDAD INIGUALABLE</h3>
          </div>

          <div>
            {loadingServices ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-16 bg-zinc-900/50 rounded-xl animate-pulse border border-gold/5" />
                ))}
              </div>
            ) : services.length > 0 ? (
              Object.entries(
                services.reduce((acc, service) => {
                  if (!acc[service.category]) acc[service.category] = [];
                  acc[service.category].push(service);
                  return acc;
                }, {} as Record<string, Service[]>)
              ).map(([category, items]) => (
                <div key={category} className="mb-16 last:mb-0">
                  <h4 className="text-gold font-bold uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
                    <span className="h-[1px] flex-1 bg-gold/20"></span>
                    {CATEGORY_LABELS[category] || category}
                    <span className="h-[1px] flex-1 bg-gold/20"></span>
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
                    {items.map((service, index) => (
                      <div 
                        key={service.id} 
                        className="group relative flex justify-between items-end pb-4 border-b border-gold/10 hover:border-gold/30 transition-all cursor-default"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-gold opacity-50 group-hover:opacity-100 transition-opacity font-mono text-[10px]">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <h4 className="text-lg font-bold uppercase tracking-tight group-hover:text-gold transition-colors">
                              {service.name}
                            </h4>
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-1 group-hover:text-gray-300 transition-colors italic">
                            {service.description || "Experiencia premium de barbería."}
                          </p>
                        </div>
                        
                        <div className="hidden md:block flex-1 border-b border-dotted border-gold/20 mb-2 mx-4 h-0 group-hover:border-gold/40 transition-colors" />

                        <div className="text-right flex flex-col items-end gap-2">
                          <span className="text-xl font-bold text-gold outfit">
                            ${service.price}
                          </span>
                          <Link 
                            href="/reservar" 
                            className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 text-gold"
                          >
                            Reservar <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12 border border-dashed border-gold/20 rounded-2xl">
                Próximamente más servicios...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map & Location */}
      <section id="contacto" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-gold font-bold uppercase tracking-widest mb-2">Ubicación</h2>
            <h3 className="text-4xl font-bold outfit mb-8">VISÍTANOS EN NUESTRA BARBER</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Estamos ubicados en el corazón de la ciudad, en un espacio diseñado para tu comodidad y relajación. Ven y disfruta de un café o una bebida mientras esperas tu turno.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="text-gold w-6 h-6 mt-1" />
                <div>
                  <p className="font-bold">Blvd Lopez Portillo #72 entre calle dos y calle tres</p>
                  <p className="text-gray-400 text-sm">Col. Mision del Sol, Hermosillo, Sonora</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-gold w-6 h-6 mt-1" />
                <div>
                  <p className="font-bold">Reserva al:</p>
                  <p className="text-gray-400 text-sm">+52 6624197268</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] bg-zinc-900 rounded-2xl overflow-hidden border border-gold/20 relative group">
            <Map center={[29.125947, -110.959104]} zoom={16} />
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="py-24 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-gold font-bold uppercase tracking-widest mb-2">Galería</h2>
            <h3 className="text-4xl font-bold outfit">NUESTRO TRABAJO</h3>
          </div>
          <a href="/galeria" className="text-gold uppercase tracking-widest text-sm font-bold border-b border-gold hover:text-gold-light transition-all">
            Ver Todo
          </a>
        </div>

        <div className="flex gap-4 animate-scroll px-4">
          {loadingPhotos ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[300px] h-[400px] bg-zinc-900 rounded-xl animate-pulse border border-gold/5" />
            ))
          ) : photos.length > 0 ? (
            photos.map((photo) => (
              <div key={photo.id} className="min-w-[300px] h-[400px] bg-zinc-900 rounded-xl overflow-hidden relative group">
                <Image
                  src={photo.image}
                  alt={photo.title || "Trabajo de OG Barbería"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-all z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <p className="text-white font-bold uppercase tracking-widest text-sm translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    {photo.title || "Estilo Premium"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 text-gray-500 italic">
              Próximamente más fotos de nuestro trabajo...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
