'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { TransactionProvider } from '../../context/TransactionContext';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import AddTransactionModal from '../../components/transactions/AddTransactionModal';

function DashboardLayoutInner({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--surface-base)]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAddTransaction={() => setIsAddModalOpen(true)}
      />

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {isAddModalOpen && (
        <AddTransactionModal
          onSave={() => {}}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-base)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TransactionProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </TransactionProvider>
  );
}
