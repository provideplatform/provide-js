import apiClient from './apiClient';

export default function broadcastTx(token, params) {
  const client = apiClient(token);
  client.post('transactions', params).on('response', (response) => {
    console.log(response.statusCode);
    console.log(response.headers['content-type']);
  });
}
