'use client';
import { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { CATEGORY_LIST } from '../../lib/categories';

export default function AddTransactionModal({ initial, onSave, onClose }) {
  const { addTransaction, editTransaction } = useTransactions();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
    category: 'Groceries',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setFormData({
        name: initial.name || '',
        amount: initial.amount || '',
        date: initial.date || new Date().toISOString().slice(0, 10),
        type: initial.type || 'expense',
        category: initial.category || 'Groceries',
      });
    }
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalData = { ...formData, amount: parseFloat(formData.amount) || 0 };
      if (initial) {
        await editTransaction(initial._id || initial.id, finalData);
      } else {
        await addTransaction(finalData);
      }
      onSave && onSave(finalData);
      onClose();
    } catch (error) {
      // Error notification handled in context
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
      <div className="bg-[var(--surface-card)] w-full max-w-lg rounded-[32px] overflow-hidden shadow-[0_32px_100px_-20px_rgba(0,0,0,0.8)] border border-[var(--surface-border)]/20 relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#a3e635] via-[#fbbf24] to-red-400 opacity-80" />

        <div className="p-8 pb-0 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-[var(--text-primary)]">
              {initial ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Record a new movement in your capital.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Merchant / Name</label>
              <input
                required type="text" placeholder="e.g. Apple Store"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-2xl py-3 px-4 text-sm text-[var(--text-primary)] placeholder:text-slate-600 outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3e635] font-bold text-sm">₹</span>
                <input
                  required type="number" step="0.01" placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-2xl py-3 pl-8 pr-4 text-sm text-[var(--text-primary)] font-bold outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Transaction Date</label>
              <input
                required type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-2xl py-3 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-2xl py-3 px-4 text-sm text-[var(--text-primary)] font-bold outline-none focus:border-[#a3e635]/50 transition-all appearance-none cursor-pointer"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-2xl py-3 px-4 text-sm text-[var(--text-primary)] font-bold outline-none focus:border-[#a3e635]/50 transition-all appearance-none cursor-pointer"
            >
              {CATEGORY_LIST.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button" onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-[2] bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(163,230,53,0.3)] active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>

        <div className="bg-black/20 p-5 flex items-center justify-between border-t border-white/[0.03]">
          <div className="flex items-center gap-2 text-[#a3e635]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.25em]">Secure Encrypted Entry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
