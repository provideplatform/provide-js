import broadcastTx from './internal/broadcastTx';

// BlockchainService.create_transaction(app_api_token, {
//     network_id: network_id,
//     params: {
//       abi: abi,
//       name: contract_name,
//       source: File.read(sol_src),
//       build_artifact: contract,
//     },
//     data: contract['bytecode'],
//     to: nil,
//     value: 0,
//     wallet_id: wallet_id,
// })

export default broadcastTx(token, params);
