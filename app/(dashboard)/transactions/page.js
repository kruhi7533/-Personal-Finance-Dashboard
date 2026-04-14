'use client';
import { useState, useMemo } from 'react';
import { useTransactions } from '../../../context/TransactionContext';
import { useAuth } from '../../../context/AuthContext';
import { getCategoryByKey, CATEGORY_LIST } from '../../../lib/categories';
import AddTransactionModal from '../../../components/transactions/AddTransactionModal';
import { formatINR, formatDate } from '../../../lib/formatters';
import { exportTransactionsToPDF } from '../../../lib/exportPDF';
import { Download, RotateCcw, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

function SummaryCard({ title, value, sub, colorClass, borderClass }) {
  return (
    <div className={`bg-[var(--surface-card)] rounded-[24px] p-6 border ${borderClass} flex-1`}>
      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-2xl font-bold font-display ${colorClass}`}>{value}</p>
        {sub && <span className={`text-[10px] font-bold ${sub.startsWith('+') ? 'text-[#a3e635]' : 'text-red-400'}`}>{sub}</span>}
      </div>
      {title === 'NET CASH FLOW' && <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-medium">Optimal range maintained</p>}
    </div>
  );
}

export default function TransactionsPage() {
  const {
    filteredTransactions, filters, setFilter, resetFilters,
    editTransaction, deleteTransaction, availableMonths, addNotification, txLoading,
  } = useTransactions();
  const { isAdmin } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { paginatedList, totalPages, startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      paginatedList: filteredTransactions.slice(start, end),
      totalPages: Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage)),
      startIndex: start + 1,
      endIndex: Math.min(end, filteredTransactions.length),
    };
  }, [filteredTransactions, currentPage]);

  const { inflow, outflow, net } = useMemo(() => {
    const inf = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const out = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { inflow: inf, outflow: out, net: inf - out };
  }, [filteredTransactions]);

  const openEdit = (txn) => { setEditTarget(txn); setShowModal(true); };

  if (txLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Transaction History</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Review and manage your wealth flow across all connected assets.</p>
        </div>
        <button
          onClick={() => { exportTransactionsToPDF(filteredTransactions); addNotification('Transaction list exported to PDF', 'success'); }}
          className="bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-[0_8px_20px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2 no-print"
        >
          <Download size={18} strokeWidth={2.5} /> Export PDF
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 ml-1">Type</span>
          <select value={filters.type} onChange={(e) => { setFilter('type', e.target.value); setCurrentPage(1); }}
            className="bg-[var(--surface-card)] border border-[var(--surface-border)]/20 text-xs font-bold text-[var(--text-primary)] rounded-xl px-4 py-3 outline-none focus:border-[#a3e635]/30 transition w-36 appearance-none">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 ml-1">Category</span>
          <select value={filters.category} onChange={(e) => { setFilter('category', e.target.value); setCurrentPage(1); }}
            className="bg-[var(--surface-card)] border border-[var(--surface-border)]/20 text-xs font-bold text-[var(--text-primary)] rounded-xl px-4 py-3 outline-none focus:border-[#a3e635]/30 transition w-44 appearance-none">
            <option value="all">All Categories</option>
            {CATEGORY_LIST.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 ml-1">Month</span>
          <select value={filters.month} onChange={(e) => { setFilter('month', e.target.value); setCurrentPage(1); }}
            className="bg-[var(--surface-card)] border border-[var(--surface-border)]/20 text-xs font-bold text-[var(--text-primary)] rounded-xl px-4 py-3 outline-none focus:border-[#a3e635]/30 transition w-44 appearance-none">
            <option value="all">All Time</option>
            {availableMonths.map(m => {
              const label = new Date(m).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
              return <option key={m} value={m}>{label}</option>;
            })}
          </select>
        </div>
        <button onClick={() => { resetFilters(); setCurrentPage(1); }}
          className="self-end mb-0.5 bg-[var(--surface-card)] hover:bg-[var(--surface-border)]/10 text-slate-500 hover:text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-colors border border-[var(--surface-border)]/20">
          <div className="flex items-center gap-2"><RotateCcw size={12} strokeWidth={3} /> Reset Filters</div>
        </button>
      </div>

      <div className="bg-[var(--surface-card)] rounded-[32px] border border-[var(--surface-border)]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Name</th>
                <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Date</th>
                <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Category</th>
                <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Type</th>
                <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Amount</th>
                <th className="text-right px-8 py-6 border-b border-[var(--surface-border)]/20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((t, idx) => {
                const cat = getCategoryByKey(t.category);
                const isLast = idx === paginatedList.length - 1;
                const canEdit = isAdmin || (t.userId?._id === undefined); // user can always edit own
                return (
                  <tr key={t._id || t.id} className="group hover:bg-[var(--surface-border)] transition-colors">
                    <td className={`px-8 py-5 flex items-center gap-4 ${!isLast ? 'border-b border-[var(--surface-border)]/20' : ''}`}>
                      <div className="w-10 h-10 rounded-xl bg-[var(--text-primary)]/5 flex items-center justify-center text-sm ring-1 ring-inset ring-[var(--surface-border)]/50">{cat.icon}</div>
                      <div>
                        <p className="font-bold text-[var(--text-primary)] text-sm">{t.name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                          {isAdmin && t.userId?.name ? `By: ${t.userId.name} • ` : ''}Ref: #TXN{(t._id || t.id).toString().slice(-6)}
                        </p>
                      </div>
                    </td>
                    <td className={`px-8 py-5 text-slate-400 text-xs font-medium ${!isLast ? 'border-b border-[var(--surface-border)]/20' : ''}`}>
                      {formatDate(t.date, { month: 'short', day: '2-digit', year: 'numeric' })}
                    </td>
                    <td className={`px-8 py-5 text-slate-500 text-xs font-medium ${!isLast ? 'border-b border-[var(--surface-border)]/20' : ''}`}>{t.category}</td>
                    <td className={`px-8 py-5 ${!isLast ? 'border-b border-[var(--surface-border)]/20' : ''}`}>
                      <span className={`text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${t.type === 'income' ? 'bg-[#a3e635]/10 text-[#a3e635]' : 'bg-red-400/10 text-red-400'}`}>{t.type}</span>
                    </td>
                    <td className={`px-8 py-5 font-display font-bold text-base ${t.type === 'income' ? 'text-[#a3e635]' : 'text-[var(--text-primary)]'} ${!isLast ? 'border-b border-[var(--surface-border)]/20' : ''}`}>
                      {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                    </td>
                    <td className={`px-8 py-5 text-right ${!isLast ? 'border-b border-[var(--surface-border)]/20' : ''}`}>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(t)} className="p-2 bg-[var(--surface-border)]/10 hover:bg-[var(--surface-border)]/20 rounded-lg text-slate-500 hover:text-[var(--text-primary)] transition-colors">
                          <Pencil size={14} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => deleteTransaction(t._id || t.id)} className="p-2 bg-red-400/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors">
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              <p className="text-sm font-medium uppercase tracking-[0.2em]">No transactions matched</p>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-[var(--surface-border)]/5 border-t border-[var(--surface-border)]/20 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Showing <span className="text-[var(--text-primary)]">{filteredTransactions.length > 0 ? startIndex : 0}-{endIndex}</span> of <span className="text-[var(--text-primary)]">{filteredTransactions.length}</span> transactions
          </p>
          <div className="flex items-center gap-1.5">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors">
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`min-w-[32px] h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#a3e635] text-[#0a0f1e]' : 'text-slate-500 hover:bg-[var(--surface-border)]/10'}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors">
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <SummaryCard title="TOTAL MONTHLY INFLOW" value={formatINR(inflow)} sub="+12.5%" colorClass="text-[#a3e635]" borderClass="border-[#a3e635]/10" />
        <SummaryCard title="TOTAL MONTHLY OUTFLOW" value={formatINR(outflow)} sub="-4.2%" colorClass="text-red-400" borderClass="border-red-400/10" />
        <SummaryCard title="NET CASH FLOW" value={formatINR(net)} colorClass="text-[var(--text-primary)]" borderClass="border-[var(--surface-border)]/20" />
      </div>

      {showModal && (
        <AddTransactionModal
          initial={editTarget}
          onSave={() => { setEditTarget(null); }}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}
