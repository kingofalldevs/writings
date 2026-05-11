import { Polar } from '@polar-sh/sdk';
const polar = new Polar({ accessToken: 'test' });
polar.checkouts.create({
  paymentProcessor: 'stripe',
  products: ['test'],
  customerEmail: 'test@example.com',
  successUrl: 'http://localhost'
}).then(console.log).catch(e => console.log('ERROR:', e.message));
