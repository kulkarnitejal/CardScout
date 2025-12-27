import { Request, Response } from 'express';
import plaidService from '../services/plaid.service';

export const createLinkToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // In production, get userId from authenticated session/token
    const userId = req.body.userId || req.headers['user-id'] || 'default-user-id';
    
    const linkToken = await plaidService.createLinkToken(userId);
    
    res.json({
      success: true,
      link_token: linkToken,
    });
  } catch (error: any) {
    console.error('Error in createLinkToken controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create link token',
    });
  }
};

export const exchangeToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { public_token } = req.body;

    if (!public_token) {
      res.status(400).json({
        success: false,
        error: 'public_token is required',
      });
      return;
    }

    const { accessToken, itemId } = await plaidService.exchangePublicToken(public_token);

    // In production, store accessToken and itemId in database associated with user
    // For now, we'll return them to the client
    // TODO: Store in database and associate with user session

    res.json({
      success: true,
      access_token: accessToken,
      item_id: itemId,
    });
  } catch (error: any) {
    console.error('Error in exchangeToken controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to exchange token',
    });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { access_token, start_date, end_date } = req.body;

    if (!access_token || !start_date || !end_date) {
      res.status(400).json({
        success: false,
        error: 'access_token, start_date, and end_date are required',
      });
      return;
    }

    // In production, verify access_token belongs to authenticated user
    // TODO: Add authentication middleware

    const transactions = await plaidService.getTransactions(
      access_token,
      start_date,
      end_date
    );

    res.json({
      success: true,
      transactions,
    });
  } catch (error: any) {
    console.error('Error in getTransactions controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transactions',
    });
  }
};

export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      res.status(400).json({
        success: false,
        error: 'access_token is required',
      });
      return;
    }

    const accounts = await plaidService.getAccounts(access_token);

    res.json({
      success: true,
      accounts,
    });
  } catch (error: any) {
    console.error('Error in getAccounts controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch accounts',
    });
  }
};

