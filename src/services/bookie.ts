import { ApiClient } from '../clients';
import {
  BillingAccount,
  KycApplication,
  KycApplicationParams,
  Payment,
  Facility,
  Agreement,
  TokenizationPolicy,
  Transaction
} from '@provide/types';

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

  public async createFacility(params: any): Promise<Facility> {
    return ApiClient.handleResponse(await this.client.post('facilities', params)) as Facility;  
  }

  public async fetchFacilities(params?: any, includeTotalCount = false): Promise<Facility[]> {
    return ApiClient.handleResponse(await this.client.get('facilities', params || {}), includeTotalCount) as Facility[];
  }

  public async fetchFacilityDetails(facilityId: string, params?: any): Promise<Facility> {
    return ApiClient.handleResponse(await this.client.get(`facilities/${facilityId}`, params || {})) as Facility;
  }

  public async createAgreement(facilityId: string, params: any): Promise<Agreement> {
    return ApiClient.handleResponse(await this.client.post(`facilities/${facilityId}/agreements`, params)) as Agreement;  
  }

  public async fetchAgreements(facilityId: string, params?: any): Promise<Agreement[]> {
    return ApiClient.handleResponse(await this.client.get(`facilities/${facilityId}/agreements`, params || {})) as Agreement[];  
  }

  public async fetchAgreementDetails(facilityId: string, agreementId: string, params?: any): Promise<Agreement> {
    return ApiClient.handleResponse(await this.client.get(`facilities/${facilityId}/agreements/${agreementId}`, params || {})) as Agreement;
  }

  public async createTokenizationPolicy(params: any): Promise<TokenizationPolicy> {
    return ApiClient.handleResponse(await this.client.post('tokenization_policies', params)) as TokenizationPolicy;  
  }

  public async fetchTokenizationPolicies(params?: any): Promise<TokenizationPolicy[]> {
    return ApiClient.handleResponse(await this.client.get('tokenization_policies', params || {})) as TokenizationPolicy[];
  }

  public async fetchTokenizationPolicyDetails(tokenizationPolicyId: string, params?: any): Promise<TokenizationPolicy> {
    return ApiClient.handleResponse(await this.client.get(`tokenization_policies/${tokenizationPolicyId}`, params || {})) as TokenizationPolicy;
  }
  
  public async createBillingAccountTransaction(billingAccountId: string, params: any): Promise<Transaction> {
    return ApiClient.handleResponse(await this.client.post(`billing_accounts/${billingAccountId}/transactions`, params)) as Transaction;  
  }

  public async fetchBillingAccountTransactions(billingAccountId: string, params?: any, includeTotalCount = false): Promise<{ items: Transaction[], totalCount: number}> {
    return ApiClient.handleResponse(await this.client.get(`billing_accounts/${billingAccountId}/transactions`, params || {}), includeTotalCount) as { items: Transaction[], totalCount: number};
  }

  public async fetchBillingAccountTransactionDetails(billingAccountId: string, transactionId: string, params?: any): Promise<Transaction> {
    return ApiClient.handleResponse(await this.client.get(`billing_accounts/${billingAccountId}/transactions/${transactionId}`, params || {})) as Transaction;
  }
}

export const bookieClientFactory = (token: string, scheme?: string, host?: string, path?: string): Bookie => {
  return Bookie.clientFactory(token, scheme, host, path);
};
