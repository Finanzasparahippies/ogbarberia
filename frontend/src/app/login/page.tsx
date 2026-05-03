'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/users/login/', { email, password });
      await login(res.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Credenciales incorrectas o problema de servidor');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900/50 p-8 rounded-2xl border border-gold/20 backdrop-blur-sm">
        <h2 className="text-3xl font-bold outfit mb-2 gold-text-gradient text-center">BIENVENIDO</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Ingresa tus datos para gestionar tus citas</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none transition-all"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="w-full btn-gold py-4 text-sm font-bold uppercase tracking-widest">
            Entrar
          </button>
        </form>
        
        <p className="text-center mt-8 text-gray-500 text-sm">
          ¿No tienes cuenta? <Link href="/register" className="text-gold hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
