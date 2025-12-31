# Fix Worklets Error - Rebuild Required

The `react-native-reanimated` plugin requires a **native rebuild**. Here's how to fix it:

## Quick Fix Steps

### 1. Stop Current Server
Press `Ctrl+C` in the terminal where `npm start` is running.

### 2. Clear Metro Cache and Restart
```bash
npm start -- --clear
```

### 3. Rebuild the Native App (REQUIRED)

Since you're using a development build, you **must rebuild** after adding the Babel plugin:

```bash
# For iOS physical device
npx expo run:ios --device

# Or for iOS simulator
npx expo run:ios
```

This will:
- Rebuild the native iOS app with the new Babel configuration
- Install the updated app on your device
- The Worklets error should be gone

## Why Rebuild is Needed

The `react-native-reanimated/plugin` modifies JavaScript code at build time. The native app needs to be rebuilt to include these changes.

## Alternative: If Rebuild Takes Too Long

If you want to test quickly without rebuilding, you can temporarily remove the drawer navigator and use a simpler menu (like a modal). But for the drawer to work properly, you need the rebuild.

## After Rebuild

Once rebuilt:
1. The drawer menu will work
2. Hamburger icon will open the side menu
3. Sign out and bug report features will be functional

