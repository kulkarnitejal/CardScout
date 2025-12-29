import { supabase } from '../config/supabase';
import type { Database } from '../config/supabase';

type PlaidItem = Database['public']['Tables']['plaid_items']['Row'];
type PlaidItemInsert = Database['public']['Tables']['plaid_items']['Insert'];
type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

// ============================================
// Authentication
// ============================================

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// ============================================
// Plaid Items
// ============================================

export const createPlaidItem = async (itemData: PlaidItemInsert) => {
  const { data, error } = await supabase
    .from('plaid_items')
    .insert(itemData)
    .select()
    .single();
  return { data, error };
};

export const getPlaidItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('plaid_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getPlaidItem = async (itemId: string) => {
  const { data, error } = await supabase
    .from('plaid_items')
    .select('*')
    .eq('id', itemId)
    .single();
  return { data, error };
};

export const getPlaidItemByItemId = async (userId: string, plaidItemId: string) => {
  const { data, error } = await supabase
    .from('plaid_items')
    .select('*')
    .eq('user_id', userId)
    .eq('item_id', plaidItemId)
    .single();
  return { data, error };
};

export const updatePlaidItem = async (id: string, updates: Partial<PlaidItemInsert>) => {
  const { data, error } = await supabase
    .from('plaid_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deletePlaidItem = async (id: string) => {
  const { error } = await supabase
    .from('plaid_items')
    .delete()
    .eq('id', id);
  return { error };
};

// ============================================
// Accounts
// ============================================

export const upsertAccounts = async (accounts: AccountInsert[]) => {
  const { data, error } = await supabase
    .from('accounts')
    .upsert(accounts, { onConflict: 'plaid_item_id,account_id' })
    .select();
  return { data, error };
};

export const getAccounts = async (plaidItemId: string) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('plaid_item_id', plaidItemId)
    .order('name');
  return { data, error };
};

export const updateAccount = async (id: string, updates: Partial<AccountInsert>) => {
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// ============================================
// Transactions
// ============================================

export const upsertTransactions = async (transactions: TransactionInsert[]) => {
  const { data, error } = await supabase
    .from('transactions')
    .upsert(transactions, { onConflict: 'plaid_item_id,transaction_id' })
    .select();
  return { data, error };
};

export const getTransactions = async (
  userId: string,
  options?: {
    plaidItemId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
) => {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (options?.plaidItemId) {
    query = query.eq('plaid_item_id', options.plaidItemId);
  }

  if (options?.startDate) {
    query = query.gte('date', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('date', options.endDate);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getTransactionsByMerchant = async (
  userId: string,
  merchantName: string
) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .ilike('merchant_name', `%${merchantName}%`)
    .order('date', { ascending: false });
  return { data, error };
};

export const deleteTransactions = async (plaidItemId: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('plaid_item_id', plaidItemId);
  return { error };
};

