# Gift Card Migration Script

This script migrates mock gift card data from `src/services/mockGiftCards.ts` to your Supabase `gift_cards` table.

## Prerequisites

1. Make sure you have created the `gift_cards` table in Supabase with the following schema:

```sql
CREATE TABLE gift_cards (
  id TEXT PRIMARY KEY,
  merchant TEXT NOT NULL,
  discount_percent DECIMAL(5,2) NOT NULL,
  available_amount DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  source TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

2. Set your Supabase credentials in `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Running the Migration

```bash
npx ts-node scripts/migrate-gift-cards.ts
```

The script will:
- Read all gift cards from `src/services/mockGiftCards.ts`
- Insert/update them in your Supabase `gift_cards` table
- Verify the migration was successful

## Notes

- The script uses `upsert`, so running it multiple times is safe
- Only active gift cards (`is_active = true`) will be returned by the app
- After migration, the app will use Supabase as the source of truth for gift cards

