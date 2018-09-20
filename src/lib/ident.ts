import { ApiClient } from './apiClient';

/*
 * Ident microservice; provides access to functionality
 * exposed by the Provide identity and resource authorization APIs.
 */
export class Ident {

  private static readonly DEFAULT_HOST = 'ident.provide.services';
  private static readonly DEFAULT_PATH = 'api/';

  private readonly client: ApiClient;

  constructor(token: string, host?: string, path?: string, scheme?: string) {
    if (!host) host = Ident.DEFAULT_HOST;
    if (!path) path = Ident.DEFAULT_PATH;
    this.client = new ApiClient(scheme, host, path, token);
  }

  public createApplication(params) {
    return this.client.post('applications', params);
  }

  public updateApplication(application_id, params) {
    return this.client.put(`applications/${application_id}`, params);
  }

  public fetchApplications(params) {
    return this.client.get('applications', params);
  }

  public fetchApplicationDetails(app_id) {
    return this.client.get(`applications/${app_id}`, { });
  }

  public fetchApplicationTokens(app_id) {
    return this.client.get(`applications/${app_id}/tokens`, { });
  }

  public authenticate(params) {
    return this.client.post('authenticate', params);
  }

  public fetchTokens(params) {
    return this.client.get('tokens', params);
  }

  public fetchTokenDetails(token_id) {
    return this.client.get(`tokens/${token_id}`, { });
  }

  public deleteToken(token_id) {
    return this.client.delete(`tokens/${token_id}`);
  }

  public createUser(params) {
    return this.client.post('users', params);
  }

  public fetchUsers() {
    return this.client.get('users', { });
  }

  public fetchUserDetails(user_id) {
    return this.client.get(`users/${user_id}`, { });
  }

  public updateUser(user_id, params) {
    return this.client.put(`users/${user_id}`, params);
  }
}
