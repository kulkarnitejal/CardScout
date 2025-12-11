import { GiftCard } from '../types';

export const mockGiftCards: GiftCard[] = [
  {
    id: 'gc_amazon',
    merchant: 'Amazon',
    discountPercent: 8.5,
    availableAmount: 500,
    source: 'GiftCardMarketplace',
    category: 'Shopping',
  },
  {
    id: 'gc_target',
    merchant: 'Target',
    discountPercent: 6.0,
    availableAmount: 300,
    source: 'CardCash',
    category: 'Retail',
  },
  {
    id: 'gc_starbucks',
    merchant: 'Starbucks',
    discountPercent: 10.0,
    availableAmount: 200,
    source: 'Raise',
    category: 'Food & Drink',
  },
  {
    id: 'gc_walmart',
    merchant: 'Walmart',
    discountPercent: 5.5,
    availableAmount: 400,
    source: 'GiftCardMarketplace',
    category: 'Retail',
  },
  {
    id: 'gc_bestbuy',
    merchant: 'Best Buy',
    discountPercent: 7.0,
    availableAmount: 250,
    source: 'CardCash',
    category: 'Shopping',
  },
  {
    id: 'gc_homedepot',
    merchant: 'Home Depot',
    discountPercent: 6.5,
    availableAmount: 350,
    source: 'Raise',
    category: 'Retail',
  },
  {
    id: 'gc_costco',
    merchant: 'Costco',
    discountPercent: 5.0,
    availableAmount: 500,
    source: 'GiftCardMarketplace',
    category: 'Groceries',
  },
  {
    id: 'gc_wholefoods',
    merchant: 'Whole Foods',
    discountPercent: 9.0,
    availableAmount: 200,
    source: 'CardCash',
    category: 'Groceries',
  },
  {
    id: 'gc_cvs',
    merchant: 'CVS Pharmacy',
    discountPercent: 7.5,
    availableAmount: 150,
    source: 'Raise',
    category: 'Retail',
  },
  {
    id: 'gc_chipotle',
    merchant: 'Chipotle',
    discountPercent: 12.0,
    availableAmount: 100,
    source: 'GiftCardMarketplace',
    category: 'Food & Drink',
  },
  {
    id: 'gc_netflix',
    merchant: 'Netflix',
    discountPercent: 15.0,
    availableAmount: 100,
    source: 'CardCash',
    category: 'Entertainment',
  },
  {
    id: 'gc_spotify',
    merchant: 'Spotify',
    discountPercent: 10.0,
    availableAmount: 100,
    source: 'Raise',
    category: 'Entertainment',
  },
  {
    id: 'gc_apple',
    merchant: 'Apple Store',
    discountPercent: 5.0,
    availableAmount: 500,
    source: 'GiftCardMarketplace',
    category: 'Shopping',
  },
  {
    id: 'gc_nike',
    merchant: 'Nike',
    discountPercent: 8.0,
    availableAmount: 200,
    source: 'CardCash',
    category: 'Retail',
  },
  {
    id: 'gc_traderjoes',
    merchant: 'Trader Joe\'s',
    discountPercent: 6.0,
    availableAmount: 150,
    source: 'Raise',
    category: 'Groceries',
  },
];

export const getGiftCardByMerchant = (merchantName: string): GiftCard | undefined => {
  return mockGiftCards.find(
    (gc) => gc.merchant.toLowerCase() === merchantName.toLowerCase()
  );
};

export const getAllGiftCards = (): GiftCard[] => {
  return mockGiftCards;
};

