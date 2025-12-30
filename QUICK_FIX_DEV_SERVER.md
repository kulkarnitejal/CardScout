# Quick Fix: Dev Server Connection

## Try These in Order:

### 1. Use `exp://` Protocol Instead

In the app, try using `exp://` instead of `http://`:

```
exp://192.168.1.205:8081
```

### 2. Restart with LAN Mode

Stop your current server (Ctrl+C) and restart with:

```bash
npx expo start --lan
```

Then try connecting again with: `exp://192.168.1.205:8081`

### 3. Use Tunnel Mode (Most Reliable)

Stop server and restart with tunnel (works even on different networks):

```bash
npx expo start --tunnel
```

This will give you a URL like `exp://abc-123.tunnel.exp.direct:80`
Use that exact URL in your app.

### 4. Check Firewall

Your Mac firewall might be blocking. Try:

**System Settings** → **Network** → **Firewall** → Temporarily turn off to test

### 5. Verify Network

Make sure both devices are on the **exact same WiFi network**:
- Check WiFi name on both devices
- They must match exactly

### 6. Try from Terminal Output

When you run `npm start`, look at the terminal output:
- It should show a URL
- Copy that **exact** URL
- Use it in the app

## Most Likely Solution: Use Tunnel Mode

```bash
# Stop current server (Ctrl+C)
# Then run:
npx expo start --tunnel
```

This is the most reliable method and works even if devices are on different networks!

