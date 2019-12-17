import * as jwt from 'jsonwebtoken';
import * as url from 'url';

import { ApiClientResponse, IpfsClient } from '../clients';
import { Goldmine, Ident } from '.';
import { Account, Application, Connector, ConnectorConfig, Contract, Message, MessageData, Token, Transaction, Wallet, unmarshal } from '@provide/types';


/*
 * Message bus client.
 */
export class MessageBus {

  public static readonly APPLICATION_TYPE_MESSAGE_BUS = 'message_bus';
  public static readonly APPLICATION_HD_WALLET_DEFAULT_PURPOSE = 44;
  public static readonly CONNECTOR_TYPE_IPFS = 'ipfs';
  public static readonly CONNECTOR_TYPE_IPFS_DEFAULT_API_PORT = 5001;
  public static readonly CONNECTOR_TYPE_IPFS_DEFAULT_GATEWAY_PORT = 8080;
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

  public static create(
      token: string,
      networkId: string,
      name: string,
      connectorConfig: ConnectorConfig,
      registryContract: Contract,
    ): Promise<MessageBus> {
    return new Promise((resolve, reject) => {
      const ident = new Ident(token);

      if (!connectorConfig) {
        reject('invalid registry contract');
        return;
      }

      if (!registryContract || !registryContract.params || !registryContract.params.compiled_artifact) {
        reject('invalid registry contract');
        return;
      }

      ident.createApplication({
        name: name,
        network_id: networkId,
        type: MessageBus.APPLICATION_TYPE_MESSAGE_BUS,
      }).then(
        (response: ApiClientResponse) => {
          const resp = JSON.parse(response.responseBody);
          const application = unmarshal(JSON.stringify(resp.application), Application) as Application;
          const applicationToken = unmarshal(JSON.stringify(resp.token), Token) as Token;
          console.log(`created message bus application: ${application.id}`);

          // tslint:disable-next-line: no-non-null-assertion
          const goldmine = new Goldmine(applicationToken.token!);

          goldmine.createWallet({
            purpose: MessageBus.APPLICATION_HD_WALLET_DEFAULT_PURPOSE,
          }).then(
            (hdWalletResponse: ApiClientResponse) => {
              const applicationHdWallet = unmarshal(hdWalletResponse.responseBody, Wallet) as Wallet;
              // tslint:disable-next-line: no-non-null-assertion
              const hdWalletId = applicationHdWallet.id!;

              // tslint:disable-next-line: no-non-null-assertion
              goldmine.fetchWalletAccounts(hdWalletId).then(
                (accountsResponse: ApiClientResponse) => {
                  const hdWalletAccounts = unmarshal(accountsResponse.responseBody, Account) as Account[];
                  const applicationIdentity = hdWalletAccounts[0];

                  goldmine.createConnector({
                    name: `${name} message bus connector - ${MessageBus.CONNECTOR_TYPE_IPFS} - ${connectorConfig.region}`,
                    application_id: application.id,
                    network_id: networkId,
                    type: MessageBus.CONNECTOR_TYPE_IPFS,
                    config: connectorConfig,
                  }).then(
                    (connectorResponse: ApiClientResponse) => {
                      const connector = connectorResponse.unmarshalResponse(Connector) as Connector;
                      console.log(`created connector ${connector.id} for message bus application: ${application.id}`);

                      goldmine.createContract({
                        name: registryContract.name,
                        network_id: networkId,
                        application_id: application.id,
                        type: MessageBus.CONTRACT_TYPE_REGISTRY,
                        address: '0x',
                        params: {
                          // tslint:disable-next-line: no-non-null-assertion
                          compiled_artifact: registryContract.params!.compiled_artifact,
                          wallet_id: hdWalletId,
                          hd_derivation_path: applicationIdentity.hdDerivationPath,
                        },
                      }).then(
                        (contractResponse: ApiClientResponse) => {
                          const contract = contractResponse.unmarshalResponse(Contract) as Contract;
                          console.log(`created registry contract ${contract.id} for message bus application: ${application.id}`);

                          // tslint:disable-next-line: no-non-null-assertion
                          const mb = new MessageBus(applicationToken.token!);
                          resolve(mb);
                        }
                      ).catch(
                        (contractResponse: any) => {
                          console.log(`WARNING: failed to create registry contract for message bus application ${application.id}; ${contractResponse}`);
                          reject(contractResponse);
                        }
                      );
                    }
                  ).catch(
                    (connectorResponse: any) => {
                      console.log(`WARNING: failed to create connector for message bus application ${application.id}; ${accountsResponse}`);
                      reject(connectorResponse);
                    }
                  );
                }
              ).catch(
                (accountsResponse: any) => {
                  console.log(`WARNING: failed to fetch HD wallet accounts for message bus application ${application.id}; ${accountsResponse}`);
                  reject(accountsResponse);
                }
              );
            },
          ).catch(
            (hdWalletResponse: any) => {
              console.log(`WARNING: failed to create HD wallet for message bus application ${application.id}; ${hdWalletResponse}`);
              reject(hdWalletResponse);
            }
          );
        }
      ).catch(
        (response: any) => {
          console.log(`WARNING: failed to create message bus application; ${response}`);
          reject(response);
        }
      );
    });
  }

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
    const ipfsUrl: any = url.parse(`${connector.config!['api_url']}/api/v0`);

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
              link['data_url'] = `${this.getConnector()!.config!['api_url']}/api/v0/get?arg=/ipfs/${atob(link['hash'])}&encoding=json&stream-channels=true"`;
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
