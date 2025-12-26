export interface Transaction {
  id: string;
  date: Date;
  merchant: string;
  amount: number;
  category: string;
}

export interface Merchant {
  name: string;
  category: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  lastTransactionDate: Date;
}

export interface GiftCard {
  id: string;
  merchant: string;
  discountPercent: number;
  availableAmount: number;
  source: string;
  category?: string;
}

export interface Recommendation {
  id: string;
  merchant: Merchant;
  giftCard: GiftCard;
  potentialSavings: number;
  monthlySpending: number;
  annualSavings: number;
  savingsPercent: number;
}

