import { Polar } from '@polar-sh/sdk';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
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

  const { email, uid } = req.body;

  if (!email || !uid) {
    return res.status(400).json({ error: 'Email and UID are required' });
  }

  const apiKey = process.env.POLAR_ACCESS_TOKEN?.trim();
  const isSandbox = apiKey?.startsWith('polar_at_s_') || 
                   apiKey?.startsWith('polar_oat_') || 
                   process.env.POLAR_ENVIRONMENT === 'sandbox';

  const polar = new Polar({
    accessToken: apiKey,
    server: isSandbox ? 'sandbox' : 'production',
  });

  try {
    console.log(`[SYNC] Checking Polar for email: ${email}`);
    
    // Search for subscriptions for this email
    const subscriptions = await polar.subscriptions.list({
      query: email
    });

    // Find an active subscription for our Product
    const activeSub = subscriptions.items?.find(sub => 
      (sub.status === 'active' || sub.status === 'trialing') && 
      sub.productId === process.env.POLAR_PRODUCT_PRO
    );

    if (activeSub) {
      console.log(`[SYNC] Found active subscription: ${activeSub.id}. Updating UID: ${uid}`);
      
      await db.collection('users').doc(uid).update({
        subscription: {
          status: 'active',
          plan: 'pro',
          productId: activeSub.productId,
          subscriptionId: activeSub.id,
          customerId: activeSub.customerId,
          updatedAt: new Date().toISOString(),
        }
      });

      return res.status(200).json({ success: true, message: 'Subscription synced successfully!' });
    } else {
      console.log(`[SYNC] No active subscription found for ${email} on Polar.`);
      return res.status(404).json({ error: 'No active subscription found on Polar for this email.' });
    }
  } catch (error) {
    console.error('[SYNC] Error syncing subscription:', error);
    return res.status(500).json({ error: 'Sync failed', details: error.message });
  }
}
