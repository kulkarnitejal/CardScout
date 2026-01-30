# Plaid Production Setup Guide

## 🔑 Where Plaid Secrets Go

**Important**: Plaid secrets go in your **backend (Railway)**, NOT in the frontend app!

### Frontend (Mobile App) - No Secrets Needed ✅
- The frontend **does NOT** use Plaid secrets directly
- It only calls your backend API at `https://cardscout-production.up.railway.app/api`
- ✅ Already configured correctly - no changes needed

### Backend (Railway Server) - Add Secrets Here ⚠️

The backend reads Plaid credentials from **environment variables** in Railway.

## 📍 Where to Add Plaid Production Secrets

### Step 1: Get Your Plaid Production Credentials

1. Go to [dashboard.plaid.com](https://dashboard.plaid.com)
2. Log in to your Plaid account
3. Navigate to **Team Settings** → **Keys**
4. Find the **Production** section
5. Copy:
   - **Production Client ID**
   - **Production Secret** (click "Show" to reveal)

⚠️ **Important**: These are **different** from your sandbox/development credentials!

### Step 2: Add to Railway Environment Variables

1. Go to [railway.app](https://railway.app)
2. Select your project
3. Select the `cardscout-production` service
4. Click on the **Variables** tab
5. Add these three environment variables:

```
PLAID_CLIENT_ID=your_production_client_id_here
PLAID_SECRET=your_production_secret_key_here
PLAID_ENV=production
```

### Step 3: Redeploy Backend

After adding the variables:
1. Railway will automatically detect the changes
2. It will trigger a new deployment
3. Or manually trigger: Railway Dashboard → Deployments → Redeploy

## 🔍 How It Works

### Current Flow:

```
Frontend App (TestFlight)
    ↓
Calls: https://cardscout-production.up.railway.app/api/plaid/create-link-token
    ↓
Backend (Railway)
    ↓
Reads: PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV from environment variables
    ↓
Calls Plaid API with production credentials
    ↓
Returns link token to frontend
```

### Backend Code Location:

The backend reads Plaid config from:
- **File**: `server/src/config/plaid.config.ts`
- **Code**:
  ```typescript
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  const environment = process.env.PLAID_ENV || 'sandbox';
  ```

## 📋 Complete Railway Environment Variables

Your Railway service should have:

```
# Plaid Production Credentials
PLAID_CLIENT_ID=your_production_client_id
PLAID_SECRET=your_production_secret
PLAID_ENV=production

# Server Configuration
PORT=3000
NODE_ENV=production
```

## ✅ Verification Steps

### 1. Check Railway Variables

1. Railway Dashboard → Your Service → Variables
2. Verify all three Plaid variables are set:
   - ✅ `PLAID_CLIENT_ID`
   - ✅ `PLAID_SECRET`
   - ✅ `PLAID_ENV=production`

### 2. Check Railway Logs

1. Railway Dashboard → Your Service → Deployments → Latest → Logs
2. Look for:
   - ✅ Server starting successfully
   - ✅ No "Plaid credentials are missing" errors
   - ✅ Environment: production

### 3. Test Backend Endpoint

```bash
curl -X POST https://cardscout-production.up.railway.app/api/plaid/create-link-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test"}'
```

Should return:
```json
{
  "success": true,
  "link_token": "link-production-..."
}
```

### 4. Test in App

1. Open TestFlight app
2. Try to connect bank account
3. Should see Plaid Link open with production banks (not sandbox)

## ⚠️ Important Notes

### 1. Production vs Sandbox

- **Sandbox**: Test credentials, fake banks, unlimited calls
- **Production**: Real banks, real data, rate limits, fees apply

### 2. Credentials Are Different

- Sandbox credentials ≠ Production credentials
- Make sure you're using **Production** credentials from Plaid dashboard

### 3. Environment Variable Name

- Use `PLAID_ENV=production` (not `PLAID_ENVIRONMENT`)
- Valid values: `sandbox`, `development`, or `production`

### 4. Never Commit Secrets

- ✅ Secrets are in Railway (not in code)
- ✅ `.env` file should be in `.gitignore`
- ❌ Never commit Plaid secrets to git

## 🐛 Troubleshooting

### Issue: "Plaid credentials are missing"

**Check**:
1. Railway Variables tab - are credentials set?
2. Railway Logs - any errors during startup?
3. Variable names - exact match: `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`

**Fix**: Add missing variables in Railway

### Issue: Still using sandbox

**Check**:
1. Is `PLAID_ENV=production` set in Railway?
2. Did you redeploy after adding variables?

**Fix**: Set `PLAID_ENV=production` and redeploy

### Issue: "Invalid credentials" from Plaid

**Check**:
1. Are you using **Production** credentials (not sandbox)?
2. Did you copy the full secret key?
3. Are there any extra spaces in Railway variables?

**Fix**: Double-check credentials in Plaid dashboard, copy exactly

## 📝 Summary

**Where to add Plaid production secrets:**
- ✅ **Railway Dashboard** → Your Service → **Variables** tab
- ❌ **NOT** in frontend app (`eas.json`)
- ❌ **NOT** in code files

**What to add:**
```
PLAID_CLIENT_ID=your_production_client_id
PLAID_SECRET=your_production_secret
PLAID_ENV=production
```

**After adding:**
1. Railway auto-deploys (or manually redeploy)
2. Test backend endpoint
3. Test in TestFlight app

That's it! The frontend doesn't need any changes - it already calls your backend correctly.

