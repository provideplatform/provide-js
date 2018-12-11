# provide-js

a Javascript library to help you use Provide's Goldmine, Ident, and InterPlanetaryFileSystem APIs

## License

MIT © 2018 Provide Technologies Inc.

## Table of contents
1. [Install](#Install)
1. [WebPack](#WebPack)
1. [Goldmine](#Goldmine)
    1. [Goldmine with JavaScript and Promise](#GoldmineJavaScriptPromise)
    1. [Goldmine with JavaScript and RxJS](#GoldmineJavaScriptRxJS)
    1. [Goldmine with TypeScript and Promise](#GoldmineTypeScriptPromise)
    1. [Goldmine with TypeScript and RxJS](#GoldmineTypeScriptRxJS)
1. [Ident](#Ident)
    1. [Ident with JavaScript and Promise](#IdentJavaScriptPromise)
    1. [Ident with JavaScript and RxJS](#IdentJavaScriptRxJS)
    1. [Ident with TypeScript and Promise](#IdentTypeScriptPromise)
    1. [Ident with TypeScript and RxJS](#IdentTypeScriptRxJS)
1. [IpfsClient](#IpfsClient)
    1. [IpfsClient with JavaScript and Promise](#IpfsClientJavaScriptPromise)
    1. [IpfsClient with JavaScript and RxJS](#IpfsClientJavaScriptRxJS)
    1. [IpfsClient with TypeScript and Promise](#IpfsClientTypeScriptPromise)
    1. [IpfsClient with TypeScript and RxJS](#IpfsClientTypeScriptRxJS)

<a name="Install"></a>
## Install

```bash
> yarn add provide-js
```
or
```bash
> npm install provide-js --save
```

##### Recommended for uploading files to IPFS:

```bash
> yarn add pull-file-reader
```
or
```bash
> npm install pull-file-reader --save
```

<a name="WebPack"></a>
## WebPack

If using webpack, add node options to your webpack config.

```javascript
module.exports = {
  node: {
    buffer: true,
    crypto: true,
    os: true,
    path: true,
    stream: true,
  }
};
```

<a name="Goldmine"></a>
## Goldmine

Here are usage examples for 2 of the 50+ Goldmine methods. The others have similar usage.

<a name="GoldmineJavaScriptPromise"></a>
### Goldmine with JavaScript and Promise

##### Fetch connectors

```javascript
import { Goldmine } from 'provide-js';

const apiToken = 'myapitoken';
const dappId = 'mydappid';
const networkId = 'mynetworkid';
const goldmine = new Goldmine(apiToken);
const params = {
  application_id: dappId,
  network_id: networkId,
};

goldmine.fetchConnectors(params).then(
  (response) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const connectorList = JSON.parse(response.responseBody);
    console.log(connectorList);
  }
).catch(
  (response) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

##### Execute a contract

```javascript
import { Goldmine } from 'provide-js';

const apiToken = 'myapitoken';
const methodParams = ["1stparamvalue","2ndparamvalue"];
const executionParams = {
    method: 'methodname',
    params: methodParams,
    value: 0,
    wallet_id: 'mywalletid',
};
const contractId = 'mycontractid';
const goldmine = new Goldmine(apiToken);

goldmine.executeContract(contractId, executionParams).then(
  (response) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
  }
).catch(
  (response) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="GoldmineJavaScriptRxJS"></a>
### Goldmine with JavaScript and RxJS

##### Fetch connectors

```javascript
import { Goldmine } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const apiToken = 'myapitoken';
const dappId = 'mydappid';
const networkId = 'mynetworkid';
const goldmine = new Goldmine(apiToken);
const params = {
  application_id: dappId,
  network_id: networkId,
};
const observable = from(goldmine.fetchConnectors(params));

observable.pipe(first()).subscribe(
  (response) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const connectorList = JSON.parse(response.responseBody);
    console.log(connectorList);
  },
  (response) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

##### Execute a contract

```javascript
import { Goldmine } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const apiToken = 'myapitoken';
const methodParams = ["1stparamvalue","2ndparamvalue"];
const executionParams = {
    method: 'methodname',
    params: methodParams,
    value: 0,
    wallet_id: 'mywalletid',
};
const contractId = 'mycontractid';
const goldmine = new Goldmine(apiToken);
const observable = from(goldmine.executeContract(contractId, executionParams));

observable.pipe(first()).subscribe(
  (response) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
  },
  (response) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="GoldmineTypeScriptPromise"></a>
### Goldmine with TypeScript and Promise

##### Fetch connectors

```typescript
import { ApiClientResponse, Goldmine } from 'provide-js';

const apiToken: string = 'myapitoken';
const dappId: string = 'mydappid';
const networkId: string = 'mynetworkid';
const goldmine = new Goldmine(apiToken);
const params = {
  application_id: dappId,
  network_id: networkId,
};

goldmine.fetchConnectors(params).then(
  (response: ApiClientResponse) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const connectorList = JSON.parse(response.responseBody);
    console.log(connectorList);
  }
).catch(
  (response: ApiClientResponse) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

##### Execute a contract

```typescript
import { ApiClientResponse, Goldmine } from 'provide-js';

const apiToken: string = 'myapitoken';
const methodParams: (number|string)[] = ["1stparamvalue","2ndparamvalue"];
const executionParams: object = {
    method: 'methodname',
    params: methodParams,
    value: 0,
    wallet_id: 'mywalletid',
};
const contractId: string = 'mycontractid';
const goldmine: Goldmine = new Goldmine(apiToken);

goldmine.executeContract(contractId, executionParams).then(
  (response: ApiClientResponse) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
  }
).catch(
  (response: ApiClientResponse) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="GoldmineTypeScriptRxJS"></a>
### Goldmine with TypeScript and RxJS

##### Fetch connectors

```typescript
import { ApiClientResponse, Goldmine } from 'provide-js';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

const apiToken: string = 'myapitoken';
const dappId: string = 'mydappid';
const networkId: string = 'mynetworkid';
const goldmine = new Goldmine(apiToken);
const params = {
  application_id: dappId,
  network_id: networkId,
};
const observable: Observable<ApiClientResponse> = from(goldmine.fetchConnectors(params));

observable.pipe(first()).subscribe(
  (response: ApiClientResponse) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const connectorList = JSON.parse(response.responseBody);
    console.log(connectorList);
  },
  (response: ApiClientResponse) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

##### Execute a contract

```typescript
import { ApiClientResponse, Goldmine } from 'provide-js';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

const apiToken: string = 'myapitoken';
const methodParams: (number|string)[] = ["1stparamvalue","2ndparamvalue"];
const executionParams = {
    method: 'methodname',
    params: methodParams,
    value: 0,
    wallet_id: 'mywalletid',
};
const contractId: string = 'mycontractid';
const goldmine: Goldmine = new Goldmine(apiToken);
const observable: Observable<ApiClientResponse> = from<ApiClientResponse>(goldmine.executeContract(contractId, executionParams));

observable.pipe(first()).subscribe(
  (response: ApiClientResponse) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
  },
  (response: ApiClientResponse) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="Ident"></a>
## Ident

Here is a usage example for 1 of the 10+ Ident methods. The others have similar usage.

<a name="IdentJavaScriptPromise"></a>
### Ident with JavaScript and Promise

##### Fetch DApp details

```javascript
import { Ident } from 'provide-js';

const apiToken = 'myapitoken';
const dappId = 'mydappid';
const ident = new Ident(apiToken);

ident.fetchApplicationDetails(dappId).then(
  (response) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const dappDetails = JSON.parse(response.responseBody);
    console.log(dappDetails);
  }
).catch(
  (response) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="IdentJavaScriptRxJS"></a>
### Ident with JavaScript and RxJS

##### Fetch DApp details

```javascript
import { Ident } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const apiToken = 'myapitoken';
const dappId = 'mydappid';
const ident = new Ident(apiToken);
const observable = from(ident.fetchApplicationDetails(dappId));

observable.pipe(first()).subscribe(
  (response) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const dappDetails = JSON.parse(response.responseBody);
    console.log(dappDetails);
  },
  (response) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="IdentTypeScriptPromise"></a>
### Ident with TypeScript and Promise

##### Fetch DApp details

```typescript
import { ApiClientResponse, Ident } from 'provide-js';

const apiToken: string = 'myapitoken';
const dappId: string = 'mydappid';
const ident = new Ident(apiToken);

ident.fetchApplicationDetails(dappId).then(
  (response: ApiClientResponse) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const dappDetails = JSON.parse(response.responseBody);
    console.log(dappDetails);
  }
).catch(
  (response: ApiClientResponse) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="IdentTypeScriptRxJS"></a>
### Ident with TypeScript and RxJS

##### Fetch DApp details

```typescript
import { ApiClientResponse, Ident } from 'provide-js';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

const apiToken: string = 'myapitoken';
const dappId: string = 'mydappid';
const ident = new Ident(apiToken);
const observable: Observable<ApiClientResponse> = from(ident.fetchApplicationDetails(dappId));

observable.pipe(first()).subscribe(
  (response: ApiClientResponse) => {
    console.log(response.requestBody);
    console.log(response.requestHeaders);
    console.log(response.responseBody);
    console.log(response.responseHeaders);
    console.log(response.xhr);
    const dappDetails = JSON.parse(response.responseBody);
    console.log(dappDetails);
  },
  (response: ApiClientResponse) => {
    console.log('Error!');
    console.log(response.xhr);
  }
);
```

<a name="IpfsClient"></a>
## IpfsClient

Before you use the IpfsClient, you must have an IPFS node. If you don't have your own then you can use Provide's by not passing any constructor arguments.

You will need to have CORS set up. If you don't know much about CORS and just want to get playing quickly, run these 2 ipfs commands to allow all websites access to your IPFS node.

```bash
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

<a name="IpfsClientJavaScriptPromise"></a>
### IpfsClient with JavaScript and Promise

##### Create a text file

```javascript
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';

const ipfs = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const path = 'path/to/file.txt';
const content = 'Once upon a time, I wrote a brief novel. The end.';

ipfs.add(path, Buffer.from(content)).then(
  (hash) => console.log(hash)
).catch(
  (error) => console.log(error)
);
```

##### Fetch a text file

```javascript
import { IpfsClient } from 'provide-js';

const ipfs = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const hash = 'hashIgotFromCreatingAfile';

ipfs.cat(hash).then(
  (fileBuffer) => console.log(fileBuffer.toString())
).catch(
  (error) => console.log(error)
);
```

##### Upload any kind of file

```javascript
import { IpfsClient } from 'provide-js';
import fileReaderPullStream from 'pull-file-reader';

const ipfs = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
// This event would come from an <input type='file'/> change event.
const file = event.target.files[0];
// Create a stream from the file, so big files may upload without allocating memory twice
const content = fileReaderPullStream(file);
const path = file.name;
let uploadProgress = '';
const options = {
  progress: (progress) => uploadProgress = `received: ${progress}`,
  wrapWithDirectory: true,
};

ipfs.add(path, content, options).then(
  (hash) => console.log(hash)
).catch(
  (error) => console.log(error)
);
// You may then download the file using your ipfs gateway url and hash,
// e.g. http://localhost:8080/ipfs/hashIgotFromCreatingAfile
```

<a name="IpfsClientJavaScriptRxJS"></a>
### IpfsClient with JavaScript and RxJS

##### Create a text file

```javascript
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const ipfs = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const path = 'path/to/file.txt';
const content = 'Once upon a time, I wrote a brief novel. The end.';
const observable = from(ipfs.add(path, Buffer.from(content)));

observable.pipe(first()).subscribe(
  (hash) => console.log(hash),
  (error) => console.log(error),
);
```

##### Fetch a text file

```javascript
import { IpfsClient } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const ipfs = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const hash = 'hashIgotFromCreatingAfile';
const observable = from(ipfs.cat(hash));

observable.pipe(first()).subscribe(
  (fileBuffer) => console.log(fileBuffer.toString()),
  (error) => console.log(error),
);
```

##### Upload any kind of file

```javascript
import { IpfsClient } from 'provide-js';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import fileReaderPullStream from 'pull-file-reader';

const ipfs = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
// This event would come from an <input type='file'/> change event.
const file = event.target.files[0];
// Create a stream from the file, so big files may upload without allocating memory twice
const content = fileReaderPullStream(file);
const path = file.name;
let uploadProgress = '';
const options = {
  progress: (progress) => uploadProgress = `received: ${progress}`,
  wrapWithDirectory: true,
};
const observable = from(ipfs.add(path, content, options));

observable.pipe(first()).subscribe(
  (hash) => console.log(hash),
  (error) => console.log(error),
);
// You may then download the file using your ipfs gateway url and hash,
// e.g. http://localhost:8080/ipfs/hashIgotFromCreatingAfile
```

<a name="IpfsClientTypeScriptPromise"></a>
### IpfsClient with TypeScript and Promise

##### Create a text file

```typescript
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';

const ipfs: IpfsClient = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const path: string = 'path/to/file.txt';
const content: string = 'Once upon a time, I wrote a brief novel. The end.';

ipfs.add(path, Buffer.from(content)).then(
  (hash: string) => console.log(hash)
).catch(
  (error: Error) => console.log(error)
);
```

##### Fetch a text file

```typescript
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';

const ipfs: IpfsClient = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const hash: string = 'hashIgotFromCreatingAfile';

ipfs.cat(hash).then(
  (fileBuffer: Buffer) => console.log(fileBuffer.toString())
).catch(
  (error: Error) => console.log(error)
);
```

##### Upload any kind of file

```typescript
import { IpfsClient } from 'provide-js';
import fileReaderPullStream from 'pull-file-reader';

const ipfs = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
// This event would come from an <input type='file'/> change event.
const file: File = event.target.files[0];
// Create a stream from the file, so big files may upload without allocating memory twice
const content: any = fileReaderPullStream(file);
const path: string = file.name;
let uploadProgress: string = '';
const options = {
  progress: (progress: number) => uploadProgress = `received: ${progress}`,
  wrapWithDirectory: true,
};

ipfs.add(path, content, options).then(
  (hash: string) => console.log(hash)
).catch(
  (error: Error) => console.log(error)
);
// You may then download the file using your ipfs gateway url and hash,
// e.g. http://localhost:8080/ipfs/hashIgotFromCreatingAfile
```

<a name="IpfsClientTypeScriptRxJS"></a>
### IpfsClient with TypeScript and RxJS

##### Create a text file

```typescript
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

const ipfs: IpfsClient = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const path: string = 'path/to/file.txt';
const content: string = 'Once upon a time, I wrote a brief novel. The end.';
const observable: Observable<string | Error> = from(ipfs.add(path, Buffer.from(content)));

observable.pipe(first()).subscribe(
  (hash: string) => console.log(hash),
  (error: Error) => console.log(error),
);
```

##### Fetch a text file

```typescript
import { Buffer } from 'buffer';
import { IpfsClient } from 'provide-js';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

const ipfs: IpfsClient = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
const hash: string = 'hashIgotFromCreatingAfile';
const observable: Observable<Buffer | Error> = from(ipfs.cat(hash));

observable.pipe(first()).subscribe(
  (fileBuffer: Buffer) => console.log(fileBuffer.toString()),
  (error: Error) => console.log(error),
);
```

##### Upload any kind of file

```typescript
import { IpfsClient } from 'provide-js';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import fileReaderPullStream from 'pull-file-reader';

const ipfs: IpfsClient = new IpfsClient('http', 'localhost', 5001, '/api/v0/');
// This event would come from an <input type='file'/> change event.
const file: File = event.target.files[0];
// Create a stream from the file, so big files may upload without allocating memory twice
const content: any = fileReaderPullStream(file);
const path: string = file.name;
let uploadProgress: string = '';
const options = {
  progress: (progress: number) => uploadProgress = `received: ${progress}`,
  wrapWithDirectory: true,
};
const observable: Observable<string | Error> = from(ipfs.add(path, content, options));

observable.pipe(first()).subscribe(
  (hash: string) => console.log(hash),
  (error: Error) => console.log(error),
);
// You may then download the file using your ipfs gateway url and hash,
// e.g. http://localhost:8080/ipfs/hashIgotFromCreatingAfile
```
