import { ApiClient, ApiClientResponse } from '../clients';

/*
 * Goldmine microservice; provides access to functionality
 * exposed by the Provide blockchain APIs.
 */
export class Goldmine {

  private static readonly DEFAULT_HOST = 'goldmine.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!host) {
      host = Goldmine.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path);
  }

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string): Goldmine {
    const _scheme = scheme ? scheme : (process.env['GOLDMINE_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['GOLDMINE_API_HOST'] || Goldmine.DEFAULT_HOST);
    const _path = path ? path : (process.env['GOLDMINE_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Goldmine(token, _scheme, _host, _path);
  }

  public fetchAccounts(params?: object): Promise<ApiClientResponse> {
    return this.client.get('accounts', (params || {}));
  }

  public fetchAccountDetails(accountId: string): Promise<ApiClientResponse> {
    return this.client.get(`accounts/${accountId}`, {});
  }

  public fetchAccountBalance(accountId: string, tokenId: string): Promise<ApiClientResponse> {
    return this.client.get(`accounts/${accountId}/balances/${tokenId}`, {});
  }

  public createAccount(params: object): Promise<ApiClientResponse> {
    return this.client.post('accounts', params);
  }

  public fetchBridges(params?: object): Promise<ApiClientResponse> {
    return this.client.get('bridges', (params || {}));
  }

  public fetchBridgeDetails(bridgeId: string): Promise<ApiClientResponse> {
    return this.client.get(`bridges/${bridgeId}`, {});
  }

  public createBridge(params: object): Promise<ApiClientResponse> {
    return this.client.post('bridges', params);
  }

  public fetchConnectors(params?: object): Promise<ApiClientResponse> {
    return this.client.get('connectors', (params || {}));
  }

  public fetchConnectorDetails(connectorId: string, params?: object): Promise<ApiClientResponse> {
    return this.client.get(`connectors/${connectorId}`, (params || {}));
  }

  public fetchConnectorLoadBalancers(connectorId: string, params?: object): Promise<ApiClientResponse> {
    return this.client.get(`connectors/${connectorId}/load_balancers`, (params || {}));
  }

  public fetchConnectorNodes(connectorId: string, params?: object): Promise<ApiClientResponse> {
    return this.client.get(`connectors/${connectorId}/nodes`, (params || {}));
  }

  public createConnector(params: object): Promise<ApiClientResponse> {
    return this.client.post('connectors', params);
  }

  public deleteConnector(connectorId: string): Promise<ApiClientResponse> {
    return this.client.delete(`connectors/${connectorId}`);
  }

  public authorizeConnectorSubscription(connectorId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`connectors/${connectorId}/subscriptions`, params);
  }

  public authorizeContractSubscription(contractId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`contracts/${contractId}/subscriptions`, params);
  }

  public fetchContracts(params?: object): Promise<ApiClientResponse> {
    return this.client.get('contracts', (params || {}));
  }

  public fetchContractDetails(contractId: string): Promise<ApiClientResponse> {
    return this.client.get(`contracts/${contractId}`, {});
  }

  public createContract(params: object): Promise<ApiClientResponse> {
    return this.client.post('contracts', params);
  }

  public executeContract(contractId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`contracts/${contractId}/execute`, params);
  }

  public fetchNetworks(params?: object): Promise<ApiClientResponse> {
    return this.client.get('networks', (params || {}));
  }

  public createNetwork(params: object): Promise<ApiClientResponse> {
    return this.client.post('networks', params);
  }

  public updateNetwork(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.put(`networks/${networkId}`, params);
  }

  public fetchNetworkDetails(networkId: string): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}`, {});
  }

  public fetchNetworkAccounts(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/accounts`, params);
  }

  public fetchNetworkBlocks(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/blocks`, params);
  }

  public fetchNetworkBridges(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/bridges`, params);
  }

  public fetchNetworkConnectors(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/connectors`, params);
  }

  public fetchNetworkContracts(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/contracts`, params);
  }

  public fetchNetworkContractDetails(networkId: string, contractId: string): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/contracts/${contractId}`, {});
  }

  public fetchNetworkOracles(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/oracles`, params);
  }

  public fetchNetworkTokens(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/tokens`, params);
  }

  public network_transactions(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/transactions`, params);
  }

  public fetchNetworkTransactionDetails(networkId: string, transactionId: string): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/transactions/${transactionId}`, {});
  }

  public fetchNetworkStatus(networkId: string): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/status`, {});
  }

  public fetchNetworkNodes(networkId: string, params?: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/nodes`, (params || {}));
  }

  public createNetworkNode(networkId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`networks/${networkId}/nodes`, params);
  }

  public fetchNetworkNodeDetails(networkId: string, nodeId: string): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/nodes/${nodeId}`, {});
  }

  public fetchNetworkNodeLogs(networkId: string, nodeId: string, params?: object): Promise<ApiClientResponse> {
    return this.client.get(`networks/${networkId}/nodes/${nodeId}/logs`, (params || {}));
  }

  public deleteNetworkNode(networkId: string, nodeId: string): Promise<ApiClientResponse> {
    return this.client.delete(`networks/${networkId}/nodes/${nodeId}`);
  }

  public fetchOracles(params?: object): Promise<ApiClientResponse> {
    return this.client.get('oracles', (params || {}));
  }

  public fetchOracleDetails(oracleId: string): Promise<ApiClientResponse> {
    return this.client.get(`oracles/${oracleId}`, {});
  }

  public createOracle(params: object): Promise<ApiClientResponse> {
    return this.client.post('oracles', params);
  }

  public fetchTokens(params?: object): Promise<ApiClientResponse> {
    return this.client.get('tokens', (params || {}));
  }

  public fetchTokenDetails(tokenId: string): Promise<ApiClientResponse> {
    return this.client.get(`tokens/${tokenId}`, {});
  }

  public createToken(params: object): Promise<ApiClientResponse> {
    return this.client.post('tokens', params);
  }

  public createTransaction(params: object): Promise<ApiClientResponse> {
    return this.client.post('transactions', params);
  }

  public fetchTransactions(params?: object): Promise<ApiClientResponse> {
    return this.client.get('transactions', (params || {}));
  }

  public fetchTransactionDetails(transactionId: string): Promise<ApiClientResponse> {
    return this.client.get(`transactions/${transactionId}`, {});
  }

  public fetchWallets(params?: object): Promise<ApiClientResponse> {
    return this.client.get('wallets', (params || {}));
  }

  public fetchWalletAccounts(walletId: string): Promise<ApiClientResponse> {
    return this.client.get(`wallets/${walletId}/accounts`, {});
  }

  public fetchWalletDetails(walletId: string): Promise<ApiClientResponse> {
    return this.client.get(`wallets/${walletId}`, {});
  }

  public createWallet(params: object): Promise<ApiClientResponse> {
    return this.client.post('wallets', params);
  }
}

export const goldmineClientFactory = (token: string, scheme?: string, host?: string, path?: string): Goldmine => {
  return Goldmine.clientFactory(token, scheme, host, path);
};
