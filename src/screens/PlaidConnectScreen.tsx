import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import { create, open, destroy, LinkSuccess, LinkExit, LinkTokenConfiguration } from 'react-native-plaid-link-sdk';
import { Transaction } from '../types';
import { TransactionCard } from '../components/TransactionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { COLORS, FONTS } from '../utils/constants';
import { generateLinkToken, exchangePublicToken, fetchTransactions, fetchAccounts } from '../services/plaidService';
import { getPlaidItems, getTransactions, getCurrentUser } from '../services/supabaseService';
import { MenuModal } from '../components/MenuModal';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const PlaidConnectScreen: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
    loadData();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setHasConnected(false);
        return;
      }

      const { data: plaidItems } = await getPlaidItems(user.id);
      setHasConnected(!!(plaidItems && plaidItems.length > 0));
    } catch (error) {
      console.error('Error checking connection status:', error);
      setHasConnected(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        // No user logged in, no transactions to show
        setTransactions([]);
        return;
      }

      // Check if user has connected Plaid items
      const { data: plaidItems } = await getPlaidItems(user.id);
      
      if (plaidItems && plaidItems.length > 0) {
        // Load transactions from Supabase
        await loadTransactionsFromSupabase(user.id);
      } else {
        // No Plaid connection, no transactions to show
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactionsFromSupabase = async (userId: string) => {
    try {
      // Get transactions from Supabase (last 90 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);

      const { data: supabaseTransactions, error } = await getTransactions(userId, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        limit: 500, // Limit to recent transactions
      });

      if (error) {
        console.error('Error loading transactions from Supabase:', error);
        throw error;
      }

      if (supabaseTransactions && supabaseTransactions.length > 0) {
        // Convert Supabase transactions to our Transaction format
        const formattedTransactions: Transaction[] = supabaseTransactions.map((txn: any) => ({
          id: txn.transaction_id,
          date: new Date(txn.date),
          merchant: txn.merchant_name || txn.name || 'Unknown',
          amount: Math.abs(txn.amount),
          category: txn.category || txn.personal_finance_category?.primary || 'Other',
        }));

        setTransactions(formattedTransactions);
      } else {
        // No transactions in Supabase yet
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions from Supabase:', error);
      setTransactions([]);
    }
  };

  const loadPlaidTransactions = async (accessToken: string, plaidItemId: string) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90); // Last 90 days

      // Fetch transactions from Plaid and sync to Supabase
      const plaidTransactions = await fetchTransactions(accessToken, plaidItemId, startDate, endDate, true);
      
      // Convert Plaid transactions to our Transaction format
      const formattedTransactions: Transaction[] = plaidTransactions.map((txn: any) => ({
        id: txn.transaction_id,
        date: new Date(txn.date),
        merchant: txn.merchant_name || txn.name || 'Unknown',
        amount: Math.abs(txn.amount),
        category: txn.category?.[0] || txn.personal_finance_category?.primary || 'Other',
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading Plaid transactions:', error);
      throw error;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      // Generate link token from backend
      console.log('🔄 Generating link token...');
      const token = await generateLinkToken();
      console.log('✅ Link token received:', token.substring(0, 20) + '...');
      
      // Create Plaid Link session
      const tokenConfig: LinkTokenConfiguration = {
        token: token,
        noLoadingState: false,
        onLoad: () => {
          console.log('✅ Plaid Link onLoad callback fired');
        },
      };
      
      console.log('🔧 Creating Plaid Link session...');
      create(tokenConfig);
      
      // Open Plaid Link after a short delay to ensure create() completes
      // According to Plaid docs, maximizing delay reduces latency
      console.log('🚀 Scheduling Plaid Link open...');
      setTimeout(() => {
        console.log('🚀 Opening Plaid Link now...');
        try {
          const openProps = {
            onSuccess: (success: LinkSuccess) => {
              console.log('✅ Plaid Link onSuccess called');
              handlePlaidSuccess(success);
            },
            onExit: (exit: LinkExit | null) => {
              console.log('🔚 Plaid Link onExit called');
              handlePlaidExit(exit);
            },
          };
          
          console.log('📞 Calling open() function...');
          open(openProps);
          console.log('✅ open() function called successfully');
        } catch (openError: any) {
          console.error('❌ Exception thrown when calling open():', openError);
          console.error('Error stack:', openError.stack);
          setConnecting(false);
          Alert.alert(
            'Error',
            openError.message || 'Failed to open Plaid Link. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }, 500); // Increased delay to ensure create() initializes properly
      
    } catch (error: any) {
      console.error('❌ Error in handleConnect:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setConnecting(false);
      Alert.alert(
        'Connection Error',
        error.message || 'Failed to initialize bank connection. Please check your backend server is running.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePlaidSuccess = async (success: LinkSuccess) => {
    try {
      setConnecting(true);
      
      // Get institution info from Plaid metadata if available
      const institutionName = success.metadata?.institution?.name;
      const institutionId = success.metadata?.institution?.id;
      
      // Exchange public token for access token and save to Supabase
      const { accessToken, itemId, plaidItemId } = await exchangePublicToken(
        success.publicToken,
        institutionName,
        institutionId
      );
      
      setHasConnected(true);
      
      // Clean up Plaid session
      await destroy();
      
      // Fetch and sync accounts to Supabase
      try {
        await fetchAccounts(accessToken, plaidItemId, true);
        console.log('✅ Accounts synced to Supabase');
      } catch (accountError) {
        console.error('Error syncing accounts:', accountError);
        // Continue even if account sync fails
      }
      
      // Load transactions from Plaid and sync to Supabase
      await loadPlaidTransactions(accessToken, plaidItemId);
      
      Alert.alert(
        'Success!',
        'Your bank account has been connected successfully.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to connect bank account. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setConnecting(false);
    }
  };

  const handlePlaidExit = (exit: LinkExit | null) => {
    setConnecting(false);
    
    if (exit?.error) {
      Alert.alert(
        'Connection Cancelled',
        exit.error.displayMessage || 'Bank connection was cancelled.',
        [{ text: 'OK' }]
      );
    }
  };

  const hasConnectedAccounts = hasConnected || transactions.length > 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show connect flow if no accounts connected
  if (!hasConnectedAccounts) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Transactions</Text>
            <View style={styles.menuButtonPlaceholder} />
          </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              1. Connect your bank account securely via Plaid{'\n'}
              2. We analyze your transaction history{'\n'}
              3. Get personalized gift card recommendations{'\n'}
              4. Save money on merchants you frequent
            </Text>
          </View>

          <View style={styles.securityCard}>
            <Text style={styles.securityTitle}>🔒 Bank-Level Security</Text>
            <Text style={styles.securityText}>
              Your financial data is encrypted and secure. We use Plaid, the same technology trusted by thousands of financial apps.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.connectButton, connecting && styles.connectButtonDisabled]}
            onPress={handleConnect}
            disabled={connecting}
          >
            <Text style={styles.connectButtonText}>
              {connecting ? 'Connecting...' : 'Connect Bank Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              Note: Plaid integration requires a backend server. Currently, the app uses mock transaction data for demonstration purposes.
            </Text>
          </View>
        </ScrollView>
        <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </View>
    );
  }

  // Show transactions if accounts are connected
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Transactions</Text>
            <View style={styles.menuButtonPlaceholder} />
          </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.connectNewAccountContainer}>
            <TouchableOpacity
              style={styles.connectNewButton}
              onPress={handleConnect}
              disabled={connecting}
            >
              <Text style={styles.connectNewButtonText}>
                {connecting ? 'Connecting...' : '+ Connect Another Account'}
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
      <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 2,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
    marginLeft: 4,
  },
  menuButtonPlaceholder: {
    width: 50,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for bottom navigation
  },
  listContent: {
    paddingVertical: 8,
  },
  connectNewAccountContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  connectNewButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  connectNewButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  securityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  securityTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  noteContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  noteText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

