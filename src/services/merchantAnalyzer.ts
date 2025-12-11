import { Transaction, Merchant } from '../types';
import { getLast30DaysTransactions } from './transactionService';

export const analyzeMerchants = (transactions: Transaction[]): Merchant[] => {
  const merchantMap = new Map<string, {
    transactions: Transaction[];
    totalSpent: number;
    category: string;
  }>();

  // Group transactions by merchant
  transactions.forEach((txn) => {
    const key = txn.merchant.toLowerCase();
    if (!merchantMap.has(key)) {
      merchantMap.set(key, {
        transactions: [],
        totalSpent: 0,
        category: txn.category,
      });
    }
    const merchant = merchantMap.get(key)!;
    merchant.transactions.push(txn);
    merchant.totalSpent += txn.amount;
  });

  // Convert to Merchant array
  const merchants: Merchant[] = [];
  merchantMap.forEach((data, merchantName) => {
    const sortedTransactions = data.transactions.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    
    merchants.push({
      name: data.transactions[0].merchant, // Use original casing
      category: data.category,
      totalSpent: Math.round(data.totalSpent * 100) / 100,
      transactionCount: data.transactions.length,
      averageTransaction: Math.round((data.totalSpent / data.transactions.length) * 100) / 100,
      lastTransactionDate: sortedTransactions[0].date,
    });
  });

  // Sort by total spent (descending)
  return merchants.sort((a, b) => b.totalSpent - a.totalSpent);
};

export const getTopMerchants = (
  merchants: Merchant[],
  limit: number = 10
): Merchant[] => {
  return merchants.slice(0, limit);
};

export const calculateMonthlySpending = (
  transactions: Transaction[],
  merchantName: string
): number => {
  const last30Days = getLast30DaysTransactions(transactions);
  const merchantTransactions = last30Days.filter(
    (txn) => txn.merchant.toLowerCase() === merchantName.toLowerCase()
  );
  
  const total = merchantTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  return Math.round(total * 100) / 100;
};

