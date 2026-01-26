# Production Setup Guide

This guide explains what needs to be deployed and configured for your app to work in TestFlight/App Store.

## 🚨 Critical: What's Causing the Blank Screen

Your app is currently showing a blank screen because:

1. **Supabase credentials are placeholders** - The app tries to initialize Supabase on startup and fails
2. **Backend API URL is a placeholder** - Any API calls will fail
3. **No error handling** - These failures cause the app to crash silently

## ✅ What You Need to Deploy/Configure

### Option 1: Full Setup (Recommended for Production)

#### 1. Deploy Backend Server

Your backend needs to be deployed to a public URL. Options:

**A. Railway (Easiest)**
```bash
cd server
# Install Railway CLI: npm i -g @railway/cli
railway login
railway init
railway up
# Get the URL from Railway dashboard
```

**B. Render**
- Go to render.com
- Create new Web Service
- Connect your GitHub repo
- Point to `server/` directory
- Set environment variables (PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV)

**C. Heroku**
```bash
cd server
heroku create your-app-name
heroku config:set PLAID_CLIENT_ID=... PLAID_SECRET=... PLAID_ENV=production
git push heroku main
```

**D. AWS/Google Cloud/Azure**
- Deploy Node.js app
- Set environment variables
- Get public URL

#### 2. Configure Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a project (or use existing)
3. Get your project URL and anon key from Settings → API
4. Set these as environment variables when building

#### 3. Set Environment Variables

When building with EAS:

```bash
eas build --platform ios --profile production \
  --env EXPO_PUBLIC_API_URL=https://your-backend.railway.app/api \
  --env EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  --env EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Or add to `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-backend.railway.app/api",
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

### Option 2: Quick Test (Without Backend)

If you just want to test the app UI without backend functionality:

1. **Set Supabase credentials** (still needed for auth)
2. **Skip backend deployment** - The app will show errors for Plaid features but won't crash
3. **Update constants** to handle missing backend gracefully

## 📋 Step-by-Step Setup

### Step 1: Deploy Backend (Required for Plaid Features)

1. **Choose a hosting platform** (Railway recommended for ease)
2. **Deploy your server**:
   ```bash
   cd server
   # Follow platform-specific deployment steps
   ```
3. **Set environment variables** on your hosting platform:
   - `PLAID_CLIENT_ID` - Your Plaid client ID
   - `PLAID_SECRET` - Your Plaid secret key
   - `PLAID_ENV` - `production` or `sandbox`
   - `PORT` - Usually 3000 or auto-assigned
4. **Get your backend URL** - e.g., `https://cardscout-api.railway.app`
5. **Test your backend**:
   ```bash
   curl https://your-backend-url/api/health
   ```

### Step 2: Configure Supabase (Required for Auth)

1. **Create/Login to Supabase**: [supabase.com](https://supabase.com)
2. **Create a new project** (or use existing)
3. **Get credentials**:
   - Go to Settings → API
   - Copy "Project URL" → This is `EXPO_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → This is `EXPO_PUBLIC_SUPABASE_ANON_KEY`
4. **Set up database tables** (if not already done):
   - Run migrations from your server
   - Or use Supabase SQL editor

### Step 3: Build with Environment Variables

**Option A: Command Line**
```bash
eas build --platform ios --profile production \
  --env EXPO_PUBLIC_API_URL=https://your-backend-url/api \
  --env EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co \
  --env EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Option B: eas.json** (Recommended)
Update `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-backend-url/api",
        "EXPO_PUBLIC_SUPABASE_URL": "https://xxxxx.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key-here"
      }
    }
  }
}
```

### Step 4: Build and Test

```bash
npm run build:ios:production
```

## 🔍 Troubleshooting

### Still seeing blank screen?

1. **Check error boundary** - The app now shows errors instead of blank screen
2. **Check TestFlight crash logs**:
   - Go to App Store Connect
   - Your App → TestFlight → Crashes
3. **Verify environment variables**:
   - Check they're set in `eas.json` or build command
   - Check they don't have placeholder values
4. **Test backend URL**:
   ```bash
   curl https://your-backend-url/api/health
   ```
5. **Test Supabase**:
   - Try logging in via Supabase dashboard
   - Check project is active

### Common Issues

**Issue**: "Network Error" when connecting Plaid
- **Cause**: Backend not deployed or wrong URL
- **Fix**: Deploy backend and set `EXPO_PUBLIC_API_URL`

**Issue**: "Invalid API key" from Supabase
- **Cause**: Wrong Supabase credentials
- **Fix**: Double-check URL and anon key from Supabase dashboard

**Issue**: App crashes on startup
- **Cause**: Invalid Supabase configuration
- **Fix**: App now handles this gracefully, but check credentials

## 📝 Checklist

Before building for TestFlight:

- [ ] Backend deployed and accessible (test with curl)
- [ ] Backend URL added to `eas.json` or build command
- [ ] Supabase project created
- [ ] Supabase URL and anon key added to `eas.json` or build command
- [ ] Plaid credentials set on backend (PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV)
- [ ] Database tables created in Supabase
- [ ] Test build locally first (if possible)

## 🚀 Quick Start (Minimal Setup)

If you want to test the app quickly:

1. **Set Supabase** (required for app to start):
   ```bash
   # In eas.json production env:
   "EXPO_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
   "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-key"
   ```

2. **Leave backend empty** - App will show errors for Plaid features but won't crash

3. **Build**:
   ```bash
   npm run build:ios:production
   ```

The app will start and show login screen, but Plaid features won't work until backend is deployed.

