# Troubleshoot Dev Server Connection

If the dev server isn't connecting, try these solutions:

## Solution 1: Use Tunnel Mode

Stop your current dev server (Ctrl+C) and restart with tunnel:

```bash
npx expo start --tunnel
```

This uses Expo's tunnel service which works even if devices are on different networks.

## Solution 2: Use LAN Mode Explicitly

Make sure the dev server is listening on your network:

```bash
npx expo start --lan
```

This explicitly tells Expo to use your local network IP.

## Solution 3: Check Firewall

Your Mac's firewall might be blocking port 8081:

1. **System Settings** → **Network** → **Firewall**
2. Make sure firewall is configured to allow connections
3. Or temporarily disable firewall to test

## Solution 4: Try Different URL Format

In the app, try these URL formats:

1. **exp:// protocol:**
   ```
   exp://192.168.1.205:8081
   ```

2. **http:// protocol:**
   ```
   http://192.168.1.205:8081
   ```

3. **With explicit path:**
   ```
   http://192.168.1.205:8081/
   ```

## Solution 5: Check Network Interface

Make sure you're using the correct network interface:

```bash
# Check which network you're on
ifconfig | grep "inet " | grep -v 127.0.0.1

# Make sure both devices show similar IP ranges
# e.g., both 192.168.1.x or both 10.0.x.x
```

## Solution 6: Restart Everything

1. **Stop dev server:** Press Ctrl+C in terminal
2. **Kill any remaining processes:**
   ```bash
   lsof -ti:8081 | xargs kill -9
   ```
3. **Clear Metro cache:**
   ```bash
   npx expo start --clear
   ```
4. **Try connecting again**

## Solution 7: Use QR Code (If Available)

If your terminal shows a QR code:
1. Open Camera app on iPhone
2. Scan the QR code
3. It should open in Expo app automatically

## Solution 8: Check Expo CLI Version

Make sure you're using a recent version:

```bash
npx expo --version
```

Update if needed:
```bash
npm install -g expo-cli@latest
```

## Solution 9: Check for Error Messages

Look at the terminal where `npm start` is running:
- Are there any error messages?
- Does it say "Metro waiting on..."?
- Is there a URL shown?

## Solution 10: Manual Connection via Expo Go (Temporary)

As a last resort, you can test with Expo Go first:
1. Install Expo Go from App Store
2. Run `npx expo start`
3. Scan QR code with Expo Go
4. This confirms your dev server works

Then go back to development build.

## Most Common Issue: Firewall

The most common cause is the Mac firewall blocking incoming connections. Try:

```bash
# Temporarily allow connections (requires admin)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

Or disable firewall temporarily in System Settings to test.

