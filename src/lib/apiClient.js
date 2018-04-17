const request = require('request');

export default function apiClient(scheme, host, path, token) {
  const baseUrl = `${scheme}://${host}/${path}`;
  const client = request.defaults({
    'user-agent': 'provide-js client',
    authorization: `bearer ${token}`
  });

  return {
    get: (uri, params) => client.get(baseUrl + uri, { qa: params }),
    post: (uri, params) => client.post(baseUrl + uri, { body: JSON.stringify(params) }),
    put: (uri, params) => client.put(baseUrl + uri, { body: JSON.stringify(params) }),
    delete: uri => client.delete(baseUrl + uri)
  };
}
