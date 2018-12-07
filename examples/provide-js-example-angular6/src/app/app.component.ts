import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import fileReaderPullStream from 'pull-file-reader';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  public content: string;
  public error: Error;
  public hash: string;
  public uploadedHash: string;
  public uploadPath: string;
  public uploadProgress: string;

  private ipfs: IpfsClient;

  public ngOnInit(): void {
    this.ipfs = new IpfsClient();
    this.uploadPath = `${IpfsClient.DEFAULT_SCHEME}://${IpfsClient.DEFAULT_HOST}:${IpfsClient.DEFAULT_PORT}${IpfsClient.DEFAULT_PATH}`;
  }

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

  public onSubmit (event) {
    event.preventDefault();
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
