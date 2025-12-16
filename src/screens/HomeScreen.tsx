import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import { Transaction, Recommendation } from '../types';
import { generateMockTransactions } from '../services/mockTransactions';
import { analyzeMerchants } from '../services/merchantAnalyzer';
import { generateRecommendations } from '../services/recommendationEngine';
import { loadTransactions, saveTransactions } from '../services/storageService';
import { FeaturedRecommendationCard } from '../components/FeaturedRecommendationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { COLORS, FONTS, getFontFamily } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // 12px carousel padding + 12px card margin on each side
const SNAP_INTERVAL = CARD_WIDTH + 24; // Card width + margins

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      let loadedTransactions = await loadTransactions();
      
      // If no transactions exist, generate mock data
      if (loadedTransactions.length === 0) {
        loadedTransactions = generateMockTransactions(100);
        await saveTransactions(loadedTransactions);
      }
      
      setTransactions(loadedTransactions);
      
      // Analyze and generate recommendations
      const merchants = analyzeMerchants(loadedTransactions);
      const recs = generateRecommendations(merchants, loadedTransactions);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SNAP_INTERVAL);
    setCurrentCardIndex(index);
  };

  const totalSavings = recommendations.reduce(
    (sum, rec) => sum + rec.annualSavings,
    0
  );

  const topMerchantsCount = recommendations.length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <Text style={styles.title}>Card Scout</Text>
        <Text style={styles.subtitle}>Maximize your savings, maximize your life</Text>
      </View>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatCurrency(totalSavings)}</Text>
          <Text style={styles.statLabel}>Potential Annual Savings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{topMerchantsCount}</Text>
          <Text style={styles.statLabel}>Top Recommendations</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your Current Deals</Text>
            <Text style={styles.sectionSubtitle}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              // Navigate to Benefits tab
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('MainTabs', { screen: 'Benefits' });
              }
            }}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recommendations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No recommendations available. Connect your bank account to get started.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // Navigate to Connect Bank tab
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('MainTabs', { screen: 'ConnectBank' });
                }
              }}
            >
              <Text style={styles.buttonText}>Connect Bank Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={recommendations.slice(0, 5)}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={SNAP_INTERVAL}
              decelerationRate="fast"
              onScroll={onScroll}
              scrollEventThrottle={16}
              renderItem={({ item }) => (
                <FeaturedRecommendationCard
                  recommendation={item}
                  onViewDetails={() =>
                    navigation.navigate('GiftCardDetail', { recommendation: item })
                  }
                />
              )}
              contentContainerStyle={styles.carouselContent}
            />
            {recommendations.length > 1 && (
              <View style={styles.pagination}>
                {recommendations.slice(0, 5).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentCardIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Navigate to Transactions screen in stack
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Transactions');
            }
          }}
        >
          <Text style={styles.actionButtonText}>View Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => {
            // Navigate to Connect Bank tab
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('MainTabs', { screen: 'ConnectBank' });
            }
          }}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Connect Bank
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stickyHeader: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 60,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100, // Space for bottom navigation
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  carouselContent: {
    paddingHorizontal: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textSecondary,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    opacity: 1,
    backgroundColor: COLORS.primary,
  },
  seeAll: {
    padding: 6,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
});

