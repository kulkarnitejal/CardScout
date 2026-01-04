export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(0)}%`;
};

/**
 * Calculate discount percent from available amount and price
 * Formula: (availableAmount - price) / availableAmount * 100
 */
export const calculateDiscountPercent = (availableAmount: number, price: number): number => {
  if (availableAmount <= 0) {
    return 0;
  }
  return Math.round(((availableAmount - price) / availableAmount) * 100 * 100) / 100;
};

