/*
 * Copyright 2017-2022 Provide Technologies Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as natsutil from 'ts-natsutil';

export class NatsClientFacade {

  public static readonly DEFAULT_SCHEME = 'wss';
  public static readonly DEFAULT_HOST = 'websocket.provide.services';
  public static readonly DEFAULT_PATH = '';

  private readonly bearerToken?: string;
  private readonly natsUrl: string;

  private service?: natsutil.INatsService;

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
    scheme = NatsClientFacade.DEFAULT_SCHEME,
    host = NatsClientFacade.DEFAULT_HOST,
    path?: string,
  ) {
    this.bearerToken = bearerToken;
    this.natsUrl = `${scheme}://${host}/${path ? `${path}/` : ''}`;
  }

  public connect(): Promise<any> {
    const service = natsutil.natsServiceFactory({
      bearerToken: this.bearerToken,
      servers: [this.natsUrl],
    });
    return service.connect().then(() => {
      console.log(`NATS connection established to endpoint: ${this.natsUrl}`);
      this.service = service;
    });
  }

  public close() {
    this.service?.disconnect();
  }

  public publish({subject, payload, reply}): Promise<any> {
    if (!this.service) {
      return Promise.reject(`no NATS service available to publish message on subject: ${subject}`);
    }
    return this.service?.publish(subject, payload, reply);
  }

  public subscribe({ subject, onMessage }): Promise<any> {
    if (!this.service) {
      return Promise.reject(`no NATS service available to subscribe to subject: ${subject}`);
    }
    return this.service.subscribe(subject, onMessage);
  }

  public unsubscribe(subject: string): void {
    if (!this.service) {
      return;
    }
    this.service.unsubscribe(subject);
  }

  public request({subject, timeout, payload}): Promise<any> {
    if (!this.service) {
      return Promise.reject(`no NATS service available to send request on subject: ${subject}`);
    }
    return this.service.request(subject, timeout, payload);
  }
}
