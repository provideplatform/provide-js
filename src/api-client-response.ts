export class ApiClientResponse {

  public readonly requestBody: string;
  public readonly requestHeaders: string;
  public readonly responseBody: string;
  public readonly responseHeaders: string;
  public readonly query: string;
  public readonly xhr: XMLHttpRequest;

  constructor(
    query: string,
    requestBody: string,
    requestHeaders: Map<string, string>,
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

    requestHeaders.forEach((value, header) => {
      requestHeadersString += `${header}: ${value}\n`;
    });

    if (requestHeadersString !== '') {
      this.requestHeaders = requestHeadersString;
    }
  }
}
