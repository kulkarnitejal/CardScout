import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Transaction } from '../types';
import { loadTransactions, loadOrGenerateTransactions, regenerateTransactions } from '../services/storageService';
import { TransactionCard } from '../components/TransactionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { COLORS, FONTS } from '../utils/constants';

export const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Use loadOrGenerateTransactions to ensure we have transactions with current merchants
      const loadedTransactions = await loadOrGenerateTransactions(100);
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Regenerate transactions to get fresh data with current merchants
    try {
      const newTransactions = await regenerateTransactions(100);
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error regenerating transactions:', error);
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
  listContent: {
    paddingVertical: 8,
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
});

