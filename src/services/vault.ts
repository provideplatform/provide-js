import { ApiClient, ApiClientResponse } from '../clients';

/*
 * Vault microservice; provides advanced privacy and messaging capabilities
 * (i.e., zero-knowledge proofs, SNARK-friendly hash functions, double-ratchet
 * algorithm, etc.
 */
export class Vault {

  private static readonly DEFAULT_HOST = 'vault.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!host) {
      host = Vault.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path);
  }

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string): Vault {
    const _scheme = scheme ? scheme : (process.env['VAULT_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['VAULT_API_HOST'] || Vault.DEFAULT_HOST);
    const _path = path ? path : (process.env['VAULT_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Vault(token, _scheme, _host, _path);
  }

  public createVault(params: object): Promise<ApiClientResponse> {
    return this.client.post('vaults', params);
  }

  public fetchVaults(params: object): Promise<ApiClientResponse> {
    return this.client.get('vaults', params);
  }

  public fetchVaultKeys(vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`vaults/${vaultId}/keys`, params);
  }

  public createVaultKey(vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`vaults/${vaultId}/keys`, params);
  }

  public deleteVaultKey(vaultId: string, keyId: string): Promise<ApiClientResponse> {
    return this.client.delete(`vaults/${vaultId}/keys/${keyId}`);
  }

  public signMessage(vaultId: string, keyId: string, msg: string): Promise<ApiClientResponse> {
    return this.client.post(`vaults/${vaultId}/keys/${keyId}/sign`, { message: msg });
  }

  public verifySignature(vaultId: string, keyId: string, msg: string, sig: string): Promise<ApiClientResponse> {
    return this.client.post(`vaults/${vaultId}/keys/${keyId}/verify`, { message: msg, signature: sig });
  }

  public fetchVaultSecrets(vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`vaults/${vaultId}/secrets`, params);
  }

  public createVaultSecret(vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`vaults/${vaultId}/secrets`, params);
  }

  public deleteVaultSecret(vaultId: string, secretId: string): Promise<ApiClientResponse> {
    return this.client.delete(`vaults/${vaultId}/secrets/${secretId}`);
  }
}

export const vaultClientFactory = (token: string, scheme?: string, host?: string, path?: string): Vault => {
  return Vault.clientFactory(token, scheme, host, path);
};
