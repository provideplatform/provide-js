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

  private static clientFactory(token?: string | undefined): ApiClient {
    const scheme = process.env['IDENT_API_SCHEME'] || 'https';
    const host = process.env['IDENT_API_HOST'] || Ident.DEFAULT_HOST;
    const path = process.env['IDENT_API_PATH'] || ApiClient.DEFAULT_PATH;
    return new ApiClient(token, scheme, host, path);
  }

  public static authenticate(params: object): Promise<ApiClientResponse> {
    return Ident.clientFactory(undefined).post('authenticate', params);
  }

  public static createUser(params: object): Promise<ApiClientResponse> {
    return Ident.clientFactory(undefined).post('users', params);
  }

  public static requestPasswordReset(email: string): Promise<ApiClientResponse> {
    return Ident.clientFactory(undefined).post('reset_password', { email });
  }

  public static resetPassword(token: string, password: string): Promise<ApiClientResponse> {
    return Ident.clientFactory(undefined).post(`reset_password/${token}`, { password });
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

  public fetchApplicationTokens(appId: string): Promise<ApiClientResponse> {
    return this.client.get(`applications/${appId}/tokens`, {});
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
}
