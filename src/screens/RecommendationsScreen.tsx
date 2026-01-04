import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Transaction, Recommendation } from '../types';
import { analyzeMerchants } from '../services/merchantAnalyzer';
import { generateRecommendations, generateAllDeals } from '../services/recommendationEngine';
import { RecommendationCard } from '../components/RecommendationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SegmentedControl } from '../components/SegmentedControl';
import { SearchBar } from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS } from '../utils/constants';
import { getCurrentUser } from '../services/supabaseService';
import { getTransactions } from '../services/supabaseService';
import { MenuModal } from '../components/MenuModal';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

type RecommendationsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BackParamList, 'Benefits'>,
  StackNavigationProp<RootStackParamList>
>;

export const RecommendationsScreen: React.FC = () => {
  const navigation = useNavigation<RecommendationsScreenNavigationProp>();
  const [selectedSegment, setSelectedSegment] = useState(0); // 0 = "For You", 1 = "All Deals"
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Recommendation[]>([]);
  const [allDeals, setAllDeals] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadData();
    // Load all deals from Supabase
    loadAllDeals();
  }, []);

  const loadAllDeals = async () => {
    try {
      const deals = await generateAllDeals();
      setAllDeals(deals);
    } catch (error) {
      console.error('Error loading all deals:', error);
      setAllDeals([]);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        console.log('No user logged in, cannot load transactions');
        setPersonalizedRecommendations([]);
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
        setPersonalizedRecommendations([]);
        return;
      }

      if (!supabaseTransactions || supabaseTransactions.length === 0) {
        console.log('No transactions found in Supabase');
        setPersonalizedRecommendations([]);
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
      const recs = await generateRecommendations(merchants, transactions);
      setPersonalizedRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setPersonalizedRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filter recommendations based on search query
  const filterRecommendations = (recs: Recommendation[]): Recommendation[] => {
    if (!searchQuery.trim()) {
      return recs;
    }
    const query = searchQuery.toLowerCase().trim();
    return recs.filter((rec) => {
      const merchantName = rec.merchant.name.toLowerCase();
      // Only match if the query is actually contained in the merchant name
      return merchantName.includes(query);
    });
  };

  // Get current recommendations based on selected segment
  const currentRecommendations = useMemo(() => {
    const baseRecs = selectedSegment === 0 ? personalizedRecommendations : allDeals;
    return filterRecommendations(baseRecs);
  }, [selectedSegment, personalizedRecommendations, allDeals, searchQuery]);

  const totalAnnualSavings = personalizedRecommendations.reduce(
    (sum, rec) => sum + rec.annualSavings,
    0
  );

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
        <Text style={styles.title}>Deals</Text>
        <View style={styles.menuButtonPlaceholder} />
      </View>

      <FlatList
        data={currentRecommendations}
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            enabled={selectedSegment === 0} // Only refresh for "For You" view
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.headerControls}>
              <View style={styles.segmentedControlContainer}>
                <SegmentedControl
                  segments={['For You', 'All Deals']}
                  selectedIndex={selectedSegment}
                  onSegmentChange={setSelectedSegment}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSearchVisible(!searchVisible);
                  if (searchVisible) {
                    setSearchQuery(''); // Clear search when closing
                  }
                }}
                style={styles.searchIconButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name={searchVisible ? "close" : "magnify"} 
                  size={24} 
                  color={COLORS.text} 
                />
              </TouchableOpacity>
            </View>

            {searchVisible && (
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search merchants..."
              />
            )}

          </View>
        }
    
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? `No results for "${searchQuery}"`
                : selectedSegment === 0
                ? 'No recommendations available yet.'
                : 'No deals available.'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery.trim()
                ? 'Try a different search term'
                : selectedSegment === 0
                ? 'Connect your bank account to see personalized gift card recommendations.'
                : 'Check back later for new deals.'}
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
  headerControls: {
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  segmentedControlContainer: {
    flex: 1,
  },
  searchIconButton: {
    padding: 8,
    marginLeft: 8,
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

