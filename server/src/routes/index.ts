import { Router } from 'express';
import plaidRoutes from './plaid.routes';
import userRoutes from './user.routes';

const router = Router();

// Root API endpoint - provides API information
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CardScout API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      plaid: {
        createLinkToken: 'POST /api/plaid/create-link-token',
        exchangeToken: 'POST /api/plaid/exchange-token',
        getTransactions: 'POST /api/plaid/transactions',
        getAccounts: 'POST /api/plaid/accounts',
      },
      user: {
        deleteAccount: 'DELETE /api/user/delete',
      },
    },
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CardScout API is running',
    timestamp: new Date().toISOString(),
  });
});

// Plaid routes
router.use('/plaid', plaidRoutes);

// User routes
router.use('/user', userRoutes);

export default router;

