export class ApiClient {

  private static readonly DEFAULT_SCHEME = 'https';
  private static readonly DEFAULT_HOST = 'provide.services';
  private static readonly DEFAULT_PATH = 'api/v1';

  public baseUrl: string;
  public headers: Headers;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!scheme) scheme = ApiClient.DEFAULT_SCHEME;
    if (!host) host = ApiClient.DEFAULT_HOST;
    if (!path) path = ApiClient.DEFAULT_PATH;

    this.baseUrl = `${scheme}://${host}/${path}/`;

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('User-Agent', 'provide-js client');
    this.headers.append('Authorization', `bearer ${token}`);
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
      headers: this.headers,
      mode: "cors",
    };

    const uriWithQuery = uri + ApiClient.toQuery(params);

    const request = new Request(this.baseUrl + uriWithQuery);

    return fetch(request, requestInit);
  }

  public post(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: this.headers,
      mode: "cors",
      body: JSON.stringify(params),
    };

    const request = new Request(this.baseUrl + uri);

    return fetch(request, requestInit);
  }

  public put(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      method: 'PUT',
      headers: this.headers,
      mode: "cors",
      body: JSON.stringify(params),
    };

    const request = new Request(this.baseUrl + uri);

    return fetch(request, requestInit);
  }

  public delete(uri: string): Promise<any> {
    const requestInit: RequestInit = {
      method: 'DELETE',
      headers: this.headers,
      mode: "cors",
    };

    const request = new Request(this.baseUrl + uri);

    return fetch(request, requestInit);
  }

}
