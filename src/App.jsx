import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { TransactionProvider, useTransactions } from './context/TransactionContext'
import { RoleProvider } from './context/RoleContext'

// Components
import Sidebar from './components/layout/Sidebar'
import Topbar  from './components/layout/Topbar'
import AddTransactionModal from './components/transactions/AddTransactionModal'

// Pages
import Dashboard    from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights     from './pages/Insights'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { addTransaction } = useTransactions()

  return (
    <div className="flex min-h-screen bg-surface-base">
      {/* Sidebar - Desktop fixed, Mobile drawer */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onAddTransaction={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/"             element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"    element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights"     element={<Insights />} />
            <Route path="*"             element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Add Transaction Modal */}
      {isAddModalOpen && (
        <AddTransactionModal 
          onSave={addTransaction}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <RoleProvider>
      <TransactionProvider>
        <Layout />
      </TransactionProvider>
    </RoleProvider>
  )
}
