import IpfsHttpClient from 'ipfs-http-client';
import { lookup as mimelookup } from 'mime-types';

import { ApiClient } from './api-client';
import { ApiClientResponse } from './api-client-response';


export class IpfsClient {

  public static readonly DEFAULT_SCHEME = 'http';
  public static readonly DEFAULT_HOST = 'ipfs.provide.services';
  public static readonly DEFAULT_PORT = 5001;
  public static readonly DEFAULT_PATH = '/api/v0/';
  public static readonly DEFAULT_GATEWAY_PORT = 8080;
  public static readonly DEFAULT_GATEWAY_PATH = '/ipfs/';

  private apiClient: ApiClient;
  private ipfs: IpfsHttpClient;

  /**
   * Initialize a wrapped IPFS client.
   *
   * Parameters form a full URI of [scheme]://[host]:[port][path]
   *
   * @param scheme Either 'http' or 'https'
   * @param host The domain name or ip address of the host of the IPFS
   * @param port Port number to use
   * @param path The path under the domain, e.g. '/api/v0/'
   */
  constructor(
    scheme = IpfsClient.DEFAULT_SCHEME,
    host = IpfsClient.DEFAULT_HOST,
    port = IpfsClient.DEFAULT_PORT,
    path = IpfsClient.DEFAULT_PATH,
  ) {
    this.apiClient = new ApiClient(undefined, scheme, host, path);

    let sanitizedHost = host;
    const portSuffix = `:${port}`;
    if (host.lastIndexOf(portSuffix) === host.length - portSuffix.length) {
      sanitizedHost = host.substr(0, host.length - portSuffix.length);
    }

    this.ipfs = new IpfsHttpClient({
      protocol: scheme,
      host: sanitizedHost,
      port: port,
      'api-path': path,
    });
  }

  /**
   * Add a file to IPFS.
   *
   * @param path The file path or name. (e.g. "myfile.txt" or "mydir/myfile.txt")
   * @param content A Buffer, Readable Stream, or Pull Stream with the contents of the file
   * @param options An optional IPFS options object. See IPFS documentation.
   *
   * @return A Promise with the hash if resolved or an Error if rejected
   */
  public add(path: string, content: any, options: any = null): Promise<any[] | Error> {
    const files = [{
      path: path,
      content: content,
    }];

    return new Promise(async (resolve, reject) => {
      const retvals: any[] = [];
      const gen = this.ipfs.add(files, options);
      let result = await gen.next();
      if (!result) {
        reject(`failed to add ${content.byteLength}-byte object to IPFS`);
        return;
      }
      if (result && typeof result.value !== 'undefined') {
        retvals.push(result.value);
      }
      while (!result.done) {
        result = await gen.next();
        if (result && typeof result.value !== 'undefined') {
          retvals.push(result.value);
        }
      }
      resolve(retvals);
    });
  }

  /**
   * Retrieve a file from IPFS for the given hash.
   *
   * @param hash A hash associated with a file on the IPFS
   *
   * @return A Promise with the file buffer if resolved, or an Error if rejected
   */
  public cat(hash: string): Promise<any | Error> {
    return new Promise(async (resolve, reject) => {
      let retval;
      const gen = this.ipfs.cat(hash);
      let result = await gen.next();
      if (!result) {
        reject(`failed to cat IPFS object: ${hash}`);
        return;
      }
      retval = result.value;
      while (!result.done) {
        result = await gen.next();
      }

      resolve(retval);
    });
  }

  /**
   * List the directory contents for Unix filesystem objects.
   *
   * @param hashes An array of hashes for which the associated IPFS links will be returned
   *
   * @return A Promise with the linked objects if resolved, or an Error if rejected
   */
  public ls(hashes: string[]): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      this.apiClient.get('ls', {arg: hashes}).then((response: ApiClientResponse) => {
        const links: any[] = [];
        JSON.parse(response.responseBody)['Objects'].forEach((ipfsObject: object[]) => {
          ipfsObject['Links'].forEach((lnk: object) => {
            links.push({
              hash: lnk['Hash'],
              mime: lnk['Name'] === '' ? null : mimelookup(lnk['Name']),
              name: lnk['Name'],
              size: lnk['Size'],
              target: lnk['Target'] === '' ? null : lnk['Target'],
              type: lnk['Type'],
            });
          });
        });
        resolve(links);
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }
}
