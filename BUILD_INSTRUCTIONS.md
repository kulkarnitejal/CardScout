# Build Instructions - Skip Configure Step

Since `eas.json` is already configured, you can skip the `build:configure` step!

## Quick Build Steps

### 1. Login to Expo
```bash
npx eas-cli@latest login
```

### 2. Build for iOS (Skip Configure!)
```bash
npx eas-cli@latest build --profile development --platform ios
```

The `eas.json` file is already set up, so you don't need to run `build:configure`.

## Alternative: Local Build (Faster!)

If you have Xcode installed, this is much faster:

```bash
# Generate native iOS project
npx expo prebuild --clean

# Build and install on your iPhone
npx expo run:ios --device
```

Make sure your iPhone is:
- Connected via USB
- Unlocked  
- You've trusted your computer

## After Building

1. Install the development build on your device
2. Run: `npm start` 
3. Open the development build app (NOT Expo Go)
4. Test Plaid connection - it should work! 🎉

## Note About Plaid SDK

The Plaid SDK doesn't need an Expo config plugin - it works automatically once you have a development build. That's why we removed it from `app.json`.

