# TestFlight Configuration Guide

This guide ensures your app is properly configured for TestFlight and App Store distribution.

## Critical Configuration Issues Fixed

### 1. ✅ API URL Configuration
- **Fixed**: The API URL now properly switches between development and production
- **Action Required**: Set your production API URL:
  - Option A: Set environment variable `EXPO_PUBLIC_API_URL` in EAS build
  - Option B: Update `src/utils/constants.ts` line 12 with your deployed backend URL

### 2. ✅ EAS Build Configuration
- **Fixed**: Production build now configured for App Store distribution
- **Status**: Ready for TestFlight submission

### 3. ✅ Error Boundary
- **Added**: Error boundary component to catch and display errors instead of blank screen
- **Benefit**: You'll now see error messages if something goes wrong

### 4. ✅ Entry Point
- **Verified**: Entry point is correctly set to `index.ts`

## Required Environment Variables

Before building for TestFlight, ensure these are set:

### For EAS Build:
```bash
# Set these when building:
eas build --platform ios --profile production \
  --env EXPO_PUBLIC_API_URL=https://your-backend-api.com/api \
  --env EXPO_PUBLIC_SUPABASE_URL=your-supabase-url \
  --env EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### Or set in eas.json:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-backend-api.com/api",
        "EXPO_PUBLIC_SUPABASE_URL": "your-supabase-url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-supabase-key"
      }
    }
  }
}
```

## Configuration Checklist

- [ ] **Backend API URL**: Update production API URL in `src/utils/constants.ts` or set `EXPO_PUBLIC_API_URL`
- [ ] **Supabase Credentials**: Update `src/config/supabase.ts` or set environment variables
- [ ] **App Version**: Update version in `app.json` if needed
- [ ] **Build Number**: EAS will auto-increment, but verify in `app.json`

## Building for TestFlight

1. **Update environment variables** (see above)

2. **Build production version**:
   ```bash
   npm run build:ios:production
   ```

3. **Submit to App Store Connect**:
   ```bash
   eas submit --platform ios --profile production
   ```

## Troubleshooting Blank Screen

If you still see a blank screen in TestFlight:

1. **Check Error Boundary**: The app now shows error messages instead of blank screen
2. **Check Console Logs**: Use Xcode Console or TestFlight crash logs
3. **Verify API URL**: Ensure production API URL is accessible
4. **Check Supabase**: Ensure Supabase credentials are correct
5. **Font Loading**: Verify Poppins fonts are loading correctly

## Common Issues

### Issue: Blank Screen
- **Cause**: Unhandled JavaScript error
- **Fix**: Error boundary now catches and displays errors

### Issue: Network Errors
- **Cause**: Wrong API URL in production
- **Fix**: Set `EXPO_PUBLIC_API_URL` environment variable

### Issue: Authentication Fails
- **Cause**: Supabase credentials not set
- **Fix**: Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Issue: Fonts Not Loading
- **Cause**: Font files not bundled
- **Fix**: Verify `@expo-google-fonts/poppins` is in dependencies (already added)

## Next Steps

1. Set your production API URL
2. Set your Supabase credentials
3. Build and test locally first
4. Build for TestFlight
5. Monitor error logs in TestFlight

