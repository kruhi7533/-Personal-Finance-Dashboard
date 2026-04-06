/**
 * Generic CSV Exporting Utility
 */
export const exportTransactionsToCSV = (transactions, filename = `transactions_${new Date().toISOString().slice(0, 10)}.csv`) => {
  if (!transactions || transactions.length === 0) return

  const headers = ['Name', 'Date', 'Category', 'Type', 'Amount']
  const rows = transactions.map(t => [
    t.name,
    t.date,
    t.category,
    t.type,
    t.amount
  ])

  const csvContent = [headers, ...rows]
    .map(e => e.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
