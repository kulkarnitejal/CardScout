# Where to Find Production Error Logs

When a user encounters an error during signup (or any other action), here's where to find the logs:

## 🔍 Signup Error Logs

Since signup uses **Supabase Auth**, errors are logged in multiple places:

### 1. **Supabase Dashboard** (Primary Location for Auth Errors)

**Where to look:**
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Navigate to **Logs** → **Auth Logs**
4. Or go to **Authentication** → **Users** to see user creation attempts

**What you'll see:**
- User signup attempts
- Authentication errors
- Email verification status
- Failed login attempts
- Error messages and stack traces

**How to access:**
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/logs/auth
```

### 2. **Supabase Database Logs**

**Where to look:**
1. Supabase Dashboard → **Logs** → **Postgres Logs**
2. Or **Database** → **Logs**

**What you'll see:**
- Database query errors
- Row Level Security (RLS) policy violations
- Connection issues

### 3. **Railway Backend Logs** (If Backend is Involved)

**Where to look:**
1. Go to [railway.app](https://railway.app)
2. Select your project → `cardscout-production` service
3. Click **Deployments** → Select latest deployment → **View Logs**

**What you'll see:**
- Backend API errors
- Plaid integration errors
- Server-side errors

**How to access:**
```
https://railway.app/project/YOUR_PROJECT_ID/service/YOUR_SERVICE_ID/deployments
```

### 4. **App Store Connect Crash Logs** (For App Crashes)

**Where to look:**
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Your App → **TestFlight** → **Crashes**
3. Or **Analytics** → **Crashes**

**What you'll see:**
- App crashes
- Exception logs
- Stack traces from production builds

### 5. **Expo Dashboard** (Build & Runtime Errors)

**Where to look:**
1. Go to [expo.dev](https://expo.dev)
2. Your Project → **Builds** → Select build → **View Logs**

**What you'll see:**
- Build errors
- Runtime errors (if using Expo's error reporting)

## 📊 Current Error Logging

### What's Currently Logged:

**In the App:**
- `console.error()` calls (visible in development, not in production)
- Error boundary catches React errors
- Alert messages shown to users

**In Supabase:**
- All authentication events
- Database errors
- API errors

**In Backend (Railway):**
- Server errors via `console.error()`
- HTTP request/response logs (via Morgan)

## ⚠️ Limitations

**Current Issues:**
1. **No centralized error tracking** - Errors are scattered
2. **No production console logs** - `console.error()` doesn't show in production
3. **No error reporting service** - No Sentry, Bugsnag, etc.
4. **User errors only shown in Alert** - Not logged anywhere

## ✅ Recommended: Add Error Tracking

### Option 1: Add Sentry (Recommended)

Sentry provides comprehensive error tracking:

```bash
npm install @sentry/react-native
```

Then add to your app to track all errors automatically.

### Option 2: Add Custom Error Logging

Log errors to your backend or a logging service.

### Option 3: Use Supabase Edge Functions

Create an edge function to log errors to Supabase.

## 🔎 How to Debug a Specific Signup Error

### Step 1: Check Supabase Auth Logs
1. Go to Supabase Dashboard
2. **Logs** → **Auth Logs**
3. Filter by time/date
4. Look for signup attempts around the error time
5. Check error messages

### Step 2: Check User in Supabase
1. **Authentication** → **Users**
2. Search for the email address
3. Check if user was created
4. Check email verification status

### Step 3: Check Railway Logs (if backend involved)
1. Railway Dashboard → Your service → Logs
2. Look for API calls around the error time
3. Check for backend errors

### Step 4: Check App Store Connect (if app crashed)
1. App Store Connect → TestFlight → Crashes
2. Look for crash reports around the error time

## 📝 Common Signup Errors & Where to Find Them

| Error Type | Location | How to Access |
|------------|----------|---------------|
| Email already exists | Supabase Auth Logs | Dashboard → Logs → Auth |
| Invalid email format | Supabase Auth Logs | Dashboard → Logs → Auth |
| Weak password | Supabase Auth Logs | Dashboard → Logs → Auth |
| Network error | Railway Logs | Railway → Service → Logs |
| Database error | Supabase Postgres Logs | Dashboard → Logs → Postgres |
| App crash | App Store Connect | TestFlight → Crashes |

## 🚀 Quick Access Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Railway Dashboard**: https://railway.app
- **App Store Connect**: https://appstoreconnect.apple.com
- **Expo Dashboard**: https://expo.dev

## 💡 Pro Tip

**Set up email alerts:**
- Supabase: Configure email notifications for errors
- Railway: Set up alerts for deployment failures
- App Store Connect: Enable crash report emails

This way you'll be notified immediately when errors occur!

