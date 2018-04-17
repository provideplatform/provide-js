import apiClient from './apiClient';

export default function createApplication(token, params) {
  const client = apiClient(token);
  client.post('applications', params).on('response', (response) => {
    console.log(response.statusCode);
    console.log(response.headers['content-type']);
  });
}
