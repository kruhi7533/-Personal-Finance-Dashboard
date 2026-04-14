'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-base)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Loading FinFlow...</p>
      </div>
    </div>
  );
}
