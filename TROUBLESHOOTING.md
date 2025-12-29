# Troubleshooting Network Errors

If you're getting "Network Error" when trying to connect to Plaid:

## Quick Fixes

### 1. Check Your Platform

The API URL is automatically set based on your platform:
- **iOS Simulator**: `http://localhost:3000/api` ✅
- **Android Emulator**: `http://10.0.2.2:3000/api` ✅
- **Physical Device**: Needs your computer's IP address ❌

### 2. For Physical Devices (iPhone/iPad/Android Phone)

You MUST use your computer's IP address instead of localhost.

1. Find your computer's IP address:
   ```bash
   # On Mac/Linux:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows:
   ipconfig
   ```

2. Update `src/utils/constants.ts`:
   ```typescript
   // Uncomment this line and replace with your IP:
   export const API_BASE_URL = 'http://192.168.1.205:3000/api';
   ```

3. Make sure your device and computer are on the **same WiFi network**

### 3. Verify Backend is Running

```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📡 Environment: development
🔗 API available at http://localhost:3000/api
```

### 4. Test Backend Manually

Test if the backend is accessible:

**From your computer:**
```bash
curl http://localhost:3000/api/health
```

**From your device/emulator:**
- Open a browser and go to: `http://YOUR_IP:3000/api/health`
- Should return: `{"status":"ok",...}`

### 5. Check Console Logs

When you try to connect, check the Expo console. You should see:
```
🔗 API Base URL: http://...
📱 Platform: ios/android
```

This tells you what URL the app is trying to use.

### 6. Common Issues

**Issue**: "Network Error" or "ECONNREFUSED"
- **Solution**: Backend not running or wrong URL

**Issue**: "ENOTFOUND"
- **Solution**: Wrong URL or device can't reach your computer

**Issue**: Works on simulator but not physical device
- **Solution**: Use IP address instead of localhost

**Issue**: CORS errors
- **Solution**: Backend CORS is already configured to allow all origins

### 7. Still Not Working?

1. **Restart everything:**
   - Stop backend server (Ctrl+C)
   - Restart backend: `cd server && npm run dev`
   - Reload Expo app (shake device → Reload)

2. **Check firewall:**
   - Make sure port 3000 is not blocked
   - Try temporarily disabling firewall

3. **Try different URL:**
   - If on physical device, try your computer's IP
   - If on emulator, make sure you're using the correct emulator URL

4. **Check network:**
   - Device and computer must be on same WiFi
   - Try disconnecting and reconnecting to WiFi

## Quick Test

Run this in your terminal to test backend:
```bash
curl -X POST http://localhost:3000/api/plaid/create-link-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test"}'
```

Should return: `{"success":true,"link_token":"..."}`

