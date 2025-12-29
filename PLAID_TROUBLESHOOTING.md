# Plaid Link Troubleshooting

## Issue: "Connecting..." but Plaid Link doesn't open

If you click "Connect Bank Account" and it shows "Connecting..." but Plaid Link doesn't open, try these steps:

### 1. Check Console Logs

Look for these log messages in your Expo console:
- `🔄 Generating link token...` - Should appear when you click the button
- `✅ Link token received: ...` - Should appear if token generation succeeds
- `🔧 Creating Plaid Link session...` - Should appear after token received
- `🚀 Scheduling Plaid Link open...` - Should appear before opening
- `🚀 Opening Plaid Link now...` - Should appear when trying to open
- `📞 Calling open() function...` - Should appear right before open()
- `✅ open() function called successfully` - Should appear if open() succeeds

### 2. Common Issues

#### Issue: Network Error
- **Symptom**: Error generating link token
- **Solution**: 
  - Make sure backend is running: `cd server && npm run dev`
  - For physical device, use IP address in `src/utils/constants.ts`
  - Check that device and computer are on same WiFi

#### Issue: Token Generated but Link Doesn't Open
- **Symptom**: See "✅ Link token received" but no Plaid UI
- **Possible Causes**:
  1. Native modules not properly linked
  2. iOS build needs to be rebuilt
  3. SDK version compatibility issue

### 3. Rebuild Native Modules (Expo)

If Plaid Link isn't opening, you may need to rebuild:

```bash
# Clear cache and rebuild
npx expo start --clear

# Or for development build
npx expo prebuild --clean
```

### 4. Check iOS Configuration

For iOS, make sure:
- You're using a development build (not Expo Go) - Plaid SDK requires native modules
- Native modules are properly linked
- iOS build is up to date

### 5. Verify SDK Installation

Check if Plaid SDK is properly installed:

```bash
npm list react-native-plaid-link-sdk
```

Should show version `^12.7.0` or similar.

### 6. Test with Development Build

Plaid SDK requires native modules, so you need a development build:

```bash
# Build for iOS
npx expo run:ios

# Or use EAS Build
eas build --profile development --platform ios
```

### 7. Check for Errors

Look for any red errors in:
- Expo console
- Xcode console (if building natively)
- Device logs

### 8. Verify Token is Valid

The link token should start with `link-sandbox-` or `link-development-` or `link-production-`.

If you see the token in logs but Link doesn't open, the token might be invalid or expired.

## Quick Test

1. Click "Connect Bank Account"
2. Check console for all the log messages above
3. Share which messages you see and which are missing
4. This will help identify where the flow is breaking

