import { useMemo, useRef, useEffect, useState } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { useTransactions } from '../context/TransactionContext'
import { getCategoryByKey } from '../constants/categories'
import { formatINR, formatShortINR, formatDate } from '../utils/formatters'
import { groupByMonth, groupByCategory } from '../utils/aggregations'

// ── Register ChartJS ──────────────────────────────────────────────────────────
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
)

// Utils are now imported from ../utils/formatters.js and ../utils/aggregations.js

// ── Stat Card Component ───────────────────────────────────────────────────────
function PremiumStatCard({ title, value, sub, growth, trend, icon }) {
  return (
    <div className="bg-[#141b2d] rounded-3xl p-6 border border-white/[0.03] space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
          {icon}
        </div>
        {growth && (
          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${growth.startsWith('+') ? 'bg-[#a3e635]/10 text-[#a3e635]' : 'bg-red-400/10 text-red-400'}`}>
            {growth}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold font-display text-white">{value}</p>
      </div>
      {sub && (
        <div className="pt-2 border-t border-white/[0.03]">
           {title === 'SAVINGS RATE' ? (
             <div className="space-y-2">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#a3e635] rounded-full" style={{ width: sub }}></div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Target: 40%</p>
             </div>
           ) : (
             <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
           )}
        </div>
      )}
    </div>
  )
}

// ── Dashboard Component ───────────────────────────────────────────────────────
export default function Dashboard() {
  const { transactions, stats } = useTransactions()
  const chartRef = useRef(null)

  // ── 1. Calculate Monthly Metrics ────────────────────────────────────────────
  const { latestMonthIncome, latestMonthExpense, latestSavingsRate, latestMonthLabel } = useMemo(() => {
    const monthly = groupByMonth(transactions)
    const latestMonth = Object.keys(monthly).sort().reverse()[0]
    const data = monthly[latestMonth] || { income: 0, expense: 0 }
    
    return {
      latestMonthIncome: data.income,
      latestMonthExpense: data.expense,
      latestSavingsRate: data.income > 0 ? (((data.income - data.expense) / data.income) * 100).toFixed(0) : 0,
      latestMonthLabel: new Date(latestMonth).toLocaleString('en-IN', { month: 'long' })
    }
  }, [transactions])

  // ── 2. Balance Trend Data (Line) ───────────────────────────────────────────
  const lineData = useMemo(() => {
    const monthlyMap = transactions.reduce((acc, t) => {
      const mon = t.date.slice(0, 7)
      if (!acc[mon]) acc[mon] = 0
      acc[mon] += t.type === 'income' ? t.amount : -t.amount
      return acc
    }, {})

    const sortedMonths = Object.keys(monthlyMap).sort()
    let cumulative = 0
    const points = sortedMonths.map(m => {
      cumulative += monthlyMap[m]
      return cumulative
    })

    const labels = sortedMonths.map(m => new Date(m).toLocaleString('en-IN', { month: 'long' }).toUpperCase())

    return {
      labels,
      datasets: [{
        label: 'Balance',
        data: points,
        borderColor: '#a3e635',
        borderWidth: 3,
        pointBackgroundColor: '#a3e635',
        pointBorderColor: '#0a0f1e',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, 'rgba(163, 230, 53, 0.2)')
          gradient.addColorStop(1, 'rgba(163, 230, 53, 0)')
          return gradient
        },
      }]
    }
  }, [transactions])

  // ── 3. Spending Allocation (Doughnut) ──────────────────────────────────────
  const doughnutData = useMemo(() => {
    const catMap = groupByCategory(transactions, 'expense')
    
    const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4)
    const total = entries.reduce((s, e) => s + e[1], 0)

    return {
      labels: entries.map(([k]) => k),
      totalValue: total,
      data: {
        labels: entries.map(([k]) => k),
        datasets: [{
          data: entries.map(([, v]) => v),
          backgroundColor: ['#a3e635', '#f87171', '#fbbf24', '#38bdf8'],
          borderWidth: 0,
          hoverOffset: 10,
        }]
      }
    }
  }, [transactions])

  // ── 4. Income vs Expenses (Bar) ────────────────────────────────────────────
  const barData = useMemo(() => {
    const monthlyMap = transactions.reduce((acc, t) => {
      const mon = t.date.slice(5, 7) // Short month ID '03', '04'
      const label = new Date(t.date).toLocaleString('en-IN', { month: 'short' }).toUpperCase()
      if (!acc[label]) acc[label] = { income: 0, expense: 0 }
      acc[label][t.type] += t.amount
      return acc
    }, {})

    const labels = ['MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'] // Mock future projection labels like screenshot
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: labels.map(l => monthlyMap[l]?.income || 0),
          backgroundColor: '#a3e635',
          borderRadius: 4,
          barThickness: 8,
        },
        {
          label: 'Expenses',
          data: labels.map(l => monthlyMap[l]?.expense || 0),
          backgroundColor: '#334155',
          borderRadius: 4,
          barThickness: 8,
        }
      ]
    }
  }, [transactions])

  // ── 5. Recent Movements ────────────────────────────────────────────────────
  const recentMovements = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
  }, [transactions])

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Portfolio Overview</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time performance and allocation metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Export PDF
          </button>
          <button className="bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] px-5 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-[0_8px_20px_rgba(163,230,53,0.2)]">
            Generate Insights
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard
          title="TOTAL BALANCE"
          value={formatINR(stats.netBalance, 0)}
          growth="+8.2%"
          icon="💼"
        />
        <PremiumStatCard
          title="MONTHLY INCOME"
          value={formatINR(latestMonthIncome, 0)}
          sub={latestMonthLabel}
          icon="💳"
        />
        <PremiumStatCard
          title="MONTHLY EXPENSES"
          value={formatINR(latestMonthExpense, 0)}
          growth="-2.1%"
          icon="🛒"
        />
        <PremiumStatCard
          title="SAVINGS RATE"
          value={`${latestSavingsRate}%`}
          sub={`${latestSavingsRate}%`}
          icon="🏦"
        />
      </div>

      {/* Main Chart Area */}
      <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-white">Balance Trend</h2>
            <p className="text-xs text-slate-500 font-medium">Last 6 months performance</p>
          </div>
          <div className="flex bg-[#0a0f1e] p-1 rounded-xl">
             {['6M', '1Y', 'ALL'].map(opt => (
               <button key={opt} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${opt === '6M' ? 'bg-[#141b2d] text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                 {opt}
               </button>
             ))}
          </div>
        </div>
        <div className="h-[300px] w-full">
           <Line 
             data={lineData} 
             options={{
               responsive: true,
               maintainAspectRatio: false,
               plugins: { legend: { display: false }, tooltip: { padding: 12, borderRadius: 12 } },
               scales: {
                 x: { grid: { display: false }, border: { display: false }, ticks: { color: '#475569', font: { size: 10, weight: 'bold' } } },
                 y: { grid: { color: 'rgba(255,255,255,0.03)' }, border: { display: false }, ticks: { display: false } }
               }
             }}
           />
        </div>
      </div>

      {/* Lower Grid (Doughnut + Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Allocation */}
        <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03]">
          <h2 className="text-lg font-bold text-white mb-8">Spending Allocation</h2>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40">
              <Doughnut 
                data={doughnutData.data}
                options={{
                  cutout: '75%',
                  responsive: true,
                  plugins: { legend: { display: false } }
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{formatShortINR(doughnutData.totalValue)}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Spent</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
               {doughnutData.labels.map((lab, i) => (
                 <div key={lab} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: doughnutData.data.datasets[0].backgroundColor[i] }}></div>
                       <span className="text-xs font-bold text-slate-300">{lab}</span>
                    </div>
                    <span className="text-xs font-bold text-white">
                      {((doughnutData.data.datasets[0].data[i] / doughnutData.totalValue) * 100).toFixed(0)}%
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white">Income vs. Expenses</h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-[#a3e635]"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Income</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-[#334155]"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expenses</span>
               </div>
            </div>
          </div>
          <div className="h-44">
            <Bar 
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, border: { display: false }, ticks: { color: '#475569', font: { size: 9, weight: 'bold' } } },
                  y: { display: false }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-white">Recent Movements</h2>
          <button className="text-[10px] font-bold text-[#a3e635] uppercase tracking-widest hover:underline">
            View All Records
          </button>
        </div>
        <div className="space-y-4">
           {recentMovements.map(m => {
             const cat = getCategoryByKey(m.category)
             return (
               <div key={m.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/[0.03] hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                       {cat.icon}
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white">{m.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {m.category} • {formatDate(m.date)}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                      <p className={`text-sm font-bold font-display ${m.type === 'income' ? 'text-[#a3e635]' : 'text-white'}`}>
                        {m.type === 'income' ? '+' : '-'}{formatINR(m.amount, 0)}
                      </p>
                     <span className="text-[8px] uppercase tracking-widest font-black text-[#a3e635] bg-[#a3e635]/10 px-1.5 py-0.5 rounded">
                       Success
                     </span>
                  </div>
               </div>
             )
           })}
        </div>
      </div>
    </div>
  )
}
