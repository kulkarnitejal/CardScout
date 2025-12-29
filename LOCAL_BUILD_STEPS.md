# Local Development Build - Recommended Approach

Since EAS is having issues with the Plaid SDK module, let's use a **local build** instead. This is actually faster and easier!

## Prerequisites

- Xcode installed (from Mac App Store)
- iPhone connected via USB (or use Simulator)

## Steps

### 1. Generate Native iOS Project

```bash
npx expo prebuild --clean
```

This creates the `ios/` folder with native code.

### 2. Build and Install on Device

**For Physical iPhone:**
```bash
npx expo run:ios --device
```

**For Simulator (Quick Test):**
```bash
npx expo run:ios
```

### 3. Start Development Server

In a separate terminal:
```bash
npm start
```

The development build will automatically connect to your dev server.

### 4. Test Plaid

Open the development build app on your device and test the Plaid connection!

## Troubleshooting

### "No devices found"
- Make sure iPhone is connected via USB
- Unlock your iPhone
- Trust your computer when prompted

### Build fails
- Make sure Xcode is installed
- Try: `xcode-select --install` if needed
- Check Xcode is up to date

### App doesn't connect to dev server
- Make sure `npm start` is running
- Check device and computer are on same WiFi
- Restart the dev server

## Why Local Build?

- ✅ Faster (no waiting for cloud build)
- ✅ Works around EAS config issues
- ✅ Easier to debug
- ✅ Free (no EAS build minutes used)

