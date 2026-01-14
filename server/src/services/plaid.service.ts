import { PlaidApi, LinkTokenCreateRequest, TransactionsGetRequest, CountryCode, Products } from 'plaid';
import { createPlaidClient, getPlaidConfig } from '../config/plaid.config';

class PlaidService {
  private client: PlaidApi | null = null;

  private getClient(): PlaidApi {
    if (!this.client) {
      const config = getPlaidConfig();
      this.client = createPlaidClient(config);
    }
    return this.client;
  }

  /**
   * Create a Link token for Plaid Link
   */
  async createLinkToken(userId: string): Promise<string> {
    try {
      const request: LinkTokenCreateRequest = {
        user: {
          client_user_id: userId,
        },
        client_name: 'CardScout',
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: 'en',
      };

      const response = await this.getClient().linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to create Plaid Link token');
    }
  }

  /**
   * Exchange public token for access token
   */
  async exchangePublicToken(publicToken: string): Promise<{ accessToken: string; itemId: string }> {
    try {
      const response = await this.getClient().itemPublicTokenExchange({
        public_token: publicToken,
      });

      return {
        accessToken: response.data.access_token,
        itemId: response.data.item_id,
      };
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw new Error('Failed to exchange public token');
    }
  }

  /**
   * Get transactions for a given date range
   */
  async getTransactions(
    accessToken: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    try {
      const request: TransactionsGetRequest = {
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await this.getClient().transactionsGet(request);
      return response.data.transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  /**
   * Get account information
   */
  async getAccounts(accessToken: string) {
    try {
      const response = await this.getClient().accountsGet({
        access_token: accessToken,
      });
      return response.data.accounts;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  }
}

export default new PlaidService();

