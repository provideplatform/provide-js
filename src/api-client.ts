import {ApiClientResponse} from "./api-client-response";

export class ApiClient {

  public static readonly DEFAULT_SCHEME = 'https';
  public static readonly DEFAULT_HOST = 'provide.services';
  public static readonly DEFAULT_PATH = 'api/v1';

  private readonly baseUri: string;
  private readonly requestHeaders: Map<string, string>;

  constructor(
    apiToken: string,
    scheme = ApiClient.DEFAULT_SCHEME,
    host = ApiClient.DEFAULT_HOST,
    path = ApiClient.DEFAULT_PATH,
  ) {
    this.baseUri = `${scheme}://${host}/${path}/`;

    this.requestHeaders = new Map<string, string>();
    this.requestHeaders.set('Authorization', `bearer ${apiToken}`);
    this.requestHeaders.set('Content-Type', 'application/json');
  }

  private static toQuery(paramObject: object): string {
    const paramList = [];

    for (const p in paramObject)
      if (paramObject.hasOwnProperty(p))
        paramList.push(encodeURIComponent(p) + "=" + encodeURIComponent(paramObject[p]));

    if (paramList.length > 0)
      return paramList.join("&");
    else
      return '';
  }

  public get(uri: string, params: object): Promise<any> {
    return this.makeRequest('GET', uri, params);
  }

  public post(uri: string, params: object): Promise<any> {
    return this.makeRequest('POST', uri, params);
  }

  public put(uri: string, params: object): Promise<any> {
    return this.makeRequest('PUT', uri, params);
  }

  public delete(uri: string): Promise<any> {
    return this.makeRequest('DELETE', uri);
  }

  private makeRequest(
    method: string,
    uri: string,
    params: object = null
  ): Promise<ApiClientResponse> {

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();
      xhr.open(method, this.baseUri + uri);

      this.requestHeaders.forEach((value, header) => {
        xhr.setRequestHeader(header, value);
      });

      let requestBody: string;

      if (params === null)
        requestBody = undefined;
      else if (method === "GET")
        requestBody = ApiClient.toQuery(params);
      else
        requestBody = JSON.stringify(params);

      xhr.onload = () => resolve(
        new ApiClientResponse(
          requestBody,
          this.requestHeaders,
          xhr.response,
          xhr.getAllResponseHeaders(),
          xhr,
        )
      );

      xhr.onerror = () => reject(
        new ApiClientResponse(
          requestBody,
          this.requestHeaders,
          xhr.response,
          xhr.getAllResponseHeaders(),
          xhr,
        )
      );

      if (requestBody === undefined)
        xhr.send();
      else
        xhr.send(requestBody);

    });
  }

}
