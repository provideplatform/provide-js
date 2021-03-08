import { ApiClient } from '../clients';
import { BillingAccount, KycApplication, KycApplicationParams, Payment } from '@provide/types';

/*
 * Bookie microservice; provides access to functionality
 * exposed by the Provide Payments APIs.
 */
export class Bookie {

  private static readonly DEFAULT_HOST = 'bookie.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!host) {
      host = Bookie.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path);
  }

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string): Bookie {
    const _scheme = scheme ? scheme : (process.env['BOOKIE_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['BOOKIE_API_HOST'] || Bookie.DEFAULT_HOST);
    const _path = path ? path : (process.env['BOOKIE_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Bookie(token, _scheme, _host, _path);
  }

  public async fetchBillingAccounts(params?: any): Promise<BillingAccount[]> {
    return ApiClient.handleResponse(await this.client.get('billing_accounts', params || {})) as BillingAccount[];
  }

  public async fetchBillingAccountDetails(billingAccountId: string, params?: any): Promise<BillingAccount> {
    return ApiClient.handleResponse(await this.client.get(`billing_accounts/${billingAccountId}`, params || {})) as BillingAccount;
  }

  public async createBillingAccount(params: any): Promise<BillingAccount> {
    return ApiClient.handleResponse(await this.client.post('billing_accounts', params)) as BillingAccount;
  }

  public async deleteBillingAccount(billingAccountId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`kyc_applicatons/${billingAccountId}`));
  }

  public async fetchKycApplications(params?: any): Promise<KycApplication[]> {
    return ApiClient.handleResponse(await this.client.get(`kyc_applicatons`, params || {})) as KycApplication[];
  }

  public async fetchKycApplicationDetails(kycApplicationId: string, params?: any): Promise<KycApplication> {
    return ApiClient.handleResponse(await this.client.get(`kyc_applicatons/${kycApplicationId}`, params || {})) as KycApplication;
  }

  public async createKycApplication(params: KycApplicationParams): Promise<KycApplication> {
    return ApiClient.handleResponse(await this.client.post('kyc_applicatons', params)) as KycApplication;
  }

  public async updateKycApplication(kycApplicationId: string, params: Partial<KycApplicationParams>): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`kyc_applicatons/${kycApplicationId}`, params));
  }

  public async createPayment(params: any): Promise<Payment> {
    return ApiClient.handleResponse(await this.client.post('payments', params)) as Payment;
  }
}

export const bookieClientFactory = (token: string, scheme?: string, host?: string, path?: string): Bookie => {
  return Bookie.clientFactory(token, scheme, host, path);
};
