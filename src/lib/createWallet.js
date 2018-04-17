import apiClient from './apiClient';

export default function createWallet(token, params) {
  const client = apiClient(token);
  client.post('wallets', params).on('response', (response) => {
    console.log(response.statusCode);
    console.log(response.headers['content-type']);
  });
}
