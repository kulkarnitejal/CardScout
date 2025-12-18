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
} from 'react-native';
import { Transaction } from '../types';
import { loadTransactions } from '../services/storageService';
import { TransactionCard } from '../components/TransactionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { COLORS, FONTS } from '../utils/constants';

export const PlaidConnectScreen: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const loadedTransactions = await loadTransactions();
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleConnect = async () => {
    setConnecting(true);
    
    // TODO: Implement Plaid Link integration
    // This requires:
    // 1. Backend server to generate link tokens
    // 2. react-native-plaid-link-sdk implementation
    // 3. Token exchange and transaction fetching
    
    setTimeout(() => {
      setConnecting(false);
      Alert.alert(
        'Coming Soon',
        'Plaid integration requires a backend server. For now, the app uses mock transaction data. Check the documentation for backend setup instructions.',
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  const hasConnectedAccounts = transactions.length > 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show connect flow if no accounts connected
  if (!hasConnectedAccounts) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>
            Connect your bank to view transactions
          </Text>
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
      </View>
    );
  }

  // Show transactions if accounts are connected
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.subtitle}>
          {transactions.length} total transactions
        </Text>
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
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
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

