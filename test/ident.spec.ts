// import { Ident, identClientFactory } from '../src/services';
// import { assert } from 'console';

// let ident: Ident;
// let user: any;
// let token: string;

// beforeAll(async () => {
//   user = await Ident.createUser({
//     email: `user${new Date().getTime()}@prvd.local`,
//     password: 'testp455',
//     first_name: 'Prvd',
//     last_name: 'User',
//   });

//   token = await Ident.authenticate({
//     email: user['email'],
//     password: 'testp455',
//   });
//   ident = identClientFactory(token['token']['token']);
// });

// describe('authentication', () => {
//   beforeEach(async () => {
//     assert(ident, 'ident not defined');
//     assert(token, 'token not authorized');
//     assert(user, 'user not created');
//   });

//   it('should work!', async () => {
//     const resp = await ident.fetchApplications({});
//     assert(resp, 'applications list not retrieved');
//   });
// });
