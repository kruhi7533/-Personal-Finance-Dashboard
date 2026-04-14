'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard');
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome to FinFlow!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-base)] p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#a3e635]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#a3e635]/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#a3e635" fillOpacity="0.2" stroke="#a3e635" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 8L8 10.5V13.5L12 16L16 13.5V10.5L12 8Z" fill="#a3e635"/>
            </svg>
            <span className="text-3xl font-bold tracking-tight text-white font-display">
              Fin<span className="text-[#a3e635]">Flow</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Sign in to your finance dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--surface-card)] rounded-[32px] border border-[var(--surface-border)]/20 overflow-hidden shadow-[0_32px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635]" />

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Email Address</label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-2xl py-3.5 px-4 text-sm text-[var(--text-primary)] placeholder:text-slate-600 outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-2xl py-3.5 px-4 text-sm text-[var(--text-primary)] placeholder:text-slate-600 outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] py-4 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] shadow-[0_8px_30px_rgba(163,230,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0a0f1e] border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Demo Credentials */}
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-[var(--surface-border)]/10 space-y-2">
              <p className="text-[9px] uppercase tracking-widest font-black text-[#a3e635] text-center">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ email: 'admin@finflow.com', password: 'admin123' })}
                  className="text-[10px] font-bold text-slate-400 bg-white/5 hover:bg-white/10 px-3 py-2.5 rounded-xl transition-colors border border-white/5"
                >
                  🛡️ Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ email: 'sakshi@finflow.com', password: 'user123' })}
                  className="text-[10px] font-bold text-slate-400 bg-white/5 hover:bg-white/10 px-3 py-2.5 rounded-xl transition-colors border border-white/5"
                >
                  👤 User Login
                </button>
              </div>
            </div>
          </form>

          <div className="px-8 pb-8">
            <p className="text-center text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#a3e635] font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
