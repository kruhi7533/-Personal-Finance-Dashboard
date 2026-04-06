import { useState, useEffect } from 'react'
import { useTransactions } from '../../context/TransactionContext'
import { useRole } from '../../context/RoleContext'
import { CATEGORY_LIST } from '../../constants/categories'

export default function AddTransactionModal({ initial, onSave, onClose }) {
  const { isAdmin } = useRole()
  const { addTransaction, editTransaction } = useTransactions()

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
    category: 'Food & Dining'
  })

  useEffect(() => {
    if (initial) setFormData(initial)
  }, [initial])

  if (!isAdmin) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalData = { 
      ...formData, 
      amount: parseFloat(formData.amount) || 0 
    }
    if (initial) {
      editTransaction(initial.id, finalData)
    } else {
      addTransaction(finalData)
    }
    onSave && onSave(finalData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
      <div className="bg-[#141b2d] w-full max-w-lg rounded-[32px] overflow-hidden shadow-[0_32px_100px_-20px_rgba(0,0,0,0.8)] border border-white/[0.03] relative">
        {/* Top Gradient Border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#a3e635] via-[#fbbf24] to-red-400 opacity-80" />
        
        {/* Header */}
        <div className="p-8 pb-0 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-white">
              {initial ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Record a new movement in your capital.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Merchant / Name */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Merchant / Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Apple Store"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 px-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Amount (INR)</label>
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3e635] font-bold text-sm">₹</span>
                 <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Transaction Date */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Transaction Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.04] transition-all [color-scheme:dark]"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 px-4 text-sm text-slate-300 font-bold outline-none focus:border-[#a3e635]/50 transition-all appearance-none cursor-pointer"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-600 block pl-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 px-4 text-sm text-slate-300 font-bold outline-none focus:border-[#a3e635]/50 transition-all appearance-none cursor-pointer"
            >
              {CATEGORY_LIST.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-[#a3e635] hover:bg-[#bef264] text-[#0a0f1e] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(163,230,53,0.3)] active:scale-[0.98]"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Save Transaction
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-black/20 p-5 flex items-center justify-between border-t border-white/[0.03]">
           <div className="flex items-center gap-2 text-[#a3e635]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.25em]">Secure Encrypted Entry</span>
           </div>
           <div className="flex items-center gap-3 text-slate-600">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
           </div>
        </div>
      </div>
    </div>
  )
}
