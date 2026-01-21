# Fix dSYM Error for App Store Submission

This document explains how to fix the "Upload Symbols Failed" error for ReactNativeDependencies.framework when submitting to the App Store.

## The Problem

When archiving your app for App Store submission, you may see this error:

```
Upload Symbols Failed

The archive did not include a dSYM for the ReactNativeDependencies.framework with the UUIDs [B35F1182-B82E-3372-8A74-A4FE502C0906]. 
Ensure that the archive's dSYM folder includes a DWARF file for ReactNativeDependencies.framework with the expected UUIDs.
```

This happens because prebuilt frameworks (like ReactNativeDependencies) need their dSYM files explicitly included in the archive.

## Solution

### Option 1: Add Build Phase Script (Recommended)

1. Open your project in Xcode:
   ```bash
   open ios/GiftCardMaxing.xcworkspace
   ```

2. Select your project in the navigator (GiftCardMaxing)

3. Select the **GiftCardMaxing** target

4. Go to the **Build Phases** tab

5. Click the **+** button at the top and select **New Run Script Phase**

6. Name it: `Copy dSYMs for Prebuilt Frameworks`

7. Drag it to be **after** the `[CP] Embed Pods Frameworks` phase

8. Add this script:
   ```bash
   "${SRCROOT}/scripts/copy-dsyms.sh"
   ```

9. Make sure **"Run script only when installing"** is **unchecked**

10. Save and rebuild your archive

### Option 2: Manual dSYM Copy (If Option 1 doesn't work)

If the script doesn't find the dSYM automatically, you can manually locate and copy it:

1. Find the ReactNativeDependencies dSYM:
   ```bash
   find ios/Pods -name "ReactNativeDependencies.framework.dSYM" -type d
   ```

2. When archiving, the dSYM should be in:
   - `ios/Pods/ReactNativeDependencies-artifacts/ReactNativeDependencies.framework.dSYM`
   - Or in your DerivedData folder

3. After archiving, manually add the dSYM:
   - Open the archive in Xcode Organizer
   - Right-click on the archive → Show in Finder
   - Navigate to `dSYMs` folder
   - Copy the `ReactNativeDependencies.framework.dSYM` into this folder

### Option 3: Use EAS Build (Alternative)

If you're using EAS Build, the dSYMs should be automatically included. Make sure your `eas.json` has:

```json
{
  "build": {
    "production": {
      "ios": {
        "simulator": false
      }
    }
  }
}
```

## Verification

After applying the fix:

1. Archive your app again
2. Check the archive's dSYMs folder contains `ReactNativeDependencies.framework.dSYM`
3. Try uploading to App Store Connect again

## What We Changed

1. **Podfile**: Updated to ensure dSYMs are generated for Release builds
2. **Script**: Created `ios/scripts/copy-dsyms.sh` to automatically copy dSYMs during build
3. **Build Settings**: Ensured `DEBUG_INFORMATION_FORMAT` is set to `dwarf-with-dsym` for Release

## Additional Notes

- The dSYM files are needed for crash reporting and symbolication
- This is a common issue with React Native projects using prebuilt frameworks
- The script will automatically find and copy dSYMs from common locations

## Troubleshooting

If you still get the error:

1. Clean your build folder: `Product → Clean Build Folder` (Shift+Cmd+K)
2. Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
3. Reinstall pods: `cd ios && pod install`
4. Rebuild and archive

If the dSYM still can't be found, check:
- The framework is actually being used (not stripped out)
- The dSYM exists in the Pods directory
- The build configuration is set to Release (not Debug)

