# Plaid Production Migration Guide

This guide walks you through migrating from Plaid's development/sandbox environment to production.

## Prerequisites

1. **Plaid Account**: You need a Plaid account. If you don't have one, sign up at [https://dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)

2. **Production Access**: To use production, you typically need to:
   - Complete Plaid's onboarding process
   - Submit your application for review (if required)
   - Get approved for production access

## Step 1: Get Production Credentials

1. **Log into Plaid Dashboard**: Go to [https://dashboard.plaid.com](https://dashboard.plaid.com)

2. **Navigate to Team Settings → Keys**:
   - Click on your team name in the top right
   - Go to "Team Settings"
   - Click on "Keys" in the left sidebar

3. **Copy Production Credentials**:
   - **Production Client ID**: Found in the "Production" section
   - **Production Secret**: Click "Show" to reveal the secret key
   - ⚠️ **IMPORTANT**: These are different from your development/sandbox credentials

## Step 2: Update Environment Variables

Update your server's `.env` file (or environment variables in your hosting platform):

### For Local Development:
```bash
# In server/.env file
PLAID_CLIENT_ID=your_production_client_id_here
PLAID_SECRET=your_production_secret_key_here
PLAID_ENV=production
```

### For Production Deployment:
Set these environment variables in your hosting platform (Heroku, AWS, Railway, etc.):
- `PLAID_CLIENT_ID` = Your production client ID
- `PLAID_SECRET` = Your production secret key
- `PLAID_ENV` = `production`

## Step 3: Code Changes Required

✅ **Good News**: Your code already supports production! The `plaid.config.ts` file already handles the `production` environment.

However, you should verify:

1. **Environment Variable Name**: Make sure you're using `PLAID_ENV` (not `PLAID_ENVIRONMENT`)
2. **Valid Values**: The environment accepts: `'sandbox' | 'development' | 'production'`

## Step 4: Important Differences Between Dev and Production

### Development/Sandbox:
- ✅ Test credentials work (e.g., `user_good`, `pass_good`)
- ✅ No real bank connections
- ✅ Unlimited API calls
- ✅ No fees
- ✅ Instant access

### Production:
- ⚠️ **Real bank connections only** - No test credentials
- ⚠️ **Rate limits** - API calls are limited based on your plan
- ⚠️ **Fees apply** - Check Plaid's pricing
- ⚠️ **User consent required** - Users must agree to Plaid's terms
- ⚠️ **Webhook verification** - Production webhooks must be verified
- ⚠️ **Compliance** - Must follow Plaid's compliance requirements

## Step 5: Testing Production

⚠️ **Warning**: In production, you cannot use test credentials. You must:
1. Connect real bank accounts
2. Use real user data
3. Be aware that transactions are real

**Recommendation**: Test thoroughly in sandbox/development first, then do a small production test with a real account you control.

## Step 6: Additional Production Considerations

### 1. Webhooks (if you use them)
- Production webhooks require verification
- Update webhook URLs to production endpoints
- Ensure your server can handle webhook verification

### 2. Error Handling
- Production errors may differ from development
- Ensure proper error logging and monitoring
- Set up alerts for production issues

### 3. Compliance
- Review Plaid's compliance requirements
- Ensure your app follows Plaid's terms of service
- Consider GDPR, CCPA, and other privacy regulations

### 4. Monitoring
- Set up monitoring for API usage
- Track rate limits
- Monitor for errors and failures

## Step 7: Rollback Plan

If you need to rollback to development:
1. Change `PLAID_ENV` back to `development` or `sandbox`
2. Use development credentials
3. Restart your server

## Verification Checklist

- [ ] Production credentials obtained from Plaid Dashboard
- [ ] Environment variables updated (`PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV=production`)
- [ ] Server restarted with new environment variables
- [ ] Tested with a real bank account (small test first)
- [ ] Error handling and logging verified
- [ ] Monitoring set up for production
- [ ] Compliance requirements reviewed

## Support

- **Plaid Support**: [https://support.plaid.com](https://support.plaid.com)
- **Plaid Dashboard**: [https://dashboard.plaid.com](https://dashboard.plaid.com)
- **Plaid Documentation**: [https://plaid.com/docs](https://plaid.com/docs)

## Current Code Status

✅ Your code is already production-ready! The `plaid.config.ts` file supports:
- `sandbox` environment
- `development` environment  
- `production` environment

You just need to:
1. Get production credentials
2. Update environment variables
3. Set `PLAID_ENV=production`

