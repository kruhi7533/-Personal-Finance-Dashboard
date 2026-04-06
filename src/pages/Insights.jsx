import { useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { formatINR, formatDate } from '../utils/formatters'
import { groupByMonth, groupByCategory, getFinancialInsights } from '../utils/aggregations'

// ── Stat Card Component ───────────────────────────────────────────────────────
function InsightStatCard({ title, value, icon, badge, trendIcon, darkIcon }) {
  return (
    <div className="bg-[#141b2d] rounded-[24px] p-6 border border-white/[0.03] space-y-4">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${darkIcon ? 'bg-white/5' : 'bg-[#a3e635]/10 text-[#a3e635]'}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {badge && (
            <span className="bg-[#a3e635] text-[#0a0f1e] text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
              {badge}
            </span>
          )}
          {trendIcon && <span className="text-[#a3e635]">{trendIcon}</span>}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold font-display text-white">{value}</p>
      </div>
    </div>
  )
}

// ── Insights Page ─────────────────────────────────────────────────────────────
export default function Insights() {
  const { transactions } = useTransactions()

  // ── 1. Calculate Top Stat Data ──────────────────────────────────────────────
  const { topCategory, bestMonth, avgMonthlySpend, largestExpense } = useMemo(() => {
    return getFinancialInsights(transactions)
  }, [transactions])

  // ── 2. Historical Analysis (Last 5 Months) ─────────────────────────────────
  const monthlyBreakdown = useMemo(() => {
    const monMap = groupByMonth(transactions)

    return Object.entries(monMap)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 5)
      .map(([mon, v], i) => ({
        id: (5 - i).toString().padStart(2, '0'),
        date: new Date(mon).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
        count: v.count,
        income: v.income,
        expense: v.expense,
        net: v.income - v.expense
      }))
  }, [transactions])

  // ── 3. Category Distribution ────────────────────────────────────────────────
  const categoryShare = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const total = expenses.reduce((s, t) => s + t.amount, 0)
    const catMap = groupByCategory(transactions, 'expense')
    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, percent: total > 0 ? Math.round((value / total) * 100) : 0 }))
  }, [transactions])

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#a3e635] mb-2">Portfolio Overview</p>
        <h1 className="text-5xl font-bold font-display text-white tracking-tighter">
          Financial <span className="text-[#a3e635]">Insights</span>
        </h1>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightStatCard 
          title="Top Spending Category"
          value={topCategory}
          icon="🏠"
          badge="Highest"
        />
        <InsightStatCard 
          title="Best Savings Month"
          value={bestMonth}
          icon="📅"
          trendIcon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
          darkIcon
        />
        <InsightStatCard 
          title="Avg. Monthly Spend"
          value={formatINR(avgMonthlySpend, 0)}
          icon="📊"
          darkIcon
        />
        <InsightStatCard 
          title="Largest Expense"
          value={formatINR(largestExpense, 0)}
          icon="⚠️"
          darkIcon
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Income vs Expense Monthly Breakdown */}
        <div className="lg:col-span-2 bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-bold text-white">Income vs. Expense</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Cash flow analysis for the last 5 months</p>
            </div>
            <button className="text-[10px] font-bold text-[#a3e635] uppercase tracking-widest flex items-center gap-2 hover:underline">
               View Detailed Report
               <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="9" x2="9" y2="1"/><polyline points="3 1 9 1 9 7"/></svg>
            </button>
          </div>

          <div className="space-y-4">
             {monthlyBreakdown.map(item => (
               <div key={item.id} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/[0.03] hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-6">
                     <span className="text-xl font-black text-slate-800 font-display">{item.id}</span>
                     <div>
                        <p className="text-sm font-bold text-white">{item.date}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{item.count} Transactions</p>
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

        {/* Right Sidebar */}
        <div className="space-y-6">
           {/* Category Share */}
           <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03]">
              <h2 className="text-lg font-bold text-white mb-6">Category Share</h2>
              <p className="text-[10px] text-slate-500 font-medium mb-8 uppercase tracking-widest">Visual distribution of your monthly burn.</p>
              
              <div className="space-y-6">
                {categoryShare.map((cat, i) => (
                  <div key={cat.name} className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                       <span className="text-slate-400">{cat.name}</span>
                       <span className="text-white">{cat.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-[#a3e635]' : 'bg-[#a3e635]/40'}`} 
                         style={{ width: `${cat.percent}%` }}
                       />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* AI Suggestion Box */}
           <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="60" height="60" fill="currentColor" className="text-[#a3e635]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-[#a3e635]">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6m-3-3v6m-4.5-4.5V11m9 4.5V11M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 </div>
                 <h3 className="text-[10px] uppercase font-black tracking-[0.25em] text-[#a3e635]">AI Suggestion</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                You've spent <span className="text-white font-black">{formatINR(largestExpense, 0)}</span> on <span className="text-[#a3e635] font-black">{topCategory}</span> this period. Consider consolidating subscription services to save approx. <span className="text-[#a3e635] font-black">₹1,200/mo.</span>
              </p>
           </div>
        </div>
      </div>

      {/* Bottom Grid Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Investment Yield */}
         <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03] flex items-center justify-between">
            <div>
               <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2">Investment Yield</p>
               <h3 className="text-4xl font-bold font-display text-white tracking-tight">+8.42%</h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-[#a3e635] font-bold">↑ 1.2%</span>
                  <span className="text-[10px] text-slate-600 font-medium">from last month</span>
               </div>
            </div>
            <div className="w-32 h-16">
               <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                 <path d="M0 35 Q 25 30, 40 20 T 70 25 T 100 5" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                 <path d="M0 35 Q 25 30, 40 20 T 70 25 T 100 5 V 40 H 0 Z" fill="url(#grad)" opacity="0.1" />
                 <defs>
                   <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#a3e635" />
                     <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                   </linearGradient>
                 </defs>
               </svg>
            </div>
         </div>

         {/* Debt Ratio */}
         <div className="bg-[#141b2d] rounded-[32px] p-8 border border-white/[0.03] flex items-center justify-between relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg width="80" height="80" fill="currentColor" className="text-white"><path d="M12 2L2 7v2h20V7L12 2zm0 2.18L18.64 7H5.36L12 4.18zM4 11v9h2v-9H4zm5 0v9h2v-9H9zm5 0v9h2v-9h-2zm5 0v9h2v-9h-2zM2 22v2h20v-2H2z"/></svg>
            </div>
            <div>
               <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2">Debt Ratio</p>
               <h3 className="text-4xl font-bold font-display text-white tracking-tight">12.5%</h3>
               <div className="flex items-center gap-2 mt-2 text-red-400">
                  <span className="text-[10px] font-bold">↓ Optimal threshold</span>
               </div>
            </div>
            {/* Minimal Icon Placeholder */}
            <div className="w-20 h-20 bg-white/[0.02] rounded-[24px] flex items-center justify-center text-4xl opacity-20">
               🏛️
            </div>
         </div>
      </div>
    </div>
  )
}
