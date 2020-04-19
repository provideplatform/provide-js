import { ApiClient, ApiClientResponse } from '../clients';


/*
 * Ident microservice; provides access to functionality
 * exposed by the Provide identity and resource authorization APIs.
 */
export class Ident {

  private static readonly DEFAULT_HOST = 'ident.provide.services';

  private readonly client: ApiClient;

  constructor(token: string, scheme?: string, host?: string, path?: string) {
    if (!host) {
      host = Ident.DEFAULT_HOST;
    }

    this.client = new ApiClient(token, scheme, host, path);
  }

  public static clientFactory(token?: string | undefined, scheme?: string, host?: string, path?: string): Ident | ApiClient {
    const _scheme = scheme ? scheme : (process.env['IDENT_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['IDENT_API_HOST'] || Ident.DEFAULT_HOST);
    const _path = path ? path : (process.env['IDENT_API_PATH'] || ApiClient.DEFAULT_PATH);
    return token ? new Ident(token, _scheme, _host, _path) : new ApiClient(token, _scheme, _host, _path);
  }

  private static unauthenticatedClientFactory(token?: string | undefined, scheme?: string, host?: string, path?: string): ApiClient {
    const _scheme = scheme ? scheme : (process.env['IDENT_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['IDENT_API_HOST'] || Ident.DEFAULT_HOST);
    const _path = path ? path : (process.env['IDENT_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new ApiClient(token, _scheme, _host, _path);
  }

  public static authenticate(params: object, scheme?: string, host?: string, path?: string): Promise<ApiClientResponse> {
    return Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post('authenticate', params);
  }

  public static createUser(params: object, scheme?: string, host?: string, path?: string): Promise<ApiClientResponse> {
    return Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post('users', params);
  }

  public static requestPasswordReset(email: string, scheme?: string, host?: string, path?: string): Promise<ApiClientResponse> {
    return Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post('reset_password', { email });
  }

  public static resetPassword(token: string, password: string, scheme?: string, host?: string, path?: string): Promise<ApiClientResponse> {
    return Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post(`reset_password/${token}`, { password });
  }

  public createApplication(params: object): Promise<ApiClientResponse> {
    return this.client.post('applications', params);
  }

  public updateApplication(appId: string, params: object): Promise<ApiClientResponse> {
    return this.client.put(`applications/${appId}`, params);
  }

  public fetchApplications(params: object): Promise<ApiClientResponse> {
    return this.client.get('applications', params);
  }

  public fetchApplicationDetails(appId: string): Promise<ApiClientResponse> {
    return this.client.get(`applications/${appId}`, {});
  }

  public fetchApplicationOrganizations(appId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`applications/${appId}/organizations`, params);
  }

  public createApplicationOrganization(appId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`applications/${appId}/organizations`, params);
  }

  public updateApplicationOrganization(appId: string, organizationId: string, params: object): Promise<ApiClientResponse> {
    return this.client.put(`applications/${appId}/organizations/${organizationId}`, params);
  }

  public deleteApplicationOrganization(appId: string, organizationId: string): Promise<ApiClientResponse> {
    return this.client.delete(`applications/${appId}/organizations/${organizationId}`);
  }

  public fetchApplicationInvitations(appId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`applications/${appId}/invitations`, params);
  }

  public fetchApplicationTokens(appId: string): Promise<ApiClientResponse> {
    return this.client.get(`applications/${appId}/tokens`, {});
  }

  public fetchApplicationUsers(appId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`applications/${appId}/users`, params);
  }

  public createApplicationUser(appId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`applications/${appId}/users`, params);
  }

  public updateApplicationUser(appId: string, userId: string, params: object): Promise<ApiClientResponse> {
    return this.client.put(`applications/${appId}/users/${userId}`, params);
  }

  public deleteApplicationUser(appId: string, userId: string): Promise<ApiClientResponse> {
    return this.client.delete(`applications/${appId}/users/${userId}`);
  }

  public createOrganization(params: object): Promise<ApiClientResponse> {
    return this.client.post('organizations', params);
  }

  public fetchOrganizations(params: object): Promise<ApiClientResponse> {
    return this.client.get('organizations', params);
  }

  public fetchOrganizationDetails(organizationId: string): Promise<ApiClientResponse> {
    return this.client.get(`organizations/${organizationId}`, {});
  }

  public updateOrganization(organizationId: string, params: object): Promise<ApiClientResponse> {
    return this.client.put(`organizations/${organizationId}`, params);
  }

  public fetchOrganizationInvitations(organizationId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`organizations/${organizationId}/invitations`, params);
  }

  public fetchOrganizationUsers(organizationId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`organizations/${organizationId}/users`, params);
  }

  public createOrganizationUser(organizationId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`organizations/${organizationId}/users`, params);
  }

  public updateOrganizationUser(organizationId: string, userId: string, params: object): Promise<ApiClientResponse> {
    return this.client.put(`organizations/${organizationId}/users/${userId}`, params);
  }

  public deleteOrganizationUser(organizationId: string, userId: string): Promise<ApiClientResponse> {
    return this.client.delete(`organizations/${organizationId}/users/${userId}`);
  }

  public fetchOrganizationVaults(organizationId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`organizations/${organizationId}/vaults`, params);
  }

  public fetchOrganizationVaultKeys(organizationId: string, vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`organizations/${organizationId}/vaults/${vaultId}/keys`, params);
  }

  public createOrganizationVaultKey(organizationId: string, vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`organizations/${organizationId}/vaults/${vaultId}/keys`, params);
  }

  public deleteOrganizationVaultKey(organizationId: string, vaultId: string, keyId: string): Promise<ApiClientResponse> {
    return this.client.delete(`organizations/${organizationId}/vaults/${vaultId}/keys/${keyId}`);
  }

  public organizationVaultKeySignMessage(organizationId: string, vaultId: string, keyId: string, msg: string): Promise<ApiClientResponse> {
    return this.client.post(`organizations/${organizationId}/vaults/${vaultId}/keys/${keyId}/sign`, { message: msg });
  }

  public organizationVaultKeyVerifySignature(
    organizationId: string,
    vaultId: string,
    keyId: string,
    msg: string,
    sig: string,
  ): Promise<ApiClientResponse> {
    return this.client.post(`organizations/${organizationId}/vaults/${vaultId}/keys/${keyId}/verify`, { message: msg, signature: sig });
  }

  public fetchOrganizationVaultSecrets(organizationId: string, vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.get(`organizations/${organizationId}/vaults/${vaultId}/secrets`, params);
  }

  public createOrganizationVaultSecret(organizationId: string, vaultId: string, params: object): Promise<ApiClientResponse> {
    return this.client.post(`organizations/${organizationId}/vaults/${vaultId}/secrets`, params);
  }

  public deleteOrganizationVaultSecret(organizationId: string, vaultId: string, secretId: string): Promise<ApiClientResponse> {
    return this.client.delete(`organizations/${organizationId}/vaults/${vaultId}/secrets/${secretId}`);
  }

  public fetchTokens(params: object): Promise<ApiClientResponse> {
    return this.client.get('tokens', params);
  }

  public fetchTokenDetails(tokenId: string): Promise<ApiClientResponse> {
    return this.client.get(`tokens/${tokenId}`, {});
  }

  public deleteToken(tokenId: string): Promise<ApiClientResponse> {
    return this.client.delete(`tokens/${tokenId}`);
  }

  public createInvitation(params: object): Promise<ApiClientResponse> {
    return this.client.post('invitations', params);
  }

  public createUser(params: object): Promise<ApiClientResponse> {
    return this.client.post('users', params);
  }

  public fetchUsers(): Promise<ApiClientResponse> {
    return this.client.get('users', {});
  }

  public fetchUserDetails(userId: string): Promise<ApiClientResponse> {
    return this.client.get(`users/${userId}`, {});
  }

  public updateUser(userId: string, params: object): Promise<ApiClientResponse> {
    return this.client.put(`users/${userId}`, params);
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

export const identClientFactory = (token: string, scheme?: string, host?: string, path?: string): Ident => {
  return Ident.clientFactory(token, scheme, host, path) as Ident;
};
