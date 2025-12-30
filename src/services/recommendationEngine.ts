import { Merchant, GiftCard, Recommendation, Transaction } from '../types';
import { getAllGiftCards, getGiftCardByMerchant } from './mockGiftCards';
import { calculateThreeMonthSpending } from './merchantAnalyzer';

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

export const generateRecommendations = (
  merchants: Merchant[],
  transactions: Transaction[]
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const giftCards = getAllGiftCards();

  merchants.forEach((merchant) => {
    // Try exact match first
    let giftCard = getGiftCardByMerchant(merchant.name);
    
    // If no exact match, try fuzzy matching
    if (!giftCard) {
      giftCard = giftCards.find((gc) => fuzzyMatchMerchant(merchant.name, gc.merchant));
    }

    if (!giftCard) {
      return; // No matching gift card found
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
  });

  // Sort by annual savings (descending)
  recommendations.sort((a, b) => b.annualSavings - a.annualSavings);

  // Return top recommendations
  return recommendations.slice();
};

export const getRecommendationById = (
  recommendations: Recommendation[],
  id: string
): Recommendation | undefined => {
  return recommendations.find((rec) => rec.id === id);
};

