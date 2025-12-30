# Connect Development Server to Your Device

Your development build is installed! Now you need to connect it to your dev server.

## Step 1: Start the Development Server

In your terminal, run:

```bash
npm start
```

Or:

```bash
npx expo start
```

You should see:
- A QR code
- A URL like `exp://192.168.x.x:8081`
- Options to press `i` for iOS or `a` for Android

## Step 2: Get Your Computer's IP Address

The URL in your app shows `http://10.0.0.25:8081`, but you need your computer's actual IP.

**Find your IP:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for an IP like `192.168.x.x` or `10.0.x.x`

## Step 3: Connect in the App

### Option A: Use the URL from Terminal

When you run `npm start`, it will show a URL. Use that in the app.

### Option B: Enter URL Manually

1. In the Expo app on your device, tap "Enter URL manually"
2. Replace the URL with: `http://YOUR_IP:8081`
   - Replace `YOUR_IP` with your computer's IP address
   - Example: `http://192.168.1.205:8081`
3. Tap "Connect"

## Step 4: Make Sure Device and Computer Are on Same WiFi

- Both your iPhone and computer must be on the **same WiFi network**
- If they're not, the connection won't work

## Troubleshooting

### "Connection refused" or "Cannot connect"
- Make sure `npm start` is running
- Check the IP address is correct
- Verify both devices are on same WiFi
- Try restarting the dev server: Press `r` in the terminal running `npm start`

### Port 8081 is already in use
```bash
# Kill the process using port 8081
lsof -ti:8081 | xargs kill -9

# Then start again
npm start
```

### Still can't connect
1. Check your computer's firewall isn't blocking port 8081
2. Try using the `exp://` URL instead of `http://`
3. Make sure your dev server shows "Metro waiting on..."

## Quick Test

1. Run: `npm start`
2. Look for the URL in the terminal output
3. Enter that exact URL in your device
4. Tap "Connect"

Your app should load! 🎉

