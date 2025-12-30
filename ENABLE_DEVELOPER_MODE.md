# Enable Developer Mode on iPhone

The error shows: **"Developer Mode disabled - To use iPhone for development, enable Developer Mode in Settings → Privacy & Security."**

## Steps to Enable Developer Mode

### 1. On Your iPhone

1. Open **Settings** app
2. Go to **Privacy & Security**
3. Scroll down to find **Developer Mode**
4. Toggle **Developer Mode** to **ON**
5. Your iPhone will **restart** (this is normal)

### 2. After Restart

1. When your iPhone restarts, you'll see a prompt
2. Tap **Turn On** to confirm Developer Mode
3. Enter your passcode if prompted

### 3. Verify Developer Mode is On

- Go back to Settings → Privacy & Security
- Developer Mode should show as **ON** (green toggle)

## Then Try Building Again

Once Developer Mode is enabled:

```bash
npx expo run:ios --device
```

## Alternative: Use Simulator (No Developer Mode Needed)

If you want to test quickly without enabling Developer Mode:

```bash
npx expo run:ios
```

This will open in iOS Simulator instead of your physical device.

## Why Developer Mode is Needed

Developer Mode is required by Apple for:
- Installing development builds
- Running apps that aren't from the App Store
- Debugging and development tools

It's safe to enable - it just allows development tools to work.

