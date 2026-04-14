'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTransactions } from '../../../context/TransactionContext';
import { getCategoryByKey } from '../../../lib/categories';
import { formatINR, formatShortINR, formatDate } from '../../../lib/formatters';
import { groupByMonth, groupByCategory } from '../../../lib/aggregations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

function PremiumStatCard({ title, value, sub, growth, icon }) {
  return (
    <div className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--surface-border)]/20 space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[var(--text-primary)]/5 flex items-center justify-center text-sm ring-1 ring-inset ring-[var(--surface-border)]/50">{icon}</div>
        {growth && (
          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${growth.startsWith('+') ? 'bg-[#a3e635]/10 text-[#a3e635]' : 'bg-red-400/10 text-red-400'}`}>{growth}</div>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold font-display text-[var(--text-primary)]">{value}</p>
      </div>
      {sub && (
        <div className="pt-2 border-t border-[var(--surface-border)]/20">
          {title === 'SAVINGS RATE' ? (
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#a3e635] rounded-full" style={{ width: sub }} />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Target: 40%</p>
            </div>
          ) : (
            <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { transactions, stats, addNotification, txLoading } = useTransactions();
  const router = useRouter();

  const { latestMonthIncome, latestMonthExpense, latestSavingsRate, latestMonthLabel } = useMemo(() => {
    const monthly = groupByMonth(transactions);
    const latestMonth = Object.keys(monthly).sort().reverse()[0];
    const data = monthly[latestMonth] || { income: 0, expense: 0 };
    return {
      latestMonthIncome: data.income,
      latestMonthExpense: data.expense,
      latestSavingsRate: data.income > 0 ? (((data.income - data.expense) / data.income) * 100).toFixed(0) : 0,
      latestMonthLabel: latestMonth ? new Date(latestMonth).toLocaleString('en-IN', { month: 'long' }) : 'N/A',
    };
  }, [transactions]);

  const lineData = useMemo(() => {
    const monthlyMap = transactions.reduce((acc, t) => {
      const mon = t.date.slice(0, 7);
      if (!acc[mon]) acc[mon] = 0;
      acc[mon] += t.type === 'income' ? t.amount : -t.amount;
      return acc;
    }, {});
    const sortedMonths = Object.keys(monthlyMap).sort();
    let cumulative = 0;
    const points = sortedMonths.map(m => { cumulative += monthlyMap[m]; return cumulative; });
    const labels = sortedMonths.map(m => new Date(m).toLocaleString('en-IN', { month: 'long' }).toUpperCase());
    return {
      labels,
      datasets: [{
        label: 'Balance', data: points, borderColor: '#a3e635', borderWidth: 3,
        pointBackgroundColor: '#a3e635', pointBorderColor: '#0a0f1e', pointBorderWidth: 2, pointRadius: 4,
        pointHoverRadius: 6, tension: 0.4, fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(163, 230, 53, 0.2)');
          gradient.addColorStop(1, 'rgba(163, 230, 53, 0)');
          return gradient;
        },
      }],
    };
  }, [transactions]);

  const doughnutData = useMemo(() => {
    const catMap = groupByCategory(transactions, 'expense');
    const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const total = entries.reduce((s, e) => s + e[1], 0);
    return {
      labels: entries.map(([k]) => k), totalValue: total,
      data: {
        labels: entries.map(([k]) => k),
        datasets: [{ data: entries.map(([, v]) => v), backgroundColor: ['#a3e635', '#f87171', '#fbbf24', '#38bdf8'], borderWidth: 0, hoverOffset: 10 }],
      },
    };
  }, [transactions]);

  const barData = useMemo(() => {
    const rawMap = transactions.reduce((acc, t) => {
      const monKey = t.date.slice(0, 7);
      if (!acc[monKey]) acc[monKey] = { income: 0, expense: 0 };
      acc[monKey][t.type] += t.amount;
      return acc;
    }, {});
    const sortedKeys = Object.keys(rawMap).sort().slice(-6);
    const labels = sortedKeys.map(k => new Date(k).toLocaleString('en-IN', { month: 'short' }).toUpperCase());
    return {
      labels,
      datasets: [
        { label: 'Income', data: sortedKeys.map(k => rawMap[k].income), backgroundColor: '#a3e635', borderRadius: 4, barThickness: 8 },
        { label: 'Expenses', data: sortedKeys.map(k => rawMap[k].expense), backgroundColor: '#334155', borderRadius: 4, barThickness: 8 },
      ],
    };
  }, [transactions]);

  const recentMovements = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  }, [transactions]);

  if (txLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Portfolio Overview</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time performance and allocation metrics.</p>
        </div>
        <div className="flex gap-3 no-print">
          <button onClick={() => { addNotification('Dashboard report generated', 'success'); window.print(); }}
            className="bg-white/5 hover:bg-white/10 text-[var(--text-primary)] px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-[var(--surface-border)]/50">
            Export PDF
          </button>
          <button onClick={() => router.push('/insights')}
            className="bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] px-5 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-[0_8px_20px_rgba(163,230,53,0.2)]">
            Generate Insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard title="TOTAL BALANCE" value={formatINR(stats.netBalance, 0)} growth="+8.2%" icon="💼" />
        <PremiumStatCard title="MONTHLY INCOME" value={formatINR(latestMonthIncome, 0)} sub={latestMonthLabel} icon="💳" />
        <PremiumStatCard title="MONTHLY EXPENSES" value={formatINR(latestMonthExpense, 0)} growth="-2.1%" icon="🛒" />
        <PremiumStatCard title="SAVINGS RATE" value={`${latestSavingsRate}%`} sub={`${latestSavingsRate}%`} icon="🏦" />
      </div>

      <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Balance Trend</h2>
            <p className="text-xs text-slate-500 font-medium">Performance over time</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <Line data={lineData} options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { padding: 12, borderRadius: 12 } },
            scales: {
              x: { grid: { display: false }, border: { display: false }, ticks: { color: '#475569', font: { size: 10, weight: 'bold' } } },
              y: { grid: { color: 'rgba(255,255,255,0.03)' }, border: { display: false }, ticks: { display: false } },
            },
          }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-8">Spending Allocation</h2>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40">
              <Doughnut data={doughnutData.data} options={{ cutout: '75%', responsive: true, plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[var(--text-primary)]">{formatShortINR(doughnutData.totalValue)}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Spent</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {doughnutData.labels.map((lab, i) => (
                <div key={lab} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: doughnutData.data.datasets[0].backgroundColor[i] }} />
                    <span className="text-xs font-bold text-slate-300">{lab}</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {doughnutData.totalValue > 0 ? ((doughnutData.data.datasets[0].data[i] / doughnutData.totalValue) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Income vs. Expenses</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-[#a3e635]" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Income</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-[#334155]" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expenses</span></div>
            </div>
          </div>
          <div className="h-44">
            <Bar data={barData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false }, border: { display: false }, ticks: { color: '#475569', font: { size: 9, weight: 'bold' } } },
                y: { display: false },
              },
            }} />
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Recent Movements</h2>
          <button onClick={() => router.push('/transactions')} className="text-[10px] font-bold text-[#a3e635] uppercase tracking-widest hover:underline">
            View All Records
          </button>
        </div>
        <div className="space-y-4">
          {recentMovements.map(m => {
            const cat = getCategoryByKey(m.category);
            return (
              <div key={m._id || m.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-[var(--surface-border)]/20 hover:bg-white/[0.04] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--text-primary)]/5 flex items-center justify-center text-base ring-1 ring-inset ring-[var(--surface-border)]/50 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{m.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{m.category} • {formatDate(m.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold font-display ${m.type === 'income' ? 'text-[#a3e635]' : 'text-[var(--text-primary)]'}`}>
                    {m.type === 'income' ? '+' : '-'}{formatINR(m.amount, 0)}
                  </p>
                  <span className="text-[8px] uppercase tracking-widest font-black text-[#a3e635] bg-[#a3e635]/10 px-1.5 py-0.5 rounded">Success</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
