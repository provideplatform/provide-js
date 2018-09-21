import { RequestAPI } from "request";
export declare class ApiClient {
    private static readonly DEFAULT_SCHEME;
    private static readonly DEFAULT_HOST;
    private static readonly DEFAULT_PATH;
    baseUrl: string;
    headers: object;
    requestAPI: RequestAPI<any, any, any>;
    constructor(token: string, scheme?: string, host?: string, path?: string);
    get(uri: string, params: object): Promise<any>;
    post(uri: string, params: object): Promise<any>;
    put(uri: string, params: object): Promise<any>;
    delete(uri: string): Promise<any>;
}
