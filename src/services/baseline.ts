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

  public async configure(params: any): Promise<void> {
    return ApiClient.handleResponse(await this.client.put('config', params));
  }

  public async fetchMappings(params: any | undefined): Promise<Mapping[]> {
    return ApiClient.handleResponse(await this.client.get(`mappings`, params || {}));
  }

  public async createMapping(params: any | undefined): Promise<void> {
    return ApiClient.handleResponse(await this.client.post('mappings', params || {}));
  }

  public async updateMapping(mappingId: string, params: any | undefined): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`mappings/${mappingId}`, params || {}));
  }

  public async deleteMapping(mappingId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`mappings/${mappingId}`));
  }

  public async createObject(params: any): Promise<BaselineResponse> {
    return ApiClient.handleResponse(await this.client.post('objects', params)) as BaselineResponse;
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

  public async createWorkflow(params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.post(`workflows`, params));
  }

  public async updateWorkflow(workflowId: string, params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.put(`workflows/${workflowId}`, params));
  }

  public async fetchWorkflows(params: any | undefined): Promise<Workflow[]> {
    return ApiClient.handleResponse(await this.client.get(`workflows`, params));
  }

  public async fetchWorkflowDetails(workflowId: string, params: any | undefined): Promise<Workflow[]> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}`, params));
  }

  public async createWorktep(workflowId: string, params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.post(`workflows/${workflowId}/worksteps`, params));
  }

  public async updateWorkstep(workflowId: string, workstepId: string, params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.put(`workflows/${workflowId}/worksteps/${workstepId}`, params));
  }

  public async fetchWorksteps(workflowId: string, params: any | undefined): Promise<Workflow[]> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}/worksteps`, params));
  }

  public async fetchWorkstepDetails(workflowId: string, workstepId: string, params: any | undefined): Promise<Workflow[]> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}/worksteps/${workstepId}`, params));
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
