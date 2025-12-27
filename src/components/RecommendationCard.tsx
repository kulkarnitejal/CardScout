import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Recommendation } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { COLORS, FONTS } from '../utils/constants';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress?: () => void;
}

// Map gift card sources to their website URLs
const getSourceUrl = (source: string, merchant: string): string => {
  const sourceMap: { [key: string]: string } = {
    'Sam\'s Club': 'https://www.samsclub.com/browse/Gift-Cards/1003'
  }
  
  const baseUrl = sourceMap[source] || 'https://www.google.com/search?q=' + encodeURIComponent(`${merchant} gift card`);
  return baseUrl;
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onPress,
}) => {
  const handleBuyNow = async () => {
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

  const CardContent = (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.merchantInfo}>
          <Text style={styles.merchantName}>{recommendation.merchant.name}</Text>
          <Text style={styles.category}>{recommendation.merchant.category}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {formatPercent(recommendation.savingsPercent)} OFF
            </Text>
          </View>
          {onPress && (
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>›</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.savingsContainer}>
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>Monthly Spending</Text>
          <Text style={styles.savingsValue}>{formatCurrency(recommendation.monthlySpending)}</Text>
        </View>

        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>Gift Card</Text>
          <View style={styles.giftCardValue}>
            <Text style={styles.giftCardAmount}>{formatCurrency(recommendation.giftCard.availableAmount)}</Text>
            <Text style={styles.giftCardPrice}>Pay {formatCurrency(recommendation.giftCard.price)}</Text>
          </View>
        </View>

        <View style={[styles.savingsRow, styles.savingsRowLast]}>
          <Text style={styles.savingsLabel}>Monthly Savings</Text>
          <Text style={[styles.savingsValue, styles.annualSavings]}>
            {formatCurrency(recommendation.potentialSavings)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.source}>
            Available via {recommendation.giftCard.source}
          </Text>
          <Text style={styles.availableAmount}>
            Up to {formatCurrency(recommendation.giftCard.availableAmount)} available
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.buyNowButton}
          onPress={handleBuyNow}
          activeOpacity={0.7}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  merchantInfo: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  arrowContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  merchantName: {
    fontSize: 20,
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
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  savingsContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  savingsRowLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  savingsLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  savingsValue: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.text,
  },
  giftCardValue: {
    alignItems: 'flex-end',
  },
  giftCardAmount: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  giftCardPrice: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  annualSavings: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.success,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  footerLeft: {
    flex: 1,
  },
  source: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  availableAmount: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    fontWeight: '600',
  },
  buyNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
});

