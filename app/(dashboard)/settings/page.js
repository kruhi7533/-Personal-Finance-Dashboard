'use client';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { Sun, Moon, User, Bell, Shield } from 'lucide-react';

function SettingSection({ icon, title, children }) {
  return (
    <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--surface-border)]/10">
        <div className="w-10 h-10 rounded-xl bg-[var(--text-primary)]/5 flex items-center justify-center text-[var(--text-primary)]">{icon}</div>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingItem({ label, description, action }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-bold text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>
      <div>{action}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="space-y-8 pb-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">System Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your account preferences and application configuration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SettingSection icon={<User size={20} />} title="Profile Information">
          <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-[var(--surface-border)]/20">
            <div className="w-16 h-16 rounded-2xl bg-[#a3e635] flex items-center justify-center text-2xl font-black text-[#0a0f1e]">{initials}</div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">{user?.name}</p>
              <p className="text-xs text-slate-500 font-medium">{user?.email} • <span className="text-[#a3e635] font-bold capitalize">{user?.role}</span></p>
            </div>
          </div>
        </SettingSection>

        <SettingSection icon={<MonitorIcon size={20} />} title="Appearance & Preferences">
          <SettingItem label="Application Theme" description="Switch between light and dark visual modes."
            action={
              <button onClick={toggleTheme}
                className="flex items-center gap-2 bg-[var(--surface-border)]/20 px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-border)]/30">
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            }
          />
          <SettingItem label="Primary Currency" description="Set your default currency for all calculations."
            action={
              <select className="bg-[var(--surface-base)] border border-[var(--surface-border)]/20 text-xs font-bold text-[var(--text-primary)] rounded-xl px-4 py-2 outline-none">
                <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option>
              </select>
            }
          />
        </SettingSection>

        <SettingSection icon={<Bell size={20} />} title="Notifications">
          <SettingItem label="Email Alerts" description="Receive weekly summaries of your spending."
            action={<div className="w-10 h-5 bg-[#a3e635] rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div>}
          />
          <SettingItem label="Large Transaction Alerts" description="Notify me of any transaction above ₹50,000."
            action={<div className="w-10 h-5 bg-white/10 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white/40 rounded-full shadow-sm" /></div>}
          />
        </SettingSection>

        <SettingSection icon={<Shield size={20} />} title="Security">
          <SettingItem label="Two-Factor Authentication" description="Add an extra layer of security to your account."
            action={<button className="text-[10px] font-black uppercase tracking-widest text-[#a3e635] hover:underline">Enable 2FA</button>}
          />
          <SettingItem label="Data Export" description="Download all your recorded financial data."
            action={<button className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:underline">Export Data</button>}
          />
        </SettingSection>
      </div>
    </div>
  );
}

function MonitorIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}
