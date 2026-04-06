import { NavLink } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#a3e635" fillOpacity="0.2" stroke="#a3e635" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 8L8 10.5V13.5L12 16L16 13.5V10.5L12 8Z" fill="#a3e635"/>
  </svg>
)

const IconDashboard = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
)

const IconTransactions = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
)

const IconInsights = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
)

const IconSettings = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
)

const IconSupport = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
)

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: <IconDashboard /> },
  { to: '/transactions', label: 'Transactions', icon: <IconTransactions /> },
  { to: '/insights',     label: 'Insights',     icon: <IconInsights /> },
]

export default function Sidebar({ isOpen, onClose, onAddTransaction }) {
  const { isAdmin } = useRole()

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-surface-sidebar border-r border-surface-border/30
    transform transition-transform duration-300 ease-in-out flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className="p-8 pb-10 flex items-center gap-3">
          <IconLogo />
          <span className="text-2xl font-bold tracking-tight text-white font-display">
            Fin<span className="text-brand-primary">Flow</span>
          </span>
        </div>

        <div className="px-4 mb-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-4 mb-4">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex-1" />

        {/* Action Button */}
        {isAdmin && (
          <div className="px-6 mb-8">
            <button 
              onClick={() => { onAddTransaction(); onClose(); }}
              className="btn-primary w-full"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Transaction
            </button>
          </div>
        )}

        {/* Footer Links */}
        <div className="p-4 border-t border-surface-border/30">
          <button className="btn-ghost w-full">
            <IconSettings />
            <span className="text-sm">Settings</span>
          </button>
          <button className="btn-ghost w-full">
            <IconSupport />
            <span className="text-sm">Support</span>
          </button>
        </div>
      </aside>
    </>
  )
}
