import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Merchant } from '../types';
import { formatCurrency, formatDateShort } from '../utils/formatters';
import { COLORS, FONTS } from '../utils/constants';

interface MerchantCardProps {
  merchant: Merchant;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({ merchant }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{merchant.name}</Text>
          <Text style={styles.category}>{merchant.category}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>{formatCurrency(merchant.totalSpent)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{merchant.transactionCount}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{formatCurrency(merchant.averageTransaction)}</Text>
          </View>
        </View>
        <Text style={styles.lastTransaction}>
          Last: {formatDateShort(merchant.lastTransactionDate)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
  },
  mainInfo: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.background,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.primary,
  },
  lastTransaction: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
});

