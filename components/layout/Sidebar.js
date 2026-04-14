'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ArrowLeftRight, PieChart, Settings, LifeBuoy, Plus, Shield } from 'lucide-react';

const IconLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#a3e635" fillOpacity="0.2" stroke="#a3e635" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 8L8 10.5V13.5L12 16L16 13.5V10.5L12 8Z" fill="#a3e635"/>
  </svg>
);

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',    icon: <LayoutDashboard size={20} strokeWidth={2} /> },
  { href: '/transactions', label: 'Transactions', icon: <ArrowLeftRight size={20} strokeWidth={2} /> },
  { href: '/insights',     label: 'Insights',     icon: <PieChart size={20} strokeWidth={2} /> },
];

const adminNavItems = [
  { href: '/admin',        label: 'Admin Panel',  icon: <Shield size={20} strokeWidth={2} /> },
];

export default function Sidebar({ isOpen, onClose, onAddTransaction }) {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-surface-sidebar border-r border-surface-border/30
    transform transition-transform duration-300 ease-in-out flex flex-col no-print
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
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
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="px-4 mt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-4 mb-4">Admin</p>
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div className="flex-1" />

        {/* Add Transaction Button */}
        <div className="px-6 mb-8">
          <button
            onClick={() => { onAddTransaction(); onClose(); }}
            className="btn-primary w-full"
          >
            <Plus size={20} strokeWidth={3} />
            Add Transaction
          </button>
        </div>

        <div className="p-4 border-t border-[var(--surface-border)]/30 space-y-1">
          <Link
            href="/settings"
            onClick={onClose}
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
          >
            <Settings size={20} strokeWidth={2} />
            <span className="text-sm">Settings</span>
          </Link>
          <Link
            href="/support"
            onClick={onClose}
            className={`nav-link ${isActive('/support') ? 'active' : ''}`}
          >
            <LifeBuoy size={20} strokeWidth={2} />
            <span className="text-sm">Support</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
