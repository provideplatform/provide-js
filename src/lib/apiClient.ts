import { RequestAPI } from "request";

export class ApiClient {

  private static readonly DEFAULT_SCHEME = 'https';
  private static readonly DEFAULT_HOST = 'provide.services';
  private static readonly DEFAULT_PATH = 'api';

  public baseUrl: string;
  public headers: object;
  public requestAPI: RequestAPI<any, any, any> = require('request-promise-native');

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
      headers: this.headers,
      qs: params,
      json: true,
    };

    return this.requestAPI.get(uri, options);
  }

  public post(uri: string, params: object): Promise<any> {
    const options = {
      headers: this.headers,
      body: params,
      json: true,
    };

    return this.requestAPI.post(uri, options);
  }

  public put(uri: string, params: object): Promise<any> {
    const options = {
      headers: this.headers,
      body: params,
      json: true,
    };

    return this.requestAPI.put(uri, options);
  }

  public delete(uri: string): Promise<any> {
    const options = {
      headers: this.headers,
      json: true,
    };

    return this.requestAPI.delete(uri, options);
  }

}
