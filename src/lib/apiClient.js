const request = require('request');

export default function apiClient(token) {
  const scheme = process.env.API_SCHEME || 'https';
  const host = process.env.API_HOST || 'provide.services';
  const path = process.env.API_PATH || 'api/';

  const baseUrl = `${scheme}://${host}/${path}`;
  const client = request.defaults({
    'user-agent': 'provide-js client',
    authorization: `bearer ${token}`
  });

  return {
    get: (uri, params) => client.get(`${baseUrl}/${uri}`, { qs: params }),
    post: (uri, params) => client.post(`${baseUrl}/${uri}`, { body: JSON.stringify(params) }),
    put: (uri, params) => client.put(`${baseUrl}/${uri}`, { body: JSON.stringify(params) }),
    delete: uri => client.delete(`${baseUrl}/${uri}`)
  };
}
