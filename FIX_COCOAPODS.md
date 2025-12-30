# Fix CocoaPods Build Error

The build is failing because CocoaPods is not installed. Here's how to fix it:

## Step 1: Install CocoaPods

Run this command in your terminal (you'll need to enter your password):

```bash
sudo gem install cocoapods
```

**Alternative (if you have Homebrew):**
```bash
brew install cocoapods
```

## Step 2: Install Pods

After CocoaPods is installed, navigate to the iOS folder and install pods:

```bash
cd ios
pod install
```

If you get errors, try:
```bash
cd ios
pod install --repo-update
```

## Step 3: Clean and Rebuild

After installing pods, clean the build and try again:

```bash
# From project root
cd ios
rm -rf Pods Podfile.lock
pod install

# Then try building again
cd ..
npx expo run:ios --device
```

## Alternative: Use Simulator (No Code Signing Issues)

If you want to test quickly without dealing with code signing:

```bash
npx expo run:ios
```

This builds for the simulator which doesn't require code signing.

## If You Still Get Code Signing Errors

The error `errSecInternalComponent` is a code signing issue. Try:

1. **Open Xcode:**
   ```bash
   open ios/GiftCardMaxing.xcworkspace
   ```

2. **In Xcode:**
   - Select the project in the navigator
   - Go to "Signing & Capabilities"
   - Make sure "Automatically manage signing" is checked
   - Select your development team
   - Build from Xcode (⌘+B)

3. **Or try building from command line with clean:**
   ```bash
   cd ios
   xcodebuild clean -workspace GiftCardMaxing.xcworkspace -scheme GiftCardMaxing
   cd ..
   npx expo run:ios --device
   ```

## Quick Test: Simulator First

To test Plaid quickly without code signing issues:

```bash
npx expo run:ios
```

This will open in iOS Simulator and you can test Plaid there!

