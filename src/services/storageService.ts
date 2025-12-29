import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { generateMockTransactions } from './mockTransactions';
import { getAllGiftCards } from './mockGiftCards';

const TRANSACTIONS_KEY = '@giftcardmaxing:transactions';
const PLAID_ACCESS_TOKEN_KEY = '@giftcardmaxing:plaid_access_token';
const PLAID_ITEM_ID_KEY = '@giftcardmaxing:plaid_item_id';

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

/**
 * Regenerate and save mock transactions with current gift card merchants
 * This will clear existing transactions and generate new ones
 */
export const regenerateTransactions = async (count: number = 100): Promise<Transaction[]> => {
  try {
    // Clear existing transactions
    await clearTransactions();
    
    // Generate new transactions with current merchants from gift cards
    const newTransactions = generateMockTransactions(count);
    
    // Save the new transactions
    await saveTransactions(newTransactions);
    
    return newTransactions;
  } catch (error) {
    console.error('Error regenerating transactions:', error);
    throw error;
  }
};

/**
 * Check if transactions contain merchants that don't match current gift cards
 */
const shouldRegenerateTransactions = (transactions: Transaction[]): boolean => {
  if (transactions.length === 0) return true;
  
  const giftCards = getAllGiftCards();
  const validMerchants = new Set(
    giftCards.map(card => card.merchant.toLowerCase())
  );
  
  // Check if any transaction has a merchant not in current gift cards
  const hasInvalidMerchant = transactions.some(txn => {
    const merchantLower = txn.merchant.toLowerCase();
    return !validMerchants.has(merchantLower);
  });
  
  return hasInvalidMerchant;
};

/**
 * Load transactions, or generate new ones if none exist or merchants are outdated
 */
export const loadOrGenerateTransactions = async (count: number = 100): Promise<Transaction[]> => {
  try {
    const existingTransactions = await loadTransactions();
    
    // If no transactions exist, generate new ones
    if (existingTransactions.length === 0) {
      console.log('No transactions found, generating new ones...');
      return await regenerateTransactions(count);
    }
    
    // Check if transactions need to be regenerated due to outdated merchants
    if (shouldRegenerateTransactions(existingTransactions)) {
      console.log('Transactions contain outdated merchants, regenerating...');
      return await regenerateTransactions(count);
    }
    
    return existingTransactions;
  } catch (error) {
    console.error('Error loading or generating transactions:', error);
    // Fallback: try to generate new transactions
    try {
      return await regenerateTransactions(count);
    } catch (genError) {
      console.error('Error generating fallback transactions:', genError);
      return [];
    }
  }
};

// Plaid token storage
export const savePlaidAccessToken = async (accessToken: string, itemId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PLAID_ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(PLAID_ITEM_ID_KEY, itemId);
  } catch (error) {
    console.error('Error saving Plaid access token:', error);
    throw error;
  }
};

export const getPlaidAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PLAID_ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting Plaid access token:', error);
    return null;
  }
};

export const clearPlaidTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PLAID_ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(PLAID_ITEM_ID_KEY);
  } catch (error) {
    console.error('Error clearing Plaid tokens:', error);
    throw error;
  }
};

export const hasPlaidAccessToken = async (): Promise<boolean> => {
  const token = await getPlaidAccessToken();
  return token !== null;
};

