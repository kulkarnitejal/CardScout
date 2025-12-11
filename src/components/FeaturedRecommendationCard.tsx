import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Recommendation } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { COLORS } from '../utils/constants';

interface FeaturedRecommendationCardProps {
  recommendation: Recommendation;
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // 24px padding on each side

export const FeaturedRecommendationCard: React.FC<FeaturedRecommendationCardProps> = ({
  recommendation,
  onPress,
}) => {
  const giftCardPrice = recommendation.giftCard.availableAmount * 
    (1 - recommendation.giftCard.discountPercent / 100);

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
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onPress}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
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
    fontWeight: '700',
  },
  contentSection: {
    flex: 1,
    marginBottom: 24,
  },
  merchantName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
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
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  savingsBoxValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.success,
  },
  savingsBoxRight: {
    alignItems: 'flex-end',
  },
  savingsBoxSmallText: {
    fontSize: 12,
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
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

