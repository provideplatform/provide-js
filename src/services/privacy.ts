import { ApiClient } from '../clients';
import { Circuit, ProveResponse, VerifyResponse } from '@provide/types';

/*
 * Privacy microservice; provides access to protocol-agnostic functionality
 * exposed by the Provide Privacy API and its underlying circuit registry.
 */
export class Privacy {

  private static readonly DEFAULT_HOST = 'privacy.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!host) {
      host = Privacy.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path);
  }

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string): Privacy {
    const _scheme = scheme ? scheme : (process.env['PRIVACY_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['PRIVACY_API_HOST'] || Privacy.DEFAULT_HOST);
    const _path = path ? path : (process.env['PRIVACY_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Privacy(token, _scheme, _host, _path);
  }

  public async fetchCircuits(params?: object): Promise<Circuit[]> {
    return ApiClient.handleResponse(await this.client.get('circuits', params || {}));
  }

  public async fetchCircuitDetails(circuitId: string, params?: object): Promise<Circuit> {
    return ApiClient.handleResponse(await this.client.get(`circuits/${circuitId}`, params || {}));
  }

  public async deployCircuit(params: object): Promise<Circuit> {
    return ApiClient.handleResponse(await this.client.post('circuits', params));
  }

  public async prove(circuitId: string, params: object): Promise<ProveResponse> {
    return ApiClient.handleResponse(await this.client.post(`circuits/${circuitId}/prove`, params));
  }

  public async verify(circuitId: string, params: object): Promise<VerifyResponse> {
    return ApiClient.handleResponse(await this.client.post(`circuits/${circuitId}/verify`, params));
  }
}

export const privacyClientFactory = (token: string, scheme?: string, host?: string, path?: string): Privacy => {
  return Privacy.clientFactory(token, scheme, host, path);
};
