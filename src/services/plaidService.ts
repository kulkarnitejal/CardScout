import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { savePlaidAccessToken } from './storageService';

export interface PlaidConfig {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

/**
 * Generate a Plaid Link token from the backend
 */
export const generateLinkToken = async (userId?: string): Promise<string> => {
  try {
    const url = `${API_BASE_URL}/plaid/create-link-token`;
    console.log('🌐 Requesting link token from:', url);
    
    const response = await axios.post(url, {
      userId: userId || 'default-user-id',
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
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Make sure the server is running and the URL is correct for your platform.`);
    }
    
    if (error.response) {
      throw new Error(error.response.data?.error || 'Failed to generate link token');
    }
    
    throw new Error(error.message || 'Failed to generate link token');
  }
};

/**
 * Exchange public token for access token via backend
 */
export const exchangePublicToken = async (publicToken: string): Promise<{ accessToken: string; itemId: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/plaid/exchange-token`, {
      public_token: publicToken,
    });

    if (response.data.success && response.data.access_token && response.data.item_id) {
      // Store the access token securely
      await savePlaidAccessToken(response.data.access_token, response.data.item_id);
      
      return {
        accessToken: response.data.access_token,
        itemId: response.data.item_id,
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
 * Fetch transactions from Plaid via backend
 */
export const fetchTransactions = async (
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<any[]> => {
  try {
    // Format dates as YYYY-MM-DD
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const response = await axios.post(`${API_BASE_URL}/plaid/transactions`, {
      access_token: accessToken,
      start_date: startDateStr,
      end_date: endDateStr,
    });

    if (response.data.success && Array.isArray(response.data.transactions)) {
      return response.data.transactions;
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
 * Get accounts from Plaid via backend
 */
export const fetchAccounts = async (accessToken: string): Promise<any[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/plaid/accounts`, {
      access_token: accessToken,
    });

    if (response.data.success && Array.isArray(response.data.accounts)) {
      return response.data.accounts;
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
