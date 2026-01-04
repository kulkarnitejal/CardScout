import { Merchant, GiftCard, Recommendation, Transaction } from '../types';
import { getAllGiftCards, getGiftCardByMerchant } from './supabaseService';
import { calculateThreeMonthSpending } from './merchantAnalyzer';
import { calculateDiscountPercent } from '../utils/formatters';

// Helper to convert Supabase gift card format to our GiftCard type
const convertSupabaseGiftCard = (supabaseCard: any): GiftCard => {
  // Calculate discount percent from available amount and price
  const discountPercent = calculateDiscountPercent(
    supabaseCard.available_amount,
    supabaseCard.price
  );

  return {
    id: supabaseCard.id,
    merchant: supabaseCard.merchant,
    discountPercent,
    availableAmount: supabaseCard.available_amount,
    price: supabaseCard.price,
    source: supabaseCard.source,
    sourceLink: supabaseCard.source_link || undefined,
    category: supabaseCard.category || undefined,
  };
};

const fuzzyMatchMerchant = (merchantName: string, giftCardMerchant: string): boolean => {
  const normalizedMerchant = merchantName.toLowerCase().trim();
  const normalizedGiftCard = giftCardMerchant.toLowerCase().trim();
  
  // Exact match
  if (normalizedMerchant === normalizedGiftCard) {
    return true;
  }
  
  // Contains match (e.g., "Amazon.com" matches "Amazon")
  if (normalizedMerchant.includes(normalizedGiftCard) || normalizedGiftCard.includes(normalizedMerchant)) {
    return true;
  }
  
  return false;
};

export const generateRecommendations = async (
  merchants: Merchant[],
  transactions: Transaction[]
): Promise<Recommendation[]> => {
  const recommendations: Recommendation[] = [];
  
  // Fetch all gift cards from Supabase
  const { data: supabaseGiftCards, error } = await getAllGiftCards();
  
  if (error || !supabaseGiftCards) {
    console.error('Error fetching gift cards from Supabase:', error);
    return []; // Return empty array if fetch fails
  }

  const giftCards = supabaseGiftCards.map(convertSupabaseGiftCard);

  for (const merchant of merchants) {
    // Try exact match first - this now returns the best deal if multiple exist
    const { data: exactMatch } = await getGiftCardByMerchant(merchant.name);
    let giftCard: GiftCard | undefined = exactMatch ? convertSupabaseGiftCard(exactMatch) : undefined;
    
    // If no exact match, try fuzzy matching
    if (!giftCard) {
      const fuzzyMatches = giftCards.filter((gc) => fuzzyMatchMerchant(merchant.name, gc.merchant));
      
      // If multiple fuzzy matches, pick the one with highest discount
      if (fuzzyMatches.length > 0) {
        fuzzyMatches.sort((a, b) => b.discountPercent - a.discountPercent);
        giftCard = fuzzyMatches[0];
      }
    }

    if (!giftCard) {
      continue; // No matching gift card found
    }

    // Calculate 3-month spending
    const threeMonthSpending = calculateThreeMonthSpending(transactions, merchant.name);

    // Calculate potential savings (based on monthly average from 3-month data)
    const monthlyAverage = threeMonthSpending / 3;
    const potentialSavings = Math.round((monthlyAverage * giftCard.discountPercent / 100) * 100) / 100;
    const annualSavings = Math.round((potentialSavings * 12) * 100) / 100;

    recommendations.push({
      id: `rec_${merchant.name.toLowerCase().replace(/\s+/g, '_')}`,
      merchant,
      giftCard,
      potentialSavings,
      threeMonthSpending,
      annualSavings,
      savingsPercent: giftCard.discountPercent,
    });
  }

  // Sort by annual savings (descending)
  recommendations.sort((a, b) => b.annualSavings - a.annualSavings);

  // Return top recommendations
  return recommendations;
};

export const getRecommendationById = (
  recommendations: Recommendation[],
  id: string
): Recommendation | undefined => {
  return recommendations.find((rec) => rec.id === id);
};

/**
 * Generate recommendations from all available gift cards
 * Used for "All Deals" view where we don't have transaction data
 */
export const generateAllDeals = async (): Promise<Recommendation[]> => {
  const { data: supabaseGiftCards, error } = await getAllGiftCards();
  
  if (error || !supabaseGiftCards) {
    console.error('Error fetching gift cards from Supabase:', error);
    return []; // Return empty array if fetch fails
  }

  const giftCards = supabaseGiftCards.map(convertSupabaseGiftCard);
  const recommendations: Recommendation[] = [];
  const now = new Date();

  giftCards.forEach((giftCard) => {
    // Create a minimal merchant object for display purposes
    const merchant: Merchant = {
      name: giftCard.merchant,
      category: giftCard.category || 'Other',
      totalSpent: 0,
      transactionCount: 0,
      averageTransaction: 0,
      lastTransactionDate: now,
    };

    // For "All Deals", we don't have spending data, so set to 0
    recommendations.push({
      id: giftCard.id,
      merchant,
      giftCard,
      potentialSavings: 0,
      threeMonthSpending: 0,
      annualSavings: 0,
      savingsPercent: giftCard.discountPercent,
    });
  });

  // Sort by discount percentage (descending), then by merchant name
  recommendations.sort((a, b) => {
    if (b.savingsPercent !== a.savingsPercent) {
      return b.savingsPercent - a.savingsPercent;
    }
    return a.merchant.name.localeCompare(b.merchant.name);
  });

  return recommendations;
};

