import IPFS from 'ipfs';

export class IpfsClient {

  public static readonly DEFAULT_SCHEME = 'http';
  public static readonly DEFAULT_HOST = 'ipfs.provide.services';
  public static readonly DEFAULT_PORT = 5001;
  public static readonly DEFAULT_PATH = '/api/v0/';

  private ipfs: IPFS;

  /**
   * Connect to the IPFS parameters form a full URI of [scheme]://[host]:[port][path]
   * @param scheme Either http or https
   * @param host The domain name or ip address of the host of the IPFS
   * @param port Port number to use
   * @param path The path under the domain
   *
   * @return A Promise with true if resolved or false if rejected
   */
  public connect(
    scheme = IpfsClient.DEFAULT_SCHEME,
    host = IpfsClient.DEFAULT_HOST,
    port = IpfsClient.DEFAULT_PORT,
    path = IpfsClient.DEFAULT_PATH,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.ipfs = new IPFS(host, port, path, scheme === 'https');
        this.ipfs.once('ready', () => resolve(true));
      }
      catch (e) {
        reject(false);
      }
    });
  }

  /**
   * Add a file to the IPFS (note that you must connect first)
   * @param path The file path or name. (e.g. "myfile.txt" or "mydir/myfile.txt")
   * @param content A Buffer, Readable Stream, or Pull Stream with the contents of the file
   *
   * @return A Promise with the hash if resolved or an Error if rejected
   */
  public add(path: string, content: any): Promise<string | Error> {
    const files =
      [{
        path: path, // The file path
        content: content, // A Buffer, Readable Stream or Pull Stream with the contents of the file
      }];

    return new Promise((resolve, reject) => {
      this.ipfs.add(
        files,
        (error: Error, resultFiles: any[]) => {
          if (error) reject(error);
          else resolve(resultFiles[0].hash);
        });
    });
  }

  /**
   * Retrieve a file from the IPFS (note that you must connect first)
   * @param hash A hash associated with a file on the IPFS
   *
   * @return A Promise with the file buffer if resolved, or an Error if rejected
   */
  public cat(hash: string): Promise<any | Error> {
    return this.ipfs.cat(hash);
  }

}
