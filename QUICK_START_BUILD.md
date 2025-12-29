# Quick Start: Create Development Build

## Option 1: Use npx (No Global Install Required) ✅

### Step 1: Login
```bash
npx eas-cli@latest login
```

### Step 2: Configure (if needed)
```bash
npx eas-cli@latest build:configure
```

### Step 3: Build
```bash
npx eas-cli@latest build --profile development --platform ios
```

Wait 10-15 minutes, then install the build on your device.

## Option 2: Local Build (Requires Xcode) ⚡ Faster

If you have Xcode installed, this is faster:

```bash
# Generate native iOS project
npx expo prebuild --clean

# Build and install on connected device
npx expo run:ios --device
```

Make sure your iPhone is:
- Connected via USB
- Unlocked
- Trusted your computer

## Option 3: Fix npm Permissions (For Global Install)

If you want to install EAS CLI globally:

```bash
# Fix npm permissions (one-time setup)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Now install globally
npm install -g eas-cli
```

But using `npx` is easier and doesn't require this!

## After Building

1. Install the development build on your device
2. Run: `npm start`
3. Open the development build app (not Expo Go)
4. Test Plaid connection - it should work! 🎉

