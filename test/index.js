import { assert } from 'chai';

import broadcastTx from '../src/lib/broadcastTx';
import createApplication from '../src/lib/createApplication';
import createToken from '../src/lib/createToken';
import createWallet from '../src/lib/createWallet';

createApplication('token', {
  // BlockchainService.create_wallet(jwt, {application_id: app_id, network_id: network_id})
});

createToken('token', {
  // IdentService.authenticate(jwt_token, {application_id: app_id})
});

createWallet('token', {
  // BlockchainService.create_wallet(jwt, {application_id: app_id, network_id: network_id})
});

broadcastTx('token', {
  // BlockchainService.create_transaction(jwt, {application_id: app_id, network_id: network_id, wallet_id: wallet_id, to: to, value: value, data: data, params: args})
});
