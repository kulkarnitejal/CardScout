import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Get Supabase credentials from environment or constants
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Log Supabase configuration (always log for debugging)
console.log('🔐 Supabase Config Check:', {
  hasUrl: !!SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY,
  urlLength: SUPABASE_URL.length,
  keyLength: SUPABASE_ANON_KEY.length,
  urlPreview: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 20)}...` : 'not set',
  isDev: __DEV__,
});

// Validate Supabase credentials
const isValidSupabaseConfig = SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== '' && 
  SUPABASE_ANON_KEY !== '' &&
  !SUPABASE_URL.includes('your-supabase') &&
  !SUPABASE_ANON_KEY.includes('your-supabase');

if (!isValidSupabaseConfig) {
  console.error('❌ Supabase credentials not configured!');
  console.error('URL:', SUPABASE_URL || 'NOT SET');
  console.error('Key:', SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in eas.json');
  
  if (!__DEV__) {
    console.error('⚠️ This will cause authentication to fail in production!');
  }
}

// Custom storage adapter using Expo SecureStore for secure token storage
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client with fallback for missing credentials
export const supabase = isValidSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

// Export validation flag
export const isSupabaseConfigured = isValidSupabaseConfig;

// Database types (you can generate these later with Supabase CLI)
export type Database = {
  public: {
    Tables: {
      plaid_items: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          access_token: string;
          institution_id: string | null;
          institution_name: string | null;
          webhook_url: string | null;
          error: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          access_token: string;
          institution_id?: string | null;
          institution_name?: string | null;
          webhook_url?: string | null;
          error?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          access_token?: string;
          institution_id?: string | null;
          institution_name?: string | null;
          webhook_url?: string | null;
          error?: any | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          plaid_item_id: string;
          account_id: string;
          name: string;
          official_name: string | null;
          type: string | null;
          subtype: string | null;
          mask: string | null;
          balance_current: number | null;
          balance_available: number | null;
          balance_limit: number | null;
          currency_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plaid_item_id: string;
          account_id: string;
          name: string;
          official_name?: string | null;
          type?: string | null;
          subtype?: string | null;
          mask?: string | null;
          balance_current?: number | null;
          balance_available?: number | null;
          balance_limit?: number | null;
          currency_code?: string | null;
        };
        Update: {
          id?: string;
          plaid_item_id?: string;
          account_id?: string;
          name?: string;
          official_name?: string | null;
          type?: string | null;
          subtype?: string | null;
          mask?: string | null;
          balance_current?: number | null;
          balance_available?: number | null;
          balance_limit?: number | null;
          currency_code?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          plaid_item_id: string;
          account_id: string | null;
          transaction_id: string;
          amount: number;
          date: string;
          authorized_date: string | null;
          merchant_name: string | null;
          name: string | null;
          category: string | null;
          category_id: string | null;
          personal_finance_category: any | null;
          location: any | null;
          payment_meta: any | null;
          pending: boolean | null;
          iso_currency_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plaid_item_id: string;
          account_id?: string | null;
          transaction_id: string;
          amount: number;
          date: string;
          authorized_date?: string | null;
          merchant_name?: string | null;
          name?: string | null;
          category?: string | null;
          category_id?: string | null;
          personal_finance_category?: any | null;
          location?: any | null;
          payment_meta?: any | null;
          pending?: boolean | null;
          iso_currency_code?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plaid_item_id?: string;
          account_id?: string | null;
          transaction_id?: string;
          amount?: number;
          date?: string;
          authorized_date?: string | null;
          merchant_name?: string | null;
          name?: string | null;
          category?: string | null;
          category_id?: string | null;
          personal_finance_category?: any | null;
          location?: any | null;
          payment_meta?: any | null;
          pending?: boolean | null;
          iso_currency_code?: string | null;
        };
      };
      gift_cards: {
        Row: {
          id: string;
          merchant: string;
          available_amount: number;
          price: number;
          source: string;
          source_link: string | null;
          category: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          merchant: string;
          available_amount: number;
          price: number;
          source: string;
          source_link?: string | null;
          category?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          merchant?: string;
          available_amount?: number;
          price?: number;
          source?: string;
          source_link?: string | null;
          category?: string | null;
          is_active?: boolean;
        };
      };
    };
  };
};

