import { Model, unmarshal } from '@provide/types';

export class ApiClientResponse {

  public readonly requestBody: string;
  public readonly requestHeaders?: string;
  public readonly responseBody: string;
  public readonly responseHeaders: string;
  public readonly query: string;
  public readonly xhr: XMLHttpRequest;

  constructor(
    query: string,
    requestBody: string,
    requestHeaders: any,
    responseBody: string,
    responseHeaders: string,
    xhr: XMLHttpRequest,
  ) {
    this.query = query;
    this.requestBody = requestBody;
    this.responseBody = responseBody;
    this.responseHeaders = responseHeaders;
    this.xhr = xhr;

    let requestHeadersString = '';
    Object.keys(requestHeaders).forEach((header) => {
      requestHeadersString += `${header}: ${requestHeaders[header]}\n`;
    });

    if (requestHeadersString !== '') {
      this.requestHeaders = requestHeadersString;
    }
  }

  public unmarshalResponse<T extends Model | Model[]>(clazz: new () => T): Model | Model[] | null {
    let response: any;
    const contentLength = this.xhr.getResponseHeader('content-length');
    if (clazz !== null && contentLength !== null && parseInt(contentLength, 10) >= 2) {
      const retval = unmarshal(this.responseBody, clazz);
      if (retval != null) {
        response = retval;
      }
    }

    return response;
  }
}
