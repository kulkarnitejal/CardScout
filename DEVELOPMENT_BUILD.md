# Creating a Development Build for iOS

Since Plaid SDK requires native modules, you need a development build (not Expo Go).

## Option 1: EAS Build (Cloud - Recommended)

This builds your app in the cloud. Easiest option.

### Step 1: Login to Expo (No Installation Needed!)

You can use `npx` to run EAS CLI without installing globally:

```bash
npx eas-cli@latest login
```

Enter your Expo account email/username when prompted.
(If you don't have an account, create one at https://expo.dev)

(If you don't have an Expo account, create one at https://expo.dev)

### Step 3: Configure EAS

```bash
npx eas-cli@latest build:configure
```

(Or if you installed globally: `eas build:configure`)

This will create an `eas.json` file.

### Step 4: Build for iOS Development

```bash
npx eas-cli@latest build --profile development --platform ios
```

(Or if you installed globally: `eas build --profile development --platform ios`)

This will:
- Build your app in the cloud
- Take about 10-15 minutes
- Give you a download link or install link

### Step 5: Install on Your Device

- Download the `.ipa` file
- Install via TestFlight (if configured) or direct install
- Or scan the QR code provided

### Step 6: Run Development Server

After installing the development build:

```bash
npm start
```

Then:
- Open the development build app on your device
- Scan the QR code or press `i` to open in simulator
- Your app will load with native modules support

## Option 2: Local Development Build (Faster for Testing)

Build locally on your Mac (requires Xcode).

### Step 1: Install iOS Dependencies

```bash
npx expo prebuild --clean
```

This generates the native iOS project.

### Step 2: Build and Run

```bash
npx expo run:ios
```

This will:
- Build the iOS app locally
- Install on connected device or simulator
- Start the development server automatically

### For Physical Device:

1. Connect your iPhone via USB
2. Trust your computer on the iPhone
3. Run: `npx expo run:ios --device`
4. Select your device when prompted

## Option 3: Quick Test with Simulator

If you just want to test quickly:

```bash
npx expo run:ios
```

This will open in iOS Simulator (no physical device needed).

## After Building

Once you have the development build installed:

1. **Start the dev server:**
   ```bash
   npm start
   ```

2. **Open the development build app** on your device (not Expo Go)

3. **The app will connect** to your dev server automatically

4. **Test Plaid connection** - it should now work!

## Troubleshooting

### "Command not found: eas"
- Install: `npm install -g eas-cli`

### "No devices found"
- Make sure iPhone is connected via USB
- Trust the computer on your iPhone
- Unlock your iPhone

### Build fails
- Check that you have Xcode installed (for local builds)
- Make sure you're logged into Expo account (for EAS builds)
- Check error messages in the build output

### App doesn't connect to dev server
- Make sure dev server is running: `npm start`
- Check that device and computer are on same WiFi
- Try restarting the dev server

## Which Option to Choose?

- **EAS Build (Cloud)**: Best if you don't have Xcode or want easiest setup
- **Local Build**: Best if you have Xcode and want faster iteration
- **Simulator**: Best for quick testing without a physical device

## Next Steps

After creating the development build:
1. Install it on your device
2. Run `npm start` to start dev server
3. Open the development build app
4. Test Plaid connection - it should work now!

