import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const TRANSACTIONS_KEY = '@giftcardmaxing:transactions';

export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(transactions.map(txn => ({
      ...txn,
      date: txn.date.toISOString(),
    })));
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving transactions:', error);
    throw error;
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    if (jsonValue == null) {
      return [];
    }
    const data = JSON.parse(jsonValue);
    return data.map((txn: any) => ({
      ...txn,
      date: new Date(txn.date),
    }));
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const clearTransactions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
  } catch (error) {
    console.error('Error clearing transactions:', error);
    throw error;
  }
};

