'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { Sun, Moon, User, Bell, Shield, Monitor as MonitorIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function SettingSection({ icon, title, children }) {
  return (
    <div className="bg-[var(--surface-card)] rounded-[32px] p-8 border border-[var(--surface-border)]/20 space-y-6 shadow-sm">
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
    <div className="flex items-center justify-between py-2 transition-all hover:bg-white/[0.01] -mx-2 px-2 rounded-xl">
      <div>
        <p className="text-sm font-bold text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>
      <div>{action}</div>
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out ${enabled ? 'bg-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'bg-slate-700/50'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    largeTransaction: false
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('finflow-notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('finflow-notifications', JSON.stringify(updated));
    toast.success(`${key === 'email' ? 'Email' : 'Large transaction'} alerts ${updated[key] ? 'enabled' : 'disabled'}`, {
      style: { background: '#1e293b', color: '#fff', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
      iconTheme: { primary: '#a3e635', secondary: '#fff' }
    });
  };

  if (!mounted) return null;

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="space-y-8 pb-10 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-black font-display text-[var(--text-primary)] tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your account preferences and application configuration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SettingSection icon={<User size={20} />} title="Profile Information">
          <div className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-[2rem] border border-[var(--surface-border)]/20 shadow-inner">
            <div className="w-16 h-16 rounded-[1.25rem] bg-[#a3e635] flex items-center justify-center text-3xl font-black text-[#0a0f1e] shadow-[0_10px_30px_rgba(163,230,53,0.2)]">
              {initials}
            </div>
            <div>
              <p className="text-base font-black text-[var(--text-primary)]">{user?.name}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                {user?.email} • <span className="text-[#a3e635]">{user?.role}</span>
              </p>
            </div>
          </div>
        </SettingSection>

        <SettingSection icon={<MonitorIcon size={20} />} title="Appearance & Preferences">
          <SettingItem 
            label="Application Theme" 
            description="Switch between light and dark visual modes."
            action={
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-3 bg-[var(--surface-border)]/30 hover:bg-[#a3e635]/10 hover:text-[#a3e635] px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[var(--text-primary)] transition-all active:scale-95 border border-white/5"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
            }
          />
          <SettingItem 
            label="Primary Currency" 
            description="Set your default currency for all calculations."
            action={
              <select className="bg-white/5 border border-white/10 text-xs font-black text-[var(--text-primary)] rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:bg-white/10 transition-colors uppercase tracking-widest">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            }
          />
        </SettingSection>

        <SettingSection icon={<Bell size={20} />} title="Notifications">
          <SettingItem 
            label="Email Alerts" 
            description="Receive weekly summaries of your spending."
            action={<Toggle enabled={notifications.email} onChange={() => handleToggle('email')} />}
          />
          <SettingItem 
            label="Large Transaction Alerts" 
            description="Notify me of any transaction above ₹50,000."
            action={<Toggle enabled={notifications.largeTransaction} onChange={() => handleToggle('largeTransaction')} />}
          />
        </SettingSection>

        <SettingSection icon={<Shield size={20} />} title="Security">
          <SettingItem 
            label="Two-Factor Authentication" 
            description="Add an extra layer of security to your account."
            action={<button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a3e635] hover:underline px-4 py-2 bg-[#a3e635]/5 rounded-lg border border-[#a3e635]/10">Enable 2FA</button>}
          />
          <SettingItem 
            label="Data Export" 
            description="Download all your recorded financial data."
            action={<button className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:underline opacity-60 hover:opacity-100">Export Ledger</button>}
          />
        </SettingSection>
      </div>
    </div>
  );
}

