'use client';
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { transactionAPI } from '../lib/api';
import { calculateTotals } from '../lib/aggregations';
import { useAuth } from './AuthContext';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    month: 'all',
    search: '',
  });

  // Sort state
  const [sort, setSort] = useState({ column: 'date', direction: 'desc' });

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load transactions from API when user is authenticated
  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
      setTxLoading(false);
    }
  }, [user]);

  const loadTransactions = useCallback(async () => {
    try {
      setTxLoading(true);
      const res = await transactionAPI.getAll();
      // Normalize dates to string format for consistency
      const normalized = res.data.map(t => ({
        ...t,
        id: t._id,
        date: new Date(t.date).toISOString().slice(0, 10),
      }));
      setTransactions(normalized);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setTxLoading(false);
    }
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      time: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
    setUnreadCount((prev) => prev + 1);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // CRUD — now backed by API
  const addTransaction = useCallback(async (txn) => {
    try {
      const res = await transactionAPI.create(txn);
      const newTxn = {
        ...res.data,
        id: res.data._id,
        date: new Date(res.data.date).toISOString().slice(0, 10),
      };
      setTransactions((prev) => [newTxn, ...prev]);
      addNotification(`New transaction added: ${txn.name}`, 'success');
      return newTxn;
    } catch (error) {
      addNotification(`Failed to add transaction: ${error.response?.data?.message || error.message}`, 'error');
      throw error;
    }
  }, [addNotification]);

  const editTransaction = useCallback(async (id, updates) => {
    try {
      const res = await transactionAPI.update(id, updates);
      const updated = {
        ...res.data,
        id: res.data._id,
        date: new Date(res.data.date).toISOString().slice(0, 10),
      };
      setTransactions((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? updated : t))
      );
      addNotification(`Transaction updated: ${updates.name || 'Details changed'}`, 'info');
    } catch (error) {
      addNotification(`Failed to update: ${error.response?.data?.message || error.message}`, 'error');
      throw error;
    }
  }, [addNotification]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      const deleted = transactions.find(t => t.id === id || t._id === id);
      await transactionAPI.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id && t._id !== id));
      if (deleted) addNotification(`Deleted transaction: ${deleted.name}`, 'warning');
    } catch (error) {
      addNotification(`Failed to delete: ${error.response?.data?.message || error.message}`, 'error');
      throw error;
    }
  }, [transactions, addNotification]);

  // Filter helpers
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ type: 'all', category: 'all', month: 'all', search: '' });
  }, []);

  const toggleSort = useCallback((column) => {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
  }, []);

  // Derived: filtered + sorted list
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters.month !== 'all') {
      result = result.filter((t) => t.date.startsWith(filters.month));
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      let aVal = a[sort.column];
      let bVal = b[sort.column];

      if (sort.column === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (sort.column === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filters, sort]);

  // Derived: summary stats
  const stats = useMemo(() => {
    const { inflow, outflow, net } = calculateTotals(transactions);
    return {
      totalIncome: inflow,
      totalExpenses: outflow,
      netBalance: net,
      savingsRate: inflow > 0 ? ((net / inflow) * 100).toFixed(1) : '0.0',
    };
  }, [transactions]);

  // Unique months
  const availableMonths = useMemo(() => {
    const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))];
    return months.sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const value = {
    transactions,
    filteredTransactions,
    stats,
    availableMonths,
    txLoading,
    loadTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    clearNotifications,
    filters,
    setFilter,
    resetFilters,
    sort,
    toggleSort,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within a TransactionProvider');
  return ctx;
}
