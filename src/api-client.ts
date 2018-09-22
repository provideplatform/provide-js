export class ApiClient {

  private static readonly DEFAULT_SCHEME = 'https';
  private static readonly DEFAULT_HOST = 'provide.services';
  private static readonly DEFAULT_PATH = 'api';

  public baseUrl: string;
  public headersInit: HeadersInit;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!scheme) scheme = ApiClient.DEFAULT_SCHEME;
    if (!host) host = ApiClient.DEFAULT_HOST;
    if (!path) path = ApiClient.DEFAULT_PATH;

    this.baseUrl = `${scheme}://${host}/${path}/`;
    this.headersInit = {
      "Content-Type": "application/json; charset=utf-8",
      'User-Agent': 'provide-js client',
      'Authorization': `bearer ${token}`,
    };
  }

  private static toQuery(params: object): string {
    const paramList = [];

    for (const p in params)
      if (params.hasOwnProperty(p))
        paramList.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));

    if (paramList.length > 0)
      return '?' + paramList.join("&");
    else
      return '';
  }

  public get(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      method: 'GET',
      headers: this.headersInit,
    };

    const uriWithQuery = uri + ApiClient.toQuery(params);

    return fetch(this.baseUrl + uriWithQuery, requestInit).then(response => response.json());
  }

  public post(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: this.headersInit,
      body: JSON.stringify(params),
    };

    return fetch(this.baseUrl + uri, requestInit).then(response => response.json());
  }

  public put(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      method: 'PUT',
      headers: this.headersInit,
      body: JSON.stringify(params),
    };

    return fetch(this.baseUrl + uri, requestInit).then(response => response.json());
  }

  public delete(uri: string): Promise<any> {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: this.headersInit,
    };

    return fetch(this.baseUrl + uri, requestInit).then(response => response.json());
  }

}
