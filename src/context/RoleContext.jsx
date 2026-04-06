import { createContext, useContext, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
// role: 'admin' | 'viewer'
//
// admin  → can add / edit / delete transactions, change settings
// viewer → read-only; add/edit/delete controls are hidden or disabled

// ── Context ───────────────────────────────────────────────────────────────────
const RoleContext = createContext(null)

// ── Provider ──────────────────────────────────────────────────────────────────
export function RoleProvider({ children }) {
  const [role, setRole] = useState('admin')   // default to admin for the demo

  const isAdmin  = role === 'admin'
  const isViewer = role === 'viewer'

  const switchRole = (newRole) => {
    if (newRole === 'admin' || newRole === 'viewer') {
      setRole(newRole)
    }
  }

  const toggleRole = () => {
    setRole((prev) => (prev === 'admin' ? 'viewer' : 'admin'))
  }

  const value = {
    role,
    isAdmin,
    isViewer,
    switchRole,
    toggleRole,
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within a RoleProvider')
  return ctx
}
