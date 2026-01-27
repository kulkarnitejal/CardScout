# Debugging Network Issues in TestFlight

## Issue: Network Requests Failing in TestFlight

If network requests are failing in TestFlight, here's how to debug:

## ✅ Configuration Check

Your `eas.json` is correctly configured:
- ✅ Production profile has `EXPO_PUBLIC_API_URL: "https://cardscout-production.up.railway.app/api"`
- ✅ Preview-testflight profile also has the URL

## 🔍 How to Verify the Build is Using Production URL

### Step 1: Check Build Profile

When you built, did you use:
```bash
npm run build:ios:production
# OR
eas build --platform ios --profile production
```

**Important**: If you used `preview` profile instead of `production`, it won't have the API URL!

### Step 2: Verify Environment Variable is Set

The environment variable `EXPO_PUBLIC_API_URL` must be:
1. ✅ Set in `eas.json` (already done)
2. ✅ Available at **build time** (EAS handles this)
3. ✅ Read correctly in the app (code checks for it)

### Step 3: Check What URL the App is Actually Using

I've added logging to help debug. The app will now log:
- Environment check (dev vs prod)
- Whether production URL is set
- Final API URL being used

**To see these logs:**
1. Connect device via USB
2. Open Xcode → Window → Devices and Simulators
3. Select your device
4. Click "Open Console"
5. Filter for your app
6. Look for logs starting with 🔍, ✅, or 🌐

## 🐛 Common Issues

### Issue 1: Built with Wrong Profile

**Symptom**: Network requests fail, app uses localhost

**Fix**: Rebuild with production profile:
```bash
npm run build:ios:production
```

### Issue 2: Environment Variable Not Injected

**Symptom**: Logs show "Production API URL not configured"

**Fix**: 
1. Check `eas.json` has the env var
2. Rebuild (env vars are injected at build time)
3. Verify in build logs that env var was set

### Issue 3: Backend Not Accessible

**Symptom**: Network errors, connection refused

**Fix**:
1. Test backend directly:
   ```bash
   curl https://cardscout-production.up.railway.app/api/health
   ```
2. Check Railway dashboard - is service running?
3. Check Railway logs for errors

### Issue 4: HTTPS/SSL Issues

**Symptom**: SSL errors, certificate errors

**Fix**: 
- Railway should handle SSL automatically
- Check Railway dashboard for SSL status

## 🔧 Quick Fix: Add Debug Screen

To help debug, you can temporarily add a debug screen that shows:
- Current API URL
- Environment (dev/prod)
- Network test results

## 📋 Verification Checklist

Before rebuilding, verify:

- [ ] `eas.json` has `EXPO_PUBLIC_API_URL` in production profile ✅
- [ ] Backend is accessible: `curl https://cardscout-production.up.railway.app/api/health` ✅
- [ ] Built with `--profile production` (not preview) ❓
- [ ] Check build logs to confirm env var was set ❓
- [ ] Check device console logs to see what URL app is using ❓

## 🚀 Next Steps

1. **Rebuild with production profile** (if you used preview):
   ```bash
   npm run build:ios:production
   ```

2. **Check build logs** in Expo dashboard:
   - Look for environment variables being set
   - Verify `EXPO_PUBLIC_API_URL` appears

3. **Test backend directly**:
   ```bash
   curl https://cardscout-production.up.railway.app/api
   curl https://cardscout-production.up.railway.app/api/health
   ```

4. **Check device logs** after installing TestFlight build:
   - Connect device
   - Open Xcode Console
   - Look for API URL logs

5. **Verify Railway backend is running**:
   - Railway dashboard → Service → Logs
   - Should see "Server running on port..."

## 💡 Pro Tip

The updated code now logs the API URL being used. After installing the new build, check the console logs to see exactly what URL the app is trying to use. This will tell you if:
- The env var is being read correctly
- The app is in production mode
- The URL is correct

