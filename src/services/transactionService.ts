import { Transaction } from '../types';

export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter(
    (txn) => txn.date >= startDate && txn.date <= endDate
  );
};

export const getTransactionsByMerchant = (
  transactions: Transaction[],
  merchantName: string
): Transaction[] => {
  return transactions.filter(
    (txn) => txn.merchant.toLowerCase() === merchantName.toLowerCase()
  );
};

export const getLast30DaysTransactions = (transactions: Transaction[]): Transaction[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  return filterTransactionsByDateRange(transactions, startDate, endDate);
};

export const getLast90DaysTransactions = (transactions: Transaction[]): Transaction[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  return filterTransactionsByDateRange(transactions, startDate, endDate);
};

