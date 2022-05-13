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
import { ApiClientOptions, Prover, ProveResponse, VerifyResponse } from '@provide/types';

/*
 * Privacy microservice; provides access to protocol-agnostic functionality
 * exposed by the Provide Privacy API and its underlying prover/circuit registry.
 */
export class Privacy {

  private static readonly DEFAULT_HOST = 'privacy.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string, options?: ApiClientOptions) {
    if (!host) {
      host = Privacy.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path, options);
  }

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string, options?: ApiClientOptions): Privacy {
    const _scheme = scheme ? scheme : (process.env['PRIVACY_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['PRIVACY_API_HOST'] || Privacy.DEFAULT_HOST);
    const _path = path ? path : (process.env['PRIVACY_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Privacy(token, _scheme, _host, _path, options);
  }

  public async fetchProvers(params?: object): Promise<Prover[]> {
    return ApiClient.handleResponse(await this.client.get('provers', params), this.client.options);
  }

  public async fetchProverDetails(proverId: string, params?: object): Promise<Prover> {
    return ApiClient.handleResponse(await this.client.get(`provers/${proverId}`, params), this.client.options);
  }

  public async deployProver(params: object): Promise<Prover> {
    return ApiClient.handleResponse(await this.client.post('provers', params), this.client.options);
  }

  public async prove(proverId: string, params: object): Promise<ProveResponse> {
    return ApiClient.handleResponse(await this.client.post(`provers/${proverId}/prove`, params), this.client.options);
  }

  public async verify(proverId: string, params: object): Promise<VerifyResponse> {
    return ApiClient.handleResponse(await this.client.post(`provers/${proverId}/verify`, params), this.client.options);
  }
}

export const privacyClientFactory = (token: string, scheme?: string, host?: string, path?: string, options?: ApiClientOptions): Privacy => {
  return Privacy.clientFactory(token, scheme, host, path, options);
};
