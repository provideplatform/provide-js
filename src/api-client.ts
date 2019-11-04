import {ApiClientResponse} from './api-client-response';

export class ApiClient {

  public static readonly DEFAULT_SCHEME = 'https';
  public static readonly DEFAULT_HOST = 'provide.services';
  public static readonly DEFAULT_PATH = 'api/v1';

  private readonly apiToken: string;
  private readonly baseUri: string;

  constructor(
    apiToken?: string,
    scheme = ApiClient.DEFAULT_SCHEME,
    host = ApiClient.DEFAULT_HOST,
    path = ApiClient.DEFAULT_PATH,
  ) {
    this.apiToken = apiToken;
    this.baseUri = `${scheme}://${host}/${path}/`;
  }

  private static toQuery(paramObject: object): string {
    const paramList: string[] = [];

    for (const p in paramObject) {
      if (paramObject.hasOwnProperty(p)) {
        const param = paramObject[p];
        if (param instanceof Array) {
          // tslint:disable-next-line: forin
          for (const i in param) {
            paramList.push(encodeURIComponent(p) + '=' + encodeURIComponent(param[i]));
          }
        } else {
          paramList.push(encodeURIComponent(p) + '=' + encodeURIComponent(paramObject[p]));
        }
      }
    }

    if (paramList.length > 0) {
      return paramList.join('&');
    }

    return '';
  }

  public get(uri: string, params: object): Promise<ApiClientResponse> {
    return this.makeRequest('GET', uri, params);
  }

  public post(uri: string, params: object): Promise<ApiClientResponse> {
    return this.makeRequest('POST', uri, params);
  }

  public put(uri: string, params: object): Promise<ApiClientResponse> {
    return this.makeRequest('PUT', uri, params);
  }

  public delete(uri: string): Promise<ApiClientResponse> {
    return this.makeRequest('DELETE', uri);
  }

  private makeRequest(
    method: string,
    uri: string,
    params: object = null
  ): Promise<ApiClientResponse> {

    return new Promise((resolve, reject) => {
      let query = '';
      let requestBody: string;

      if (params === null) {
        requestBody = undefined;
      } else if (method === 'GET' && Object.keys(params).length > 0) {
        query = `?${ApiClient.toQuery(params)}`;
      } else {
        requestBody = JSON.stringify(params);
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, this.baseUri + uri + query);

      const requestHeaders = new Map<string, string>();
      if (this.apiToken) {
        requestHeaders.set('Authorization', `bearer ${this.apiToken}`);
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
