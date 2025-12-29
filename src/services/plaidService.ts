import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import {
  createPlaidItem,
  getPlaidItems,
  getPlaidItemByItemId,
  upsertAccounts,
  upsertTransactions,
  getCurrentUser,
} from './supabaseService';

export interface PlaidConfig {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

/**
 * Generate a Plaid Link token from the backend
 */
export const generateLinkToken = async (): Promise<string> => {
  try {
    // Get current user from Supabase
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to connect bank account');
    }

    const url = `${API_BASE_URL}/plaid/create-link-token`;
    console.log('🌐 Requesting link token from:', url);
    
    const response = await axios.post(url, {
      userId: user.id,
    }, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success && response.data.link_token) {
      console.log('✅ Link token received successfully');
      return response.data.link_token;
    }

    throw new Error(response.data.error || 'Failed to generate link token');
  } catch (error: any) {
    console.error('❌ Error generating link token:', error);
    console.error('📡 API URL was:', `${API_BASE_URL}/plaid/create-link-token`);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - check if backend server is running');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      const platform = require('react-native').Platform.OS;
      let helpMessage = `Cannot connect to backend at ${API_BASE_URL}.`;
      
      if (platform === 'ios' || platform === 'android') {
        helpMessage += `\n\nIf you're on a physical device, you need to use your computer's IP address instead of localhost.`;
        helpMessage += `\n\n1. Find your computer's IP: ifconfig | grep "inet "`;
        helpMessage += `\n2. Update src/utils/constants.ts line 40:`;
        helpMessage += `\n   export const API_BASE_URL = 'http://YOUR_IP:3000/api';`;
      } else {
        helpMessage += `\n\nMake sure:`;
        helpMessage += `\n1. Backend server is running (cd server && npm run dev)`;
        helpMessage += `\n2. The URL is correct for your platform`;
      }
      
      throw new Error(helpMessage);
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'Failed to generate link token');
    }
    
    throw new Error(error.message || 'Failed to generate link token');
  }
};

/**
 * Exchange public token for access token via backend and store in Supabase
 */
export const exchangePublicToken = async (
  publicToken: string,
  institutionName?: string,
  institutionId?: string
): Promise<{ accessToken: string; itemId: string; plaidItemId: string }> => {
  try {
    // Get current user from Supabase
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to connect bank account');
    }

    const response = await axios.post(`${API_BASE_URL}/plaid/exchange-token`, {
      public_token: publicToken,
    });

    if (response.data.success && response.data.access_token && response.data.item_id) {
      const { access_token, item_id } = response.data;

      // Check if this Plaid item already exists for this user
      const existingItem = await getPlaidItemByItemId(user.id, item_id);

      let plaidItemId: string;

      if (existingItem.data) {
        // Update existing item
        const { updatePlaidItem } = await import('./supabaseService');
        const { data: updatedItem, error: updateError } = await updatePlaidItem(existingItem.data.id, {
          access_token: access_token,
          institution_id: institutionId || existingItem.data.institution_id,
          institution_name: institutionName || existingItem.data.institution_name,
        });

        if (updateError) {
          throw new Error(`Failed to update Plaid item: ${updateError.message}`);
        }

        plaidItemId = updatedItem!.id;
      } else {
        // Create new Plaid item in Supabase
        const { data: newItem, error: createError } = await createPlaidItem({
          user_id: user.id,
          item_id: item_id,
          access_token: access_token,
          institution_id: institutionId || null,
          institution_name: institutionName || null,
        });

        if (createError) {
          throw new Error(`Failed to save Plaid item: ${createError.message}`);
        }

        plaidItemId = newItem!.id;
      }

      console.log('✅ Plaid item saved to Supabase:', plaidItemId);
      
      return {
        accessToken: access_token,
        itemId: item_id,
        plaidItemId,
      };
    }

    throw new Error(response.data.error || 'Failed to exchange token');
  } catch (error: any) {
    console.error('Error exchanging public token:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || 'Failed to exchange token');
    }
    throw new Error(error.message || 'Failed to exchange token');
  }
};

/**
 * Fetch transactions from Plaid via backend and sync to Supabase
 */
export const fetchTransactions = async (
  accessToken: string,
  plaidItemId: string,
  startDate: Date,
  endDate: Date,
  syncToSupabase: boolean = true
): Promise<any[]> => {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated');
    }

    // Format dates as YYYY-MM-DD
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const response = await axios.post(`${API_BASE_URL}/plaid/transactions`, {
      access_token: accessToken,
      start_date: startDateStr,
      end_date: endDateStr,
    });

    if (response.data.success && Array.isArray(response.data.transactions)) {
      const transactions = response.data.transactions;

      // Sync transactions to Supabase if requested
      if (syncToSupabase && transactions.length > 0) {
        await syncTransactionsToSupabase(transactions, plaidItemId, user.id);
      }

      return transactions;
    }

    throw new Error(response.data.error || 'Failed to fetch transactions');
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || 'Failed to fetch transactions');
    }
    throw new Error(error.message || 'Failed to fetch transactions');
  }
};

/**
 * Sync transactions from Plaid to Supabase
 */
const syncTransactionsToSupabase = async (
  plaidTransactions: any[],
  plaidItemId: string,
  userId: string
): Promise<void> => {
  try {
    // Get accounts for this Plaid item to map account_id
    const { getAccounts } = await import('./supabaseService');
    const { data: accounts } = await getAccounts(plaidItemId);
    const accountMap = new Map(accounts?.map(acc => [acc.account_id, acc.id]) || []);

    // Transform Plaid transactions to Supabase format
    const transactionsToUpsert = plaidTransactions.map((txn: any) => ({
      user_id: userId,
      plaid_item_id: plaidItemId,
      account_id: accountMap.get(txn.account_id) || null,
      transaction_id: txn.transaction_id,
      amount: parseFloat(txn.amount.toString()),
      date: txn.date,
      authorized_date: txn.authorized_date || null,
      merchant_name: txn.merchant_name || null,
      name: txn.name || null,
      category: txn.category?.[0] || null,
      category_id: txn.category_id || null,
      personal_finance_category: txn.personal_finance_category || null,
      location: txn.location || null,
      payment_meta: txn.payment_meta || null,
      pending: txn.pending || false,
      iso_currency_code: txn.iso_currency_code || 'USD',
    }));

    // Upsert transactions in batches (Supabase has a limit)
    const batchSize = 100;
    for (let i = 0; i < transactionsToUpsert.length; i += batchSize) {
      const batch = transactionsToUpsert.slice(i, i + batchSize);
      const { error } = await upsertTransactions(batch);
      
      if (error) {
        console.error(`Error syncing transaction batch ${i / batchSize + 1}:`, error);
        // Continue with other batches even if one fails
      }
    }

    console.log(`✅ Synced ${transactionsToUpsert.length} transactions to Supabase`);
  } catch (error) {
    console.error('Error syncing transactions to Supabase:', error);
    // Don't throw - we still want to return the transactions even if sync fails
  }
};

/**
 * Get accounts from Plaid via backend and sync to Supabase
 */
export const fetchAccounts = async (
  accessToken: string,
  plaidItemId: string,
  syncToSupabase: boolean = true
): Promise<any[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/plaid/accounts`, {
      access_token: accessToken,
    });

    if (response.data.success && Array.isArray(response.data.accounts)) {
      const accounts = response.data.accounts;

      // Sync accounts to Supabase if requested
      if (syncToSupabase && accounts.length > 0) {
        await syncAccountsToSupabase(accounts, plaidItemId);
      }

      return accounts;
    }

    throw new Error(response.data.error || 'Failed to fetch accounts');
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || 'Failed to fetch accounts');
    }
    throw new Error(error.message || 'Failed to fetch accounts');
  }
};

/**
 * Sync accounts from Plaid to Supabase
 */
const syncAccountsToSupabase = async (
  plaidAccounts: any[],
  plaidItemId: string
): Promise<void> => {
  try {
    // Transform Plaid accounts to Supabase format
    const accountsToUpsert = plaidAccounts.map((acc: any) => ({
      plaid_item_id: plaidItemId,
      account_id: acc.account_id,
      name: acc.name,
      official_name: acc.official_name || null,
      type: acc.type || null,
      subtype: acc.subtype || null,
      mask: acc.mask || null,
      balance_current: acc.balances?.current ? parseFloat(acc.balances.current.toString()) : null,
      balance_available: acc.balances?.available ? parseFloat(acc.balances.available.toString()) : null,
      balance_limit: acc.balances?.limit ? parseFloat(acc.balances.limit.toString()) : null,
      currency_code: acc.balances?.iso_currency_code || 'USD',
    }));

    const { error } = await upsertAccounts(accountsToUpsert);
    
    if (error) {
      console.error('Error syncing accounts to Supabase:', error);
      throw error;
    }

    console.log(`✅ Synced ${accountsToUpsert.length} accounts to Supabase`);
  } catch (error) {
    console.error('Error syncing accounts to Supabase:', error);
    // Don't throw - we still want to return the accounts even if sync fails
  }
};
