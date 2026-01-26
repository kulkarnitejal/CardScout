# Railway Deployment Setup

## Quick Fix for "Route /api not found" Error

The error occurs because `/api` itself wasn't a route. I've added a root `/api` route that will now respond.

## Railway Configuration

### 1. Build Settings

In Railway dashboard, make sure:
- **Root Directory**: `server` (if deploying from monorepo) or leave empty if deploying server folder directly
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 2. Environment Variables

Set these in Railway dashboard → Variables:

```
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret_key
PLAID_ENV=production
PORT=3000
NODE_ENV=production
```

### 3. Verify Deployment

After deploying, test these endpoints:

```bash
# Root API endpoint (should now work)
curl https://cardscout-production.up.railway.app/api

# Health check
curl https://cardscout-production.up.railway.app/api/health

# Should return:
# {"status":"ok","message":"CardScout API is running",...}
```

## Testing Your Backend

### Test Root Endpoint
```bash
curl https://cardscout-production.up.railway.app/api
```

### Test Health Endpoint
```bash
curl https://cardscout-production.up.railway.app/api/health
```

### Test Plaid Endpoint (requires body)
```bash
curl -X POST https://cardscout-production.up.railway.app/api/plaid/create-link-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test"}'
```

## Troubleshooting

### If you still get "Route /api not found":

1. **Check Railway logs**:
   - Go to Railway dashboard → Your service → Deployments → View logs
   - Look for errors during build or startup

2. **Verify build completed**:
   - Check that `npm run build` succeeded
   - Should see `dist/` folder created

3. **Check start command**:
   - Make sure Railway is running `npm start` (not `npm run dev`)
   - Should see: "🚀 Server running on port 3000"

4. **Verify environment variables**:
   - All required variables are set in Railway
   - No typos in variable names

5. **Redeploy**:
   - After making changes, trigger a new deployment
   - Railway should auto-deploy on git push, or manually trigger

### Common Issues

**Issue**: Server not starting
- **Check**: Railway logs for startup errors
- **Fix**: Verify `npm start` command works locally

**Issue**: Port binding error
- **Check**: Railway automatically assigns PORT, make sure server uses `process.env.PORT`
- **Fix**: Server already uses `process.env.PORT || 3000` ✅

**Issue**: Routes not found
- **Check**: Server is actually running (check logs)
- **Fix**: Root `/api` route now added ✅

## Next Steps

1. ✅ Root `/api` route added - test it
2. ✅ Verify health endpoint works
3. ✅ Test Plaid endpoints with proper authentication
4. ✅ Update app to use Railway URL (already done in eas.json)

