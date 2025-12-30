import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Transaction, Recommendation } from '../types';
import { analyzeMerchants } from '../services/merchantAnalyzer';
import { generateRecommendations } from '../services/recommendationEngine';
import { RecommendationCard } from '../components/RecommendationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS } from '../utils/constants';
import { getCurrentUser } from '../services/supabaseService';
import { getTransactions } from '../services/supabaseService';

type RecommendationsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BackParamList, 'Benefits'>,
  StackNavigationProp<RootStackParamList>
>;

export const RecommendationsScreen: React.FC = () => {
  const navigation = useNavigation<RecommendationsScreenNavigationProp>();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
        setRecommendations([]);
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
        setRecommendations([]);
        return;
      }

      if (!supabaseTransactions || supabaseTransactions.length === 0) {
        console.log('No transactions found in Supabase');
        setRecommendations([]);
        return;
      }

      // Convert Supabase transactions to our Transaction format
      const transactions: Transaction[] = supabaseTransactions.map((txn: any) => ({
        id: txn.transaction_id,
        date: new Date(txn.date),
        merchant: txn.merchant_name || txn.name || 'Unknown',
        amount: Math.abs(txn.amount),
        category: txn.category || txn.personal_finance_category?.primary || 'Other',
      }));

      // Generate recommendations from real transactions
      const merchants = analyzeMerchants(transactions);
      const recs = generateRecommendations(merchants, transactions);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations([]);
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

  const totalAnnualSavings = recommendations.reduce(
    (sum, rec) => sum + rec.annualSavings,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deals for you</Text>
      </View>

      {recommendations.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Potential Annual Savings</Text>
          <Text style={styles.summaryValue}>
            ${totalAnnualSavings.toFixed(2)}
          </Text>
        </View>
      )}

      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecommendationCard
            recommendation={item}
            onPress={() =>
              navigation.navigate('GiftCardDetail', { recommendation: item })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No recommendations available yet.
            </Text>
            <Text style={styles.emptySubtext}>
              {recommendations.length === 0 && !loading
                ? 'Connect your bank account and make some transactions to get personalized gift card recommendations.'
                : 'Connect your bank account to analyze your spending and get personalized gift card recommendations.'}
            </Text>
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
    padding: 16,
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
  summaryCard: {
    backgroundColor: COLORS.success,
    margin: 16,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: '#fff',
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

