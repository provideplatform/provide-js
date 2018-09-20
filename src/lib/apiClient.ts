const request = require('request');

// const scheme = process.env.API_SCHEME || 'https';
// const host = process.env.API_HOST || 'provide.services';
// const path = process.env.API_PATH || 'api/';

export class ApiClient {
  baseUrl: string;
  public client: Request;
  token: string;

  constructor(scheme: string, host: string, path: string, token: string) {
    this.baseUrl = `${scheme}//${host}/${path}`;
    this.client = request.defaults({
      'user-agent': 'provide-js client',
      authorization: `bearer ${token}`
    });
  }

  public get(uri, params) {
    this.client.get(`${this.baseUrl}/${uri}`, { qs: params });
  }

  public post(uri, params) {
    this.client.post(`${this.baseUrl}/${uri}`, { body: JSON.stringify(params) });
  }

  public put(uri, params) {
    this.client.put(`${this.baseUrl}/${uri}`, { body: JSON.stringify(params) });
  }

  public delete(uri) {
    this.client.delete(`${this.baseUrl}/${uri}`);
  }
}
