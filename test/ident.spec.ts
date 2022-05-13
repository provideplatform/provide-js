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
