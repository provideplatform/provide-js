import { ApiClient } from '../clients';
import { BaselineResponse, Mapping, Workflow, Workgroup } from '@provide/types';

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

  public static unauthenticatedClientFactory(token: string, scheme?: string, host?: string, path?: string): ApiClient {
    const _scheme = scheme ? scheme : (process.env['BASELINE_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['BASELINE_API_HOST'] || Baseline.DEFAULT_HOST);
    const _path = path ? path : (process.env['BASELINE_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new ApiClient(token, _scheme, _host, _path);
  }

  public static async fetchStatus(scheme?: string, host?: string): Promise<any> {
    return ApiClient.handleResponse(await Baseline.unauthenticatedClientFactory('', scheme, host, '/').get('status', {}));
  }

  public async configureProxy(params: any): Promise<void> {
    return ApiClient.handleResponse(await this.client.put('config', params));
  }

  public async createObject(params: any): Promise<BaselineResponse> {
    return ApiClient.handleResponse(await this.client.post('objects', params)) as BaselineResponse;
  }

  public async createWorkflow(workgroupId: string, params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.post(`workgroups/${workgroupId}/workflows`, params));
  }

  public async fetchWorkflows(workgroupId: string, params: any | undefined): Promise<Workflow[]> {
    return ApiClient.handleResponse(await this.client.get(`workgroups/${workgroupId}/workflows`, params));
  }

  public async createWorkgroup(params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.post('workgroups', params));
  }

  public async fetchWorkgroups(params: any | undefined): Promise<Workgroup[]> {
    return ApiClient.handleResponse(await this.client.get('workgroups', params || {}));
  }

  public async fetchWorkgroupDetails(workgroupId: string): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.get(`workgroups/${workgroupId}`, {}));
  }

  public async fetchWorkgroupMappings(workgroupId: string, params: any | undefined): Promise<Mapping[]> {
    return ApiClient.handleResponse(await this.client.get(`workgroups/${workgroupId}/mappings`, params || {}));
  }

  public async createWorkgroupMapping(workgroupId: string, mappingId: string, params: any | undefined): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`workgroups/${workgroupId}/mappings/${mappingId}`, params || {}));
  }

  public async updateWorkgroupMapping(workgroupId: string, mappingId: string, params: any | undefined): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`workgroups/${workgroupId}/mappings/${mappingId}`, params || {}));
  }

  public async status(): Promise<number> {
    const resp = await baselineClientFactory('', undefined, undefined, '/').client.get('status', {});
    return resp.status;
  }

  public async updateObject(id: string, params: any): Promise<BaselineResponse> {
    return ApiClient.handleResponse(await this.client.put(`objects/${id}`, params)) as BaselineResponse;
  }
}

export const baselineClientFactory = (token: string, scheme?: string, host?: string, path?: string): Baseline => {
  return Baseline.clientFactory(token, scheme, host, path);
};
