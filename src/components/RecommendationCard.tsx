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

// Get source URL from gift card, with fallback to Google search
const getSourceUrl = (giftCard: { sourceLink?: string; source: string; merchant: string }): string => {
  if (giftCard.sourceLink) {
    return giftCard.sourceLink;
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
    const url = getSourceUrl(recommendation.giftCard);
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
              size={36}
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
                size={24}
                color={COLORS.textSecondary}
                style={styles.arrow}
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.quarterlySpendingContainer}>
        <Text style={styles.quarterlySpendingLabel}>Your avg. Quarterly Spend</Text>
        <Text style={styles.quarterlySpendingValue}>
          {formatCurrency(quarterlySpending)}
        </Text>
      </View>

      <View style={styles.giftCardInfoContainer}>
        <Text style={styles.giftCardLabel}>Deal</Text>
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
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flex: 1,
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  merchantInfo: {
    flex: 1,
    justifyContent: 'center',
    height: 48, // Match icon container height for perfect alignment
  },
  merchantName: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  quarterlySpendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    marginTop: 6,
    marginBottom: 6,
  },
  quarterlySpendingLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quarterlySpendingValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontWeight: '700',
  },
  rightSection: {
    alignItems: 'center',
    marginLeft: 8,
    justifyContent: 'center',
    height: 48, // Match icon container height for perfect alignment
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountBadge: {
    backgroundColor: TERRACOTTA,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    marginBottom: 8,
  },
  giftCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  giftCardValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  giftCardPrice: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: TERRACOTTA,
    fontWeight: '700',
  },
  giftCardSeparator: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  giftCardValue: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    fontWeight: '600',
  },
  getCardButton: {
    backgroundColor: LIGHT_GREEN,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  getCardText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
});


