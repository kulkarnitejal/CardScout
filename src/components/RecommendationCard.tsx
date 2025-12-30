import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Recommendation } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { COLORS, FONTS } from '../utils/constants';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress?: () => void;
}

// Map gift card sources to their website URLs
const getSourceUrl = (source: string, merchant: string): string => {
  const sourceMap: { [key: string]: string } = {
    'Sam\'s Club': 'https://www.samsclub.com/browse/Gift-Cards/1003',
    'Costco': 'https://www.costco.com/gift-cards-tickets.html'
  }
  
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
  
  // Try exact match first
  if (iconMap[categoryLower]) {
    return iconMap[categoryLower];
  }
  
  // Try partial match
  for (const [key, icon] of Object.entries(iconMap)) {
    if (categoryLower.includes(key) || key.includes(categoryLower)) {
      return icon;
    }
  }
  
  // Default fallback
  return 'store';
};

// Theme colors
const LIGHT_GREEN = '#648767'; // Light green for CTA
const TERRACOTTA = '#B4654A'; // Terracotta for secondary
const LIGHT_GREY = '#F5F5F5'; // Light grey background

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onPress,
}) => {
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
  const quarterlySpending = recommendation.threeMonthSpending; // Already 3 months = quarterly

  const CardContent = (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={iconName}
              size={48}
              color={TERRACOTTA}
            />
          </View>
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantName}>{recommendation.merchant.name}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.rightContent}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {formatPercent(recommendation.savingsPercent)} OFF
              </Text>
            </View>
            {onPress && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={28}
                color={COLORS.textSecondary}
                style={styles.arrow}
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.quarterlySpendingContainer}>
        <Text style={styles.quarterlySpendingLabel}>Avg. Quarterly Spend</Text>
        <Text style={styles.quarterlySpendingValue}>
          {formatCurrency(quarterlySpending)}
        </Text>
      </View>

      <View style={styles.giftCardInfoContainer}>
        <Text style={styles.giftCardLabel}>Gift Card</Text>
        <View style={styles.giftCardValues}>
          <Text style={styles.giftCardPrice}>
            {formatCurrency(recommendation.giftCard.price)}
          </Text>
          <Text style={styles.giftCardSeparator}>for</Text>
          <Text style={styles.giftCardValue}>
            {formatCurrency(recommendation.giftCard.availableAmount)} value
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.getCardButton}
        onPress={handleGetCard}
        activeOpacity={0.8}
      >
        <Text style={styles.getCardText}>Get Card</Text>
      </TouchableOpacity>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: LIGHT_GREY,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    flex: 1,
  },
  leftSection: {
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
  },
  merchantName: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  quarterlySpendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    marginTop: 12,
    marginBottom: 12,
  },
  quarterlySpendingLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quarterlySpendingValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontWeight: '700',
  },
  rightSection: {
    alignItems: 'center',
    marginLeft: 12,
    justifyContent: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  arrow: {
    // No margin needed, aligned with badge
  },
  giftCardInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    marginBottom: 12,
  },
  giftCardLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  giftCardValues: {
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
  getCardButton: {
    backgroundColor: LIGHT_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  getCardText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
});


