import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { Recommendation } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { COLORS, FONTS } from '../utils/constants';

interface FeaturedRecommendationCardProps {
  recommendation: Recommendation;
  onViewDetails?: () => void;
  onBuyNow?: () => void;
}

// Map gift card sources to their website URLs
const getSourceUrl = (source: string, merchant: string): string => {
  const sourceMap: { [key: string]: string } = {
    'GiftCardMarketplace': 'https://www.giftcardmarketplace.com',
    'CardCash': 'https://www.cardcash.com',
    'Raise': 'https://www.raise.com',
  };
  
  const baseUrl = sourceMap[source] || 'https://www.google.com/search?q=' + encodeURIComponent(`${merchant} gift card`);
  return baseUrl;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // 24px padding on each side

export const FeaturedRecommendationCard: React.FC<FeaturedRecommendationCardProps> = ({
  recommendation,
  onViewDetails,
  onBuyNow,
}) => {
  const giftCardPrice = recommendation.giftCard.availableAmount * 
    (1 - recommendation.giftCard.discountPercent / 100);

  const handleBuyNow = async () => {
    if (onBuyNow) {
      onBuyNow();
    } else {
      const url = getSourceUrl(recommendation.giftCard.source, recommendation.merchant.name);
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  const CardContent = (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{recommendation.merchant.category}</Text>
        </View>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {formatPercent(recommendation.savingsPercent)} OFF
          </Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.merchantName}>{recommendation.merchant.name}</Text>
        <Text style={styles.description}>
          Save {formatCurrency(recommendation.annualSavings)} annually by purchasing discounted gift cards
        </Text>

        <View style={styles.savingsBox}>
          <View style={styles.savingsBoxLeft}>
            <Text style={styles.savingsBoxLabel}>Annual Savings</Text>
            <Text style={styles.savingsBoxValue}>
              {formatCurrency(recommendation.annualSavings)}
            </Text>
          </View>
          <View style={styles.savingsBoxRight}>
            <Text style={styles.savingsBoxSmallText}>
              {formatCurrency(recommendation.monthlySpending)}/mo spending
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerSection}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Gift Card Value</Text>
          <Text style={styles.priceValue}>
            {formatCurrency(recommendation.giftCard.availableAmount)}
          </Text>
          <Text style={styles.priceSubtext}>
            Pay {formatCurrency(giftCardPrice)} • Save {formatPercent(recommendation.giftCard.discountPercent)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={onViewDetails}
          >
            <Text style={styles.viewDetailsButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleBuyNow}
          >
            <Text style={styles.actionButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return CardContent;
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginHorizontal: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 400,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  discountBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  contentSection: {
    flex: 1,
    marginBottom: 24,
  },
  merchantName: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  savingsBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsBoxLeft: {
    flex: 1,
  },
  savingsBoxLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  savingsBoxValue: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.success,
  },
  savingsBoxRight: {
    alignItems: 'flex-end',
  },
  savingsBoxSmallText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingTop: 16,
  },
  priceInfo: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 6,
  },
  viewDetailsButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
});

