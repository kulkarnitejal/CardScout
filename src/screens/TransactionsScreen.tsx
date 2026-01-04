import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Transaction } from '../types';
import { TransactionCard } from '../components/TransactionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { COLORS, FONTS } from '../utils/constants';
import { getCurrentUser, getTransactions } from '../services/supabaseService';
import { MenuModal } from '../components/MenuModal';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        console.log('No user logged in, cannot load transactions');
        setTransactions([]);
        return;
      }

      // Load transactions from Supabase (last 90 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);

      const { data: supabaseTransactions, error } = await getTransactions(user.id, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        limit: 500,
      });

      if (error) {
        console.error('Error loading transactions from Supabase:', error);
        setTransactions([]);
        return;
      }

      if (!supabaseTransactions || supabaseTransactions.length === 0) {
        console.log('No transactions found in Supabase');
        setTransactions([]);
        return;
      }

      // Convert Supabase transactions to our Transaction format
      const formattedTransactions: Transaction[] = supabaseTransactions.map((txn: any) => ({
        id: txn.transaction_id,
        date: new Date(txn.date),
        merchant: txn.merchant_name || txn.name || 'Unknown',
        amount: Math.abs(txn.amount),
        category: txn.category.replaceAll(/_/g, " ") || txn.personal_finance_category?.primary || 'Other',
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              Connect your bank account to see your transactions here.
            </Text>
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
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

