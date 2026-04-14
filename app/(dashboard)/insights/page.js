'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTransactions } from '../../../context/TransactionContext';
import { formatINR } from '../../../lib/formatters';
import { groupByMonth, groupByCategory, getFinancialInsights } from '../../../lib/aggregations';

function InsightStatCard({ title, value, icon, badge, darkIcon }) {
  return (
    <div className="bg-[var(--surface-card)] rounded-[24px] p-6 border border-[var(--surface-border)]/20 space-y-4">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base ring-1 ring-inset ring-[var(--surface-border)]/50 ${darkIcon ? 'bg-[var(--text-primary)]/5' : 'bg-[#a3e635]/10 text-[#a3e635]'}`}>{icon}</div>
        <div className="flex flex-col items-end gap-1.5">
          {badge && <span className="bg-[#a3e635] text-[#0a0f1e] text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">{badge}</span>}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold font-display text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { transactions, txLoading } = useTransactions();
  const router = useRouter();

  const { topCategory, bestMonth, avgMonthlySpend, largestExpense } = useMemo(() => getFinancialInsights(transactions), [transactions]);

  const monthlyBreakdown = useMemo(() => {
    const monMap = groupByMonth(transactions);
    return Object.entries(monMap).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 5).map(([mon, v], i) => ({
      id: (5 - i).toString().padStart(2, '0'),
      date: new Date(mon).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      count: v.count, income: v.income, expense: v.expense, net: v.income - v.expense,
    }));
  }, [transactions]);

  const categoryShare = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const catMap = groupByCategory(transactions, 'expense');
    return Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({
      name, percent: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  }, [transactions]);

  if (txLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#a3e635] mb-2">Portfolio Overview</p>
        <h1 className="text-5xl font-bold font-display text-[var(--text-primary)] tracking-tighter">Financial <span className="text-[#a3e635]">Insights</span></h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightStatCard title="Top Spending Category" value={topCategory} icon="🏠" badge="Highest" />
        <InsightStatCard title="Best Savings Month" value={bestMonth} icon="📅" darkIcon />
        <InsightStatCard title="Avg. Monthly Spend" value={formatINR(avgMonthlySpend, 0)} icon="📊" darkIcon />
        <InsightStatCard title="Largest Expense" value={formatINR(largestExpense, 0)} icon="⚠️" darkIcon />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Income vs. Expense</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Cash flow analysis for the last 5 months</p>
            </div>
            <button onClick={() => router.push('/transactions')} className="text-[10px] font-bold text-[#a3e635] uppercase tracking-widest hover:underline">View Detailed Report</button>
          </div>
          <div className="space-y-4">
            {monthlyBreakdown.map(item => (
              <div key={item.id} className="flex items-center justify-between p-6 bg-[var(--surface-border)]/5 rounded-3xl border border-[var(--surface-border)]/20 hover:bg-[var(--surface-border)]/10 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-xl font-black text-[var(--text-secondary)] font-display">{item.id}</span>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{item.date}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">{item.count} Transactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 md:gap-16">
                  <div className="text-center hidden sm:block">
                    <p className="text-[8px] uppercase tracking-widest font-black text-slate-600 mb-1">Income</p>
                    <p className="text-xs font-bold text-slate-300">{formatINR(item.income, 0)}</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-[8px] uppercase tracking-widest font-black text-slate-600 mb-1">Expense</p>
                    <p className="text-xs font-bold text-slate-300">{formatINR(item.expense, 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest font-black text-slate-600 mb-1">Net Flow</p>
                    <p className={`text-sm font-bold font-display ${item.net >= 0 ? 'text-[#a3e635]' : 'text-red-400'}`}>
                      {item.net >= 0 ? '+' : ''}{formatINR(item.net, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">Category Share</h2>
            <p className="text-[10px] text-slate-500 font-medium mb-8 uppercase tracking-widest">Visual distribution of your monthly burn.</p>
            <div className="space-y-6">
              {categoryShare.map((cat, i) => (
                <div key={cat.name} className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400">{cat.name}</span>
                    <span className="text-[var(--text-primary)]">{cat.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-[#a3e635]' : 'bg-[#a3e635]/40'}`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20 relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-[#a3e635]">💡</div>
              <h3 className="text-[10px] uppercase font-black tracking-[0.25em] text-[#a3e635]">AI Suggestion</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              You&apos;ve spent <span className="text-[var(--text-primary)] font-black">{formatINR(largestExpense, 0)}</span> on <span className="text-[#a3e635] font-black">{topCategory}</span> this period. Consider consolidating subscription services to save approx. <span className="text-[#a3e635] font-black">₹1,200/mo.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2">Investment Yield</p>
            <h3 className="text-4xl font-bold font-display text-[var(--text-primary)] tracking-tight">+8.42%</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-[#a3e635] font-bold">↑ 1.2%</span>
              <span className="text-[10px] text-slate-600 font-medium">from last month</span>
            </div>
          </div>
          <div className="w-32 h-16">
            <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0 35 Q 25 30, 40 20 T 70 25 T 100 5" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 35 Q 25 30, 40 20 T 70 25 T 100 5 V 40 H 0 Z" fill="url(#grad2)" opacity="0.1" />
              <defs><linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#a3e635" /><stop offset="100%" stopColor="#a3e635" stopOpacity="0" /></linearGradient></defs>
            </svg>
          </div>
        </div>
        <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2">Debt Ratio</p>
            <h3 className="text-4xl font-bold font-display text-[var(--text-primary)] tracking-tight">12.5%</h3>
            <div className="flex items-center gap-2 mt-2 text-red-400"><span className="text-[10px] font-bold">↓ Optimal threshold</span></div>
          </div>
          <div className="w-20 h-20 bg-white/[0.02] rounded-[24px] flex items-center justify-center text-4xl opacity-20">🏛️</div>
        </div>
      </div>
    </div>
  );
}
