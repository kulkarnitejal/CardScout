import { Router } from 'express';
import {
  createLinkToken,
  exchangeToken,
  getTransactions,
  getAccounts,
} from '../controllers/plaid.controller';
import {
  validateExchangeToken,
  validateGetTransactions,
  validateGetAccounts,
} from '../middleware/validation.middleware';

const router = Router();

// Create Plaid Link token
router.post('/create-link-token', createLinkToken);

// Exchange public token for access token
router.post('/exchange-token', validateExchangeToken, exchangeToken);

// Get transactions
router.post('/transactions', validateGetTransactions, getTransactions);

// Get accounts
router.post('/accounts', validateGetAccounts, getAccounts);

export default router;

