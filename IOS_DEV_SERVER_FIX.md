# iOS Dev Server Connection - Known Issue Fix

This is a **known issue** with Expo development builds on iOS. According to [GitHub issue #29005](https://github.com/expo/expo/issues/29005), iOS development builds don't automatically discover development servers (unlike Android).

## The Issue

- ✅ **Android**: Automatically finds dev servers
- ❌ **iOS**: Requires manual connection (this is expected behavior)

## Solutions

### Solution 1: Use QR Code (Easiest)

1. Run your dev server:
   ```bash
   npm start
   ```

2. A QR code will appear in the terminal

3. **On your iPhone:**
   - Open the **Camera app** (not the Expo app)
   - Point it at the QR code in your terminal
   - Tap the notification that appears
   - It will open in your development build app

### Solution 2: Manual URL Entry (What You're Doing)

This is the **expected way** on iOS. Make sure you're using the correct format:

**Use `exp://` protocol:**
```
exp://192.168.1.205:8081
```

**NOT `http://`:**
```
http://192.168.1.205:8081  ❌ This might not work
```

### Solution 3: Use Tunnel Mode

Tunnel mode is more reliable and works even on different networks:

```bash
npx expo start --tunnel
```

Then use the URL shown (looks like `exp://abc-123.tunnel.exp.direct:80`)

### Solution 4: Check Network Discovery

Make sure both devices can see each other:

1. **Verify same WiFi:**
   - iPhone and Mac must be on **exact same WiFi network**
   - Check WiFi name matches on both devices

2. **Test connectivity:**
   ```bash
   # On your Mac, test if iPhone can reach it
   # (You can't test this directly, but verify WiFi names match)
   ```

### Solution 5: Use Expo Go for Quick Testing

While this doesn't solve the dev build issue, you can test quickly:

1. Install **Expo Go** from App Store
2. Run `npm start`
3. Scan QR code with Expo Go
4. This confirms your dev server works

Then go back to development build for Plaid testing.

## Why This Happens

According to the GitHub issue, this is **expected behavior** on iOS:
- iOS has stricter network discovery restrictions
- Automatic server discovery doesn't work reliably
- Manual connection is the recommended approach

## Best Practice Workflow

1. **Start dev server:**
   ```bash
   npm start
   ```

2. **Connect via QR code:**
   - Use Camera app to scan QR code
   - Or manually enter: `exp://192.168.1.205:8081`

3. **Save the connection:**
   - Once connected, the app should remember it
   - Future launches should auto-connect

## If Still Not Working

1. **Try tunnel mode** (most reliable):
   ```bash
   npx expo start --tunnel
   ```

2. **Check firewall:**
   - System Settings → Network → Firewall
   - Temporarily disable to test

3. **Verify port is accessible:**
   ```bash
   curl http://192.168.1.205:8081/status
   ```
   Should return: `packager-status:running`

4. **Restart everything:**
   ```bash
   # Kill dev server
   lsof -ti:8081 | xargs kill -9
   
   # Clear cache and restart
   npx expo start --clear
   ```

## Summary

**This is normal iOS behavior** - you need to manually connect. The best approaches are:

1. ✅ **QR code scanning** (easiest)
2. ✅ **Manual URL with `exp://` protocol**
3. ✅ **Tunnel mode** (most reliable)

The automatic discovery that works on Android simply doesn't work on iOS due to platform restrictions.

