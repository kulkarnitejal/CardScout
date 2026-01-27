# Submitting Build to App Store Connect

## Quick Submit

After your build completes in Expo dashboard, submit it to App Store Connect:

```bash
# Submit the latest build
npm run submit:ios:latest

# Or submit a specific build ID
npm run submit:ios
# Then enter the build ID when prompted
```

## Step-by-Step Process

### Option 1: Submit Latest Build (Easiest)

```bash
eas submit --platform ios --profile production --latest
```

This will:
1. Find your most recent production build
2. Submit it to App Store Connect
3. You'll be prompted for Apple credentials if needed

### Option 2: Submit Specific Build

1. **Get your build ID** from Expo dashboard:
   - Go to https://expo.dev
   - Your Project → Builds
   - Copy the build ID (looks like: `abc123def456`)

2. **Submit the build**:
   ```bash
   eas submit --platform ios --profile production
   ```
   - Enter the build ID when prompted
   - Or use: `eas submit --platform ios --profile production --id YOUR_BUILD_ID`

### Option 3: Submit from Expo Dashboard

1. Go to https://expo.dev
2. Navigate to your project
3. Go to **Builds** tab
4. Find your completed build
5. Click **Submit to App Store**

## Authentication

When submitting, you'll need:

1. **App Store Connect API Key** (Recommended):
   - If you set this up earlier, it will be used automatically
   - If not, you'll be prompted to authenticate

2. **Apple ID** (Alternative):
   - You can use your Apple ID and password
   - Or use App Store Connect API key (more secure)

## After Submission

1. **Wait for processing** (5-15 minutes):
   - App Store Connect needs to process the build
   - You'll get an email when it's ready

2. **Check App Store Connect**:
   - Go to https://appstoreconnect.apple.com
   - Your App → TestFlight → iOS Builds
   - You should see your build processing/ready

3. **Add to TestFlight**:
   - Once processed, the build will appear in TestFlight
   - You can add it to a TestFlight group
   - Invite testers or use internal testing

## Troubleshooting

### "No builds found"
- Make sure you built with `--profile production`
- Check that the build completed successfully in Expo dashboard
- Verify you're using the correct Apple account

### "Build not found"
- Double-check the build ID
- Make sure the build is for iOS (not Android)
- Verify the build status is "finished" in Expo dashboard

### "Authentication failed"
- Make sure your App Store Connect API key is valid
- Or use `eas credentials` to set up credentials again
- Check that your Apple Developer account has proper permissions

### Build appears in App Store Connect but not in TestFlight
- Wait a few minutes - processing can take 5-15 minutes
- Check the build status in App Store Connect
- Make sure the build is for the correct app/bundle ID

## Quick Commands Reference

```bash
# Build and submit in one go (future builds)
eas build --platform ios --profile production --auto-submit

# Submit latest build
eas submit --platform ios --profile production --latest

# Submit specific build
eas submit --platform ios --profile production --id BUILD_ID

# Check submission status
eas submit:list
```

## Next Steps After Submission

1. ✅ Build submitted to App Store Connect
2. ⏳ Wait for processing (5-15 minutes)
3. ✅ Build appears in TestFlight
4. 📱 Add testers or use internal testing
5. 🚀 Test your app in TestFlight

