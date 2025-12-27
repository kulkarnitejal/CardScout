import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

export interface PlaidConfig {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export const createPlaidClient = (config: PlaidConfig): PlaidApi => {
  const configuration = new Configuration({
    basePath: PlaidEnvironments[config.environment],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': config.clientId,
        'PLAID-SECRET': config.secret,
      },
    },
  });

  return new PlaidApi(configuration);
};

export const getPlaidConfig = (): PlaidConfig => {
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  const environment = (process.env.PLAID_ENV || 'sandbox') as 'sandbox' | 'development' | 'production';

  if (!clientId || !secret) {
    throw new Error('Plaid credentials are missing. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.');
  }

  return {
    clientId,
    secret,
    environment,
  };
};

