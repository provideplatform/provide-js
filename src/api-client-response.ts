export class ApiClientResponse {

  public readonly requestBody: string;
  public readonly requestHeaders: string;
  public readonly responseBody: string;
  public readonly responseHeaders: string;
  public readonly xhr: XMLHttpRequest;

  constructor(
    requestBody: string,
    requestHeaders: Map<string, string>,
    responseBody: string,
    responseHeaders: string,
    xhr: XMLHttpRequest,
  ) {
    this.requestBody = requestBody;
    this.responseBody = responseBody;
    this.responseHeaders = responseHeaders;
    this.xhr = xhr;

    let requestHeadersString: string = '';

    requestHeaders.forEach((value, header) => {
      requestHeadersString += `${header}: ${value}\n`;
    });

    if (requestHeadersString !== '')
      this.requestHeaders = requestHeadersString;
  }

}
