'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useTransactions } from '../../../context/TransactionContext';
import { userAPI } from '../../../lib/api';
import { formatINR } from '../../../lib/formatters';
import { Users, ArrowLeftRight, TrendingUp, TrendingDown, Shield } from 'lucide-react';

function AdminStatCard({ title, value, icon, color }) {
  return (
    <div className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--surface-border)]/20 space-y-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold font-display text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const { transactions, stats } = useTransactions();
  const router = useRouter();
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/dashboard');
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await userAPI.getAll();
        setTotalUsers(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  const recentTxns = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-[#a3e635]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#a3e635]">Admin Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Platform Overview</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Site-wide analytics and user management.</p>
        </div>
        <Link href="/admin/users"
          className="bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-[0_8px_20px_rgba(163,230,53,0.2)] flex items-center gap-2">
          <Users size={18} strokeWidth={2.5} /> Manage Users
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard title="Total Users" value={totalUsers} icon={<Users size={22} />} color="bg-blue-500/10 text-blue-400" />
        <AdminStatCard title="Total Transactions" value={transactions.length} icon={<ArrowLeftRight size={22} />} color="bg-[#a3e635]/10 text-[#a3e635]" />
        <AdminStatCard title="Platform Income" value={formatINR(stats.totalIncome, 0)} icon={<TrendingUp size={22} />} color="bg-emerald-500/10 text-emerald-400" />
        <AdminStatCard title="Platform Expenses" value={formatINR(stats.totalExpenses, 0)} icon={<TrendingDown size={22} />} color="bg-red-500/10 text-red-400" />
      </div>

      {/* Recent Platform Transactions */}
      <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Recent Platform Activity</h2>
          <Link href="/transactions" className="text-[10px] font-bold text-[#a3e635] uppercase tracking-widest hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="text-left px-6 py-4 border-b border-[var(--surface-border)]/20">User</th>
                <th className="text-left px-6 py-4 border-b border-[var(--surface-border)]/20">Transaction</th>
                <th className="text-left px-6 py-4 border-b border-[var(--surface-border)]/20">Type</th>
                <th className="text-right px-6 py-4 border-b border-[var(--surface-border)]/20">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.map((t) => (
                <tr key={t._id || t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 border-b border-[var(--surface-border)]/10">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{t.userId?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-500">{t.userId?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4 border-b border-[var(--surface-border)]/10">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.category}</p>
                  </td>
                  <td className="px-6 py-4 border-b border-[var(--surface-border)]/10">
                    <span className={`text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${t.type === 'income' ? 'bg-[#a3e635]/10 text-[#a3e635]' : 'bg-red-400/10 text-red-400'}`}>{t.type}</span>
                  </td>
                  <td className={`px-6 py-4 border-b border-[var(--surface-border)]/10 text-right font-bold font-display ${t.type === 'income' ? 'text-[#a3e635]' : 'text-[var(--text-primary)]'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatINR(t.amount, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
