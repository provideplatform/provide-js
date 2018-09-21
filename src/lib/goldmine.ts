import { ApiClient } from './apiClient';

/*
 * Goldmine microservice; provides access to functionality
 * exposed by the Provide blockchain APIs.
 */
export class Goldmine {

  private static readonly DEFAULT_HOST = 'goldmine.provide.services';

  private client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!host) host = Goldmine.DEFAULT_HOST;
    this.client = new ApiClient(token, scheme, host, path);
  }

  public fetchBridges(params?: object) {
    return this.client.get('bridges', (params || { }));
  }

  public fetchBridgeDetails(bridgeId: string) {
    return this.client.get(`bridges/${bridgeId}`, { });
  }

  public createBridge(params: object) {
    return this.client.post('bridges', params);
  }

  public fetchConnectors(params?: object) {
    return this.client.get('connectors', (params || { }));
  }

  public fetchConnectorDetails(connectorId: string) {
    return this.client.get(`connectors/${connectorId}`, { });
  }

  public createConnector(params: object) {
    return this.client.post('connectors', params);
  }

  public deleteConnector(connectorId: string) {
    return this.client.delete(`connectors/${connectorId}`);
  }

  public fetchContracts(params?: object) {
    return this.client.get('contracts', (params || { }));
  }

  public fetchContractDetails(contractId: string) {
    return this.client.get(`contracts/${contractId}`, { });
  }

  public createContract(params: object) {
    return this.client.post('contracts', params);
  }

  public executeContract(contractId: string, params: object) {
    return this.client.post(`contracts/${contractId}/execute`, params);
  }

  public fetchNetworks(params?: object) {
    return this.client.get('networks', (params || { }));
  }

  public createNetwork(params: object) {
    return this.client.post('networks', params);
  }

  public updateNetwork(networkId: string, params: object) {
    return this.client.put(`networks/${networkId}`, params);
  }

  public fetchNetworkDetails(networkId: string) {
    return this.client.get(`networks/${networkId}`, { });
  }

  public fetchNetworkAccounts(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/accounts`, params);
  }

  public fetchNetworkBlocks(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/blocks`, params);
  }

  public fetchNetworkBridges(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/bridges`, params);
  }

  public fetchNetworkConnectors(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/connectors`, params);
  }

  public fetchNetworkContracts(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/contracts`, params);
  }

  public fetchNetworkContractDetails(networkId: string, contractId: string) {
    return this.client.get(`networks/${networkId}/contracts/${contractId}`, { });
  }

  public fetchNetworkOracles(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/oracles`, params);
  }

  public fetchNetworkTokens(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/tokens`, params);
  }

  public network_transactions(networkId: string, params: object) {
    return this.client.get(`networks/${networkId}/transactions`, params);
  }

  public fetchNetworkTransactionDetails(networkId: string, transactionId: string) {
    return this.client.get(`networks/${networkId}/transactions/${transactionId}`, { });
  }

  public fetchNetworkStatus(networkId: string) {
    return this.client.get(`networks/${networkId}/status`, { });
  }

  public fetchNetworkNodes(networkId: string, params?: object) {
    return this.client.get(`networks/${networkId}/nodes`, (params || { }));
  }

  public createNetworkNode(networkId: string, params: object) {
    return this.client.post(`networks/${networkId}/nodes`, params);
  }

  public fetchNetworkNodeDetails(networkId: string, nodeId: string) {
    return this.client.get(`networks/${networkId}/nodes/${nodeId}`, { });
  }

  public fetchNetworkNodeLogs(networkId: string, nodeId: string) {
    return this.client.get(`networks/${networkId}/nodes/${nodeId}/logs`, { });
  }

  public deleteNetworkNode(networkId: string, nodeId: string) {
    return this.client.delete(`networks/${networkId}/nodes/${nodeId}`);
  }

  public fetchOracles(params?: object) {
    return this.client.get('oracles', (params || { }));
  }

  public fetchOracleDetails(oracleId: string) {
    return this.client.get(`oracles/${oracleId}`, { });
  }

  public createOracle(params: object) {
    return this.client.post('oracles', params);
  }

  public fetchTokens(params?: object) {
    return this.client.get('tokens', (params || { }));
  }

  public fetchTokenDetails(tokenId: string) {
    return this.client.get(`tokens/${tokenId}`, { });
  }

  public createToken(params: object) {
    return this.client.post('tokens', params);
  }

  public createTransaction(params: object) {
    return this.client.post('transactions', params);
  }

  public fetchTransactions(params?: object) {
    return this.client.get('transactions', (params || { }));
  }

  public fetchTransactionDetails(transactionId: string) {
    return this.client.get(`transactions/${transactionId}`, { });
  }

  public fetchWalletBalance(walletId: string, tokenId: string) {
    return this.client.get(`wallets/${walletId}/balances/${tokenId}`, { });
  }

  public fetchWallets(params?: object) {
    return this.client.get('wallets', (params || { }));
  }

  public fetchWalletDetails(walletId: string) {
    return this.client.get(`wallets/${walletId}`, { });
  }

  public createWallet(params: object) {
    return this.client.post('wallets', params);
  }
}
