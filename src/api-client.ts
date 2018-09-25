export class ApiClient {

  public static readonly DEFAULT_SCHEME = 'https';
  public static readonly DEFAULT_HOST = 'provide.services';
  public static readonly DEFAULT_PATH = 'api/v1';

  private baseUri: string;
  private headers: Headers;

  constructor(
    apiToken: string,
    scheme = ApiClient.DEFAULT_SCHEME,
    host = ApiClient.DEFAULT_HOST,
    path = ApiClient.DEFAULT_PATH,
  ) {
    this.baseUri = `${scheme}://${host}/${path}/`;
    this.headers = new Headers();
    this.headers.append('Authorization', `bearer ${apiToken}`);
    this.headers.append('Content-Type', 'application/json');
  }

  private static toQuery(paramObject: object): string {
    const paramList = [];

    for (const p in paramObject)
      if (paramObject.hasOwnProperty(p))
        paramList.push(encodeURIComponent(p) + "=" + encodeURIComponent(paramObject[p]));

    if (paramList.length > 0)
      return '?' + paramList.join("&");
    else
      return '';
  }

  public get(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      headers: this.headers,
      method: 'GET',
      mode: 'cors'
    };

    const uriWithQuery = this.baseUri + uri + ApiClient.toQuery(params);
    const request = new Request(uriWithQuery, requestInit);

    return fetch(request);
  }

  public post(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      headers: this.headers,
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(params),
    };

    const request = new Request(this.baseUri + uri, requestInit);

    return fetch(request);
  }

  public put(uri: string, params: object): Promise<any> {
    const requestInit: RequestInit = {
      headers: this.headers,
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(params),
    };

    const request = new Request(this.baseUri + uri, requestInit);

    return fetch(request);
  }

  public delete(uri: string): Promise<any> {
    const requestInit: RequestInit = {
      headers: this.headers,
      method: 'DELETE',
      mode: 'cors',
    };

    const request = new Request(this.baseUri + uri, requestInit);

    return fetch(request);
  }

}
