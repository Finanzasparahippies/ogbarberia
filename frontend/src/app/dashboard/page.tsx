'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.is_superuser) {
        router.push('/dashboard/admin');
      } else if (user.is_barber) {
        router.push('/dashboard/barber');
      } else {
        router.push('/dashboard/client');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
