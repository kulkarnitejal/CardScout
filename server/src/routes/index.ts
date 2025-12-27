import { Router } from 'express';
import plaidRoutes from './plaid.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GiftCardMaxing API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/plaid', plaidRoutes);

export default router;

