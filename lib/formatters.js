export const formatINR = (amount, decimals = 2) => {
  return '₹' + Number(Math.abs(amount)).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatShortINR = (amount) => {
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'cr';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'k';
  return '₹' + amount;
};

export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
};

export const formatMonth = (monthString) => {
  const [year, month] = monthString.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
};
