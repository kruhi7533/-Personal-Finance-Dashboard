/**
 * Single source of truth for all transaction categories.
 */
export const CATEGORIES = {
  SALARY: { key: 'Salary', label: 'Salary', icon: '💼', color: '#10b981' },
  FREELANCE: { key: 'Freelance', label: 'Freelance', icon: '🖥️', color: '#34d399' },
  INVESTMENT: { key: 'Investment', label: 'Investment', icon: '📈', color: '#6ee7b7' },
  BONUS: { key: 'Bonus', label: 'Bonus', icon: '🎁', color: '#a7f3d0' },
  RENT: { key: 'Rent', label: 'Rent', icon: '🏠', color: '#3b82f6' },
  ELECTRICITY: { key: 'Electricity', label: 'Electricity', icon: '⚡', color: '#60a5fa' },
  INTERNET: { key: 'Internet', label: 'Internet', icon: '🌐', color: '#93c5fd' },
  GROCERIES: { key: 'Groceries', label: 'Groceries', icon: '🛒', color: '#f59e0b' },
  DINING: { key: 'Dining', label: 'Dining Out', icon: '🍽️', color: '#fbbf24' },
  COFFEE: { key: 'Coffee', label: 'Coffee', icon: '☕', color: '#fcd34d' },
  TRANSPORT: { key: 'Transport', label: 'Transport', icon: '🚌', color: '#06b6d4' },
  FUEL: { key: 'Fuel', label: 'Fuel', icon: '⛽', color: '#22d3ee' },
  ENTERTAINMENT: { key: 'Entertainment', label: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  SUBSCRIPTIONS: { key: 'Subscriptions', label: 'Subscriptions', icon: '📺', color: '#a78bfa' },
  HEALTH: { key: 'Health', label: 'Health', icon: '🏥', color: '#ef4444' },
  PHARMACY: { key: 'Pharmacy', label: 'Pharmacy', icon: '💊', color: '#f87171' },
  SHOPPING: { key: 'Shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  ELECTRONICS: { key: 'Electronics', label: 'Electronics', icon: '📱', color: '#f472b6' },
  EDUCATION: { key: 'Education', label: 'Education', icon: '📚', color: '#f97316' },
  MISC: { key: 'Miscellaneous', label: 'Miscellaneous', icon: '🔖', color: '#64748b' },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function getCategoryByKey(key) {
  return CATEGORY_LIST.find((c) => c.key === key) ?? CATEGORIES.MISC;
}
