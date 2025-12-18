 import { Transaction } from '../types';

// const merchants = [
//   'Amazon',
//   'Target',
//   'Starbucks',
//   'Walmart',
//   'Best Buy',
//   'Home Depot',
//   'Costco',
//   'Whole Foods',
//   'CVS Pharmacy',
//   'Shell Gas Station',
//   'Chipotle',
//   'McDonald\'s',
//   'Uber',
//   'Lyft',
//   'Netflix',
//   'Spotify',
//   'Apple Store',
//   'Nike',
//   'Adidas',
//   'Trader Joe\'s',
// ];

// const categories = [
//   'Shopping',
//   'Food & Drink',
//   'Gas',
//   'Entertainment',
//   'Groceries',
//   'Transportation',
//   'Retail',
// ];

// const generateRandomDate = (daysAgo: number): Date => {
//   const date = new Date();
//   date.setDate(date.getDate() - daysAgo);
//   return date;
// };

// const getRandomElement = <T>(array: T[]): T => {
//   return array[Math.floor(Math.random() * array.length)];
// };

// export const generateMockTransactions = (count: number = 100): Transaction[] => {
//   const transactions: Transaction[] = [];
  
//   for (let i = 0; i < count; i++) {
//     const daysAgo = Math.floor(Math.random() * 90); // Last 90 days
//     const merchant = getRandomElement(merchants);
//     const category = getRandomElement(categories);
//     const amount = Math.random() * 200 + 5; // $5 to $205
    
//     transactions.push({
//       id: `txn_${i + 1}`,
//       date: generateRandomDate(daysAgo),
//       merchant,
//       amount: Math.round(amount * 100) / 100,
//       category,
//     });
//   }
  
//   // Sort by date, most recent first
//   return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
// };

