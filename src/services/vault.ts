import { ApiClient } from '../clients';
import { Key, Secret, Vault as ProvideVault} from '@provide/types';

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

  public async createVault(params: object): Promise<ProvideVault> {
    return ApiClient.handleResponse(await this.client.post('vaults', params)) as ProvideVault;
  }

  public async fetchVaults(params: object): Promise<ProvideVault[]> {
    return ApiClient.handleResponse(await this.client.get('vaults', params)) as ProvideVault[];
  }

  public async fetchVaultKeys(vaultId: string, params: object): Promise<Key[]> {
    return ApiClient.handleResponse(await this.client.get(`vaults/${vaultId}/keys`, params)) as Key[];
  }

  public async createVaultKey(vaultId: string, params: object): Promise<Key> {
    return ApiClient.handleResponse(await this.client.post(`vaults/${vaultId}/keys`, params)) as Key;
  }

  public async deleteVaultKey(vaultId: string, keyId: string): Promise<Key> {
    return ApiClient.handleResponse(await this.client.delete(`vaults/${vaultId}/keys/${keyId}`)) as Key;
  }

  public async encrypt(vaultId: string, keyId: string, msg: string): Promise<any> {
    return ApiClient.handleResponse(await this.client.post(`vaults/${vaultId}/keys/${keyId}/encrypt`, { message: msg }));
  }

  public async decrypt(vaultId: string, keyId: string, msg: string): Promise<any> {
    return ApiClient.handleResponse(await this.client.post(`vaults/${vaultId}/keys/${keyId}/decrypt`, { message: msg }));
  }

  public async signMessage(vaultId: string, keyId: string, msg: string): Promise<any> {
    return ApiClient.handleResponse(await this.client.post(`vaults/${vaultId}/keys/${keyId}/sign`, { message: msg }));
  }

  public async verifySignature(vaultId: string, keyId: string, msg: string, sig: string): Promise<any> {
    return ApiClient.handleResponse(await this.client.post(`vaults/${vaultId}/keys/${keyId}/verify`, { message: msg, signature: sig }));
  }

  public async fetchVaultSecrets(vaultId: string, params: object): Promise<Secret[]> {
    return ApiClient.handleResponse(await this.client.get(`vaults/${vaultId}/secrets`, params)) as Secret[];
  }

  public async fetchVaultSecret(vaultId: string, secretId: string): Promise<Secret> {
    return ApiClient.handleResponse(await this.client.get(`vaults/${vaultId}/secrets/${secretId}`, {})) as Secret;
  }

  public async createVaultSecret(vaultId: string, params: object): Promise<Secret> {
    return ApiClient.handleResponse(await this.client.post(`vaults/${vaultId}/secrets`, params)) as Secret;
  }

  public async deleteVaultSecret(vaultId: string, secretId: string): Promise<Secret> {
    return ApiClient.handleResponse(await this.client.delete(`vaults/${vaultId}/secrets/${secretId}`));
  }

  public async seal(key: string): Promise<Secret> {
    return ApiClient.handleResponse(await this.client.post('seal', { key: key }));
  }

  public async unseal(key: string): Promise<Secret> {
    return ApiClient.handleResponse(await this.client.post('unseal', { key: key }));
  }
}

export const vaultClientFactory = (token: string, scheme?: string, host?: string, path?: string): Vault => {
  return Vault.clientFactory(token, scheme, host, path);
};
