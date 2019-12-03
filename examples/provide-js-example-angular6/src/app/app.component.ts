import { Component } from '@angular/core';
import { Buffer } from 'buffer';
import { ApiClientResponse, Goldmine, IpfsClient } from 'provide-js';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import fileReaderPullStream from 'pull-file-reader';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent {

  public apiPath = '';
  public content: string;
  public error: Error;
  public gatewayPath = '';
  public hash: string;
  public uploadedHash = '';
  public uploadProgress: string;

  private goldmine: Goldmine;
  private ipfs: IpfsClient;

  public onAdd(path: string, content: string): void {
    this.error = null;
    const observable: Observable<string | Error> = from(this.ipfs.add(path, Buffer.from(content)));
    observable.pipe(first()).subscribe(
      (hash: string) => this.hash = hash,
      (error: Error) => this.error = error,
    )
  }

  public onCaptureFile (event) {
    event.stopPropagation();
    event.preventDefault();
    const file: File = event.target.files[0];
    this.saveToIpfsWithFilename(file);
  }


  public onCat(hash: string): void {
    this.error = null;
    const observable: Observable<Buffer | Error> = from(this.ipfs.cat(hash));
    observable.pipe(first()).subscribe(
      (fileBuffer: Buffer) => this.content = fileBuffer.toString(),
      (error: Error) => this.error = error,
    )
  }

  public onConnect(token: string, networkId: string, dappId: string = null): void {
    this.goldmine = new Goldmine(token);

    const params = {
      application_id: dappId,
      network_id: networkId,
      type: 'ipfs',
    };
    if (!dappId) delete params.application_id;

    const observable: Observable<ApiClientResponse> = from(this.goldmine.fetchConnectors(params));
    observable.subscribe(
      (response: ApiClientResponse) => {
        const connectorList = JSON.parse(response.responseBody);
        console.log(connectorList);
        if (connectorList.length > 0) {
          const apiUri = AppComponent.parseUri(connectorList[0].config.rpc_url);
          const gatewayUri = AppComponent.parseUri(connectorList[0].config.gateway_url);
          this.ipfs = new IpfsClient(apiUri.protocol, apiUri.host, parseInt(apiUri.port), apiUri.path);
          this.apiPath = `${apiUri.protocol}://${apiUri.host}:${apiUri.port}${apiUri.path}`;
          this.gatewayPath = `${gatewayUri.protocol}://${gatewayUri.host}:${gatewayUri.port}${gatewayUri.path}`;
        } else {
          this.ipfs = new IpfsClient();
          this.apiPath = `${IpfsClient.DEFAULT_SCHEME}://${IpfsClient.DEFAULT_HOST}:${IpfsClient.DEFAULT_PORT}${IpfsClient.DEFAULT_PATH}`;
          this.gatewayPath = `${IpfsClient.DEFAULT_SCHEME}://${IpfsClient.DEFAULT_HOST}:${IpfsClient.DEFAULT_GATEWAY_PORT}${IpfsClient.DEFAULT_GATEWAY_PATH}`;
        }
      },
      (error: Error) => this.error = error,
    );
  }

  public onSubmit (event) {
    event.preventDefault();
  }

  private static parseUri(uri) {
    const a =  document.createElement('a');
    a.href = uri;
    return {
      protocol: a.protocol.replace(':',''),
      host: a.hostname,
      port: a.port || '',
      path: a.pathname || '',
    };
  }

  private saveToIpfsWithFilename (file) {
    // create a stream from a file, which enables uploads of big files without allocating memory twice
    const content = fileReaderPullStream(file);
    const path: string = file.name;

    const options = {
      progress: (progress: number) => this.uploadProgress = `received: ${progress}`,
      wrapWithDirectory: true,
    };

    const observable: Observable<string | Error> = from(this.ipfs.add(path, content, options));
    observable.pipe(first()).subscribe(
      (hash: string) => this.uploadedHash = hash,
      (error: Error) => this.error = error,
    );

  }

}
