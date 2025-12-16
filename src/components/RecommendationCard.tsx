import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Recommendation } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { COLORS, FONTS } from '../utils/constants';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onPress,
}) => {
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
          <Text style={styles.savingsLabel}>Monthly Savings:</Text>
          <Text style={styles.savingsValue}>
            {formatCurrency(recommendation.potentialSavings)}
          </Text>
        </View>
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>Annual Savings:</Text>
          <Text style={[styles.savingsValue, styles.annualSavings]}>
            {formatCurrency(recommendation.annualSavings)}
          </Text>
        </View>
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>Monthly Spending:</Text>
          <Text style={styles.savingsValue}>
            {formatCurrency(recommendation.monthlySpending)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.source}>
          Available via {recommendation.giftCard.source}
        </Text>
        <Text style={styles.availableAmount}>
          Up to {formatCurrency(recommendation.giftCard.availableAmount)} available
        </Text>
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
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  savingsValue: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.text,
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
  source: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  availableAmount: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

