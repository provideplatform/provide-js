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
  Account,
  ApiClientOptions,
  Bridge,
  Connector,
  Contract,
  LoadBalancer,
  LogsResponse,
  Network,
  NetworkStats,
  Node,
  Oracle,
  PaginatedResponse,
  TokenContract,
  Transaction,
  Wallet,
} from '@provide/types'

/*
 * NChain microservice; provides access to functionality
 * exposed by the Provide container runtime & blockchain APIs.
 */
export class NChain {
  private static readonly DEFAULT_HOST = 'nchain.provide.services'

  private readonly client: ApiClient

  constructor(
    token: string,
    scheme?: string,
    host?: string,
    path?: string,
    options?: ApiClientOptions
  ) {
    if (!host) {
      host = NChain.DEFAULT_HOST
    }

    this.client = new ApiClient(token, scheme, host, path, options)
  }

  public static clientFactory(
    token: string,
    scheme?: string,
    host?: string,
    path?: string,
    options?: ApiClientOptions
  ): NChain {
    const _scheme = scheme
      ? scheme
      : process.env['NCHAIN_API_SCHEME'] || 'https'
    const _host = host
      ? host
      : process.env['NCHAIN_API_HOST'] || NChain.DEFAULT_HOST
    const _path = path
      ? path
      : process.env['NCHAIN_API_PATH'] || ApiClient.DEFAULT_PATH
    return new NChain(token, _scheme, _host, _path, options)
  }

  public async fetchAccounts(
    params?: object
  ): Promise<PaginatedResponse<Account>> {
    return ApiClient.handleResponse(
      await this.client.get('accounts', params),
      this.client.options
    ) as PaginatedResponse<Account>
  }

  public async fetchAccountDetails(accountId: string): Promise<Account> {
    return ApiClient.handleResponse(
      await this.client.get(`accounts/${accountId}`),
      this.client.options
    ) as Account
  }

  public async fetchAccountBalance(
    accountId: string,
    tokenId: string
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.get(`accounts/${accountId}/balances/${tokenId}`),
      this.client.options
    )
  }

  public async createAccount(params: object): Promise<Account> {
    return ApiClient.handleResponse(
      await this.client.post('accounts', params),
      this.client.options
    ) as Account
  }

  public async fetchBridges(
    params?: object
  ): Promise<PaginatedResponse<Bridge>> {
    return ApiClient.handleResponse(
      await this.client.get('bridges', params),
      this.client.options
    ) as PaginatedResponse<Bridge>
  }

  public async fetchBridgeDetails(bridgeId: string): Promise<Bridge> {
    return ApiClient.handleResponse(
      await this.client.get(`bridges/${bridgeId}`),
      this.client.options
    ) as Bridge
  }

  public async createBridge(params: object): Promise<Bridge> {
    return ApiClient.handleResponse(
      await this.client.post('bridges', params),
      this.client.options
    ) as Bridge
  }

  public async fetchConnectors(
    params?: object
  ): Promise<PaginatedResponse<Connector>> {
    return ApiClient.handleResponse(
      await this.client.get('connectors', params),
      this.client.options
    ) as PaginatedResponse<Connector>
  }

  public async fetchConnectorDetails(
    connectorId: string,
    params?: object
  ): Promise<Connector> {
    return ApiClient.handleResponse(
      await this.client.get(`connectors/${connectorId}`, params),
      this.client.options
    ) as Connector
  }

  public async fetchConnectorLoadBalancers(
    connectorId: string,
    params?: object
  ): Promise<PaginatedResponse<LoadBalancer>> {
    return ApiClient.handleResponse(
      await this.client.get(`connectors/${connectorId}/load_balancers`, params),
      this.client.options
    ) as PaginatedResponse<LoadBalancer>
  }

  public async fetchConnectorNodes(
    connectorId: string,
    params?: object
  ): Promise<PaginatedResponse<Node>> {
    return ApiClient.handleResponse(
      await this.client.get(`connectors/${connectorId}/nodes`, params),
      this.client.options
    ) as PaginatedResponse<Node>
  }

  public async createConnector(params: object): Promise<Connector> {
    return ApiClient.handleResponse(
      await this.client.post('connectors', params),
      this.client.options
    ) as Connector
  }

  public async deleteConnector(connectorId: string): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(`connectors/${connectorId}`),
      this.client.options
    )
  }

  public async authorizeConnectorSubscription(
    connectorId: string,
    params: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.post(`connectors/${connectorId}/subscriptions`, params),
      this.client.options
    )
  }

  public async authorizeContractSubscription(
    contractId: string,
    params: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.post(`contracts/${contractId}/subscriptions`, params),
      this.client.options
    )
  }

  public async createConnectedEntity(
    connectorId: string,
    params: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.post(`connectors/${connectorId}/entities`, params),
      this.client.options
    )
  }

  public async fetchConnectedEntities(
    connectorId: string,
    params: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.get(`connectors/${connectorId}/entities`, params),
      this.client.options
    )
  }

  public async fetchConnectedEntityDetails(
    connectorId: string,
    entityId: string,
    params?: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.get(
        `connectors/${connectorId}/entities/${entityId}`,
        params
      ),
      this.client.options
    )
  }

  public async updateConnectedEntity(
    connectorId: string,
    entityId: string,
    params: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.put(
        `connectors/${connectorId}/entities/${entityId}`,
        params
      ),
      this.client.options
    )
  }

  public async deleteConnectedEntity(
    connectorId: string,
    entityId: string
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(
        `connectors/${connectorId}/entities/${entityId}`
      ),
      this.client.options
    )
  }

  public async fetchContracts(
    params?: object
  ): Promise<PaginatedResponse<Contract>> {
    return ApiClient.handleResponse(
      await this.client.get('contracts', params),
      this.client.options
    ) as PaginatedResponse<Contract>
  }

  public async fetchContractDetails(contractId: string): Promise<Contract> {
    return ApiClient.handleResponse(
      await this.client.get(`contracts/${contractId}`),
      this.client.options
    ) as Contract
  }

  public async createContract(params: object): Promise<Contract> {
    return ApiClient.handleResponse(
      await this.client.post('contracts', params),
      this.client.options
    ) as Contract
  }

  public async executeContract(
    contractId: string,
    params: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.post(`contracts/${contractId}/execute`, params),
      this.client.options
    )
  }

  public async fetchNetworks(params?: object): Promise<Network> {
    return ApiClient.handleResponse(
      await this.client.get('networks', params),
      this.client.options
    ) as Network
  }

  public async createNetwork(params: object): Promise<Network> {
    return ApiClient.handleResponse(
      await this.client.post('networks', params),
      this.client.options
    ) as Network
  }

  public async updateNetwork(networkId: string, params: object): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.put(`networks/${networkId}`, params),
      this.client.options
    )
  }

  public async fetchNetworkDetails(networkId: string): Promise<Network> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}`),
      this.client.options
    ) as Network
  }

  public async fetchNetworkAccounts(
    networkId: string,
    params: object
  ): Promise<PaginatedResponse<Account>> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/accounts`, params),
      this.client.options
    ) as PaginatedResponse<Account>
  }

  public async fetchNetworkBlocks(
    networkId: string,
    params: object
  ): Promise<any> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/blocks`, params),
      this.client.options
    )
  }

  public async fetchNetworkBridges(
    networkId: string,
    params: object
  ): Promise<PaginatedResponse<Bridge>> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/bridges`, params),
      this.client.options
    ) as PaginatedResponse<Bridge>
  }

  public async fetchNetworkConnectors(
    networkId: string,
    params: object
  ): Promise<Connector> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/connectors`, params),
      this.client.options
    ) as Connector
  }

  public async fetchNetworkContracts(
    networkId: string,
    params: object
  ): Promise<PaginatedResponse<Contract>> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/contracts`, params),
      this.client.options
    ) as PaginatedResponse<Contract>
  }

  public async fetchNetworkContractDetails(
    networkId: string,
    contractId: string
  ): Promise<Contract> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/contracts/${contractId}`),
      this.client.options
    ) as Contract
  }

  public async fetchNetworkOracles(
    networkId: string,
    params: object
  ): Promise<PaginatedResponse<Oracle>> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/oracles`, params),
      this.client.options
    ) as PaginatedResponse<Oracle>
  }

  public async fetchNetworkTokenContracts(
    networkId: string,
    params: object
  ): Promise<PaginatedResponse<TokenContract>> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/tokens`, params),
      this.client.options
    ) as PaginatedResponse<TokenContract>
  }

  public async fetchNetworkTransactions(
    networkId: string,
    params: object
  ): Promise<PaginatedResponse<Transaction>> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/transactions`, params),
      this.client.options
    ) as PaginatedResponse<Transaction>
  }

  public async fetchNetworkTransactionDetails(
    networkId: string,
    transactionId: string
  ): Promise<Transaction> {
    return ApiClient.handleResponse(
      await this.client.get(
        `networks/${networkId}/transactions/${transactionId}`
      ),
      this.client.options
    ) as Transaction
  }

  public async fetchNetworkStatus(networkId: string): Promise<NetworkStats> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/status`),
      this.client.options
    ) as NetworkStats
  }

  public async fetchNetworkNodes(
    networkId: string,
    params?: object
  ): Promise<PaginatedResponse<Node>> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/nodes`, params),
      this.client.options
    ) as PaginatedResponse<Node>
  }

  public async createNetworkNode(
    networkId: string,
    params: object
  ): Promise<Node> {
    return ApiClient.handleResponse(
      await this.client.post(`networks/${networkId}/nodes`, params),
      this.client.options
    ) as Node
  }

  public async fetchNetworkNodeDetails(
    networkId: string,
    nodeId: string
  ): Promise<Node> {
    return ApiClient.handleResponse(
      await this.client.get(`networks/${networkId}/nodes/${nodeId}`),
      this.client.options
    ) as Node
  }

  public async fetchNetworkNodeLogs(
    networkId: string,
    nodeId: string,
    params?: object
  ): Promise<LogsResponse> {
    return ApiClient.handleResponse(
      await this.client.get(
        `networks/${networkId}/nodes/${nodeId}/logs`,
        params
      ),
      this.client.options
    )
  }

  public async deleteNetworkNode(
    networkId: string,
    nodeId: string
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(`networks/${networkId}/nodes/${nodeId}`),
      this.client.options
    )
  }

  public async fetchOracles(
    params?: object
  ): Promise<PaginatedResponse<Oracle>> {
    return ApiClient.handleResponse(
      await this.client.get('oracles', params),
      this.client.options
    ) as PaginatedResponse<Oracle>
  }

  public async fetchOracleDetails(oracleId: string): Promise<Oracle> {
    return ApiClient.handleResponse(
      await this.client.get(`oracles/${oracleId}`),
      this.client.options
    ) as Oracle
  }

  public async createOracle(params: object): Promise<Oracle> {
    return ApiClient.handleResponse(
      await this.client.post('oracles', params),
      this.client.options
    ) as Oracle
  }

  public async fetchTokenContracts(
    params?: object
  ): Promise<PaginatedResponse<TokenContract>> {
    return ApiClient.handleResponse(
      await this.client.get('tokens', params),
      this.client.options
    ) as PaginatedResponse<TokenContract>
  }

  public async fetchTokenContractDetails(
    tokenId: string
  ): Promise<TokenContract> {
    return ApiClient.handleResponse(
      await this.client.get(`tokens/${tokenId}`),
      this.client.options
    ) as TokenContract
  }

  public async createTokenContract(params: object): Promise<TokenContract> {
    return ApiClient.handleResponse(
      await this.client.post('tokens', params),
      this.client.options
    ) as TokenContract
  }

  public async createTransaction(params: object): Promise<Transaction> {
    return ApiClient.handleResponse(
      await this.client.post('transactions', params),
      this.client.options
    ) as Transaction
  }

  public async fetchTransactions(
    params?: object
  ): Promise<PaginatedResponse<Transaction>> {
    return ApiClient.handleResponse(
      await this.client.get('transactions', params),
      this.client.options
    ) as PaginatedResponse<Transaction>
  }

  public async fetchTransactionDetails(
    transactionId: string
  ): Promise<Transaction> {
    return ApiClient.handleResponse(
      await this.client.get(`transactions/${transactionId}`),
      this.client.options
    ) as Transaction
  }

  public async fetchWallets(
    params?: object
  ): Promise<PaginatedResponse<Wallet>> {
    return ApiClient.handleResponse(
      await this.client.get('wallets', params),
      this.client.options
    ) as PaginatedResponse<Wallet>
  }

  public async fetchWalletAccounts(
    walletId: string
  ): Promise<PaginatedResponse<Account>> {
    return ApiClient.handleResponse(
      await this.client.get(`wallets/${walletId}/accounts`),
      this.client.options
    ) as PaginatedResponse<Account>
  }

  public async fetchWalletDetails(walletId: string): Promise<Wallet> {
    return ApiClient.handleResponse(
      await this.client.get(`wallets/${walletId}`),
      this.client.options
    ) as Wallet
  }

  public async createWallet(params: object): Promise<Wallet> {
    return ApiClient.handleResponse(
      await this.client.post('wallets', params),
      this.client.options
    ) as Wallet
  }
}

export const nchainClientFactory = (
  token: string,
  scheme?: string,
  host?: string,
  path?: string,
  options?: ApiClientOptions
): NChain => {
  return NChain.clientFactory(token, scheme, host, path, options)
}
