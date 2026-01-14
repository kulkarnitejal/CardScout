import { Router } from 'express';
import plaidRoutes from './plaid.routes';

const router = Router();

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

export default router;

