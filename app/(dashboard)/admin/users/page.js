'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { userAPI } from '../../../../lib/api';
import { Shield, Trash2, ArrowLeft, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const { user: currentUser, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/dashboard');
      return;
    }
    fetchUsers();
  }, [isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      setUsers((prev) => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete "${userName}"? This will also delete all their transactions.`)) return;
    try {
      await userAPI.delete(userId);
      setUsers((prev) => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={() => router.push('/admin')} className="flex items-center gap-2 text-slate-500 hover:text-[var(--text-primary)] mb-3 transition-colors">
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Admin</span>
          </button>
          <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">User Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage user accounts, roles, and permissions.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--surface-card)] border border-[var(--surface-border)]/20 rounded-2xl">
          <Search size={16} className="text-slate-500" />
          <input
            type="text" placeholder="Search users..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-slate-600 w-48"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--surface-border)]/20">
          <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Total Users</p>
          <p className="text-3xl font-bold font-display text-[var(--text-primary)]">{users.length}</p>
        </div>
        <div className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--surface-border)]/20">
          <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Admins</p>
          <p className="text-3xl font-bold font-display text-[#a3e635]">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--surface-border)]/20">
          <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Regular Users</p>
          <p className="text-3xl font-bold font-display text-blue-400">{users.filter(u => u.role === 'user').length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[var(--surface-card)] rounded-[32px] border border-[var(--surface-border)]/20 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">User</th>
                  <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Email</th>
                  <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Role</th>
                  <th className="text-left px-8 py-6 border-b border-[var(--surface-border)]/20">Joined</th>
                  <th className="text-right px-8 py-6 border-b border-[var(--surface-border)]/20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                  const isSelf = u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 border-b border-[var(--surface-border)]/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a3e635]/20 to-emerald-500/20 flex items-center justify-center text-xs font-bold text-[#a3e635]">{initials}</div>
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">{u.name}</p>
                            {isSelf && <span className="text-[8px] text-[#a3e635] font-black uppercase tracking-widest">(You)</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-400 text-xs font-medium border-b border-[var(--surface-border)]/10">{u.email}</td>
                      <td className="px-8 py-5 border-b border-[var(--surface-border)]/10">
                        {isSelf ? (
                          <span className="text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-widest bg-[#a3e635]/10 text-[#a3e635]">{u.role}</span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="bg-[var(--surface-base)] border border-[var(--surface-border)]/20 text-xs font-bold text-[var(--text-primary)] rounded-xl px-3 py-2 outline-none cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-8 py-5 text-slate-500 text-xs font-medium border-b border-[var(--surface-border)]/10">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 text-right border-b border-[var(--surface-border)]/10">
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(u._id, u.name)}
                            className="p-2 bg-red-400/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center text-slate-500">
                <p className="text-sm font-medium uppercase tracking-[0.2em]">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
