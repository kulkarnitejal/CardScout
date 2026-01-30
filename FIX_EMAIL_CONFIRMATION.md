# Fix: Email Confirmation Link Points to Localhost

## 🚨 Issue

Email confirmation links sent by Supabase are pointing to `localhost` instead of your production app.

## ✅ Solution

This needs to be fixed in **two places**:

### 1. Supabase Dashboard Configuration

You need to configure the redirect URL in Supabase:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   ```
   cardscout://auth/callback
   ```
5. Under **Site URL**, set:
   ```
   cardscout://
   ```
6. Click **Save**

### 2. App Code Configuration

I've updated the code to use the correct redirect URL. The `signUp` function now sets:
- **Development**: `exp://localhost:8081/--/auth/callback`
- **Production**: `cardscout://auth/callback`

### 3. Deep Linking Setup

I've added the app scheme to `app.json`:
```json
{
  "expo": {
    "scheme": "cardscout"
  }
}
```

This allows your app to handle deep links like `cardscout://auth/callback`.

## 🔍 How It Works

### Email Confirmation Flow:

1. User signs up
2. Supabase sends confirmation email
3. Email contains link: `https://your-project.supabase.co/auth/v1/verify?token=...&redirect_to=cardscout://auth/callback`
4. User clicks link
5. Supabase verifies token
6. Redirects to: `cardscout://auth/callback`
7. Your app opens and handles the deep link
8. User is logged in

## 📋 Supabase Dashboard Settings

### Authentication → URL Configuration

**Site URL:**
```
cardscout://
```

**Redirect URLs** (add these):
```
cardscout://auth/callback
cardscout://
exp://localhost:8081/--/auth/callback
```

**Note**: Add multiple URLs:
- `cardscout://auth/callback` - Production app
- `exp://localhost:8081/--/auth/callback` - Development (Expo Go)
- `cardscout://` - Fallback

## 🔧 Additional Configuration (If Needed)

If you want to handle the deep link in your app, you may need to add deep linking handling:

### Option 1: Use Expo Linking (Recommended)

The app should automatically handle `cardscout://` links if the scheme is set in `app.json` (already done).

### Option 2: Add Deep Link Handler

If you need custom handling, add to your navigation:

```typescript
import * as Linking from 'expo-linking';

useEffect(() => {
  // Handle deep links when app is opened
  const subscription = Linking.addEventListener('url', (event) => {
    const { url } = event;
    if (url.includes('auth/callback')) {
      // Handle email confirmation
      // Supabase will automatically complete the verification
    }
  });

  // Check if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url?.includes('auth/callback')) {
      // Handle email confirmation
    }
  });

  return () => subscription.remove();
}, []);
```

## ✅ Verification Steps

### 1. Check Supabase Settings

1. Supabase Dashboard → Authentication → URL Configuration
2. Verify:
   - ✅ Site URL: `cardscout://`
   - ✅ Redirect URLs include: `cardscout://auth/callback`

### 2. Test Email Confirmation

1. Sign up with a new email
2. Check email for confirmation link
3. Click the link
4. Should open your app (not browser/localhost)
5. User should be logged in

### 3. Check Deep Link

Test the deep link manually:
```bash
# On iOS Simulator:
xcrun simctl openurl booted "cardscout://auth/callback"

# On Android Emulator:
adb shell am start -a android.intent.action.VIEW -d "cardscout://auth/callback"
```

## 🐛 Troubleshooting

### Issue: Link still goes to localhost

**Check**:
1. Supabase Dashboard → Authentication → URL Configuration
2. Is `cardscout://auth/callback` in Redirect URLs?
3. Did you rebuild the app after adding the scheme?

**Fix**: 
- Add redirect URL in Supabase
- Rebuild app: `npm run build:ios:production`

### Issue: App doesn't open when clicking link

**Check**:
1. Is `scheme: "cardscout"` in `app.json`? ✅ (already added)
2. Did you rebuild after adding scheme?
3. Is the app installed on the device?

**Fix**: 
- Rebuild and reinstall app
- Test deep link manually

### Issue: Link opens browser instead of app

**Check**:
1. Supabase redirect URL format
2. App scheme configuration

**Fix**: 
- Make sure redirect URL is `cardscout://auth/callback` (not `https://`)
- Verify scheme in `app.json`

## 📝 Summary

**What I Fixed:**
1. ✅ Updated `signUp` function to use production redirect URL
2. ✅ Added `scheme: "cardscout"` to `app.json` for deep linking

**What You Need to Do:**
1. ⚠️ **Go to Supabase Dashboard** → Authentication → URL Configuration
2. ⚠️ **Add redirect URL**: `cardscout://auth/callback`
3. ⚠️ **Set Site URL**: `cardscout://`
4. ✅ **Rebuild app**: `npm run build:ios:production`

After these changes, email confirmation links will open your app instead of localhost!

