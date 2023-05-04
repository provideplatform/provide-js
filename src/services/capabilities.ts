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

import axios from 'axios'

/*
 * Capabilities utility. Manage public capabilities manifest provided by Provide.
 * The manifest is fairly large due to compiled contract artifacts so this utility
 * exists to assist in managing it.
 */
export class Capabilities {
  private static readonly capabilitiesManifestUrl =
    'https://s3.amazonaws.com/static.provide.services/capabilities/provide-capabilities-manifest.json'

  private capabilities: any
  private manifestUrl: string

  constructor(manifestUrl?: string) {
    this.manifestUrl = manifestUrl || Capabilities.capabilitiesManifestUrl
  }

  async fetch() {
    return axios.get(this.manifestUrl).then((response) => {
      if (response.status === 200) {
        this.capabilities = response.data
      }
    })
  }

  getAxiomRegistryContracts(): any {
    if (this.capabilities) {
      return this.capabilities.axiom?.contracts
    }
    return undefined
  }

  getRegistryContracts(): any {
    if (this.capabilities) {
      return this.capabilities.message_bus?.registry_contracts
    }
    return undefined
  }
}

export const capabilitiesFactory = (): Capabilities => {
  const capabilities = new Capabilities()
  capabilities.fetch()
  return capabilities
}
