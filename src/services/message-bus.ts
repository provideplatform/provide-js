import * as jwt from 'jsonwebtoken';
import * as url from 'url';

import { ApiClientResponse, IpfsClient } from '../clients';
import { Goldmine, Ident } from '.';
import { Account, Application, Connector, Contract, Message, Transaction, MessageData } from '@provide/types';


/*
 * Message bus client.
 */
export class MessageBus {

  public static readonly CONNECTOR_TYPE_IPFS = 'ipfs';
  public static readonly CONTRACT_TYPE_REGISTRY = 'registry';
  public static readonly CONTRACT_REGISTRY_DEFAULT_LIST_METHOD = 'listMessages';
  public static readonly CONTRACT_REGISTRY_DEFAULT_LIST_RESULTS_PER_PAGE = 25;
  public static readonly CONTRACT_REGISTRY_DEFAULT_PUBLISH_METHOD = 'publish';

  private readonly goldmine: Goldmine;
  private readonly ident: Ident;

  private application?: Application;
  private connectors: Connector[] = [];
  private messages: Message[] = [];
  private registryContract?: Contract;
  private signingIdentities?: Account[];
  private signingIdentity?: Account;

  private ipfs?: IpfsClient;
  private token?: any;

  constructor(token: string) {
    this.goldmine = new Goldmine(token);
    this.ident = new Ident(token);

    this.initialize(token).catch(
      (response: any) => {
        console.log(`failed to ${response}`);
      }
    );
  }

  private initialize(token: string): Promise<any> {
    const payload = jwt.decode(token);
    if (payload === null) {
      throw new Error(`failed to parse jwt: ${token}`);
    }

    this.token = payload;

    return this.resolveApplication().then(
      (application: Application) => {
        this.application = application;
        console.log(`resolved application: ${this.application}`);

        this.resolveRegistryContract().then(
          (registryContract: Contract) => {
            this.registryContract = registryContract;

            this.resolveSigningIdentities().then(
              (signingIdentities: Account[]) => {
                this.signingIdentities = signingIdentities;
                if (this.signingIdentities.length > 0) {
                  this.signingIdentity = this.signingIdentities[0];
                }

                this.resolveConnectors().then(
                  (connectors: Connector[]) => {
                    this.connectors = connectors;
                    this.configureIpfsClient();
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  private configureIpfsClient() {
    const connector = this.getConnector();
    if (connector === null) {
      return;
    }

    // tslint:disable-next-line: no-non-null-assertion
    const ipfsUrl: any = url.parse(`${connector.config!.apiUrl}/api/v0`);

    this.ipfs = new IpfsClient(ipfsUrl.protocol.replace(':', ''),
                               ipfsUrl.host,
                               parseInt(ipfsUrl.port, 10),
                               ipfsUrl.path.replace('/', ''));
  }

  private getApplicationId(): string {
    const subjectParts = this.token.sub.split(':');
    if (subjectParts.length !== 2) {
      throw new Error(`failed to parse application subject from jwt: ${this.token}`);
    }
    return subjectParts[1];
  }

  private getConnector(): Connector | null {
    if (this.connectors.length > 0) {
      return this.connectors[0];
    }

    return null;
  }

  private resolveApplication(): Promise<Application> {
    return new Promise((resolve, reject) => {
      this.ident.fetchApplicationDetails(this.getApplicationId()).then(
        (response: ApiClientResponse) => {
          const application = response.unmarshalResponse(Application) as Application;
          resolve(application);
        }
      ).catch(
        (response: ApiClientResponse) => {
          const application = response.unmarshalResponse(Application) as Application;
          reject(application);
        }
      );
    });
  }

  private resolveConnectors(): Promise<Connector[]> {
    return new Promise((resolve, reject) => {
      this.goldmine.fetchConnectors({ type: MessageBus.CONNECTOR_TYPE_IPFS }).then(
        (response: ApiClientResponse) => {
          const connectors = response.unmarshalResponse(Connector) as Connector[];
          resolve(connectors);
        }
      ).catch(
        (response: ApiClientResponse) => {
          const connector = response.unmarshalResponse(Connector) as Connector;
          reject(connector);
        }
      );
    });
  }

  private resolveRegistryContract(): Promise<Contract> {
    return new Promise((resolve, reject) => {
      this.goldmine.fetchContracts({ type: MessageBus.CONTRACT_TYPE_REGISTRY }).then(
        (response: ApiClientResponse) => {
          const contracts = response.unmarshalResponse(Contract) as Contract[];
          contracts.forEach(
            (contract: Contract) => {
              resolve(contract);
              return;
            }
          );
          reject(null);
        },
      ).catch(
        (response: ApiClientResponse) => {
          const contract = response.unmarshalResponse(Contract) as Contract;
          reject(contract);
        },
      );
    });
  }

  private resolveSigningIdentities(): Promise<Account[]> {
    return new Promise((resolve, reject) => {
      this.goldmine.fetchAccounts().then(
        (response: ApiClientResponse) => {
          const accounts = response.unmarshalResponse(Account) as Account[];
          resolve(accounts);
        },
      ).catch(
        (response: ApiClientResponse) => {
          const account = response.unmarshalResponse(Account) as Account;
          reject(account);
        },
      );
    });
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public publish(subject: string, msg: Uint8Array) {
    if (this.ipfs === null) {
      throw new Error('unable to publish message without configured ipfs');
    }
    if (typeof this.registryContract === 'undefined') {
      throw new Error('unable to publish message without configured registry contract');
    }
    if (typeof this.signingIdentity === 'undefined') {
      throw new Error('unable to publish message without configured signing identity');
    }

    // tslint:disable-next-line: no-non-null-assertion
    this.ipfs!.add('', msg).then(
      (hash: any) => {
        // tslint:disable-next-line: no-non-null-assertion
        this.goldmine.executeContract(this.registryContract!.id!, {
          method: MessageBus.CONTRACT_REGISTRY_DEFAULT_PUBLISH_METHOD,
          params: [subject, hash],
          value: 0,
          // tslint:disable-next-line: no-non-null-assertion
          account_address: this.signingIdentity!.address,
        }).then(
          (response: ApiClientResponse) => {
            console.log(`received ${response}`);
          }
        ).catch((err) => {
          console.log(`WARNING: failed to publish ${msg.length}-byte message ${hash} to registry; ${err}`);
        });
      }
    ).catch((err) => {
      console.log(`WARNING: failed to publish message to IPFS; ${err}`);
    });
  }

  public readRegistryContract(
      page: number = 1,
      rpp: number = MessageBus.CONTRACT_REGISTRY_DEFAULT_LIST_RESULTS_PER_PAGE,
  ): void {
    if (typeof this.registryContract === 'undefined') {
      throw new Error('unable to read registry without configured registry contract');
    }
    if (typeof this.registryContract === 'undefined') {
      throw new Error('unable to read registry contract without configured ipfs');
    }

    if (page === 1) {
      this.messages = [];
    }

    // tslint:disable-next-line: no-non-null-assertion
    this.goldmine.executeContract(this.registryContract!.id!, {
      method: MessageBus.CONTRACT_REGISTRY_DEFAULT_LIST_METHOD,
      params: [page, rpp],
      value: 0,
      // tslint:disable-next-line: no-non-null-assertion
      account_address: this.signingIdentity!.address,
    }).then((response: ApiClientResponse) => {
      if (response.xhr.status === 200) {
        const messages: Message[] = [];
        const messagesByHash = {};
        const ipfsHashes: any[] = [];
        const ipfsHashesModifiedAt: any[] = [];

        const messagesList = JSON.parse(response.responseBody).response as any[];
        for (const msg of messagesList) {
          if (msg.sender && msg.sender !== '0x0000000000000000000000000000000000000000') { // HACK
            const message = new Message();
            message.sender = msg.sender;
            message.timestamp = new Date(msg.timestamp * 1000).toUTCString();

            const tx = new Transaction();
            tx.unmarshal(JSON.stringify(msg));
            message.tx = tx;

            const hash = atob(msg.hash);

            messages.push(message);
            messagesByHash[hash] = message;
            ipfsHashes.push(hash);
            ipfsHashesModifiedAt.push(msg.timestamp);
          }
        }

        // tslint:disable-next-line: no-non-null-assertion
        this.ipfs!.ls(ipfsHashes).then(
          (ipfsLinks: object[]) => {
            for (const link of ipfsLinks) {
              // tslint:disable-next-line: max-line-length no-non-null-assertion
              link['data_url'] = `${this.getConnector()!.config!.apiUrl}/api/v0/get?arg=/ipfs/${atob(link['hash'])}&encoding=json&stream-channels=true"`;
              link['modified_at'] = ipfsHashesModifiedAt[ipfsLinks.indexOf(link)]; // HACK

              const msgData = new MessageData();
              msgData.unmarshal(JSON.stringify(link));
              messagesByHash[link['hash']].data = msgData;
            }
          }
        );

        this.messages = messages;
      } else {
        console.log(`WARNING: failed to read registry contract; ${response.responseBody}`);
      }
    }).catch((err) => {
      console.log(`WARNING: failed to read registry contract; ${err}`);
    });
  }
}
