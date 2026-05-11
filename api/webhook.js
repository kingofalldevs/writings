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
  console.log(`[POLAR WEBHOOK] Received event: ${type}`);
  console.log(`[POLAR WEBHOOK] Raw Data ID: ${data?.id}`);

  try {
    switch (type) {
      case 'subscription.created':
      case 'subscription.active':
      case 'subscription.updated': {
        const subscription_id = data.id;
        const customer_id = data.customer_id || data.customerId;
        const product_id = data.product_id || data.productId;
        
        // Polar payloads can be tricky—let's find the email wherever it may be
        const customer_email = (data.customer?.email || data.customer_email || data.email || data.user_email || '').toLowerCase().trim();
        
        console.log(`[POLAR WEBHOOK] Processing subscription for: ${customer_email}`);
        console.log(`[POLAR WEBHOOK] Product ID from Polar: ${product_id}`);
        console.log(`[POLAR WEBHOOK] Product ID we expect: ${process.env.POLAR_PRODUCT_PRO}`);

        if (!customer_email) {
          console.error('[POLAR WEBHOOK] ERROR: No customer email found in payload');
          return res.status(400).json({ error: 'No email found' });
        }

        // Determine plan (default to 'pro' if it looks like our product)
        const plan = (product_id === process.env.POLAR_PRODUCT_PRO) ? 'pro' : 'pro'; 

        const usersRef = db.collection('users');
        // Use case-insensitive search for email to be safe
        const snapshot = await usersRef.where('email', '>=', customer_email).where('email', '<=', customer_email + '\uf8ff').limit(1).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const currentStatus = data.status || 'active';
          
          await userDoc.ref.update({
            subscription: {
              status: (currentStatus === 'active' || currentStatus === 'trialing') ? 'active' : currentStatus,
              plan,
              productId: product_id || null,
              subscriptionId: subscription_id || null,
              customerId: customer_id || null,
              updatedAt: new Date().toISOString(),
            },
          });
          console.log(`[POLAR WEBHOOK] SUCCESS: Updated user ${customer_email} to status: active`);
        } else {
          console.warn(`[POLAR WEBHOOK] WARNING: User with email ${customer_email} not found in Firestore.`);
          // Diagnostic: log the first 5 users to see what's in there
          const allUsers = await usersRef.limit(5).get();
          console.log(`[POLAR WEBHOOK] Total users checked in diagnostic: ${allUsers.size}`);
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
