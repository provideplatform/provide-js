import { Component } from '@angular/core';
import { Buffer } from 'buffer';
import { ApiClientResponse, Goldmine, IpfsClient } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import fileReaderPullStream from 'pull-file-reader';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent {

  public content: string;
  public error: Error;
  public hash: string;
  public uploadedHash: string;
  public uploadPath: string;
  public uploadProgress: string;

  private goldmine: Goldmine;
  private ipfs: IpfsClient;

  public onAdd(path: string, content: string): void {
    this.error = null;
    const observable = from(this.ipfs.add(path, Buffer.from(content)));
    observable.pipe(first()).subscribe(
      (hash: string) => this.hash = hash,
      (error: Error) => this.error = error,
    )
  }

  public onCaptureFile (event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    this.saveToIpfsWithFilename(file);
  }


  public onCat(hash: string): void {
    this.error = null;
    const observable = from(this.ipfs.cat(hash));
    observable.pipe(first()).subscribe(
      (fileBuffer: Buffer) => this.content = fileBuffer.toString(),
      (error: Error) => this.error = error,
    )
  }

  public onConnect(apiToken: string, networkId: string, dappId: string = null): void {
    this.goldmine = new Goldmine(apiToken);

    const params = {
      application_id: dappId,
      network_id: networkId,
      type: 'ipfs',
    };
    if (!dappId) delete params.application_id;

    const observable = from(this.goldmine.fetchConnectors(params));
    observable.subscribe(
      (response: ApiClientResponse) => {
        const connectorList = JSON.parse(response.responseBody);
        console.log(connectorList);
        if (connectorList.length > 0) {
          const uri = AppComponent.parseUri(connectorList[0].config.rpc_url);
          this.ipfs = new IpfsClient(uri.protocol, uri.host, parseInt(uri.port), uri.path);
          this.uploadPath = `${uri.protocol}://${uri.host}:${uri.port}${uri.path}`;
        } else {
          this.ipfs = new IpfsClient();
          this.uploadPath = `${IpfsClient.DEFAULT_SCHEME}://${IpfsClient.DEFAULT_HOST}:${IpfsClient.DEFAULT_PORT}${IpfsClient.DEFAULT_PATH}`;
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
    const path = file.name;

    const options = {
      progress: (progress) => this.uploadProgress = `received: ${progress}`,
      wrapWithDirectory: true,
    };

    const observable = from(this.ipfs.add(path, content, options));
    observable.pipe(first()).subscribe(
      (hash: string) => this.uploadedHash = hash,
      (error: Error) => this.error = error,
    );

  }

}
