'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gold/20">
      <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter outfit gold-text-gradient">
          OG BARBERÍA
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
          <Link href="/" className="hover:text-gold transition-colors">Inicio</Link>
          <Link href="/servicios" className="hover:text-gold transition-colors">Servicios</Link>
          
          {user ? (
            <>
              <Link 
                href={user.is_superuser ? "/dashboard/admin" : (user.is_barber ? "/dashboard/barber" : "/dashboard/client")} 
                className="hover:text-gold transition-colors flex items-center gap-2"
              >
                <User size={16} className="text-gold" />
                Panel
              </Link>
              <button 
                onClick={logout}
                className="hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gold transition-colors">Entrar</Link>
              <Link href="/reservar" className="btn-gold">Reservar</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
