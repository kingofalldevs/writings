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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  // Map Polar product ID to our internal plan slug
  const PRODUCT_TO_PLAN = {
    [process.env.POLAR_PRODUCT_PRO]: 'pro',
  };

  // Vercel serverless functions automatically parse the JSON body.
  const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  if (!event || !event.type) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const { type, data } = event;
  console.log(`Polar webhook: ${type}`, data?.id);

  try {
    switch (type) {
      case 'subscription.created':
      case 'subscription.active':
      case 'subscription.updated': {
        const customer_id = data.customerId || data.customer_id;
        const subscription_id = data.id;
        const product_id = data.productId || data.product_id;
        const next_billing_date = data.currentPeriodEnd || data.current_period_end;
        
        // Polar nests the customer object if we expand it, but normally we might have to rely on their email
        const customer_email = data.customer?.email || (data.customFieldData ? data.customFieldData.email : null) || data.user_email || data.email;
        
        if (!customer_email) {
          console.error('No customer email found in webhook data');
          return res.status(400).json({ error: 'No email provided' });
        }

        const plan = PRODUCT_TO_PLAN[product_id] || 'pro'; // Default to pro if product ID matches

        // Find user by email and update their subscription
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', customer_email).limit(1).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await userDoc.ref.update({
            subscription: {
              status: (type === 'subscription.active' || type === 'subscription.updated' || data.status === 'active') ? 'active' : 'trialing',
              plan,
              productId: product_id || null,
              subscriptionId: subscription_id || null,
              customerId: customer_id || null,
              currentPeriodEnd: next_billing_date || null,
              updatedAt: new Date().toISOString(),
            },
          });
          console.log(`Successfully updated subscription for ${customer_email}`);
        } else {
          console.warn(`No user found in Firestore for email: ${customer_email}`);
        }
        break;
      }

      case 'subscription.canceled':
      case 'subscription.revoked': {
        const subscription_id = data.id;
        const customer_email = data.customer?.email || data.email;
        
        if (!customer_email) break;
        
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

      default:
        console.log(`Unhandled Polar event: ${type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
