export class ApiClient {

  private static readonly DEFAULT_SCHEME = 'https';
  private static readonly DEFAULT_HOST = 'provide.services';
  private static readonly DEFAULT_PATH = 'api';

  public baseUrl: string;
  public headers: object;
  public rp = require('request-promise');

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!scheme) scheme = ApiClient.DEFAULT_SCHEME;
    if (!host) host = ApiClient.DEFAULT_HOST;
    if (!path) path = ApiClient.DEFAULT_PATH;

    this.baseUrl = `${scheme}://${host}/${path}/`;
    this.headers = {
      'user-agent': 'provide-js client',
      'authorization': `bearer ${token}`,
    };
  }

  public get(uri: string, params: object): Promise<any> {
    const options = {
      uri: `${this.baseUrl}/${uri}`,
      qs: params,
      headers: this.headers,
      json: true,
    };

    return this.rp(options);
  }

  public post(uri: string, params: object): Promise<any> {
    const options = {
      method: 'POST',
      uri: `${this.baseUrl}/${uri}`,
      body: params,
      json: true,
    };

    return this.rp(options);
  }

  public put(uri: string, params: object): Promise<any> {
    const options = {
      method: 'PUT',
      uri: `${this.baseUrl}/${uri}`,
      body: params,
      json: true,
    };

    return this.rp(options);
  }

  public delete(uri: string): Promise<any> {
    const options = {
      method: 'DELETE',
      uri: `${this.baseUrl}/${uri}`,
      json: true,
    };

    return this.rp(options);
  }

}
