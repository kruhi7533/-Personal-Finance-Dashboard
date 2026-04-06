/** 
 * Standard INR Currency Formatter 
 * Example: 27999 -> ₹27,999.00
 */
export const formatINR = (amount, decimals = 2) => {
  return '₹' + Number(Math.abs(amount)).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** 
 * Short Currency Formatter for Charts 
 * Example: 1000 -> ₹1k
 */
export const formatShortINR = (amount) => {
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'cr'
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L'
  if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'k'
  return '₹' + amount
}

/** 
 * Standard Date Formatter 
 * Example: "2026-04-05" -> "05 Apr 2026"
 */
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options
  })
}

/** 
 * Long Month Formatter 
 * Example: "2026-04" -> "April 2026"
 */
export const formatMonth = (monthString) => {
  const [year, month] = monthString.split('-')
  const date = new Date(year, month - 1)
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' })
}
