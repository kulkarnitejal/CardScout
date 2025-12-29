# Supabase Setup Guide

## ✅ Completed Steps

1. ✅ Installed Supabase packages
2. ✅ Created Supabase configuration (`src/config/supabase.ts`)
3. ✅ Created Supabase service (`src/services/supabaseService.ts`)
4. ✅ Set up environment variable template (`.env.example`)

## 🔧 Next Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Click **Settings** → **API**
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Create `.env` File

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Restart Expo

After creating the `.env` file, restart your Expo development server:

```bash
npm start
```

Then press `r` to reload, or shake your device and select "Reload"

## 📁 Files Created

- `src/config/supabase.ts` - Supabase client configuration
- `src/services/supabaseService.ts` - Service functions for database operations
- `.env.example` - Environment variable template

## 🧪 Testing the Connection

You can test if Supabase is connected by adding this to any component:

```typescript
import { supabase } from './src/config/supabase';

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase.from('plaid_items').select('count');
  console.log('Supabase test:', { data, error });
};
```

## 📚 Available Functions

### Authentication
- `signUp(email, password)` - Create new user
- `signIn(email, password)` - Sign in user
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current authenticated user
- `getSession()` - Get current session

### Plaid Items
- `createPlaidItem(itemData)` - Create new Plaid connection
- `getPlaidItems(userId)` - Get all Plaid items for user
- `getPlaidItem(itemId)` - Get single Plaid item
- `updatePlaidItem(id, updates)` - Update Plaid item
- `deletePlaidItem(id)` - Delete Plaid item

### Accounts
- `upsertAccounts(accounts)` - Create or update accounts
- `getAccounts(plaidItemId)` - Get accounts for a Plaid item
- `updateAccount(id, updates)` - Update account

### Transactions
- `upsertTransactions(transactions)` - Create or update transactions
- `getTransactions(userId, options)` - Get transactions with filters
- `getTransactionsByMerchant(userId, merchantName)` - Get transactions by merchant
- `deleteTransactions(plaidItemId)` - Delete transactions for an item

## 🔒 Security Notes

- Access tokens are stored in Supabase (encrypted at rest)
- Row Level Security (RLS) ensures users can only access their own data
- All database operations are authenticated via Supabase Auth

## 🚀 Next Steps

1. Set up authentication screens (Login/Signup)
2. Update Plaid integration to use Supabase
3. Migrate from AsyncStorage to Supabase for transactions
4. Update Express backend to work with Supabase

