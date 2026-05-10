import { createHmac } from 'crypto';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side SDK — different from client SDK)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();

// Read raw body for signature verification
const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

// Verify Dodo webhook signature
function verifySignature(rawBody, signature, secret) {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  return signature === expected;
}

// Map Dodo plan/product ID to our internal plan slug
const PRODUCT_TO_PLAN = {
  [process.env.DODO_PRODUCT_PRO]: 'pro',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers['webhook-signature'] || req.headers['x-dodo-signature'];
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

  // Verify signature (skip if secret not set, useful for local dev)
  if (webhookSecret && signature) {
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid Dodo webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { type, data } = event;
  console.log(`Dodo webhook: ${type}`, data?.subscription_id);

  try {
    switch (type) {
      case 'subscription.created':
      case 'subscription.active': {
        const { customer_id, subscription_id, product_id, customer_email, next_billing_date } = data;
        const plan = PRODUCT_TO_PLAN[product_id] || 'unknown';

        // Find user by email and update their subscription
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', customer_email).limit(1).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await userDoc.ref.update({
            subscription: {
              status: type === 'subscription.active' ? 'active' : 'trialing',
              plan,
              productId: product_id,
              subscriptionId: subscription_id,
              customerId: customer_id,
              currentPeriodEnd: next_billing_date || null,
              updatedAt: new Date().toISOString(),
            },
          });
        }
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const { subscription_id, customer_email } = data;
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', customer_email).limit(1).get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({
            'subscription.status': 'cancelled',
            'subscription.updatedAt': new Date().toISOString(),
          });
        }
        break;
      }

      case 'subscription.on_hold': {
        const { customer_email } = data;
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', customer_email).limit(1).get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({
            'subscription.status': 'past_due',
            'subscription.updatedAt': new Date().toISOString(),
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Dodo event: ${type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
