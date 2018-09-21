import { ApiClient } from './apiClient';
var Goldmine = (function () {
    function Goldmine(token, scheme, host, path) {
        if (!host)
            host = Goldmine.DEFAULT_HOST;
        this.client = new ApiClient(token, scheme, host, path);
    }
    Goldmine.prototype.fetchBridges = function (params) {
        return this.client.get('bridges', (params || {}));
    };
    Goldmine.prototype.fetchBridgeDetails = function (bridgeId) {
        return this.client.get("bridges/" + bridgeId, {});
    };
    Goldmine.prototype.createBridge = function (params) {
        return this.client.post('bridges', params);
    };
    Goldmine.prototype.fetchConnectors = function (params) {
        return this.client.get('connectors', (params || {}));
    };
    Goldmine.prototype.fetchConnectorDetails = function (connectorId) {
        return this.client.get("connectors/" + connectorId, {});
    };
    Goldmine.prototype.createConnector = function (params) {
        return this.client.post('connectors', params);
    };
    Goldmine.prototype.deleteConnector = function (connectorId) {
        return this.client.delete("connectors/" + connectorId);
    };
    Goldmine.prototype.fetchContracts = function (params) {
        return this.client.get('contracts', (params || {}));
    };
    Goldmine.prototype.fetchContractDetails = function (contractId) {
        return this.client.get("contracts/" + contractId, {});
    };
    Goldmine.prototype.createContract = function (params) {
        return this.client.post('contracts', params);
    };
    Goldmine.prototype.executeContract = function (contractId, params) {
        return this.client.post("contracts/" + contractId + "/execute", params);
    };
    Goldmine.prototype.fetchNetworks = function (params) {
        return this.client.get('networks', (params || {}));
    };
    Goldmine.prototype.createNetwork = function (params) {
        return this.client.post('networks', params);
    };
    Goldmine.prototype.updateNetwork = function (networkId, params) {
        return this.client.put("networks/" + networkId, params);
    };
    Goldmine.prototype.fetchNetworkDetails = function (networkId) {
        return this.client.get("networks/" + networkId, {});
    };
    Goldmine.prototype.fetchNetworkAccounts = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/accounts", params);
    };
    Goldmine.prototype.fetchNetworkBlocks = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/blocks", params);
    };
    Goldmine.prototype.fetchNetworkBridges = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/bridges", params);
    };
    Goldmine.prototype.fetchNetworkConnectors = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/connectors", params);
    };
    Goldmine.prototype.fetchNetworkContracts = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/contracts", params);
    };
    Goldmine.prototype.fetchNetworkContractDetails = function (networkId, contractId) {
        return this.client.get("networks/" + networkId + "/contracts/" + contractId, {});
    };
    Goldmine.prototype.fetchNetworkOracles = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/oracles", params);
    };
    Goldmine.prototype.fetchNetworkTokens = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/tokens", params);
    };
    Goldmine.prototype.network_transactions = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/transactions", params);
    };
    Goldmine.prototype.fetchNetworkTransactionDetails = function (networkId, transactionId) {
        return this.client.get("networks/" + networkId + "/transactions/" + transactionId, {});
    };
    Goldmine.prototype.fetchNetworkStatus = function (networkId) {
        return this.client.get("networks/" + networkId + "/status", {});
    };
    Goldmine.prototype.fetchNetworkNodes = function (networkId, params) {
        return this.client.get("networks/" + networkId + "/nodes", (params || {}));
    };
    Goldmine.prototype.createNetworkNode = function (networkId, params) {
        return this.client.post("networks/" + networkId + "/nodes", params);
    };
    Goldmine.prototype.fetchNetworkNodeDetails = function (networkId, nodeId) {
        return this.client.get("networks/" + networkId + "/nodes/" + nodeId, {});
    };
    Goldmine.prototype.fetchNetworkNodeLogs = function (networkId, nodeId) {
        return this.client.get("networks/" + networkId + "/nodes/" + nodeId + "/logs", {});
    };
    Goldmine.prototype.deleteNetworkNode = function (networkId, nodeId) {
        return this.client.delete("networks/" + networkId + "/nodes/" + nodeId);
    };
    Goldmine.prototype.fetchOracles = function (params) {
        return this.client.get('oracles', (params || {}));
    };
    Goldmine.prototype.fetchOracleDetails = function (oracleId) {
        return this.client.get("oracles/" + oracleId, {});
    };
    Goldmine.prototype.createOracle = function (params) {
        return this.client.post('oracles', params);
    };
    Goldmine.prototype.fetchTokens = function (params) {
        return this.client.get('tokens', (params || {}));
    };
    Goldmine.prototype.fetchTokenDetails = function (tokenId) {
        return this.client.get("tokens/" + tokenId, {});
    };
    Goldmine.prototype.createToken = function (params) {
        return this.client.post('tokens', params);
    };
    Goldmine.prototype.createTransaction = function (params) {
        return this.client.post('transactions', params);
    };
    Goldmine.prototype.fetchTransactions = function (params) {
        return this.client.get('transactions', (params || {}));
    };
    Goldmine.prototype.fetchTransactionDetails = function (transactionId) {
        return this.client.get("transactions/" + transactionId, {});
    };
    Goldmine.prototype.fetchWalletBalance = function (walletId, tokenId) {
        return this.client.get("wallets/" + walletId + "/balances/" + tokenId, {});
    };
    Goldmine.prototype.fetchWallets = function (params) {
        return this.client.get('wallets', (params || {}));
    };
    Goldmine.prototype.fetchWalletDetails = function (walletId) {
        return this.client.get("wallets/" + walletId, {});
    };
    Goldmine.prototype.createWallet = function (params) {
        return this.client.post('wallets', params);
    };
    Goldmine.DEFAULT_HOST = 'goldmine.provide.services';
    return Goldmine;
}());
export { Goldmine };
//# sourceMappingURL=goldmine.js.map