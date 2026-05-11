export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { customerId, userEmail } = req.body || {};

    const apiKey = process.env.POLAR_ACCESS_TOKEN?.trim();
    if (!apiKey) {
      return res.status(500).json({ error: 'POLAR_ACCESS_TOKEN env variable is not set' });
    }

    // Detect if we are using a sandbox token or explicit environment
    const isSandbox = apiKey.startsWith('polar_at_s_') || process.env.POLAR_ENVIRONMENT === 'sandbox';
    
    let Polar;
    try {
      const mod = await import('@polar-sh/sdk');
      Polar = mod.Polar;
    } catch (importErr) {
      console.error('SDK import failed:', importErr.message);
      return res.status(500).json({ error: 'SDK load error', details: importErr.message });
    }

    const polar = new Polar({
      accessToken: apiKey,
      server: isSandbox ? 'sandbox' : 'production',
    });

    // If customerId is missing, try to find it by email
    if (!customerId && userEmail) {
      console.log(`Searching for customer by email: ${userEmail}`);
      const customers = await polar.customers.list({ email: userEmail });
      
      const customer = customers.items?.find(c => c.email === userEmail);
      if (customer) {
        customerId = customer.id;
        console.log(`Found customerId: ${customerId} for ${userEmail}`);
      }
    }

    if (!customerId) {
      return res.status(400).json({ error: 'Customer not found. Please ensure you have an active subscription.' });
    }

    // Create a customer portal session
    const session = await polar.customerSessions.create({
      customerId: customerId,
    });

    if (!session || !session.customerPortalUrl) {
      return res.status(500).json({
        error: 'Failed to generate portal link',
        response: session,
      });
    }

    return res.status(200).json({ portalUrl: session.customerPortalUrl });

  } catch (error) {
    console.error('Polar Portal error:', error);
    return res.status(500).json({
      error: 'Portal access failed',
      details: error?.message || String(error),
      code: error?.status || error?.code,
    });
  }
}
