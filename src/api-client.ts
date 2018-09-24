export class ApiClient {

  private static readonly DEFAULT_SCHEME = 'https';
  private static readonly DEFAULT_HOST = 'provide.services';
  private static readonly DEFAULT_PATH = 'api/v1';

  public baseUrl: string;

  private token: string;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!scheme) scheme = ApiClient.DEFAULT_SCHEME;
    if (!host) host = ApiClient.DEFAULT_HOST;
    if (!path) path = ApiClient.DEFAULT_PATH;

    this.baseUrl = `${scheme}://${host}/${path}/`;

    this.token = token;
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
    const uriWithQuery = this.baseUrl + uri + ApiClient.toQuery(params);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('User-Agent', 'provide-js client');
    headers.append('authorization', `bearer ${this.token}`);

    const requestInit: RequestInit = {
      method: 'GET',
      headers: headers,
      mode: 'cors'
    };

    const request = new Request(uriWithQuery, requestInit);

    return fetch(request);
  }

  public post(uri: string, params: object): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('User-Agent', 'provide-js client');
    headers.append('authorization', `bearer ${this.token}`);

    const requestInit: RequestInit = {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify(params),
    };

    const request = new Request(this.baseUrl + uri, requestInit);

    return fetch(request);
  }

  public put(uri: string, params: object): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('User-Agent', 'provide-js client');
    headers.append('authorization', `bearer ${this.token}`);

    const requestInit: RequestInit = {
      method: 'PUT',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify(params),
    };

    const request = new Request(this.baseUrl + uri, requestInit);

    return fetch(request);
  }

  public delete(uri: string): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('User-Agent', 'provide-js client');
    headers.append('authorization', `bearer ${this.token}`);

    const requestInit: RequestInit = {
      method: 'DELETE',
      headers: headers,
      mode: 'cors',
    };

    const request = new Request(this.baseUrl + uri, requestInit);

    return fetch(request);
  }

}
