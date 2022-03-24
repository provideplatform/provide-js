import axios, { AxiosResponse, Method } from "axios";
import {
  ApiClientResponse,
  Model,
  PaginatedResponse,
  ApiClientOptions
} from "@provide/types";

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", "");
  });
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, $1 => {
    return `_${$1.toLowerCase()}`;
  });
}

function unmarshal(obj: object): object {
  const unmarshalledObj = {};
  for (const [key, value] of Object.entries(obj)) {
    unmarshalledObj[toCamelCase(key)] = value;
  }
  return unmarshalledObj;
}
export class ApiClient {
  public static readonly DEFAULT_SCHEME = "https";
  public static readonly DEFAULT_HOST = "provide.services";
  public static readonly DEFAULT_PATH = "api/v1";
  public static readonly DEFAULT_OPTIONS = {
    preventAutoCase: false
  };

  private readonly token?: string | undefined;
  private readonly baseUrl: string;

  public readonly options?: ApiClientOptions;
  /**
   * Initialize the API client.
   *
   * Parameters form a full URI of [scheme]://[host]:[port][path]
   *
   * @param token The bearer authorization token
   * @param scheme Either 'http' or 'https'
   * @param host The domain name or ip address and port of the service
   * @param path The base path, e.g. 'api/v1'
   * @param options The api client configuration options
   */
  constructor(
    token?: string,
    scheme = ApiClient.DEFAULT_SCHEME,
    host = ApiClient.DEFAULT_HOST,
    path = ApiClient.DEFAULT_PATH,
    options = ApiClient.DEFAULT_OPTIONS
  ) {
    this.token = token;

    this.baseUrl = `${scheme}://${host}`;
    if (path && path !== "/") {
      this.baseUrl = `${this.baseUrl}/${path}/`;
    } else {
      this.baseUrl = `${this.baseUrl}/`;
    }
    this.baseUrl = `${this.baseUrl.replace(/\/+$/, "")}/`;

    this.options = options;
  }

  static handleResponse(
    resp: AxiosResponse<any>,
    options?: ApiClientOptions
  ): ApiClientResponse<Model> {
    if (
      ["PATCH", "UPDATE", "DELETE"].includes(resp.request?.method) ||
      resp.headers["content-length"] === "0"
    ) {
      if (resp.status >= 400) {
        return Promise.reject(`failed with ${resp.status} status`);
      }
      return Promise.resolve();
    }

    try {
      if (resp.data instanceof Array) {
        let arr = resp.data;
        if (!options?.preventAutoCase) {
          arr = [];
          resp.data.forEach((item: any) => {
            arr.push(unmarshal(item));
          });
        }
        return {
          results: arr,
          totalResultsCount: +resp.headers["x-total-results-count"]
        } as PaginatedResponse<Model>;
      }

      return options?.preventAutoCase ? resp.data : unmarshal(resp.data);
    } catch (err) {
      return Promise.reject("failed to handle api client response");
    }
  }

  private static toQuery(params: object): string {
    const paramList: string[] = [];

    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        const param = params[p];
        if (param instanceof Array) {
          // tslint:disable-next-line: forin
          for (const i in param) {
            paramList.push(
              encodeURIComponent(p) + "=" + encodeURIComponent(param[i])
            );
          }
        } else {
          paramList.push(
            encodeURIComponent(p) + "=" + encodeURIComponent(params[p])
          );
        }
      }
    }

    if (paramList.length > 0) {
      return paramList.join("&");
    }

    return "";
  }

  async get(uri: string, params?: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest("GET", uri, params);
  }

  async patch(uri: string, params?: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest("PATCH", uri, params);
  }

  async post(uri: string, params?: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest("POST", uri, params);
  }

  async put(uri: string, params: object): Promise<AxiosResponse<any>> {
    return await this.sendRequest("PUT", uri, params);
  }

  async delete(uri: string): Promise<AxiosResponse<any>> {
    return await this.sendRequest("DELETE", uri);
  }

  private async sendRequest(
    method: string,
    uri: string,
    params: any = null // TODO-- use generic instead of any
  ): Promise<AxiosResponse<any>> {
    let query = "";
    let requestBody: any;

    if (params === null) {
      requestBody = undefined;
    } else if (method === "GET" && Object.keys(params).length > 0) {
      query = `?${ApiClient.toQuery(params)}`;
    } else {
      requestBody = JSON.stringify(params);
    }

    const requestHeaders = {};
    if (this.token) {
      requestHeaders["Authorization"] = `bearer ${this.token}`;
    }

    if (["POST", "PUT"].indexOf(method) !== -1) {
      requestHeaders["Content-Type"] = "application/json";
    }

    const cfg = {
      url: (this.baseUrl + uri).replace(/\/+$/, "") + query,
      method: method as Method,
      headers: requestHeaders,
      data: null
    };

    if (["POST", "PUT"].indexOf(method) !== -1) {
      cfg.data = requestBody;
    }

    try {
      return axios.request(cfg);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
