import { ApiClient } from '../clients';
import { BaselineResponse } from '@provide/types';

/*
 * Baseline proxy microservice.
 */
export class Baseline {

  private static readonly DEFAULT_HOST = 'baseline.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!host) {
      host = Baseline.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path);
  }

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string): Baseline {
    const _scheme = scheme ? scheme : (process.env['BASELINE_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['BASELINE_API_HOST'] || Baseline.DEFAULT_HOST);
    const _path = path ? path : (process.env['BASELINE_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Baseline(token, _scheme, _host, _path);
  }

  public async configureProxy(params: any): Promise<void> {
    return ApiClient.handleResponse(await this.client.put('config', params));
  }

  public async createBusinessObject(params: any): Promise<BaselineResponse> {
    return ApiClient.handleResponse(await this.client.post('business_objects', params)) as BaselineResponse;
  }

  public async updateBusinessObject(id: string, params: any): Promise<BaselineResponse> {
    return ApiClient.handleResponse(await this.client.put(`business_objects/${id}`, params)) as BaselineResponse;
  }
}

export const baselineClientFactory = (token: string, scheme?: string, host?: string, path?: string): Baseline => {
  return Baseline.clientFactory(token, scheme, host, path);
};
