/*
 * Copyright 2017-2022 Provide Technologies Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ApiClient } from '../clients'
import {
  Agreement,
  ApiClientOptions,
  BillingAccount,
  KycApplication,
  KycApplicationParams,
  Payment,
  Facility,
  TokenizationPolicy,
  Transaction,
  PaginatedResponse,
} from '@provide/types'

/*
 * Bookie microservice; provides access to functionality
 * exposed by the Provide Payments APIs.
 */
export class Bookie {
  private static readonly DEFAULT_HOST = 'bookie.provide.services'

  private readonly client: ApiClient

  constructor(
    token: string,
    scheme?: string,
    host?: string,
    path?: string,
    options?: ApiClientOptions
  ) {
    if (!host) {
      host = Bookie.DEFAULT_HOST
    }

    this.client = new ApiClient(token, scheme, host, path, options)
  }

  public static clientFactory(
    token: string,
    scheme?: string,
    host?: string,
    path?: string,
    options?: ApiClientOptions
  ): Bookie {
    const _scheme = scheme
      ? scheme
      : process.env['BOOKIE_API_SCHEME'] || 'https'
    const _host = host
      ? host
      : process.env['BOOKIE_API_HOST'] || Bookie.DEFAULT_HOST
    const _path = path
      ? path
      : process.env['BOOKIE_API_PATH'] || ApiClient.DEFAULT_PATH
    return new Bookie(token, _scheme, _host, _path, options)
  }

  public async fetchBillingAccounts(
    params?: any
  ): Promise<PaginatedResponse<BillingAccount>> {
    return ApiClient.handleResponse(
      await this.client.get('billing_accounts', params),
      this.client.options
    ) as PaginatedResponse<BillingAccount>
  }

  public async fetchBillingAccountDetails(
    billingAccountId: string,
    params?: any
  ): Promise<BillingAccount> {
    return ApiClient.handleResponse(
      await this.client.get(`billing_accounts/${billingAccountId}`, params),
      this.client.options
    ) as BillingAccount
  }

  public async createBillingAccount(params: any): Promise<BillingAccount> {
    return ApiClient.handleResponse(
      await this.client.post('billing_accounts', params),
      this.client.options
    ) as BillingAccount
  }

  public async deleteBillingAccount(billingAccountId: string): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(`kyc_applicatons/${billingAccountId}`),
      this.client.options
    )
  }

  public async fetchKycApplications(
    params?: any
  ): Promise<PaginatedResponse<KycApplication>> {
    return ApiClient.handleResponse(
      await this.client.get(`kyc_applicatons`, params),
      this.client.options
    ) as PaginatedResponse<KycApplication>
  }

  public async fetchKycApplicationDetails(
    kycApplicationId: string,
    params?: any
  ): Promise<KycApplication> {
    return ApiClient.handleResponse(
      await this.client.get(`kyc_applicatons/${kycApplicationId}`, params),
      this.client.options
    ) as KycApplication
  }

  public async createKycApplication(
    params: KycApplicationParams
  ): Promise<KycApplication> {
    return ApiClient.handleResponse(
      await this.client.post('kyc_applicatons', params),
      this.client.options
    ) as KycApplication
  }

  public async updateKycApplication(
    kycApplicationId: string,
    params: Partial<KycApplicationParams>
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.put(`kyc_applicatons/${kycApplicationId}`, params),
      this.client.options
    )
  }

  public async createPayment(params: any): Promise<Payment> {
    return ApiClient.handleResponse(
      await this.client.post('payments', params),
      this.client.options
    ) as Payment
  }

  public async createFacility(params: any): Promise<Facility> {
    return ApiClient.handleResponse(
      await this.client.post('facilities', params),
      this.client.options
    ) as Facility
  }

  public async fetchFacilities(
    params?: any
  ): Promise<PaginatedResponse<Facility>> {
    return ApiClient.handleResponse(
      await this.client.get('facilities', params),
      this.client.options
    ) as PaginatedResponse<Facility>
  }

  public async fetchFacilityDetails(
    facilityId: string,
    params?: any
  ): Promise<Facility> {
    return ApiClient.handleResponse(
      await this.client.get(`facilities/${facilityId}`, params),
      this.client.options
    ) as Facility
  }

  public async createAgreement(
    facilityId: string,
    params: any
  ): Promise<Agreement> {
    return ApiClient.handleResponse(
      await this.client.post(`facilities/${facilityId}/agreements`, params),
      this.client.options
    ) as Agreement
  }

  public async fetchAgreements(
    facilityId: string,
    params?: any
  ): Promise<PaginatedResponse<Agreement>> {
    return ApiClient.handleResponse(
      await this.client.get(`facilities/${facilityId}/agreements`, params),
      this.client.options
    ) as PaginatedResponse<Agreement>
  }

  public async fetchAgreementDetails(
    facilityId: string,
    agreementId: string,
    params?: any
  ): Promise<Agreement> {
    return ApiClient.handleResponse(
      await this.client.get(
        `facilities/${facilityId}/agreements/${agreementId}`,
        params
      ),
      this.client.options
    ) as Agreement
  }

  public async createTokenizationPolicy(
    params: any
  ): Promise<TokenizationPolicy> {
    return ApiClient.handleResponse(
      await this.client.post('tokenization_policies', params),
      this.client.options
    ) as TokenizationPolicy
  }

  public async fetchTokenizationPolicies(
    params?: any
  ): Promise<PaginatedResponse<TokenizationPolicy>> {
    return ApiClient.handleResponse(
      await this.client.get('tokenization_policies', params),
      this.client.options
    ) as PaginatedResponse<TokenizationPolicy>
  }

  public async fetchTokenizationPolicyDetails(
    tokenizationPolicyId: string,
    params?: any
  ): Promise<TokenizationPolicy> {
    return ApiClient.handleResponse(
      await this.client.get(
        `tokenization_policies/${tokenizationPolicyId}`,
        params
      ),
      this.client.options
    ) as TokenizationPolicy
  }

  public async createBillingAccountTransaction(
    billingAccountId: string,
    params: any
  ): Promise<Transaction> {
    return ApiClient.handleResponse(
      await this.client.post(
        `billing_accounts/${billingAccountId}/transactions`,
        params
      ),
      this.client.options
    ) as Transaction
  }

  public async fetchBillingAccountTransactions(
    billingAccountId: string,
    params?: any
  ): Promise<PaginatedResponse<Transaction>> {
    return ApiClient.handleResponse(
      await this.client.get(
        `billing_accounts/${billingAccountId}/transactions`,
        params
      ),
      this.client.options
    ) as PaginatedResponse<Transaction>
  }

  public async fetchBillingAccountTransactionDetails(
    billingAccountId: string,
    transactionId: string,
    params?: any
  ): Promise<Transaction> {
    return ApiClient.handleResponse(
      await this.client.get(
        `billing_accounts/${billingAccountId}/transactions/${transactionId}`,
        params
      ),
      this.client.options
    ) as Transaction
  }
}

export const bookieClientFactory = (
  token: string,
  scheme?: string,
  host?: string,
  path?: string,
  options?: ApiClientOptions
): Bookie => {
  return Bookie.clientFactory(token, scheme, host, path, options)
}
