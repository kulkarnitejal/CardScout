import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Recommendation } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { COLORS } from '../utils/constants';

type GiftCardDetailRouteParams = {
  GiftCardDetail: {
    recommendation: Recommendation;
  };
};

export const GiftCardDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<GiftCardDetailRouteParams, 'GiftCardDetail'>>();
  const { recommendation } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.merchantName}>{recommendation.merchant.name}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {formatPercent(recommendation.savingsPercent)} OFF
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Breakdown</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Spending</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(recommendation.monthlySpending)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Discount Rate</Text>
            <Text style={styles.infoValue}>
              {formatPercent(recommendation.savingsPercent)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Savings</Text>
            <Text style={[styles.infoValue, styles.savingsValue]}>
              {formatCurrency(recommendation.potentialSavings)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Annual Savings</Text>
            <Text style={[styles.infoValue, styles.annualSavings]}>
              {formatCurrency(recommendation.annualSavings)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Merchant Details</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{recommendation.merchant.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Transactions</Text>
            <Text style={styles.infoValue}>
              {recommendation.merchant.transactionCount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Spent (All Time)</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(recommendation.merchant.totalSpent)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Average Transaction</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(recommendation.merchant.averageTransaction)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Card Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Source</Text>
            <Text style={styles.infoValue}>{recommendation.giftCard.source}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Available Amount</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(recommendation.giftCard.availableAmount)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Discount</Text>
            <Text style={styles.infoValue}>
              {formatPercent(recommendation.giftCard.discountPercent)}
            </Text>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            💡 Tip: Purchase gift cards for merchants you frequent regularly to maximize your savings. The discount applies to the full gift card value.
          </Text>
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
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  savingsValue: {
    color: COLORS.success,
  },
  annualSavings: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.success,
  },
  noteContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

