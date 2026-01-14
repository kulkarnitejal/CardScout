# CardScout Backend Server

Node.js/Express backend server for CardScout app with Plaid integration.

## Features

- 🔐 Plaid API integration for bank account connections
- 🔒 Secure token management
- 📊 Transaction fetching and processing
- ✅ Input validation and error handling
- 🛡️ Security middleware (Helmet, CORS)

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Plaid credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Plaid credentials from [Plaid Dashboard](https://dashboard.plaid.com):

```
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret_key
PLAID_ENV=sandbox
```

### 3. Run the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

## API Endpoints

### Health Check
```
GET /api/health
```

### Plaid Endpoints

#### Create Link Token
```
POST /api/plaid/create-link-token
Body: { "userId": "optional-user-id" }
Response: { "success": true, "link_token": "..." }
```

#### Exchange Public Token
```
POST /api/plaid/exchange-token
Body: { "public_token": "..." }
Response: { "success": true, "access_token": "...", "item_id": "..." }
```

#### Get Transactions
```
POST /api/plaid/transactions
Body: {
  "access_token": "...",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
Response: { "success": true, "transactions": [...] }
```

#### Get Accounts
```
POST /api/plaid/accounts
Body: { "access_token": "..." }
Response: { "success": true, "accounts": [...] }
```

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## Development

### TypeScript

The project uses TypeScript. To compile:

```bash
npm run build
```

### Environment

- **Development**: Uses `sandbox` Plaid environment
- **Production**: Use `development` or `production` Plaid environment

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file to version control
- Store Plaid access tokens securely (database recommended)
- Implement user authentication before production
- Validate all user inputs
- Use HTTPS in production

## Next Steps

1. ✅ Set up Plaid account and get credentials
2. ✅ Configure environment variables
3. ✅ Test API endpoints
4. 🔄 Add database for storing access tokens
5. 🔄 Implement user authentication
6. 🔄 Add rate limiting
7. 🔄 Set up logging service

## Troubleshooting

**"Plaid credentials are missing" error:**
- Make sure `.env` file exists and contains `PLAID_CLIENT_ID` and `PLAID_SECRET`

**CORS errors:**
- Update `CLIENT_URL` in `.env` to match your frontend URL

**Port already in use:**
- Change `PORT` in `.env` to a different port

