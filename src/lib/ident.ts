import ApiClient from './apiClient';

class Ident extends ApiClient {
    createAppliation(token: string, params: {}) {
        this.client.post('transactions', params).on('response', (response) => {
          console.log(response.statusCode);
          console.log(response.headers['content-type']);
        });
      }
}
