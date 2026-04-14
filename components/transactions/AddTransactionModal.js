'use client';
import { useState, useEffect, useRef } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { CATEGORY_LIST, getCategoryByKey } from '../../lib/categories';

export default function AddTransactionModal({ initial, onSave, onClose }) {
  const { addTransaction, editTransaction } = useTransactions();
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
    category: 'Groceries',
  });
  const [saving, setSaving] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'type' | 'category' | null

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

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const selectedCategory = getCategoryByKey(formData.category);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/70 animate-in fade-in duration-300">
      <div className="bg-[#0f172a]/95 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] border border-white/10 relative backdrop-blur-md">
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#a3e635] via-[#fbbf24] to-[#f472b6] opacity-90" />

        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black font-display text-white tracking-tight">
              {initial ? 'Edit Entry' : 'New Entry'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-2 opacity-80">
              Personal Capital Management
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-7">
          {/* Main Inputs */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 block pl-1">Description</label>
              <input
                required type="text" placeholder="e.g. Starbucks"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.25rem] py-4 px-5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 block pl-1">Value (INR)</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a3e635] font-black text-lg">₹</span>
                <input
                  required type="number" step="0.01" placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[1.25rem] py-4 pl-10 pr-5 text-lg font-black text-white outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 block pl-1">Execution Date</label>
              <input
                required type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.25rem] py-4 px-5 text-sm text-white outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.06] transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2.5 relative" ref={openDropdown === 'type' ? dropdownRef : null}>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 block pl-1">Flow Type</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.25rem] py-4 px-5 text-sm text-white font-bold text-left flex items-center justify-between outline-none focus:border-[#a3e635]/50 hover:bg-white/[0.06] transition-all"
              >
                <span className="capitalize">{formData.type}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${openDropdown === 'type' ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {openDropdown === 'type' && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                  {['income', 'expense'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { setFormData({ ...formData, type }); setOpenDropdown(null); }}
                      className={`w-full px-5 py-4 text-left text-sm font-bold capitalize transition-colors hover:bg-white/5 ${formData.type === type ? 'text-[#a3e635] bg-white/5' : 'text-slate-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Premium Category Dropdown */}
          <div className="space-y-2.5 relative" ref={openDropdown === 'category' ? dropdownRef : null}>
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 block pl-1">Classification</label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
              className="w-full bg-white/[0.03] border border-white/10 rounded-[1.25rem] py-4 px-5 text-sm text-white font-bold text-left flex items-center justify-between outline-none focus:border-[#a3e635]/50 hover:bg-white/[0.06] transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCategory.icon}</span>
                <span>{selectedCategory.label}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${openDropdown === 'category' ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {openDropdown === 'category' && (
              <div className="absolute bottom-full mb-3 left-0 w-full bg-[#1e293b] border border-white/10 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 max-h-[280px] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-xl bg-slate-900/90">
                <div className="p-2 grid grid-cols-1 divide-y divide-white/5">
                  {CATEGORY_LIST.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => { setFormData({ ...formData, category: c.key }); setOpenDropdown(null); }}
                      className={`w-full px-4 py-3.5 text-left flex items-center gap-4 transition-all hover:bg-[#a3e635]/10 group rounded-xl ${formData.category === c.key ? 'bg-white/5' : ''}`}
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform duration-200">{c.icon}</span>
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${formData.category === c.key ? 'text-[#a3e635]' : 'text-slate-200 group-hover:text-white'}`}>
                          {c.label}
                        </div>
                      </div>
                      {formData.category === c.key && (
                        <div className="w-2 h-2 rounded-full bg-[#a3e635] shadow-[0_0_10px_#a3e635]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-5 pt-4">
            <button
              type="button" onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white py-5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all border border-white/5 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-[2] bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] py-5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(163,230,53,0.3)] active:scale-[0.98] disabled:opacity-50 group"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-[#0a0f1e]/30 border-t-[#0a0f1e] rounded-full animate-spin" />
              ) : (
                <>
                  <span>{initial ? 'Apply Changes' : 'Confirm Entry'}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="bg-black/40 p-5 flex items-center justify-between border-t border-white/10">
          <div className="flex items-center gap-3 text-[#a3e635]">
            <div className="w-2 h-2 rounded-full bg-[#a3e635] shadow-[0_0_8px_#a3e635] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">Identity Verified & Secured</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 rounded-full bg-white/5" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

