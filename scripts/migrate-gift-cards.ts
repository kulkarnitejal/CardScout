/**
 * Migration script to migrate mock gift card data to Supabase
 * 
 * Run this script once to populate your Supabase gift_cards table with the mock data.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-gift-cards.ts
 * 
 * Make sure to set your Supabase credentials in .env or environment variables:
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { mockGiftCards } from '../src/services/mockGiftCards';

// Note: Environment variables should be set in .env file
// Expo automatically loads .env files, but for Node.js scripts,
// you may need to use dotenv or set them manually

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrateGiftCards() {
  console.log('🚀 Starting gift card migration...');
  console.log(`📦 Migrating ${mockGiftCards.length} gift cards to Supabase\n`);

  // Transform mock data to match Supabase schema
  const giftCardsToInsert = mockGiftCards.map((card) => ({
    id: card.id,
    merchant: card.merchant,
    discount_percent: card.discountPercent,
    available_amount: card.availableAmount,
    price: card.price,
    source: card.source,
    category: card.category || null,
    is_active: true,
  }));

  // Insert gift cards into Supabase
  const { data, error } = await supabase
    .from('gift_cards')
    .upsert(giftCardsToInsert, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('❌ Error migrating gift cards:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log('✅ Successfully migrated gift cards to Supabase!');
  console.log(`📊 Inserted/Updated ${data?.length || 0} gift cards\n`);

  // Verify the migration
  const { data: verifyData, error: verifyError } = await supabase
    .from('gift_cards')
    .select('id, merchant, discount_percent, is_active')
    .eq('is_active', true);

  if (verifyError) {
    console.error('⚠️  Warning: Could not verify migration:', verifyError);
  } else {
    console.log(`✅ Verification: Found ${verifyData?.length || 0} active gift cards in database\n`);
    console.log('Sample gift cards:');
    verifyData?.slice(0, 5).forEach((card) => {
      console.log(`  - ${card.merchant} (${card.discount_percent}% off)`);
    });
  }

  console.log('\n✨ Migration complete!');
}

// Run the migration
migrateGiftCards()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

