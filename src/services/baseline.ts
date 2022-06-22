/*
 * Copyright 2017-2022 Provide Technologies Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ApiClient } from '../clients';
import { ApiClientOptions, BaselineResponse, Mapping, Participant, ProtocolMessage, ProtocolMessagePayload, SubjectAccount, Workflow, Workgroup, WorkgroupAnyliticsAPIResponse, Workstep } from '@provide/types';

/*
 * Baseline proxy microservice.
 */
export class Baseline {

  private static readonly DEFAULT_HOST = 'baseline.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string, options?: ApiClientOptions) {
    if (!host) {
      host = Baseline.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path, options);
  }

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string, options?: ApiClientOptions): Baseline {
    const _scheme = scheme ? scheme : (process.env['BASELINE_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['BASELINE_API_HOST'] || Baseline.DEFAULT_HOST);
    const _path = path ? path : (process.env['BASELINE_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Baseline(token, _scheme, _host, _path, options);
  }

  public static unauthenticatedClientFactory(token: string, scheme?: string, host?: string, path?: string, options?: ApiClientOptions): ApiClient {
    const _scheme = scheme ? scheme : (process.env['BASELINE_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['BASELINE_API_HOST'] || Baseline.DEFAULT_HOST);
    const _path = path ? path : (process.env['BASELINE_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new ApiClient(token, _scheme, _host, _path, options);
  }

  public static async fetchStatus(scheme?: string, host?: string): Promise<any> {
    return ApiClient.handleResponse(await Baseline.unauthenticatedClientFactory('', scheme, host, '/').get('status'));
  }

  public async configure(params: any): Promise<void> {
    return ApiClient.handleResponse(await this.client.put('config', params), this.client.options);
  }

  public async createSubjectAccount(subjectId: string, params: any): Promise<SubjectAccount> {
    return ApiClient.handleResponse(await this.client.post(`subjects/${subjectId}/accounts`, params), this.client.options)
  }

  public async fetchMappings(params?: any): Promise<Mapping[]> {
    return ApiClient.handleResponse(await this.client.get(`mappings`, params), this.client.options);
  }

  public async createMapping(params?: any): Promise<Mapping> {
    return ApiClient.handleResponse(await this.client.post('mappings', params), this.client.options);
  }

  public async updateMapping(mappingId: string, params?: any): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`mappings/${mappingId}`, params), this.client.options);
  }

  public async deleteMapping(mappingId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`mappings/${mappingId}`), this.client.options);
  }

  public async sendProtocolMessage(params: any): Promise<any> {
    return ApiClient.handleResponse(await this.client.post('protocol_messages', params), this.client.options)
  }

  public async fetchSchemas(workgroupId: string, params: any): Promise<Mapping[]> {
    return ApiClient.handleResponse(await this.client.get(`workgroups/${workgroupId}/schemas`, params), this.client.options);
  }

  public async fetchSchemaDetails(workgroupId: string, schemaId: string): Promise<Mapping> {
    return ApiClient.handleResponse(await this.client.get(`workgroups/${workgroupId}/schemas/${schemaId}`), this.client.options);
  }

  public async createWorkgroup(params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.post('workgroups', params), this.client.options);
  }

  public async fetchWorkgroups(params?: any): Promise<Workgroup[]> {
    return ApiClient.handleResponse(await this.client.get('workgroups', params), this.client.options);
  }

  public async fetchWorkgroupDetails(workgroupId: string): Promise<Workgroup> {
    return ApiClient.handleResponse(await this.client.get(`workgroups/${workgroupId}`), this.client.options);
  }

  public async updateWorkgroup(workgroupId: string, params: any): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`workgroups/${workgroupId}`, params), this.client.options);
  }

  public async fetchWorkgroupAnalytics(workgroupId: string, params: any): Promise<WorkgroupAnyliticsAPIResponse> {
    return ApiClient.handleResponse(await this.client.get(`workgroups/${workgroupId}/analytics`, params), this.client.options);
  }

  public async createWorkflow(params: any): Promise<Workflow> {
    return ApiClient.handleResponse(await this.client.post(`workflows`, params), this.client.options);
  }

  public async updateWorkflow(workflowId: string, params: any): Promise<Workflow> {
    return ApiClient.handleResponse(await this.client.put(`workflows/${workflowId}`, params), this.client.options);
  }

  public async deployWorkflow(workflowId: string, params: any): Promise<Workflow> {
    return ApiClient.handleResponse(await this.client.post(`workflows/${workflowId}/deploy`, params), this.client.options);
  }

  public async fetchWorkstepParticipants(workflowId: string, workstepId: string, params?: any): Promise<Participant[]> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}/worksteps/${workstepId}/participants`, params), this.client.options)
  }

  public async createWorkstepParticipant(workflowId: string, workstepId: string, address: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.post(`workflows/${workflowId}/worksteps/${workstepId}/participants`, { address }), this.client.options)
  }

  public async deleteWorkstepParticipant(workflowId: string, workstepId: string, address: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`workflows/${workflowId}/worksteps/${workstepId}/participants/${address}`), this.client.options)
  }

  public async versionWorkflow(workflowId: string, params: any): Promise<Workflow> {
    return ApiClient.handleResponse(await this.client.post(`workflows/${workflowId}/versions`, params), this.client.options);
  }

  public async listWorkflowVersions(workflowId: string, params: any): Promise<Workflow> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}/versions`, params), this.client.options);
  }

  public async fetchWorkflows(params?: any): Promise<Workflow[]> {
    return ApiClient.handleResponse(await this.client.get(`workflows`, params), this.client.options);
  }

  public async fetchWorkflowDetails(workflowId: string, params?: any): Promise<Workflow> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}`, params), this.client.options);
  }

  public async createWorkstep(workflowId: string, params: any): Promise<Workstep> {
    return ApiClient.handleResponse(await this.client.post(`workflows/${workflowId}/worksteps`, params), this.client.options);
  }

  public async executeWorkstep(workflowId: string, workstepId: string, params: any): Promise<ProtocolMessagePayload> {
    return ApiClient.handleResponse(await this.client.post(`workflows/${workflowId}/worksteps/${workstepId}/execute`, params), this.client.options);
  }

  public async updateWorkstep(workflowId: string, workstepId: string, params: any): Promise<Workstep> {
    return ApiClient.handleResponse(await this.client.put(`workflows/${workflowId}/worksteps/${workstepId}`, params), this.client.options);
  }

  public async fetchWorksteps(workflowId: string, params?: any | undefined): Promise<Workstep[]> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}/worksteps`, params), this.client.options);
  }

  public async fetchWorkstepDetails(workflowId: string, workstepId: string, params?: any | undefined): Promise<Workstep> {
    return ApiClient.handleResponse(await this.client.get(`workflows/${workflowId}/worksteps/${workstepId}`, params), this.client.options);
  }

  public async deleteWorkstep(workflowId: string, workstepId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`workflows/${workflowId}/worksteps/${workstepId}`), this.client.options)
  }

  public async deleteWorkflow(workflowId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`workflows/${workflowId}`), this.client.options)
  }

  public async status(): Promise<number> {
    const resp = await baselineClientFactory('', undefined, undefined, '/').client.get('status');
    return resp.status;
  }
}

export const baselineClientFactory = (token: string, scheme?: string, host?: string, path?: string, options?: ApiClientOptions): Baseline => {
  return Baseline.clientFactory(token, scheme, host, path, options);
};
