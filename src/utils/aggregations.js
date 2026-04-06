/**
 * Group Transactions by Month
 * Returns: { "2026-04": { income: 5000, expense: 2000, count: 5 } }
 */
export const groupByMonth = (transactions) => {
  return transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7)
    if (!acc[month]) acc[month] = { income: 0, expense: 0, count: 0 }
    acc[month][t.type] += t.amount
    acc[month].count++
    return acc
  }, {})
}

/**
 * Group Transactions by Category for a specific type
 * Returns: { "Food": 150, "Rent": 2000 }
 */
export const groupByCategory = (transactions, type = 'expense') => {
  const filtered = type === 'all' ? transactions : transactions.filter(t => t.type === type)
  return filtered.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})
}

/**
 * Calculate Financial Totals
 * Returns: { inflow, outflow, net }
 */
export const calculateTotals = (transactions) => {
  const inflow  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const outflow = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return { inflow, outflow, net: inflow - outflow }
}

/**
 * Derived Financial Insights
 */
export const getFinancialInsights = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense')
  const monthly  = groupByMonth(transactions)
  const monEntries = Object.entries(monthly)

  const topCategory = Object.entries(groupByCategory(transactions, 'expense'))
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const bestMonth = monEntries
    .map(([mon, v]) => ({ mon, savings: v.income - v.expense }))
    .sort((a, b) => b.savings - a.savings)[0]?.mon || 'N/A'
    
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const avgMonthlySpend = totalExpense / (monEntries.length || 1)
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map(t => t.amount)) : 0

  return {
    topCategory,
    bestMonth: bestMonth !== 'N/A' ? new Date(bestMonth).toLocaleString('en-IN', { month: 'long' }) : 'N/A',
    avgMonthlySpend,
    largestExpense
  }
}
