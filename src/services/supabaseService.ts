import { supabase } from '../config/supabase';
import type { Database } from '../config/supabase';
import { calculateDiscountPercent } from '../utils/formatters';
import { API_BASE_URL } from '../utils/constants';

type PlaidItem = Database['public']['Tables']['plaid_items']['Row'];
type PlaidItemInsert = Database['public']['Tables']['plaid_items']['Insert'];
type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type GiftCard = Database['public']['Tables']['gift_cards']['Row'];
type GiftCardInsert = Database['public']['Tables']['gift_cards']['Insert'];

// ============================================
// Authentication
// ============================================

export const signUp = async (email: string, password: string) => {
  // Get the redirect URL for email confirmation
  // In production, this should be your app's deep link URL
  const redirectTo = __DEV__ 
    ? 'exp://localhost:8081/--/auth/callback' // Development
    : 'cardscout://auth/callback'; // Production - deep link to your app
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error.message);
      console.error('Error details:', {
        status: error.status,
        message: error.message,
      });
    } else {
      console.log('✅ Sign in successful');
    }
    
    return { data, error };
  } catch (err: any) {
    console.error('❌ Sign in exception:', err);
    console.error('Exception details:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    return { 
      data: null, 
      error: { 
        message: err.message || 'Network request failed',
        status: err.status || 500,
      } 
    };
  }
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

// ============================================
// Gift Cards
// ============================================

export const getAllGiftCards = async (options?: { activeOnly?: boolean }) => {
  let query = supabase
    .from('gift_cards')
    .select('*');

  if (options?.activeOnly !== false) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getGiftCardById = async (id: string) => {
  const { data, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  return { data, error };
};

export const getGiftCardByMerchant = async (merchantName: string) => {
  // Fetch gift cards and do exact match (case-insensitive) in memory
  // This is simpler and works well since we need to do fuzzy matching anyway
  const { data: allCards, error } = await getAllGiftCards({ activeOnly: true });
  
  if (error || !allCards) {
    return { data: null, error };
  }
  
  // Find all exact matches (case-insensitive) - there may be multiple sources
  const normalizedName = merchantName.toLowerCase().trim();
  const matches = allCards.filter(
    (card) => card.merchant.toLowerCase().trim() === normalizedName
  );
  
  if (matches.length === 0) {
    return { data: null, error: null };
  }
  
  // If multiple matches, return the one with the highest discount
  // Calculate discount for each and sort by discount (highest first)
  const matchesWithDiscount = matches.map((card) => {
    const discountPercent = calculateDiscountPercent(card.available_amount, card.price);
    return { card, discountPercent };
  });
  
  matchesWithDiscount.sort((a, b) => b.discountPercent - a.discountPercent);
  
  // Return the best deal (highest discount)
  return { data: matchesWithDiscount[0].card, error: null };
};

export const createGiftCard = async (giftCard: GiftCardInsert) => {
  const { data, error } = await supabase
    .from('gift_cards')
    .insert(giftCard)
    .select()
    .single();
  return { data, error };
};

export const upsertGiftCards = async (giftCards: GiftCardInsert[]) => {
  const { data, error } = await supabase
    .from('gift_cards')
    .upsert(giftCards, { onConflict: 'id' })
    .select();
  return { data, error };
};

export const updateGiftCard = async (id: string, updates: Partial<GiftCardInsert>) => {
  const { data, error } = await supabase
    .from('gift_cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteGiftCard = async (id: string) => {
  const { error } = await supabase
    .from('gift_cards')
    .delete()
    .eq('id', id);
  return { error };
};

// ============================================
// Account Deletion
// ============================================

/**
 * Deletes a user account and all associated data from Supabase.
 * This function calls the server endpoint which has admin privileges to:
 * - Delete all transactions
 * - Delete all accounts (linked to plaid_items)
 * - Delete all plaid_items
 * - Delete the user from auth.users (full deletion)
 * 
 * @param userId - The user ID to delete
 * @returns Object with error if deletion fails
 */
export const deleteUserAccount = async (userId: string) => {
  try {
    console.log('🗑️ Starting account deletion for user:', userId);

    // Get the current session to get the access token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('❌ Error getting session:', sessionError);
      return { 
        error: { 
          message: 'No active session. Please sign in again.',
          status: 401,
        } 
      };
    }

    // Try to call the server endpoint first (full deletion including auth.users)
    if (API_BASE_URL && API_BASE_URL !== '') {
      try {
        console.log('📡 Calling server endpoint for account deletion...');
        const response = await fetch(`${API_BASE_URL}/user/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('❌ Server endpoint error:', data);
          // Fall through to client-side deletion as fallback
        } else {
          console.log('✅ Account deleted successfully via server endpoint');
          // Sign out the user
          await supabase.auth.signOut();
          return { error: null };
        }
      } catch (serverError: any) {
        console.warn('⚠️ Server endpoint failed, falling back to client-side deletion:', serverError.message);
        // Fall through to client-side deletion as fallback
      }
    } else {
      console.warn('⚠️ API_BASE_URL not configured, using client-side deletion only');
    }

    // Fallback: Client-side deletion (deletes data but not auth.users)
    // This is used if server endpoint is not available or fails
    console.log('🔄 Using client-side deletion (data only, auth.users will remain)...');

    // Step 1: Get all plaid_items for this user
    const { data: plaidItems, error: plaidItemsError } = await getPlaidItems(userId);
    
    if (plaidItemsError) {
      console.error('❌ Error fetching plaid_items:', plaidItemsError);
      return { error: plaidItemsError };
    }

    // Step 2: Delete all accounts for each plaid_item
    if (plaidItems && plaidItems.length > 0) {
      for (const item of plaidItems) {
        const { error: accountsError } = await supabase
          .from('accounts')
          .delete()
          .eq('plaid_item_id', item.id);
        
        if (accountsError) {
          console.error('❌ Error deleting accounts for plaid_item:', item.id, accountsError);
          // Continue with deletion even if some accounts fail
        }
      }
    }

    // Step 3: Delete all transactions for this user
    const { error: transactionsError } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId);
    
    if (transactionsError) {
      console.error('❌ Error deleting transactions:', transactionsError);
      return { error: transactionsError };
    }

    // Step 4: Delete all plaid_items for this user
    const { error: plaidItemsDeleteError } = await supabase
      .from('plaid_items')
      .delete()
      .eq('user_id', userId);
    
    if (plaidItemsDeleteError) {
      console.error('❌ Error deleting plaid_items:', plaidItemsDeleteError);
      return { error: plaidItemsDeleteError };
    }

    // Step 5: Sign out the user to invalidate their session
    // Note: Without server endpoint, the user record in auth.users will remain
    await supabase.auth.signOut();

    console.log('✅ Account deletion completed (data deleted, auth.users record remains)');
    console.log('ℹ️ Note: For full deletion including auth.users, ensure server endpoint is configured.');
    return { error: null };
  } catch (error: any) {
    console.error('❌ Error during account deletion:', error);
    return { 
      error: { 
        message: error.message || 'Failed to delete account',
        status: 500,
      } 
    };
  }
};

