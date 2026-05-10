const PLAN_PRODUCT_IDS = {
  pro: process.env.DODO_PRODUCT_PRO,
};

export default async function handler(req, res) {
  // Always respond with JSON, even on crash
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, userEmail, userName, trial } = req.body || {};

    if (!planId || !userEmail) {
      return res.status(400).json({ error: 'Missing planId or userEmail' });
    }

    const productId = PLAN_PRODUCT_IDS[planId];
    if (!productId) {
      return res.status(400).json({ error: `Invalid plan: ${planId}` });
    }

    // Dynamic import — avoids module-level crash if SDK fails to load
    let DodoPayments;
    try {
      const mod = await import('dodopayments');
      DodoPayments = mod.default ?? mod;
    } catch (importErr) {
      console.error('SDK import failed:', importErr.message);
      return res.status(500).json({ error: 'SDK load error', details: importErr.message });
    }

    const apiKey = process.env.DODO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DODO_API_KEY env variable is not set' });
    }

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: process.env.DODO_ENVIRONMENT || 'test_mode',
    });

    // Determine the redirect URL (Vercel provides VERCEL_URL for serverless functions)
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || process.env.VERCEL_URL || 'localhost:3001';
    const appUrl = process.env.VITE_APP_URL || (host.includes('localhost') ? `http://${host}` : `${protocol}://${host}`);

    const subscription = await client.subscriptions.create({
      billing: {
        city: 'city',
        country: 'US',
        state: 'state',
        street: 'street',
        zipcode: '00000',
      },
      customer: {
        email: userEmail,
        name: userName || userEmail.split('@')[0],
      },
      product_id: productId,
      quantity: 1,
      return_url: `${appUrl}/?payment=success&plan=${planId}`,
      payment_link: true,
      ...(trial ? { trial_period_days: 7 } : {}),
    });

    console.log('Dodo response:', JSON.stringify(subscription, null, 2));

    const checkoutUrl =
      subscription.payment_link ||
      subscription.checkout_url ||
      subscription.url;

    if (!checkoutUrl) {
      return res.status(500).json({
        error: 'No checkout URL in Dodo response',
        response: subscription,
      });
    }

    return res.status(200).json({ checkoutUrl });

  } catch (error) {
    console.error('Dodo error:', error);
    return res.status(500).json({
      error: 'Checkout failed',
      details: error?.message || String(error),
      code: error?.status || error?.code,
    });
  }
}
