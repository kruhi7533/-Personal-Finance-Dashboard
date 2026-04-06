import { useLocation } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'
import { useTransactions } from '../../context/TransactionContext'

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
)

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
)

const IconNotification = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
)

const IconSun = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
)

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPageTitle(path) {
  const titles = {
    '/dashboard': 'Portfolio Overview',
    '/transactions': 'Transactions Register',
    '/insights': 'Financial Insights',
  }
  return titles[path] || 'FinFlow'
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const { isAdmin, role, toggleRole } = useRole()
  
  const pageTitle = getPageTitle(location.pathname)
  const { filters, setFilter } = useTransactions()

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-surface-base border-b border-surface-border/20 sticky top-0 z-40 backdrop-blur-md">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-400 lg:hidden hover:text-white transition-colors"
        >
          <IconMenu />
        </button>
        <h1 className="text-2xl font-bold font-display tracking-tight text-white">{getPageTitle(location.pathname)}</h1>
      </div>

      {/* Center Search (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <IconSearch />
          </span>
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full bg-[#141b2d]/50 border border-[#1e293b] rounded-2xl py-2.5 pl-12 pr-4 text-sm text-slate-200 outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Dark Mode Placeholder */}
        <button className="hidden sm:flex text-slate-400 hover:text-white transition-colors">
          <IconSun />
        </button>

        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <IconNotification />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-base" />
        </button>

        {/* Role Badge (Clickable for demo) */}
        <button 
          onClick={toggleRole}
          title="Switch role"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-full text-[11px] font-bold text-[#a3e635] hover:bg-[#a3e635]/20 transition-colors"
        >
          {isAdmin ? '🛡️ Admin' : '👁️ Viewer'}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-emerald-500 p-[2px]">
            <div className="w-full h-full rounded-[14px] bg-surface-base flex items-center justify-center overflow-hidden">
              <span className="text-xs font-bold text-white">AD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
