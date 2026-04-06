/**
 * src/constants/categories.js
 *
 * Single source of truth for all transaction categories.
 * Each entry contains a unique key, display label, emoji icon, and hex color
 * used consistently across Dashboard, Transactions and Insights pages.
 */

export const CATEGORIES = {
  // ── Income ─────────────────────────────────────────────────────────────────
  SALARY: {
    key:   'Salary',
    label: 'Salary',
    icon:  '💼',
    color: '#10b981',   // emerald-500
  },
  FREELANCE: {
    key:   'Freelance',
    label: 'Freelance',
    icon:  '🖥️',
    color: '#34d399',   // emerald-400
  },
  INVESTMENT: {
    key:   'Investment',
    label: 'Investment',
    icon:  '📈',
    color: '#6ee7b7',   // emerald-300
  },
  BONUS: {
    key:   'Bonus',
    label: 'Bonus',
    icon:  '🎁',
    color: '#a7f3d0',   // emerald-200
  },

  // ── Housing ────────────────────────────────────────────────────────────────
  RENT: {
    key:   'Rent',
    label: 'Rent',
    icon:  '🏠',
    color: '#3b82f6',   // blue-500
  },
  ELECTRICITY: {
    key:   'Electricity',
    label: 'Electricity',
    icon:  '⚡',
    color: '#60a5fa',   // blue-400
  },
  INTERNET: {
    key:   'Internet',
    label: 'Internet',
    icon:  '🌐',
    color: '#93c5fd',   // blue-300
  },

  // ── Food ──────────────────────────────────────────────────────────────────
  GROCERIES: {
    key:   'Groceries',
    label: 'Groceries',
    icon:  '🛒',
    color: '#f59e0b',   // amber-500
  },
  DINING: {
    key:   'Dining',
    label: 'Dining Out',
    icon:  '🍽️',
    color: '#fbbf24',   // amber-400
  },
  COFFEE: {
    key:   'Coffee',
    label: 'Coffee',
    icon:  '☕',
    color: '#fcd34d',   // amber-300
  },

  // ── Transport ─────────────────────────────────────────────────────────────
  TRANSPORT: {
    key:   'Transport',
    label: 'Transport',
    icon:  '🚌',
    color: '#06b6d4',   // cyan-500
  },
  FUEL: {
    key:   'Fuel',
    label: 'Fuel',
    icon:  '⛽',
    color: '#22d3ee',   // cyan-400
  },

  // ── Entertainment ─────────────────────────────────────────────────────────
  ENTERTAINMENT: {
    key:   'Entertainment',
    label: 'Entertainment',
    icon:  '🎬',
    color: '#8b5cf6',   // violet-500
  },
  SUBSCRIPTIONS: {
    key:   'Subscriptions',
    label: 'Subscriptions',
    icon:  '📺',
    color: '#a78bfa',   // violet-400
  },

  // ── Health ────────────────────────────────────────────────────────────────
  HEALTH: {
    key:   'Health',
    label: 'Health',
    icon:  '🏥',
    color: '#ef4444',   // red-500
  },
  PHARMACY: {
    key:   'Pharmacy',
    label: 'Pharmacy',
    icon:  '💊',
    color: '#f87171',   // red-400
  },

  // ── Shopping ──────────────────────────────────────────────────────────────
  SHOPPING: {
    key:   'Shopping',
    label: 'Shopping',
    icon:  '🛍️',
    color: '#ec4899',   // pink-500
  },
  ELECTRONICS: {
    key:   'Electronics',
    label: 'Electronics',
    icon:  '📱',
    color: '#f472b6',   // pink-400
  },

  // ── Education ─────────────────────────────────────────────────────────────
  EDUCATION: {
    key:   'Education',
    label: 'Education',
    icon:  '📚',
    color: '#f97316',   // orange-500
  },

  // ── Miscellaneous ─────────────────────────────────────────────────────────
  MISC: {
    key:   'Miscellaneous',
    label: 'Miscellaneous',
    icon:  '🔖',
    color: '#64748b',   // slate-500
  },
}

/**
 * Flat array — useful for dropdowns, filter pills, chart legends, etc.
 */
export const CATEGORY_LIST = Object.values(CATEGORIES)

/**
 * Quick lookup: category key → category object
 * Usage: getCategoryByKey('Groceries') → { key, label, icon, color }
 */
export function getCategoryByKey(key) {
  return CATEGORY_LIST.find((c) => c.key === key) ?? CATEGORIES.MISC
}
