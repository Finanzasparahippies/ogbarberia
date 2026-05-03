'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ReservarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Si está logueado, ir al dashboard de cliente (que es la agenda)
        router.push('/dashboard/client');
      } else {
        // Si no está logueado, ir a login
        router.push('/login?redirect=/dashboard/client');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
