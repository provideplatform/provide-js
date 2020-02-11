import * as natsutil from 'ts-natsutil';
import * as natsws from '@provide/nats.ws';

export class NatsClient {

  public static readonly DEFAULT_SCHEME = 'wss';
  public static readonly DEFAULT_HOST = 'websocket.provide.services';
  public static readonly DEFAULT_PATH = '';

  private readonly bearerToken?: string;
  private readonly baseUrl: string;

  private connection?: natsws.NatsConnection;
  private subscriptions: any = {};

  /**
   * Initialize a convenience wrapper to manage NATS websocket connections.
   *
   * Parameters form a full URI of [scheme]://[host]:[port][path]
   *
   * @param bearerToken  The NATS bearer authorization JWT
   * @param scheme Either 'ws' or 'wss'
   * @param host The domain name or ip address and port of the service
   * @param path The base path
   */
  constructor(
    bearerToken?: string,
    scheme = NatsClient.DEFAULT_SCHEME,
    host = NatsClient.DEFAULT_HOST,
    path?: string,
  ) {
    this.bearerToken = bearerToken;
    this.baseUrl = `${scheme}://${host}/${path ? `${path}/` : ''}`;
  }

  public close() {
    if (this.subscriptions) {
      Object.keys(this.subscribe).forEach((subject) => {
        this.subscriptions[subject].unsubscribe();
      });

      this.subscriptions = [];
    }

    if (this.connection) {
      this.connection.drain();
      this.connection.close();
      this.connection = null;
    }
  }

  public connect({ url, jwt }): Promise<natsws.NatsConnection> {
    return new Promise((resolve, reject) => {
      const natsUrl = url ? url : this.baseUrl;
      const bearerToken = jwt ? jwt : this.bearerToken;
      if (!bearerToken) {
        reject('failed to resolve bearer api token for NATS connection');
        return;
      }

      const nats = new natsutil.NatsWebsocketUtil([natsUrl], bearerToken);
      nats.getNatsWebsocketConnection().then((nc) => {
        this.connection = nc;

        nc.addEventListener('close', () => {
          console.log(`NATS connection closed: ${nc}`);
          this.close();
        });

        nc.addEventListener('error', (err) => {
          if (nc.isClosed()) {
            console.log(`NATS connection closed: ${nc}; ${err}`);
            this.close();
          }
        });

        resolve(nc);
      }).catch((response) => {
        reject(`failed to establish NATS connection; ${response}`);
      });
    });
  }

  public publish({subject, payload, reply}): Promise<any> {
    return new Promise(() => {
      if (!this.connection) {
        return Promise.reject(`no NATS connection available to publish ${payload.length}-byte payload on subject: ${subject}`);
      }

      return this.connection.publish(subject, payload, reply || '').flush();
    });
  }

  public subscribe({ subject, onMessage, opts }): Promise<any> {
    return new Promise(() => {
      if (!this.connection) {
        return Promise.reject(`no NATS connection available to subscribe to subject: ${subject}`);
      }

      const promise = this.connection.subscribe(subject, onMessage, opts || {});
      promise.then((sub) => {
        sub.subject = subject;
        this.subscriptions[subject] = sub;
        console.log(`created NATS subscription on subject: ${subject}`);
      }).catch((err) => {
        console.log(`failed to create NATS subscription; ${err}`);
      });

      return promise;
    });
  }

  public unsubscribe(subject): void {
    const sub = this.subscriptions[subject];
    if (!sub) {
      console.log(`no current NATS subscription to unsubscribe to subject: ${subject}`);
      return;
    }

    sub.unsubscribe();
    delete this.subscriptions[subject];
  }

  public request({subject, timeout, payload}): Promise<any> {
    return new Promise(() => {
      if (!this.connection) {
        return Promise.reject(`no NATS connection available to send request: ${subject}`);
      }

      if (!timeout) {
        timeout = 1000;
      }

      return this.connection.request(subject, timeout, payload).flush();
    });
  }
}
