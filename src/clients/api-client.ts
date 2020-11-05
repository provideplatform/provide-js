import axios, { AxiosResponse, Method } from 'axios';
import { Model } from '@provide/types';

export class ApiClient {

  public static readonly DEFAULT_SCHEME = 'https';
  public static readonly DEFAULT_HOST = 'provide.services';
  public static readonly DEFAULT_PATH = 'api/v1';

  private readonly token?: string | undefined;
  private readonly baseUrl: string;

  /**
   * Initialize the API client.
   *
   * Parameters form a full URI of [scheme]://[host]:[port][path]
   *
   * @param token The bearer authorization token
   * @param scheme Either 'http' or 'https'
   * @param host The domain name or ip address and port of the service
   * @param path The base path, e.g. 'api/v1'
   */
  constructor(
    token?: string,
    scheme = ApiClient.DEFAULT_SCHEME,
    host = ApiClient.DEFAULT_HOST,
    path = ApiClient.DEFAULT_PATH,
  ) {
    this.token = token;
    this.baseUrl = `${scheme}://${host}/${path && path !== '/' ? path : ''}/`;
  }

  static handleResponse(resp: AxiosResponse<any>): any {
    if (['PATCH', 'UPDATE', 'DELETE'].indexOf(resp.request?.method) !== -1 || resp.headers['content-length'] === 0) {
      if (resp.status >= 400) {
        return Promise.reject(`failed with ${resp.status} status`);
      }
      return Promise.resolve();
    }

    try {
      if (resp.data instanceof Array) {
        const arr = [];
        (resp.data as any[]).forEach((item: any) => {
          const inst = new Model();
          inst.unmarshal(JSON.stringify(item));
          (arr as any[]).push(inst);
        });
        return arr;
      }
    
      const instance = new Model();
      const json = JSON.stringify(resp.data); // HACK!!
      instance.unmarshal(json);
      return instance;
    } catch (err) {
      return Promise.reject('failed to parse response as JSON');
    }
  }

  private static toQuery(params: object): string {
    const paramList: string[] = [];

    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        const param = params[p];
        if (param instanceof Array) {
          // tslint:disable-next-line: forin
          for (const i in param) {
            paramList.push(encodeURIComponent(p) + '=' + encodeURIComponent(param[i]));
          }
        } else {
          paramList.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
        }
      }
    }

    if (paramList.length > 0) {
      return paramList.join('&');
    }

    return '';
  }

  async get(uri: string, params: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest('GET', uri, params);
  }

  async patch(uri: string, params: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest('PATCH', uri, params);
  }

  async post(uri: string, params: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest('POST', uri, params);
  }

  async put(uri: string, params: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest('PUT', uri, params);
  }

  async delete(uri: string): Promise<AxiosResponse<any>> {
    return await this.sendRequest('DELETE', uri, null);
  }

  private async sendRequest(
    method: string,
    uri: string,
    params: any = null,
  ): Promise<AxiosResponse<any>> {
    let query = '';
    let requestBody: any;

    if (params === null) {
      requestBody = undefined;
    } else if (method === 'GET' && Object.keys(params).length > 0) {
      query = `?${ApiClient.toQuery(params)}`;
    } else {
      requestBody = JSON.stringify(params);
    }

    const requestHeaders = {};
    if (this.token) {
      requestHeaders['Authorization'] = `bearer ${this.token}`;
    }

    if (['POST', 'PUT'].indexOf(method) !== -1) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    const cfg = {
      url: this.baseUrl + uri + query,
      method: method as Method,
      headers: requestHeaders,
      data: null,
    };

    if (['POST', 'PUT'].indexOf(method) !== -1) {
      cfg.data = requestBody;
    }

    try {
      return axios.request(cfg);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
