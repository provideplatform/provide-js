import { ApiClient } from '../clients';
import { Application, Invite, Key as VaultKey, Organization, Secret as VaultSecret, Token, User, Vault } from '@provide/types';

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

  public static clientFactory(token: string, scheme?: string, host?: string, path?: string): Ident {
    const _scheme = scheme ? scheme : (process.env['IDENT_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['IDENT_API_HOST'] || Ident.DEFAULT_HOST);
    const _path = path ? path : (process.env['IDENT_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new Ident(token, _scheme, _host, _path);
  }

  private static unauthenticatedClientFactory(token?: string | undefined, scheme?: string, host?: string, path?: string): ApiClient {
    const _scheme = scheme ? scheme : (process.env['IDENT_API_SCHEME'] || 'https');
    const _host = host ? host : (process.env['IDENT_API_HOST'] || Ident.DEFAULT_HOST);
    const _path = path ? path : (process.env['IDENT_API_PATH'] || ApiClient.DEFAULT_PATH);
    return new ApiClient(token, _scheme, _host, _path);
  }

  public static async authenticate(params: object, scheme?: string, host?: string, path?: string): Promise<any> {
    return ApiClient.handleResponse(await Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post('authenticate', params));
  }

  public static async createUser(params: object, scheme?: string, host?: string, path?: string): Promise<User> {
    return ApiClient.handleResponse(await Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post('users', params)) as User;
  }

  public static async requestPasswordReset(email: string, scheme?: string, host?: string, path?: string): Promise<any> {
    return ApiClient.handleResponse(await Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post('reset_password', { email }));
  }

  public static async resetPassword(token: string, password: string, scheme?: string, host?: string, path?: string): Promise<any> {
    return ApiClient.handleResponse(await Ident.unauthenticatedClientFactory(undefined, scheme, host, path).post(`reset_password/${token}`, { password }));
  }

  public async createApplication(params: object): Promise<Application> {
    return ApiClient.handleResponse(await this.client.post('applications', params)) as Application;
  }

  public async updateApplication(appId: string, params: object): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`applications/${appId}`, params));
  }

  public async fetchApplications(params: object): Promise<Application[]> {
    return ApiClient.handleResponse(await this.client.get('applications', params)) as Application[];
  }

  public async fetchApplicationDetails(appId: string): Promise<Application> {
    return ApiClient.handleResponse(await this.client.get(`applications/${appId}`, {})) as Application;
  }

  public async fetchApplicationOrganizations(appId: string, params: object): Promise<Organization[]> {
    return ApiClient.handleResponse(await this.client.get(`applications/${appId}/organizations`, params)) as Organization[];
  }

  public async createApplicationOrganization(appId: string, params: object): Promise<Organization> {
    return ApiClient.handleResponse(await this.client.post(`applications/${appId}/organizations`, params)) as Organization;
  }

  public async updateApplicationOrganization(appId: string, organizationId: string, params: object): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`applications/${appId}/organizations/${organizationId}`, params));
  }

  public async deleteApplicationOrganization(appId: string, organizationId: string): Promise<Organization> {
    return ApiClient.handleResponse(await this.client.delete(`applications/${appId}/organizations/${organizationId}`));
  }

  public async fetchApplicationInvitations(appId: string, params: object): Promise<Invite> {
    return ApiClient.handleResponse(await this.client.get(`applications/${appId}/invitations`, params));
  }

  public async fetchApplicationTokens(appId: string): Promise<Token> {
    return ApiClient.handleResponse(await this.client.get(`applications/${appId}/tokens`, {})) as Token;
  }

  public async fetchApplicationUsers(appId: string, params: object): Promise<User[]> {
    return ApiClient.handleResponse(await this.client.get(`applications/${appId}/users`, params)) as User[];
  }

  public async createApplicationUser(appId: string, params: object): Promise<User> {
    return ApiClient.handleResponse(await this.client.post(`applications/${appId}/users`, params)) as User;
  }

  public async updateApplicationUser(appId: string, userId: string, params: object): Promise<User> {
    return ApiClient.handleResponse(await this.client.put(`applications/${appId}/users/${userId}`, params)) as User;
  }

  public async deleteApplicationUser(appId: string, userId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`applications/${appId}/users/${userId}`));
  }

  public async createOrganization(params: object): Promise<Organization> {
    return ApiClient.handleResponse(await this.client.post('organizations', params)) as Organization;
  }

  public async fetchOrganizations(params: object): Promise<Organization[]> {
    return ApiClient.handleResponse(await this.client.get('organizations', params)) as Organization[];
  }

  public async fetchOrganizationDetails(organizationId: string): Promise<Organization> {
    return ApiClient.handleResponse(await this.client.get(`organizations/${organizationId}`, {})) as Organization;
  }

  public async updateOrganization(organizationId: string, params: object): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`organizations/${organizationId}`, params));
  }

  public async fetchOrganizationInvitations(organizationId: string, params: object): Promise<Invite> {
    return ApiClient.handleResponse(await this.client.get(`organizations/${organizationId}/invitations`, params));
  }

  public async fetchOrganizationUsers(organizationId: string, params: object): Promise<User[]> {
    return ApiClient.handleResponse(await this.client.get(`organizations/${organizationId}/users`, params)) as User[];
  }

  public async createOrganizationUser(organizationId: string, params: object): Promise<User> {
    return ApiClient.handleResponse(await this.client.post(`organizations/${organizationId}/users`, params)) as User;
  }

  public async updateOrganizationUser(organizationId: string, userId: string, params: object): Promise<User> {
    return ApiClient.handleResponse(await this.client.put(`organizations/${organizationId}/users/${userId}`, params));
  }

  public async deleteOrganizationUser(organizationId: string, userId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`organizations/${organizationId}/users/${userId}`));
  }

  public async fetchOrganizationVaults(organizationId: string, params: object): Promise<Vault[]> {
    return ApiClient.handleResponse(await this.client.get(`organizations/${organizationId}/vaults`, params)) as Vault[];
  }

  public async fetchOrganizationVaultKeys(organizationId: string, vaultId: string, params: object): Promise<VaultKey[]> {
    return ApiClient.handleResponse(await this.client.get(`organizations/${organizationId}/vaults/${vaultId}/keys`, params)) as VaultKey[];
  }

  public async createOrganizationVaultKey(organizationId: string, vaultId: string, params: object): Promise<VaultKey> {
    return ApiClient.handleResponse(await this.client.post(`organizations/${organizationId}/vaults/${vaultId}/keys`, params)) as VaultKey;
  }

  public async deleteOrganizationVaultKey(organizationId: string, vaultId: string, keyId: string): Promise<VaultKey[]> {
    return ApiClient.handleResponse(await this.client.delete(`organizations/${organizationId}/vaults/${vaultId}/keys/${keyId}`));
  }

  public async organizationVaultKeySignMessage(organizationId: string, vaultId: string, keyId: string, msg: string): Promise<any> {
    return ApiClient.handleResponse(await this.client.post(`organizations/${organizationId}/vaults/${vaultId}/keys/${keyId}/sign`, { message: msg }));
  }

  public async organizationVaultKeyVerifySignature(
    organizationId: string,
    vaultId: string,
    keyId: string,
    msg: string,
    sig: string,
  ): Promise<any> {
    return ApiClient.handleResponse(await this.client.post(`organizations/${organizationId}/vaults/${vaultId}/keys/${keyId}/verify`, { message: msg, signature: sig }));
  }

  public async fetchOrganizationVaultSecrets(organizationId: string, vaultId: string, params: object): Promise<VaultSecret[]> {
    return ApiClient.handleResponse(await this.client.get(`organizations/${organizationId}/vaults/${vaultId}/secrets`, params)) as VaultSecret[];
  }

  public async createOrganizationVaultSecret(organizationId: string, vaultId: string, params: object): Promise<VaultSecret> {
    return ApiClient.handleResponse(await this.client.post(`organizations/${organizationId}/vaults/${vaultId}/secrets`, params)) as VaultSecret;
  }

  public async deleteOrganizationVaultSecret(organizationId: string, vaultId: string, secretId: string): Promise<VaultSecret> {
    return ApiClient.handleResponse(await this.client.delete(`organizations/${organizationId}/vaults/${vaultId}/secrets/${secretId}`)) as VaultSecret;
  }

  public async createToken(params: object): Promise<Token> {
    return ApiClient.handleResponse(await this.client.post('tokens', params)) as Token;
  }

  public async fetchTokens(params: object): Promise<Token[]> {
    return ApiClient.handleResponse(await this.client.get('tokens', params)) as Token[];
  }

  public async fetchTokenDetails(tokenId: string): Promise<Token> {
    return ApiClient.handleResponse(await this.client.get(`tokens/${tokenId}`, {})) as Token;
  }

  public async deleteToken(tokenId: string): Promise<void> {
    return ApiClient.handleResponse(await this.client.delete(`tokens/${tokenId}`));
  }

  public async createInvitation(params: object): Promise<Invite> {
    return ApiClient.handleResponse(await this.client.post('invitations', params));
  }

  public async createUser(params: object): Promise<User> {
    return ApiClient.handleResponse(await this.client.post('users', params)) as User;
  }

  public async fetchUsers(): Promise<User[]> {
    return ApiClient.handleResponse(await this.client.get('users', {})) as User[];
  }

  public async fetchUserDetails(userId: string): Promise<User> {
    return ApiClient.handleResponse(await this.client.get(`users/${userId}`, {})) as User;
  }

  public async updateUser(userId: string, params: object): Promise<void> {
    return ApiClient.handleResponse(await this.client.put(`users/${userId}`, params));
  }
}

export const identClientFactory = (token: string, scheme?: string, host?: string, path?: string): Ident => {
  return Ident.clientFactory(token, scheme, host, path);
};
