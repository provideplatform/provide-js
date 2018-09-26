export class ApiClient {

  public static readonly DEFAULT_SCHEME = 'https';
  public static readonly DEFAULT_HOST = 'provide.services';
  public static readonly DEFAULT_PATH = 'api/v1';

  private readonly apiToken: string;
  private readonly baseUri: string;

  constructor(
    apiToken: string,
    scheme = ApiClient.DEFAULT_SCHEME,
    host = ApiClient.DEFAULT_HOST,
    path = ApiClient.DEFAULT_PATH,
  ) {
    this.apiToken = apiToken;
    this.baseUri = `${scheme}://${host}/${path}/`;
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

  private makeRequest(method: string, uri: string, params: object = null): Promise<any> {
    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();
      xhr.open(method, this.baseUri + uri);

      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new Error(`${method} failed.`));

      xhr.setRequestHeader('Authorization', `bearer ${this.apiToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      if (params === null)
        xhr.send();
      else if (method === "GET")
        xhr.send(ApiClient.toQuery(params));
      else
        xhr.send(JSON.stringify(params));

    });
  }

}
