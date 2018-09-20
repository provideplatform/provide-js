import { ApiClient } from './apiClient';

/*
 * Goldmine microservice; provides access to functionality
 * exposed by the Provide blockchain APIs.
 */
export class Goldmine {

  private static readonly DEFAULT_HOST = 'goldmine.provide.services';
  private static readonly DEFAULT_PATH = 'api/';

  private client: ApiClient;

  constructor(token: string, host?: string, path?: string, scheme?: string) {
    if (!host) host = Goldmine.DEFAULT_HOST;
    if (!path) path = Goldmine.DEFAULT_PATH;
    this.client = new ApiClient(scheme, host, path, token);
  }

  public fetchBridges(params = null) {
    return this.client.get('bridges', (params || { }));
  }

  public fetchBridgeDetails(bridgeId) {
    return this.client.get(`bridges/${bridgeId}`, { });
  }

  public createBridge(params) {
    return this.client.post('bridges', params);
  }

  public fetchConnectors(params = null) {
    return this.client.get('connectors', (params || { }));
  }

  public fetchConnectorDetails(connectorId) {
    return this.client.get(`connectors/${connectorId}`, { });
  }

  public createConnector(params) {
    return this.client.post('connectors', params);
  }

  public deleteConnector(connectorId) {
    return this.client.delete(`connectors/${connectorId}`);
  }

  public fetchContracts(params = null) {
    return this.client.get('contracts', (params || { }));
  }

  public fetchContractDetails(contractId) {
    return this.client.get(`contracts/${contractId}`, { });
  }

  public createContract(params) {
    return this.client.post('contracts', params);
  }

  public executeContract(contractId, params) {
    return this.client.post(`contracts/${contractId}/execute`, params);
  }

  public fetchNetworks(params = null) {
    return this.client.get('networks', (params || { }));
  }

  public createNetwork(params) {
    return this.client.post('networks', params);
  }

  public updateNetwork(networkId, params) {
    return this.client.put(`networks/${networkId}`, params);
  }

  public fetchNetworkDetails(networkId) {
    return this.client.get(`networks/${networkId}`, { });
  }

  public fetchNetworkAccounts(networkId, params) {
    return this.client.get(`networks/${networkId}/accounts`, params);
  }

  public fetchNetworkBlocks(networkId, params) {
    return this.client.get(`networks/${networkId}/blocks`, params);
  }

  public fetchNetworkBridges(networkId, params) {
    return this.client.get(`networks/${networkId}/bridges`, params);
  }

  public fetchNetworkConnectors(networkId, params) {
    return this.client.get(`networks/${networkId}/connectors`, params);
  }

  public fetchNetworkContracts(networkId, params) {
    return this.client.get(`networks/${networkId}/contracts`, params);
  }

  public fetchNetworkContractDetails(networkId, contractId) {
    return this.client.get(`networks/${networkId}/contracts/${contractId}`, { });
  }

  public fetchNetworkOracles(networkId, params) {
    return this.client.get(`networks/${networkId}/oracles`, params);
  }

  public fetchNetworkTokens(networkId, params) {
    return this.client.get(`networks/${networkId}/tokens`, params);
  }

  public network_transactions(networkId, params) {
    return this.client.get(`networks/${networkId}/transactions`, params);
  }

  public fetchNetworkTransactionDetails(networkId, transactionId) {
    return this.client.get(`networks/${networkId}/transactions/${transactionId}`, { });
  }

  public fetchNetworkStatus(networkId) {
    return this.client.get(`networks/${networkId}/status`, { });
  }

  public fetchNetworkNodes(networkId, params = null) {
    return this.client.get(`networks/${networkId}/nodes`, (params || { }));
  }

  public createNetworkNode(networkId, params) {
    return this.client.post(`networks/${networkId}/nodes`, params);
  }

  public fetchNetworkNodeDetails(networkId, nodeId) {
    return this.client.get(`networks/${networkId}/nodes/${nodeId}`, { });
  }

  public fetchNetworkNodeLogs(networkId, nodeId) {
    return this.client.get(`networks/${networkId}/nodes/${nodeId}/logs`, { });
  }

  public deleteNetworkNode(networkId, nodeId) {
    return this.client.delete(`networks/${networkId}/nodes/${nodeId}`);
  }

  public fetchOracles(params = null) {
    return this.client.get('oracles', (params || { }));
  }

  public fetchOracleDetails(oracleId) {
    return this.client.get(`oracles/${oracleId}`, { });
  }

  public createOracle(params) {
    return this.client.post('oracles', params);
  }

  public fetchTokens(params = null) {
    return this.client.get('tokens', (params || { }));
  }

  public fetchTokenDetails(tokenId) {
    return this.client.get(`tokens/${tokenId}`, { });
  }

  public createToken(params) {
    return this.client.post('tokens', params);
  }

  public createTransaction(params) {
    return this.client.post('transactions', params);
  }

  public fetchTransactions(params = null) {
    return this.client.get('transactions', (params || { }));
  }

  public fetchTransactionDetails(txId) {
    return this.client.get(`transactions/${txId}`, { });
  }

  public fetchWalletBalance(walletId, tokenId) {
    return this.client.get(`wallets/${walletId}/balances/${tokenId}`, { });
  }

  public fetchWallets(params = null) {
    return this.client.get('wallets', (params || { }));
  }

  public fetchWalletDetails(walletId) {
    return this.client.get(`wallets/${walletId}`, { });
  }

  public createWallet(params) {
    return this.client.post('wallets', params);
  }
}
