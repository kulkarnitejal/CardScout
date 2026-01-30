# Supabase Production Setup Guide

## 🔑 Understanding Supabase Keys

Supabase has two types of keys:

### 1. **Anon Key** (Public - Already Added ✅)
- **Location**: Frontend app (`src/config/supabase.ts`)
- **Purpose**: User authentication, public database access
- **Security**: Respects Row Level Security (RLS) policies
- **Status**: ✅ Already configured in `eas.json`

### 2. **Service Role Key** (Secret - Backend Only)
- **Location**: Backend/server only
- **Purpose**: Admin operations, bypasses RLS
- **Security**: ⚠️ **NEVER expose in frontend** - has full database access
- **Status**: Not currently used (backend doesn't use Supabase)

## 📍 Where to Add Supabase Production Secrets

### Frontend (Mobile App) - Already Done ✅

**Location**: `eas.json`

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://oelkghqrpobyyhmcwnrj.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

✅ **You've already added these!** The anon key is what you need for the frontend.

### Backend (Railway Server) - If Needed

If you want your backend to access Supabase (currently it doesn't), add to **Railway environment variables**:

1. Go to [railway.app](https://railway.app)
2. Select your `cardscout-production` service
3. Go to **Variables** tab
4. Add:

```
SUPABASE_URL=https://oelkghqrpobyyhmcwnrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key, not anon)
```

**⚠️ Important**: Use the **service_role** key (not anon key) for backend!

## 🔍 How to Get Service Role Key

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, find **service_role** key
5. ⚠️ **Keep this secret!** Never commit to git or expose in frontend

## 📋 Current Setup Status

### ✅ Frontend (Mobile App)
- **Supabase URL**: ✅ Configured in `eas.json`
- **Anon Key**: ✅ Configured in `eas.json`
- **Location**: `src/config/supabase.ts` reads from `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### ❌ Backend (Railway)
- **Supabase**: Not currently used
- **If needed**: Add to Railway environment variables

## 🎯 What You Need to Do

### For Frontend (Already Done ✅)
Nothing! You've already added the anon key to `eas.json`. Just rebuild:

```bash
npm run build:ios:production
```

### For Backend (Only if you add Supabase integration)
If you want your backend to access Supabase:

1. **Get service role key** from Supabase dashboard
2. **Add to Railway**:
   - Railway Dashboard → Your Service → Variables
   - Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. **Update backend code** to use Supabase (if needed)

## ⚠️ Security Notes

1. **Anon Key** (frontend):
   - ✅ Safe to expose in frontend
   - ✅ Already in `eas.json` (this is correct)
   - ✅ Respects RLS policies

2. **Service Role Key** (backend only):
   - ❌ **NEVER** put in frontend code
   - ❌ **NEVER** commit to git
   - ✅ Only use in backend/server
   - ✅ Store in Railway environment variables (not in code)

## 🔄 Next Steps

1. ✅ **Frontend is configured** - You've added anon key to `eas.json`
2. **Rebuild your app**:
   ```bash
   npm run build:ios:production
   ```
3. **Resubmit to TestFlight**:
   ```bash
   npm run submit:ios:latest
   ```

## ❓ Do You Need Service Role Key?

**You only need the service role key if:**
- Your backend needs to access Supabase
- You need to bypass RLS policies
- You're doing admin operations from the server

**You DON'T need it if:**
- ✅ You're only using Supabase for user authentication (anon key is enough)
- ✅ All database access goes through the frontend with RLS

Based on your current setup, **you only need the anon key** (which you've already added)! ✅

