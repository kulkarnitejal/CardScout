import { Transaction } from '../types';
import { getAllGiftCards } from './mockGiftCards';

// Get merchants from gift cards to ensure they're always in sync
const getMerchantsFromGiftCards = (): { merchant: string; category: string }[] => {
  const giftCards = getAllGiftCards();
  const merchantMap = new Map<string, string>();
  
  // Create a map of merchant to category (use first occurrence)
  giftCards.forEach(card => {
    if (!merchantMap.has(card.merchant)) {
      // Map gift card categories to transaction categories
      let category = card.category || 'Retail';
      
      // Normalize category names
      if (category === 'Restaurant') {
        category = 'Food & Drink';
      } else if (category === 'Grocery') {
        category = 'Groceries';
      } else if (category === 'Travel') {
        category = 'Transportation';
      }
      
      merchantMap.set(card.merchant, category);
    }
  });
  
  return Array.from(merchantMap.entries()).map(([merchant, category]) => ({
    merchant,
    category,
  }));
};

const generateRandomDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateMockTransactions = (count: number = 100): Transaction[] => {
  const transactions: Transaction[] = [];
  const merchantsWithCategories = getMerchantsFromGiftCards();
  
  if (merchantsWithCategories.length === 0) {
    console.warn('No merchants found in gift cards. Using fallback merchants.');
    // Fallback to ensure we always have some transactions
    merchantsWithCategories.push(
      { merchant: 'Amazon', category: 'Shopping' },
      { merchant: 'Target', category: 'Retail' },
      { merchant: 'Starbucks', category: 'Food & Drink' }
    );
  }
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90); // Last 90 days
    const merchantData = getRandomElement(merchantsWithCategories);
    const amount = Math.random() * 200 + 5; // $5 to $205
    
    transactions.push({
      id: `txn_${i + 1}`,
      date: generateRandomDate(daysAgo),
      merchant: merchantData.merchant,
      amount: Math.round(amount * 100) / 100,
      category: merchantData.category,
    });
  }
  
  // Sort by date, most recent first
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

