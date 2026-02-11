# Account Deletion Setup

This document explains how to set up the account deletion feature that fully removes users from Supabase.

## Overview

The account deletion feature uses a server-side endpoint to delete users from `auth.users` table. This requires admin privileges (service role key) which should **never** be exposed in client-side code.

## Server Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install `@supabase/supabase-js` which is required for the admin client.

### 2. Environment Variables

Add these environment variables to your server:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**⚠️ Important:**
- `SUPABASE_SERVICE_ROLE_KEY` is the **service_role** key (not anon key)
- This key has admin privileges and should **NEVER** be exposed in client code
- Keep it secure in your server environment only

### 3. Getting Your Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, find the **service_role** key
5. Copy it and add it to your server environment variables

### 4. Running the Server

**Development:**
```bash
cd server
npm run dev
```

**Production:**
```bash
cd server
npm run build
npm start
```

## How It Works

1. **Client calls server endpoint**: The app calls `DELETE /api/user/delete` with the user's auth token
2. **Server verifies identity**: The server verifies the token and extracts the user ID
3. **Server deletes all data**: 
   - Deletes all transactions
   - Deletes all accounts
   - Deletes all plaid_items
4. **Server deletes auth user**: Uses admin client to delete from `auth.users` table
5. **Client signs out**: User is signed out and redirected to login

## API Endpoint

**Endpoint:** `DELETE /api/user/delete`

**Headers:**
```
Authorization: Bearer <user-access-token>
Content-Type: application/json
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Account and all associated data deleted successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Fallback Behavior

If the server endpoint is not available or fails, the client will:
- Still delete all user data (transactions, accounts, plaid_items)
- Sign the user out
- **But** the user record in `auth.users` will remain

This ensures the feature works even if the server is down, though full deletion requires the server endpoint.

## Security Notes

- ✅ Service role key is only used on the server
- ✅ User identity is verified via JWT token
- ✅ Users can only delete their own account
- ✅ All data is permanently deleted
- ✅ User is signed out after deletion

## Troubleshooting

### "Supabase admin client not configured"
- Make sure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in your server environment

### "Invalid or expired token"
- User needs to be logged in
- Token may have expired - user should sign in again

### "Failed to delete user account"
- Check server logs for detailed error
- Verify service role key is correct
- Check Supabase dashboard for any issues

## Testing

1. Start the server: `cd server && npm run dev`
2. Make sure environment variables are set
3. Test the endpoint:
   ```bash
   curl -X DELETE http://localhost:3000/api/user/delete \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json"
   ```
4. Verify in Supabase dashboard that user and all data are deleted

