import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { supabaseAdmin, supabaseClient } from '../config/supabase.config';

/**
 * Delete user account and all associated data
 * This endpoint:
 * 1. Deletes all user data (transactions, accounts, plaid_items)
 * 2. Deletes the user from auth.users using admin client
 */
export const deleteUserAccount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    if (!supabaseAdmin) {
      res.status(500).json({
        success: false,
        error: 'Supabase admin client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.',
      });
      return;
    }

    console.log('🗑️ Starting account deletion for user:', userId);

    // Step 1: Get all plaid_items for this user
    const { data: plaidItems, error: plaidItemsError } = await supabaseAdmin
      .from('plaid_items')
      .select('*')
      .eq('user_id', userId);

    if (plaidItemsError) {
      console.error('❌ Error fetching plaid_items:', plaidItemsError);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user data',
      });
      return;
    }

    // Step 2: Delete all accounts for each plaid_item
    if (plaidItems && plaidItems.length > 0) {
      for (const item of plaidItems) {
        const { error: accountsError } = await supabaseAdmin
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
    const { error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('user_id', userId);

    if (transactionsError) {
      console.error('❌ Error deleting transactions:', transactionsError);
      res.status(500).json({
        success: false,
        error: 'Failed to delete transactions',
      });
      return;
    }

    // Step 4: Delete all plaid_items for this user
    const { error: plaidItemsDeleteError } = await supabaseAdmin
      .from('plaid_items')
      .delete()
      .eq('user_id', userId);

    if (plaidItemsDeleteError) {
      console.error('❌ Error deleting plaid_items:', plaidItemsDeleteError);
      res.status(500).json({
        success: false,
        error: 'Failed to delete plaid items',
      });
      return;
    }

    // Step 5: Delete the user from auth.users using admin client
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error('❌ Error deleting user from auth:', deleteUserError);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user account',
      });
      return;
    }

    console.log('✅ Account deletion completed successfully for user:', userId);

    res.json({
      success: true,
      message: 'Account and all associated data deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Error during account deletion:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete account',
    });
  }
};

