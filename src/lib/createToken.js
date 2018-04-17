import apiClient from './apiClient';

export default function createToken(token, params) {
  const client = apiClient(token);
  client.post('tokens', params).on('response', (response) => {
    console.log(response.statusCode);
    console.log(response.headers['content-type']);
  });
}
