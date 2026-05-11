import { Polar } from '@polar-sh/sdk';
const polar = new Polar({ accessToken: 'test' });
polar.customerSessions.create({
  customerId: 'test-id'
}).then(console.log).catch(e => console.log('ERROR:', e.message));
