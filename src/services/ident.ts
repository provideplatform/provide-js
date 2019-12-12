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
    return Ident.clientFactory(undefined).post('users', { email });
  }

  public static resetPassword(token: string, password: string): Promise<ApiClientResponse> {
    return Ident.clientFactory(undefined).post('users', { token, password });
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

  public fetchApplicationTokens(appId: string): Promise<ApiClientResponse> {
    return this.client.get(`applications/${appId}/tokens`, {});
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
