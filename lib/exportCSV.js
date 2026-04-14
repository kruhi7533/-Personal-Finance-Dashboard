/**
 * Generic CSV Exporting Utility
 */
export const exportTransactionsToCSV = (transactions, filename = `transactions_${new Date().toISOString().slice(0, 10)}.csv`) => {
  if (!transactions || transactions.length === 0) return

  const headers = ['Name', 'Date', 'Category', 'Type', 'Amount']
  
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const strValue = String(value);
    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
      return `"${strValue.replace(/"/g, '""')}"`;
    }
    return strValue;
  }

  const rows = transactions.map(t => [
    escapeCSV(t.name),
    escapeCSV(t.date),
    escapeCSV(t.category),
    escapeCSV(t.type),
    escapeCSV(t.amount)
  ])

  // prepend BOM for excel compatibility and proper utf-8 rendering
  const csvContent = '\uFEFF' + [headers.map(escapeCSV), ...rows]
    .map(e => e.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  
  link.style.position = 'absolute'
  link.style.left = '-9999px'
  document.body.appendChild(link)
  
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  link.dispatchEvent(clickEvt)
  
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 1000)
}
