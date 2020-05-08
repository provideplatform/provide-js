import { ApiClientResponse } from './api-client-response';

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
    this.baseUrl = `${scheme}://${host}/${path}/`;
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

  public get(uri: string, params: object): Promise<ApiClientResponse> {
    return this.sendRequest('GET', uri, params);
  }

  public patch(uri: string, params: object): Promise<ApiClientResponse> {
    return this.sendRequest('PATCH', uri, params);
  }

  public post(uri: string, params: object): Promise<ApiClientResponse> {
    return this.sendRequest('POST', uri, params);
  }

  public put(uri: string, params: object): Promise<ApiClientResponse> {
    return this.sendRequest('PUT', uri, params);
  }

  public delete(uri: string): Promise<ApiClientResponse> {
    return this.sendRequest('DELETE', uri, null);
  }

  private sendRequest(
    method: string,
    uri: string,
    params: any = null,
  ): Promise<ApiClientResponse> {

    return new Promise((resolve, reject) => {
      let query = '';
      let requestBody: any;

      if (params === null) {
        requestBody = undefined;
      } else if (method === 'GET' && Object.keys(params).length > 0) {
        query = `?${ApiClient.toQuery(params)}`;
      } else {
        requestBody = JSON.stringify(params);
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, this.baseUrl + uri + query);

      const requestHeaders = new Map<string, string>();
      if (this.token) {
        requestHeaders.set('Authorization', `bearer ${this.token}`);
      }

      if (['POST', 'PUT'].indexOf(method) !== -1) {
        requestHeaders.set('Content-Type', 'application/json');
      }

      requestHeaders.forEach((value, header) => {
        xhr.setRequestHeader(header, value);
      });

      xhr.onload = () => resolve(
        new ApiClientResponse(
          query,
          requestBody,
          requestHeaders,
          xhr.response,
          xhr.getAllResponseHeaders(),
          xhr,
        )
      );

      xhr.onerror = () => reject(
        new ApiClientResponse(
          query,
          requestBody,
          requestHeaders,
          xhr.response,
          xhr.getAllResponseHeaders(),
          xhr,
        )
      );

      if (requestBody === undefined) {
        xhr.send();
      } else {
        xhr.send(requestBody);
      }
    });
  }
}
