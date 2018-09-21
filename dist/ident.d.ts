export declare class Ident {
    private static readonly DEFAULT_HOST;
    private readonly client;
    constructor(token: string, scheme?: string, host?: string, path?: string);
    createApplication(params: object): Promise<any>;
    updateApplication(app_id: string, params: object): Promise<any>;
    fetchApplications(params: object): Promise<any>;
    fetchApplicationDetails(app_id: string): Promise<any>;
    fetchApplicationTokens(app_id: string): Promise<any>;
    authenticate(params: object): Promise<any>;
    fetchTokens(params: object): Promise<any>;
    fetchTokenDetails(token_id: string): Promise<any>;
    deleteToken(token_id: string): Promise<any>;
    createUser(params: object): Promise<any>;
    fetchUsers(): Promise<any>;
    fetchUserDetails(user_id: string): Promise<any>;
    updateUser(user_id: string, params: object): Promise<any>;
}
