import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Recommendation } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { COLORS, FONTS } from '../utils/constants';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Map gift card sources to their website URLs
const getSourceUrl = (source: string, merchant: string): string => {
  const sourceMap: { [key: string]: string } = {
    'Sam\'s Club': 'https://www.samsclub.com/browse/Gift-Cards/1003',
    'Costco': 'https://www.costco.com/gift-cards-tickets.html'
  };
  
  const baseUrl = sourceMap[source] || 'https://www.google.com/search?q=' + encodeURIComponent(`${merchant} gift card`);
  return baseUrl;
};

// Get icon name based on category
const getIconName = (category: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  const categoryLower = category.toLowerCase();
  const iconMap: { [key: string]: keyof typeof MaterialCommunityIcons.glyphMap } = {
    'food & drink': 'silverware-fork-knife',
    'restaurant': 'silverware-fork-knife',
    'groceries': 'cart-outline',
    'grocery': 'cart-outline',
    'transportation': 'car',
    'travel': 'airplane',
    'retail': 'shopping',
    'entertainment': 'movie',
    'gas stations': 'gas-station',
    'gas': 'gas-station',
    'fuel': 'gas-station',
    'coffee shops': 'coffee',
    'coffee': 'coffee',
    'fast food': 'food',
    'fast food restaurants': 'food',
  };
  
  if (iconMap[categoryLower]) {
    return iconMap[categoryLower];
  }
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (categoryLower.includes(key) || key.includes(categoryLower)) {
      return icon;
    }
  }
  
  return 'store';
};

// Theme colors
const LIGHT_GREEN = '#648767'; // Light green for CTA
const TERRACOTTA = '#B4654A'; // Terracotta for secondary
const LIGHT_GREY = '#F5F5F5'; // Light grey background

type GiftCardDetailRouteParams = {
  GiftCardDetail: {
    recommendation: Recommendation;
  };
};

export const GiftCardDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<GiftCardDetailRouteParams, 'GiftCardDetail'>>();
  const { recommendation } = route.params;

  const handleGetCard = async () => {
    const url = getSourceUrl(recommendation.giftCard.source, recommendation.merchant.name);
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const iconName = getIconName(recommendation.merchant.category);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={iconName}
              size={48}
              color={TERRACOTTA}
            />
          </View>
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantName}>{recommendation.merchant.name}</Text>
            <Text style={styles.category}>{recommendation.merchant.category}</Text>
          </View>
        </View>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {formatPercent(recommendation.savingsPercent)} OFF
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Gift Card Information - First */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Card Deal</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Gift Card</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.giftCardPrice}>
                {formatCurrency(recommendation.giftCard.price)}
              </Text>
              <Text style={styles.giftCardSeparator}>for</Text>
              <Text style={styles.giftCardValue}>
                {formatCurrency(recommendation.giftCard.availableAmount)} value
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Discount</Text>
            <Text style={styles.infoValue}>
              {formatPercent(recommendation.giftCard.discountPercent)}
            </Text>
          </View>

          <View style={styles.savingsContainerLast}>
            <Text style={styles.infoLabel}>Source</Text>
            <Text style={styles.infoValue}>{recommendation.giftCard.source}</Text>
          </View>

          <TouchableOpacity 
            style={styles.getCardButton}
            onPress={handleGetCard}
            activeOpacity={0.8}
          >
            <Text style={styles.getCardText}>Get Card</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Details & Projected Savings - Second */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Spending & Savings</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Your Avg. Quarterly Spend</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(recommendation.threeMonthSpending)}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Total Transactions</Text>
            <Text style={styles.infoValue}>
              {recommendation.merchant.transactionCount}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Average Transaction</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(recommendation.merchant.averageTransaction)}
            </Text>
          </View>

          {/* <View style={styles.divider} /> */}

          <View style={styles.savingsContainer}>
            <Text style={styles.savingsLabel}>Est. Monthly Savings</Text>
            <Text style={styles.savingsValue}>
              {formatCurrency(recommendation.potentialSavings)}
            </Text>
          </View>

          <View style={styles.savingsContainerLast}>
            <Text style={styles.savingsLabel}>Projected Annual Savings</Text>
            <Text style={styles.annualSavingsValue}>
              {formatCurrency(recommendation.annualSavings)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  merchantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  merchantName: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  discountBadge: {
    backgroundColor: TERRACOTTA,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    minWidth: 80,
    alignItems: 'center',
  },
  discountText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: .5,
    borderBottomColor: COLORS.background,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.text,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  giftCardPrice: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: TERRACOTTA,
    fontWeight: '700',
  },
  giftCardSeparator: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  giftCardValue: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    fontWeight: '600',
  },
  divider: {
    height: 3,
    backgroundColor: LIGHT_GREEN,
    marginVertical: 16,
  },
  savingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: .5,
    borderBottomColor: COLORS.background,
  },
  savingsContainerLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  savingsLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  savingsValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: LIGHT_GREEN,
  },
  annualSavingsValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: LIGHT_GREEN,
  },
  getCardButton: {
    backgroundColor: LIGHT_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },
  getCardText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
});
