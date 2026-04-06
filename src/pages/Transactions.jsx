import { useState, useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useRole } from '../context/RoleContext'
import { getCategoryByKey, CATEGORY_LIST } from '../constants/categories'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import { formatINR, formatDate } from '../utils/formatters'
import { exportTransactionsToCSV } from '../utils/exportCSV'

// Utils now handle formatting and CSV export

// ── Summary Card ──────────────────────────────────────────────────────────────
function SummaryCard({ title, value, sub, colorClass, borderClass }) {
  return (
    <div className={`bg-[#141b2d] rounded-[24px] p-6 border ${borderClass} flex-1`}>
      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
         <p className={`text-2xl font-bold font-display ${colorClass}`}>{value}</p>
         {sub && <span className={`text-[10px] font-bold ${sub.startsWith('+') ? 'text-[#a3e635]' : 'text-red-400'}`}>{sub}</span>}
      </div>
      {title === 'NET CASH FLOW' && <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-medium">Optimal range maintained</p>}
    </div>
  )
}

// ── Transactions Page ─────────────────────────────────────────────────────────
export default function Transactions() {
  const {
    filteredTransactions,
    filters, setFilter, resetFilters,
    state, editTransaction, deleteTransaction,
    availableMonths,
  } = useTransactions()
  const { isAdmin } = useRole()

  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // ── Derived Data ───────────────────────────────────────────────────────────
  const { paginatedList, totalPages, startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end   = start + itemsPerPage
    return {
      paginatedList: filteredTransactions.slice(start, end),
      totalPages: Math.ceil(filteredTransactions.length / itemsPerPage),
      startIndex: start + 1,
      endIndex: Math.min(end, filteredTransactions.length)
    }
  }, [filteredTransactions, currentPage])

  // Summary Metrics (based on filtered view)
  const { inflow, outflow, net } = useMemo(() => {
    const inf = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const out = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { inflow: inf, outflow: out, net: inf - out }
  }, [filteredTransactions])

  const openEdit = (txn) => { setEditTarget(txn); setShowModal(true) }
  
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Transaction History</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Review and manage your wealth flow across all connected assets.</p>
        </div>
        <button 
          onClick={() => exportTransactionsToCSV(filteredTransactions)}
          className="bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] px-6 py-2.5 rounded-xl text-sm font-bold transition-all transition-transform active:scale-95 shadow-[0_8px_20px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 ml-1">Type</span>
          <select
            value={filters.type}
            onChange={(e) => { setFilter('type', e.target.value); setCurrentPage(1); }}
            className="bg-[#141b2d] border border-white/[0.03] text-xs font-bold text-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#a3e635]/30 transition w-36 appearance-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 ml-1">Category</span>
          <select
            value={filters.category}
            onChange={(e) => { setFilter('category', e.target.value); setCurrentPage(1); }}
            className="bg-[#141b2d] border border-white/[0.03] text-xs font-bold text-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#a3e635]/30 transition w-44 appearance-none"
          >
            <option value="all">All Categories</option>
            {CATEGORY_LIST.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>

        {/* Month Dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 ml-1">Month</span>
          <select
            value={filters.month}
            onChange={(e) => { setFilter('month', e.target.value); setCurrentPage(1); }}
            className="bg-[#141b2d] border border-white/[0.03] text-xs font-bold text-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#a3e635]/30 transition w-44 appearance-none"
          >
            <option value="all">All Time</option>
            {availableMonths.map(m => {
              const label = new Date(m).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
              return <option key={m} value={m}>{label}</option>
            })}
          </select>
        </div>

        {/* Reset */}
        <button 
          onClick={() => { resetFilters(); setCurrentPage(1); }}
          className="self-end mb-0.5 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-colors border border-white/5"
        >
          <div className="flex items-center gap-2">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Reset Filters
          </div>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-[#141b2d] rounded-[32px] border border-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
             <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                   <th className="text-left px-8 py-6 border-b border-white/[0.03]">Name</th>
                   <th className="text-left px-8 py-6 border-b border-white/[0.03]">Date</th>
                   <th className="text-left px-8 py-6 border-b border-white/[0.03]">Category</th>
                   <th className="text-left px-8 py-6 border-b border-white/[0.03]">Type</th>
                   <th className="text-left px-8 py-6 border-b border-white/[0.03]">Amount</th>
                   {isAdmin && <th className="text-right px-8 py-6 border-b border-white/[0.03]">Actions</th>}
                </tr>
             </thead>
             <tbody>
                {paginatedList.map((t, idx) => {
                  const cat = getCategoryByKey(t.category)
                  const isLast = idx === paginatedList.length - 1
                  return (
                    <tr key={t.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className={`px-8 py-5 flex items-center gap-4 ${!isLast ? 'border-b border-white/[0.03]' : ''}`}>
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{cat.icon}</div>
                         <div>
                            <p className="font-bold text-white text-sm">{t.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Ref: #TXN{t.id}</p>
                         </div>
                      </td>
                      <td className={`px-8 py-5 text-slate-400 text-xs font-medium ${!isLast ? 'border-b border-white/[0.03]' : ''}`}>
                         {formatDate(t.date, { month: 'short', day: '2-digit', year: 'numeric' })}
                      </td>
                      <td className={`px-8 py-5 text-slate-500 text-xs font-medium ${!isLast ? 'border-b border-white/[0.03]' : ''}`}>
                         {t.category}
                      </td>
                      <td className={`px-8 py-5 ${!isLast ? 'border-b border-white/[0.03]' : ''}`}>
                         <span className={`text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${t.type === 'income' ? 'bg-[#a3e635]/10 text-[#a3e635]' : 'bg-red-400/10 text-red-400'}`}>
                           {t.type}
                         </span>
                      </td>
                      <td className={`px-8 py-5 font-display font-bold text-base ${t.type === 'income' ? 'text-[#a3e635]' : 'text-white'} ${!isLast ? 'border-b border-white/[0.03]' : ''}`}>
                         {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                      </td>
                      {isAdmin && (
                        <td className={`px-8 py-5 text-right ${!isLast ? 'border-b border-white/[0.03]' : ''}`}>
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(t)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={() => deleteTransaction(t.id)} className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                              </button>
                           </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
             </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center text-slate-500">
               <p className="text-sm font-medium uppercase tracking-[0.2em]">No transactions matched</p>
            </div>
          )}
        </div>

        {/* Footer info & Pagination */}
        <div className="px-8 py-6 bg-white/[0.01] border-t border-white/[0.03] flex items-center justify-between">
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
             Showing <span className="text-white">{startIndex}-{endIndex}</span> of <span className="text-white">{filteredTransactions.length}</span> transactions
           </p>
           
           <div className="flex items-center gap-1.5">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-lg text-slate-600 hover:text-white disabled:opacity-20 transition-colors"
              >
                 <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[32px] h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#a3e635] text-[#0a0f1e]' : 'text-slate-500 hover:bg-white/5'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-lg text-slate-600 hover:text-white disabled:opacity-20 transition-colors"
              >
                 <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
           </div>
        </div>
      </div>

      {/* Summary Footer Cards */}
      <div className="flex flex-col sm:flex-row gap-6">
         <SummaryCard 
            title="TOTAL MONTHLY INFLOW"
            value={formatINR(inflow)}
            sub="+12.5%"
            colorClass="text-[#a3e635]"
            borderClass="border-[#a3e635]/10"
         />
         <SummaryCard 
            title="TOTAL MONTHLY OUTFLOW"
            value={formatINR(outflow)}
            sub="-4.2%"
            colorClass="text-red-400"
            borderClass="border-red-400/10"
         />
         <SummaryCard 
            title="NET CASH FLOW"
            value={formatINR(net)}
            colorClass="text-white"
            borderClass="border-white/[0.03]"
         />
      </div>

      {showModal && (
        <AddTransactionModal
          initial={editTarget}
          onSave={(form) => {
             if (editTarget) editTransaction(editTarget.id, form)
             setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
