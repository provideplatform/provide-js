import ApiClient from './apiClient';

class Goldmine extends ApiClient {
    executeTx(token: string, params: {}) {
      this.client.post('transactions', params).on('response', (response) => {
        console.log(response.statusCode);
        console.log(response.headers['content-type']);
      });
    }

    createWallet(token, params) {
      this.client.post('wallets', params).on('response', (response) => {
        console.log(response.statusCode);
        console.log(response.headers['content-type']);
      });
    }
}
