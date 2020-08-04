import { ApiClient } from './api-client';

export class RpcClient {

  public static readonly DEFAULT_SCHEME = 'http';
  public static readonly DEFAULT_HOST = 'localhost:8545';
  public static readonly DEFAULT_PATH = '/';
  public static readonly DEFAULT_VERSION = '2.0';

  private apiClient: ApiClient;

  private id: number;
  private version: string;

  /**
   * Initialize a basic JSON-RPC wrapper.
   *
   * Parameters form a full URI of [scheme]://[host][path]
   *
   * @param scheme Either 'http' or 'https'
   * @param host The host (including port if non-default) of the JSON-RPC service
   * @param path The base path
   * @param version The JSON-RPC version; defaults to 2.0
   */
  constructor(
    scheme = RpcClient.DEFAULT_SCHEME,
    host = RpcClient.DEFAULT_HOST,
    path = RpcClient.DEFAULT_PATH,
    version = RpcClient.DEFAULT_VERSION,
  ) {
    this.apiClient = new ApiClient(undefined, scheme, host, path);
    this.id = 1;
    this.version = version;
  }

  call(method: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiClient.post('', {
        id: this.id++,
        version: this.version,
        method: method,
        params: params,
      }).then((resp) => {
        if (resp && resp.data && resp.status === 200) {
          const response = JSON.parse(resp.data);
          if (response && typeof response.result !== 'undefined' && typeof response.error === 'undefined') {
            resolve(response.result);
          } else if (response && response.error) {
            reject(response);
          } else {
            reject(response);
          }
        } else {
          reject(resp);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
