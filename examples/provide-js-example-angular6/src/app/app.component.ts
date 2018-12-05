import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  public content: string;
  public error: Error;
  public hash: string;

  private ipfs: IpfsClient;

  public ngOnInit(): void {
    this.ipfs = new IpfsClient();
  }

  public onAdd(path: string, content: string): void {
    this.error = null;
    const observable = from(this.ipfs.add(path, Buffer.from(content)));
    observable.pipe(first()).subscribe(
      (hash: string) => this.hash = hash,
      (error: Error) => this.error = error,
    )
  }

  public onCat(hash: string): void {
    this.error = null;
    const observable = from(this.ipfs.cat(hash));
    observable.pipe(first()).subscribe(
      (fileBuffer: Buffer) => this.content = fileBuffer.toString(),
      (error: Error) => this.error = error,
    )
  }

}
