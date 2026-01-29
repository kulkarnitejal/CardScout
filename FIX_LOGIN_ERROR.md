# Fix: "Login Failed Network Request Fails" in TestFlight

## 🚨 Root Cause

The error occurs because **Supabase credentials are not configured** in your production build. The `eas.json` file is missing:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Solution

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 2: Update eas.json

I've added placeholders in `eas.json`. Replace the empty strings with your actual credentials:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://YOUR_PROJECT.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

### Step 3: Rebuild

After updating `eas.json`:

```bash
npm run build:ios:production
```

### Step 4: Resubmit to TestFlight

```bash
npm run submit:ios:latest
```

## 🔍 How to Verify

### Check Build Logs

In Expo dashboard, check the build logs to verify:
- Environment variables are being set
- No errors about missing credentials

### Check Device Logs

After installing the new build:
1. Connect device via USB
2. Open Xcode → Window → Devices
3. Select device → Open Console
4. Look for logs starting with 🔐
5. Should see: "Supabase Config Check" with `hasUrl: true` and `hasKey: true`

## 📋 Complete eas.json Example

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_ENV": "production",
        "EXPO_PUBLIC_API_URL": "https://cardscout-production.up.railway.app/api",
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-project-id.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxMjM0NTY3LCJleHAiOjE5NTY4MTA1Njd9.your-key-here"
      }
    }
  }
}
```

## ⚠️ Important Notes

1. **Never commit credentials to git** - The `eas.json` with credentials should be in `.gitignore` or use EAS Secrets
2. **Use EAS Secrets for sensitive data** (recommended):
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
   ```
3. **The anon key is safe to expose** - It's designed to be public, but still use secrets for best practices

## 🐛 What Was Happening

1. App loads ✅ (frontend works)
2. User tries to sign in
3. App tries to connect to Supabase
4. Supabase URL is empty/placeholder
5. Network request fails ❌
6. Error: "Login failed network request fails"

## ✅ After Fix

1. App loads ✅
2. User tries to sign in
3. App connects to Supabase with valid credentials ✅
4. Authentication succeeds ✅
5. User is logged in ✅

## 🔧 Additional Debugging

If login still fails after adding credentials:

1. **Check Supabase Dashboard**:
   - Logs → Auth Logs
   - Look for sign-in attempts
   - Check for errors

2. **Verify Supabase Project**:
   - Is project active?
   - Are auth settings correct?
   - Is email auth enabled?

3. **Check Network**:
   - Can device reach Supabase?
   - Any firewall/network restrictions?

4. **Check Device Logs**:
   - Look for detailed error messages
   - Check Supabase connection logs

