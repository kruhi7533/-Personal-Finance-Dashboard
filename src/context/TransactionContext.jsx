import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { TRANSACTIONS } from '../data/mockData'
import { calculateTotals } from '../utils/aggregations'

// ── Context ──────────────────────────────────────────────────────────────────
const TransactionContext = createContext(null)

// ── Provider ─────────────────────────────────────────────────────────────────
export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(TRANSACTIONS)

  // ── Filter state ───────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    type:     'all',     // 'all' | 'income' | 'expense'
    category: 'all',     // 'all' | any category key string
    month:    'all',     // 'all' | 'YYYY-MM'
    search:   '',        // free-text search on name
  })

  // ── Sort state ─────────────────────────────────────────────────────────────
  const [sort, setSort] = useState({
    column: 'date',      // 'date' | 'name' | 'amount' | 'category' | 'type'
    direction: 'desc',   // 'asc' | 'desc'
  })

  // ── CRUD operations ────────────────────────────────────────────────────────
  const addTransaction = useCallback((txn) => {
    setTransactions((prev) => [
      { ...txn, id: Date.now() },
      ...prev,
    ])
  }, [])

  const editTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ── Filter helpers ─────────────────────────────────────────────────────────
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ type: 'all', category: 'all', month: 'all', search: '' })
  }, [])

  // ── Sort helper ────────────────────────────────────────────────────────────
  const toggleSort = useCallback((column) => {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    )
  }, [])

  // ── Derived: filtered + sorted list ───────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type)
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category)
    }

    // Month filter (expects 'YYYY-MM')
    if (filters.month !== 'all') {
      result = result.filter((t) => t.date.startsWith(filters.month))
    }

    // Search filter (case-insensitive on name)
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter((t) => t.name.toLowerCase().includes(q))
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sort.column]
      let bVal = b[sort.column]

      if (sort.column === 'amount') {
        aVal = Number(aVal)
        bVal = Number(bVal)
      } else if (sort.column === 'date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else {
        aVal = String(aVal).toLowerCase()
        bVal = String(bVal).toLowerCase()
      }

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [transactions, filters, sort])

  // ── Derived: summary stats ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    const { inflow, outflow, net } = calculateTotals(transactions)
    return {
      totalIncome:   inflow,
      totalExpenses: outflow,
      netBalance:    net,
      savingsRate:   inflow > 0 ? ((net / inflow) * 100).toFixed(1) : '0.0',
    }
  }, [transactions])

  // ── Unique months present in data (for month filter dropdown) ──────────────
  const availableMonths = useMemo(() => {
    const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))]
    return months.sort((a, b) => b.localeCompare(a)) // newest first
  }, [transactions])

  const value = {
    // Data
    transactions,
    filteredTransactions,
    stats,
    availableMonths,
    // CRUD
    addTransaction,
    editTransaction,
    deleteTransaction,
    // Filters
    filters,
    setFilter,
    resetFilters,
    // Sort
    sort,
    toggleSort,
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useTransactions() {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactions must be used within a TransactionProvider')
  return ctx
}
