'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users/register/', formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError('Error al registrar usuario. Intenta con otro correo.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-zinc-900/50 p-8 rounded-2xl border border-gold/20 backdrop-blur-sm">
        <h2 className="text-3xl font-bold outfit mb-2 gold-text-gradient text-center">ÚNETE AL CLUB</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Crea tu cuenta para agendar servicios premium</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Nombre</label>
              <input 
                name="first_name"
                type="text" 
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none text-sm"
                placeholder="Juan"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Apellido</label>
              <input 
                name="last_name"
                type="text" 
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none text-sm"
                placeholder="Pérez"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none text-sm"
              placeholder="tu@email.com"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Teléfono</label>
            <input 
              name="phone"
              type="tel" 
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none text-sm"
              placeholder="5512345678"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Contraseña</label>
            <input 
              name="password"
              type="password" 
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none text-sm"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="w-full btn-gold py-4 text-sm font-bold uppercase tracking-widest mt-4">
            Registrarme
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-500 text-sm">
          ¿Ya tienes cuenta? <Link href="/login" className="text-gold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
