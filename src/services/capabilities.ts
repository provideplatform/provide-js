import axios from 'axios';

/*
 * Capabilities utility. Manage public capabilities manifest provided by Provide.
 * The manifest is fairly large due to compiled contract artifacts so this utility
 * exists to assist in managing it.
 */
export class Capabilities {

  private static readonly capabilitiesManifestUrl = 'https://s3.amazonaws.com/static.provide.services/capabilities/provide-capabilities-manifest.json';

  private capabilities: any;
  private manifestUrl: string;

  constructor(manifestUrl?: string) {
    this.manifestUrl = manifestUrl || Capabilities.capabilitiesManifestUrl;
  }

  async fetch() {
    return axios.get(this.manifestUrl).then((response) => {
      if (response.status === 200) {
        this.capabilities = response.data;
      }
    });
  }

  getRegistryContracts(): any {
    if (this.capabilities) {
      return this.capabilities.message_bus?.registry_contracts;
    }
    return undefined;
  }
}

export const capabilitiesFactory = (): Capabilities => {
  const capabilities = new Capabilities();
  capabilities.fetch();
  return capabilities;
};
