'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Search, Bell, Sun, Moon, LogOut } from 'lucide-react';

function getPageTitle(path) {
  const titles = {
    '/dashboard': 'Portfolio Overview',
    '/transactions': 'Transactions Register',
    '/insights': 'Financial Insights',
    '/settings': 'System Settings',
    '/support': 'Help & Support',
    '/admin': 'Admin Dashboard',
    '/admin/users': 'User Management',
  };
  return titles[path] || 'FinFlow';
}

export default function Topbar({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { filters, setFilter, notifications, unreadCount, markAllRead, clearNotifications } = useTransactions();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggleNotifications = () => {
    if (!showNotifications) markAllRead();
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-[var(--surface-base)] border-b border-[var(--surface-border)]/20 sticky top-0 z-40 backdrop-blur-md no-print">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-400 lg:hidden hover:text-white transition-colors"
        >
          <Menu size={24} strokeWidth={2} />
        </button>
        <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--text-primary)]">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Center Search */}
      {pathname === '/transactions' ? (
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={20} className="stroke-[2.5px]" />
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="w-full bg-[var(--surface-base)] border border-[var(--surface-border)] rounded-2xl py-2.5 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 mx-8" />
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3 lg:gap-6">
        <button
          onClick={toggleTheme}
          className="hidden sm:flex text-slate-400 hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-white/5 rounded-xl"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative text-slate-400 hover:text-[var(--text-primary)] transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            <Bell size={20} strokeWidth={2.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--surface-base)]" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-4 w-80 bg-[var(--surface-card)] border border-[var(--surface-border)]/30 rounded-[24px] shadow-2xl z-20 overflow-hidden">
                <div className="p-4 border-b border-[var(--surface-border)]/20 flex items-center justify-between bg-white/[0.02]">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Notifications</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearNotifications(); }}
                    className="text-[9px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No recent alerts</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-[var(--surface-border)]/10 hover:bg-white/[0.02] last:border-0 transition-colors">
                        <div className="flex gap-3">
                          <div className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${n.type === 'success' ? 'bg-[#a3e635]' : n.type === 'warning' ? 'bg-orange-400' : n.type === 'error' ? 'bg-red-400' : 'bg-blue-400'}`} />
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">{n.message}</p>
                            <p className="text-[10px] text-slate-500 font-medium mt-1">
                              {new Date(n.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Role Badge */}
        <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-full text-[11px] font-bold text-[#a3e635]">
          {isAdmin ? '🛡️ Admin' : '👤 User'}
        </span>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-emerald-500 p-[2px]">
              <div className="w-full h-full rounded-[14px] bg-surface-base flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-4 w-56 bg-[var(--surface-card)] border border-[var(--surface-border)]/30 rounded-[20px] shadow-2xl z-20 overflow-hidden">
                <div className="p-4 border-b border-[var(--surface-border)]/20">
                  <p className="text-sm font-bold text-[var(--text-primary)]">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-sm font-bold"
                  >
                    <LogOut size={16} strokeWidth={2.5} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
