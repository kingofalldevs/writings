const PLAN_PRODUCT_IDS = {
  pro: process.env.POLAR_PRODUCT_PRO,
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
    let Polar;
    try {
      const mod = await import('@polar-sh/sdk');
      Polar = mod.Polar;
    } catch (importErr) {
      console.error('SDK import failed:', importErr.message);
      return res.status(500).json({ error: 'SDK load error', details: importErr.message });
    }

    const apiKey = process.env.POLAR_ACCESS_TOKEN?.trim();
    if (!apiKey) {
      return res.status(500).json({ error: 'POLAR_ACCESS_TOKEN env variable is not set' });
    }

    // Detect if we are using a sandbox token
    const isSandbox = apiKey.startsWith('polar_at_s_');
    console.log(`Initializing Polar SDK (Mode: ${isSandbox ? 'Sandbox' : 'Production'})`);

    const polar = new Polar({
      accessToken: apiKey,
      server: isSandbox ? 'sandbox' : 'production',
    });

    // Determine the redirect URL (Vercel provides VERCEL_URL for serverless functions)
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || process.env.VERCEL_URL || 'localhost:3001';
    const appUrl = process.env.VITE_APP_URL || (host.includes('localhost') ? `http://${host}` : `${protocol}://${host}`);

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: userEmail,
      customerName: userName || userEmail.split('@')[0],
      successUrl: `${appUrl}/?payment=success&plan=${planId}`,
    });

    console.log('Polar response:', JSON.stringify(checkout, null, 2));

    const checkoutUrl = checkout.url;

    if (!checkoutUrl) {
      return res.status(500).json({
        error: 'No checkout URL in Polar response',
        response: checkout,
      });
    }

    return res.status(200).json({ checkoutUrl });

  } catch (error) {
    console.error('Polar error:', error);
    return res.status(500).json({
      error: 'Checkout failed',
      details: error?.message || String(error),
      code: error?.status || error?.code,
    });
  }
}
