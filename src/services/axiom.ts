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

import { ApiClient } from '../clients'
import {
  ApiClientOptions,
  AxiomResponse,
  Constraint,
  Mapping,
  Participant,
  ProtocolMessage,
  ProtocolMessagePayload,
  SubjectAccount,
  Workflow,
  Workgroup,
  WorkgroupAnalyticsAPIResponse,
  Workstep,
  System,
} from '@provide/types'

/*
 * Axiom proxy microservice.
 */
export class Axiom {
  private static readonly DEFAULT_HOST = 'axiom.provide.services'

  private readonly client: ApiClient

  constructor(
    token: string,
    scheme?: string,
    host?: string,
    path?: string,
    options?: ApiClientOptions
  ) {
    if (!host) {
      host = Axiom.DEFAULT_HOST
    }

    this.client = new ApiClient(token, scheme, host, path, options)
  }

  public static clientFactory(
    token: string,
    scheme?: string,
    host?: string,
    path?: string,
    options?: ApiClientOptions
  ): Axiom {
    const _scheme = scheme
      ? scheme
      : process.env['AXIOM_API_SCHEME'] || 'https'
    const _host = host
      ? host
      : process.env['AXIOM_API_HOST'] || Axiom.DEFAULT_HOST
    const _path = path
      ? path
      : process.env['AXIOM_API_PATH'] || ApiClient.DEFAULT_PATH
    return new Axiom(token, _scheme, _host, _path, options)
  }

  public static unauthenticatedClientFactory(
    token: string,
    scheme?: string,
    host?: string,
    path?: string,
    options?: ApiClientOptions
  ): ApiClient {
    const _scheme = scheme
      ? scheme
      : process.env['AXIOM_API_SCHEME'] || 'https'
    const _host = host
      ? host
      : process.env['AXIOM_API_HOST'] || Axiom.DEFAULT_HOST
    const _path = path
      ? path
      : process.env['AXIOM_API_PATH'] || ApiClient.DEFAULT_PATH
    return new ApiClient(token, _scheme, _host, _path, options)
  }

  public static async fetchStatus(
    scheme?: string,
    host?: string
  ): Promise<any> {
    return ApiClient.handleResponse(
      await Axiom.unauthenticatedClientFactory('', scheme, host, '/').get(
        'status'
      )
    )
  }

  public async configure(params: any): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.put('config', params),
      this.client.options
    )
  }

  public async createSubjectAccount(
    subjectId: string,
    params: any
  ): Promise<SubjectAccount> {
    return ApiClient.handleResponse(
      await this.client.post(`subjects/${subjectId}/accounts`, params),
      this.client.options
    )
  }

  public async systemReachability(params: any): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.post(`systems/reachability`, params),
      this.client.options
    )
  }

  public async fetchMappings(params?: any): Promise<Mapping[]> {
    return ApiClient.handleResponse(
      await this.client.get(`mappings`, params),
      this.client.options
    )
  }

  public async createMapping(params?: any): Promise<Mapping> {
    return ApiClient.handleResponse(
      await this.client.post('mappings', params),
      this.client.options
    )
  }

  public async updateMapping(mappingId: string, params?: any): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.put(`mappings/${mappingId}`, params),
      this.client.options
    )
  }

  public async deleteMapping(mappingId: string): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(`mappings/${mappingId}`),
      this.client.options
    )
  }

  public async sendProtocolMessage(params: any): Promise<AxiomResponse> {
    return ApiClient.handleResponse(
      await this.client.post('protocol_messages', params),
      this.client.options
    )
  }

  public async fetchSchemas(
    workgroupId: string,
    params: any
  ): Promise<Mapping[]> {
    return ApiClient.handleResponse(
      await this.client.get(`workgroups/${workgroupId}/schemas`, params),
      this.client.options
    )
  }

  public async fetchSchemaDetails(
    workgroupId: string,
    schemaId: string
  ): Promise<Mapping> {
    return ApiClient.handleResponse(
      await this.client.get(`workgroups/${workgroupId}/schemas/${schemaId}`),
      this.client.options
    )
  }

  public async createWorkgroup(params: any): Promise<Workgroup> {
    return ApiClient.handleResponse(
      await this.client.post('workgroups', params),
      this.client.options
    )
  }

  public async fetchWorkgroups(params?: any): Promise<Workgroup[]> {
    return ApiClient.handleResponse(
      await this.client.get('workgroups', params),
      this.client.options
    )
  }

  public async fetchWorkgroupDetails(workgroupId: string): Promise<Workgroup> {
    return ApiClient.handleResponse(
      await this.client.get(`workgroups/${workgroupId}`),
      this.client.options
    )
  }

  public async updateWorkgroup(
    workgroupId: string,
    params: any
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.put(`workgroups/${workgroupId}`, params),
      this.client.options
    )
  }

  public async fetchWorkgroupAnalytics(
    workgroupId: string,
    params: any
  ): Promise<WorkgroupAnalyticsAPIResponse> {
    return ApiClient.handleResponse(
      await this.client.get(`workgroups/${workgroupId}/analytics`, params),
      this.client.options
    )
  }

  public async createWorkflow(params: any): Promise<Workflow> {
    return ApiClient.handleResponse(
      await this.client.post(`workflows`, params),
      this.client.options
    )
  }

  public async updateWorkflow(
    workflowId: string,
    params: any
  ): Promise<Workflow> {
    return ApiClient.handleResponse(
      await this.client.put(`workflows/${workflowId}`, params),
      this.client.options
    )
  }

  public async deployWorkflow(
    workflowId: string,
    params: any
  ): Promise<Workflow> {
    return ApiClient.handleResponse(
      await this.client.post(`workflows/${workflowId}/deploy`, params),
      this.client.options
    )
  }

  public async fetchWorkstepParticipants(
    workflowId: string,
    workstepId: string,
    params?: any
  ): Promise<Participant[]> {
    return ApiClient.handleResponse(
      await this.client.get(
        `workflows/${workflowId}/worksteps/${workstepId}/participants`,
        params
      ),
      this.client.options
    )
  }

  public async createWorkstepParticipant(
    workflowId: string,
    workstepId: string,
    address: string
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.post(
        `workflows/${workflowId}/worksteps/${workstepId}/participants`,
        { address }
      ),
      this.client.options
    )
  }

  public async deleteWorkstepParticipant(
    workflowId: string,
    workstepId: string,
    address: string
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(
        `workflows/${workflowId}/worksteps/${workstepId}/participants/${address}`
      ),
      this.client.options
    )
  }

  public async versionWorkflow(
    workflowId: string,
    params: any
  ): Promise<Workflow> {
    return ApiClient.handleResponse(
      await this.client.post(`workflows/${workflowId}/versions`, params),
      this.client.options
    )
  }

  public async listWorkflowVersions(
    workflowId: string,
    params: any
  ): Promise<Workflow> {
    return ApiClient.handleResponse(
      await this.client.get(`workflows/${workflowId}/versions`, params),
      this.client.options
    )
  }

  public async fetchWorkflows(params?: any): Promise<Workflow[]> {
    return ApiClient.handleResponse(
      await this.client.get(`workflows`, params),
      this.client.options
    )
  }

  public async fetchWorkflowDetails(
    workflowId: string,
    params?: any
  ): Promise<Workflow> {
    return ApiClient.handleResponse(
      await this.client.get(`workflows/${workflowId}`, params),
      this.client.options
    )
  }

  public async createWorkstep(
    workflowId: string,
    params: any
  ): Promise<Workstep> {
    return ApiClient.handleResponse(
      await this.client.post(`workflows/${workflowId}/worksteps`, params),
      this.client.options
    )
  }

  public async executeWorkstep(
    workflowId: string,
    workstepId: string,
    params: any
  ): Promise<ProtocolMessagePayload> {
    return ApiClient.handleResponse(
      await this.client.post(
        `workflows/${workflowId}/worksteps/${workstepId}/execute`,
        params
      ),
      this.client.options
    )
  }

  public async updateWorkstep(
    workflowId: string,
    workstepId: string,
    params: any
  ): Promise<Workstep> {
    return ApiClient.handleResponse(
      await this.client.put(
        `workflows/${workflowId}/worksteps/${workstepId}`,
        params
      ),
      this.client.options
    )
  }

  public async fetchWorksteps(
    workflowId: string,
    params?: any
  ): Promise<Workstep[]> {
    return ApiClient.handleResponse(
      await this.client.get(`workflows/${workflowId}/worksteps`, params),
      this.client.options
    )
  }

  public async fetchWorkstepDetails(
    workflowId: string,
    workstepId: string,
    params?: any
  ): Promise<Workstep> {
    return ApiClient.handleResponse(
      await this.client.get(
        `workflows/${workflowId}/worksteps/${workstepId}`,
        params
      ),
      this.client.options
    )
  }

  public async deleteWorkstep(
    workflowId: string,
    workstepId: string
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(
        `workflows/${workflowId}/worksteps/${workstepId}`
      ),
      this.client.options
    )
  }

  public async deleteWorkflow(workflowId: string): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(`workflows/${workflowId}`),
      this.client.options
    )
  }

  public async listWorkstepConstraints(
    workflowId: string,
    workstepId: string,
    params?: any
  ): Promise<Constraint[]> {
    return ApiClient.handleResponse(
      await this.client.get(
        `workflows/${workflowId}/worksteps/${workstepId}/constraints`,
        params
      ),
      this.client.options
    )
  }

  public async createWorkstepConstraint(
    workflowId: string,
    workstepId: string,
    params: any
  ): Promise<Constraint> {
    return ApiClient.handleResponse(
      await this.client.post(
        `workflows/${workflowId}/worksteps/${workstepId}/constraints`,
        params
      ),
      this.client.options
    )
  }

  public async updateWorkstepConstraint(
    workflowId: string,
    workstepId: string,
    constraintId: string,
    params: any
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.put(
        `workflows/${workflowId}/worksteps/${workstepId}/constraints/${constraintId}`,
        params
      ),
      this.client.options
    )
  }

  public async deleteWorkstepConstraint(
    workflowId: string,
    workstepId: string,
    constraintId: string
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(
        `workflows/${workflowId}/worksteps/${workstepId}/constraints/${constraintId}`
      ),
      this.client.options
    )
  }

  public async listSystems(
    workgroupId: string,
    params?: any
  ): Promise<System[]> {
    return ApiClient.handleResponse(
      await this.client.get(`workgroups/${workgroupId}/systems`, params),
      this.client.options
    )
  }

  public async getSystemDetails(
    workgroupId: string,
    systemId: string,
    params?: any
  ): Promise<System> {
    return ApiClient.handleResponse(
      await this.client.get(
        `workgroups/${workgroupId}/systems/${systemId}`,
        params
      ),
      this.client.options
    )
  }

  public async createSystem(workgroupId: string, params: any): Promise<System> {
    return ApiClient.handleResponse(
      await this.client.post(`workgroups/${workgroupId}/systems`, params),
      this.client.options
    )
  }

  public async updateSystem(
    workgroupId: string,
    systemId: string,
    params: any
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.put(
        `workgroups/${workgroupId}/systems/${systemId}`,
        params
      ),
      this.client.options
    )
  }

  public async deleteSystem(
    workgroupId: string,
    systemId: string
  ): Promise<void> {
    return ApiClient.handleResponse(
      await this.client.delete(`workgroups/${workgroupId}/systems/${systemId}`),
      this.client.options
    )
  }

  public async status(): Promise<number> {
    const resp = await axiomClientFactory(
      '',
      undefined,
      undefined,
      '/'
    ).client.get('status')
    return resp.status
  }
}

export const axiomClientFactory = (
  token: string,
  scheme?: string,
  host?: string,
  path?: string,
  options?: ApiClientOptions
): Axiom => {
  return Axiom.clientFactory(token, scheme, host, path, options)
}
