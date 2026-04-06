/**
 * src/data/mockData.js
 *
 * 30 realistic transactions in INR (Indian Rupees ₹).
 * Fields: id, name, date, amount (INR), type ('income' | 'expense'), category
 *
 * Category values match the `key` field in src/constants/categories.js
 */

export const TRANSACTIONS = [
  // ── March 2026 ─────────────────────────────────────────────────────────────
  {
    id: 1,
    name:     'Monthly Salary — TechCorp Pvt Ltd',
    date:     '2026-03-31',
    amount:   85000,
    type:     'income',
    category: 'Salary',
  },
  {
    id: 2,
    name:     'Freelance UI Design Project',
    date:     '2026-03-29',
    amount:   22000,
    type:     'income',
    category: 'Freelance',
  },
  {
    id: 3,
    name:     'Apartment Rent — March',
    date:     '2026-03-28',
    amount:   18500,
    type:     'expense',
    category: 'Rent',
  },
  {
    id: 4,
    name:     'BigBasket Groceries',
    date:     '2026-03-27',
    amount:   3240,
    type:     'expense',
    category: 'Groceries',
  },
  {
    id: 5,
    name:     'Swiggy Dinner',
    date:     '2026-03-26',
    amount:   680,
    type:     'expense',
    category: 'Dining',
  },
  {
    id: 6,
    name:     'Zerodha Dividend Credit',
    date:     '2026-03-25',
    amount:   4500,
    type:     'income',
    category: 'Investment',
  },
  {
    id: 7,
    name:     'Ola Cab — Office Commute',
    date:     '2026-03-24',
    amount:   320,
    type:     'expense',
    category: 'Transport',
  },
  {
    id: 8,
    name:     'BESCOM Electricity Bill',
    date:     '2026-03-23',
    amount:   1420,
    type:     'expense',
    category: 'Electricity',
  },
  {
    id: 9,
    name:     'Netflix Premium Subscription',
    date:     '2026-03-22',
    amount:   649,
    type:     'expense',
    category: 'Subscriptions',
  },
  {
    id: 10,
    name:     'Apollo Pharmacy — Vitamins',
    date:     '2026-03-21',
    amount:   860,
    type:     'expense',
    category: 'Pharmacy',
  },
  {
    id: 11,
    name:     'Udemy — React Advanced Course',
    date:     '2026-03-20',
    amount:   499,
    type:     'expense',
    category: 'Education',
  },
  {
    id: 12,
    name:     'Starbucks Coffee',
    date:     '2026-03-19',
    amount:   380,
    type:     'expense',
    category: 'Coffee',
  },
  {
    id: 13,
    name:     'PVR Cinema Tickets',
    date:     '2026-03-18',
    amount:   900,
    type:     'expense',
    category: 'Entertainment',
  },
  {
    id: 14,
    name:     'Zara Clothing Purchase',
    date:     '2026-03-17',
    amount:   4200,
    type:     'expense',
    category: 'Shopping',
  },
  {
    id: 15,
    name:     'BSNL Broadband Bill',
    date:     '2026-03-16',
    amount:   999,
    type:     'expense',
    category: 'Internet',
  },

  // ── April 2026 ─────────────────────────────────────────────────────────────
  {
    id: 16,
    name:     'Monthly Salary — TechCorp Pvt Ltd',
    date:     '2026-04-01',
    amount:   85000,
    type:     'income',
    category: 'Salary',
  },
  {
    id: 17,
    name:     'Q1 Performance Bonus',
    date:     '2026-04-01',
    amount:   15000,
    type:     'income',
    category: 'Bonus',
  },
  {
    id: 18,
    name:     'Apartment Rent — April',
    date:     '2026-04-02',
    amount:   18500,
    type:     'expense',
    category: 'Rent',
  },
  {
    id: 19,
    name:     'DMart Weekly Groceries',
    date:     '2026-04-02',
    amount:   2780,
    type:     'expense',
    category: 'Groceries',
  },
  {
    id: 20,
    name:     'HPCL Petrol Fill-up',
    date:     '2026-04-03',
    amount:   2500,
    type:     'expense',
    category: 'Fuel',
  },
  {
    id: 21,
    name:     'Zomato Lunch',
    date:     '2026-04-03',
    amount:   520,
    type:     'expense',
    category: 'Dining',
  },
  {
    id: 22,
    name:     'Spotify Premium',
    date:     '2026-04-04',
    amount:   119,
    type:     'expense',
    category: 'Subscriptions',
  },
  {
    id: 23,
    name:     'Freelance Content Writing',
    date:     '2026-04-04',
    amount:   8500,
    type:     'income',
    category: 'Freelance',
  },
  {
    id: 24,
    name:     'OnePlus Nord 4 Purchase',
    date:     '2026-04-05',
    amount:   27999,
    type:     'expense',
    category: 'Electronics',
  },
  {
    id: 25,
    name:     'NAMMA Metro Pass — Monthly',
    date:     '2026-04-05',
    amount:   850,
    type:     'expense',
    category: 'Transport',
  },
  {
    id: 26,
    name:     'Mutual Fund SIP — Axis Bluechip',
    date:     '2026-04-05',
    amount:   5000,
    type:     'expense',
    category: 'Investment',
  },
  {
    id: 27,
    name:     'Dr. Mehta Consultation Fee',
    date:     '2026-04-05',
    amount:   800,
    type:     'expense',
    category: 'Health',
  },
  {
    id: 28,
    name:     'BSNL Broadband — April',
    date:     '2026-04-05',
    amount:   999,
    type:     'expense',
    category: 'Internet',
  },
  {
    id: 29,
    name:     'Myntra Sale — Shoes',
    date:     '2026-04-05',
    amount:   1899,
    type:     'expense',
    category: 'Shopping',
  },
  {
    id: 30,
    name:     'Parking Fine — MG Road',
    date:     '2026-04-05',
    amount:   500,
    type:     'expense',
    category: 'Miscellaneous',
  },
]

// ── Derived helpers ───────────────────────────────────────────────────────────

/** Total income across all transactions */
export const totalIncome = TRANSACTIONS
  .filter((t) => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0)

/** Total expenses across all transactions */
export const totalExpenses = TRANSACTIONS
  .filter((t) => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0)

/** Net balance */
export const netBalance = totalIncome - totalExpenses

/**
 * Spending grouped by category — useful for Doughnut / Pie charts.
 * Returns: [{ category, total }] sorted descending by total
 */
export const spendingByCategory = Object.entries(
  TRANSACTIONS
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})
).map(([category, total]) => ({ category, total }))
  .sort((a, b) => b.total - a.total)
