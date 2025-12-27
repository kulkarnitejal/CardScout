import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  };
};

// Validation rules for Plaid endpoints
export const validateExchangeToken = validate([
  body('public_token').notEmpty().withMessage('public_token is required'),
]);

export const validateGetTransactions = validate([
  body('access_token').notEmpty().withMessage('access_token is required'),
  body('start_date').isISO8601().withMessage('start_date must be a valid ISO 8601 date'),
  body('end_date').isISO8601().withMessage('end_date must be a valid ISO 8601 date'),
]);

export const validateGetAccounts = validate([
  body('access_token').notEmpty().withMessage('access_token is required'),
]);

