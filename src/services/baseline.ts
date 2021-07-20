import { ApiClient } from '../clients';
import { Object as BaselineObject } from '@provide/types';

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

  public async createObject(params: any): Promise<BaselineObject> {
    return ApiClient.handleResponse(await this.client.post('objects', params)) as BaselineObject;
  }

  public async status(): Promise<number> {
    const resp = await this.client.get('status', {});
    return resp.status;
  }

  public async updateObject(id: string, params: any): Promise<BaselineObject> {
    return ApiClient.handleResponse(await this.client.put(`objects/${id}`, params)) as BaselineObject;
  }
}

export const baselineClientFactory = (token: string, scheme?: string, host?: string, path?: string): Baseline => {
  return Baseline.clientFactory(token, scheme, host, path);
};
