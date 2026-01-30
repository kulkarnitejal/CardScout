# Fix: Plaid Credentials Missing in Railway

## 🚨 Issue

You've added Plaid credentials to Railway's **shared environment variables**, but the service still shows "credentials are missing" in logs.

## ✅ Solution

### Problem: Shared vs Service Variables

Railway has two types of environment variables:
1. **Shared Variables** (project-level) - Available to all services
2. **Service Variables** (service-level) - Specific to one service

**The issue**: Your service might not be reading from shared variables, or they need to be set at the service level.

### Fix Option 1: Add to Service Variables (Recommended)

1. Go to [railway.app](https://railway.app)
2. Select your project
3. Select the **`cardscout-production`** service (not the project)
4. Click on **Variables** tab
5. Add these variables **directly to the service**:

```
PLAID_CLIENT_ID=your_production_client_id
PLAID_SECRET=your_production_secret
PLAID_ENV=production
```

### Fix Option 2: Verify Shared Variables Are Applied

If you want to use shared variables:

1. Go to Railway Dashboard
2. Select your **Project** (not the service)
3. Go to **Variables** tab
4. Make sure variables are set:
   - `PLAID_CLIENT_ID`
   - `PLAID_SECRET`
   - `PLAID_ENV=production`
5. Go back to your **Service** → **Variables**
6. Check if shared variables are visible/inherited
7. If not, add them directly to the service

### Fix Option 3: Redeploy After Adding Variables

After adding variables:

1. **Trigger a new deployment**:
   - Railway Dashboard → Your Service → Deployments
   - Click "Redeploy" or push new code
2. **Or wait for auto-deploy** (Railway should detect variable changes)

## 🔍 Verification Steps

### 1. Check Service Variables

1. Railway Dashboard → Your Service → **Variables** tab
2. Verify you see:
   - ✅ `PLAID_CLIENT_ID` = (your client ID)
   - ✅ `PLAID_SECRET` = (your secret - hidden)
   - ✅ `PLAID_ENV` = `production`

### 2. Check Deployment Logs

1. Railway Dashboard → Your Service → **Deployments** → Latest
2. Click **View Logs**
3. Look for:
   - ✅ Server starting successfully
   - ❌ Should NOT see: "Plaid credentials are missing"
   - ✅ Should see: "🚀 Server running on port..."

### 3. Test Backend Endpoint

```bash
curl -X POST https://cardscout-production.up.railway.app/api/plaid/create-link-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test"}'
```

**Expected response:**
```json
{
  "success": true,
  "link_token": "link-production-..."
}
```

**If you get an error:**
- Check Railway logs for the exact error
- Verify variable names are exact (case-sensitive)
- Make sure `PLAID_ENV=production` (not `PLAID_ENVIRONMENT`)

## 🐛 Common Issues

### Issue 1: Variables in Wrong Place

**Symptom**: Added to project but service can't see them

**Fix**: Add variables directly to the **service** (not just project)

### Issue 2: Variable Names Wrong

**Symptom**: Still getting "credentials missing" error

**Check**: Variable names must be **exact** (case-sensitive):
- ✅ `PLAID_CLIENT_ID` (not `PLAID_CLIENTID` or `plaid_client_id`)
- ✅ `PLAID_SECRET` (not `PLAID_SECRET_KEY` or `plaid_secret`)
- ✅ `PLAID_ENV` (not `PLAID_ENVIRONMENT` or `PLAID_ENV_NAME`)

### Issue 3: Not Redeployed

**Symptom**: Variables added but service still using old config

**Fix**: 
1. Trigger a new deployment
2. Or push a code change to trigger auto-deploy

### Issue 4: Environment Value Wrong

**Symptom**: Using sandbox instead of production

**Check**: `PLAID_ENV` must be exactly `production` (lowercase)

**Valid values**:
- `sandbox`
- `development`
- `production`

### Issue 5: Extra Spaces/Characters

**Symptom**: Credentials look right but still fail

**Fix**: 
1. Remove any leading/trailing spaces
2. Copy credentials exactly from Plaid dashboard
3. Don't add quotes around values in Railway

## 📋 Step-by-Step Fix

1. **Go to Railway**: https://railway.app
2. **Select Service**: Click on `cardscout-production` service
3. **Variables Tab**: Click "Variables" in the service
4. **Add Variables**: Click "New Variable" and add:
   - Name: `PLAID_CLIENT_ID`, Value: (your client ID)
   - Name: `PLAID_SECRET`, Value: (your secret)
   - Name: `PLAID_ENV`, Value: `production`
5. **Save**: Variables save automatically
6. **Redeploy**: Go to Deployments → Click "Redeploy"
7. **Check Logs**: Wait for deployment, check logs for errors
8. **Test**: Test the endpoint with curl

## ✅ Success Indicators

After fixing, you should see in Railway logs:

```
🚀 Server running on port 3000
📡 Environment: production
🔗 API available at http://localhost:3000/api
```

And when testing the endpoint, you should get a valid link token (not an error).

## 💡 Pro Tip

**Best Practice**: Always add environment variables **directly to the service** rather than relying on shared variables. This ensures they're definitely available to your service.

