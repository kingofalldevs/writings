import DodoPayments from 'dodopayments';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId } = req.body || {};

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    const apiKey = process.env.DODO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DODO_API_KEY env variable is not set' });
    }

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: process.env.DODO_ENVIRONMENT || 'test_mode',
    });

    // Create a customer portal session
    // Based on Dodo Payments documentation for generating magic links
    const session = await client.customers.customerPortal.create(customerId);

    if (!session || !session.link) {
      return res.status(500).json({
        error: 'Failed to generate portal link',
        response: session,
      });
    }

    return res.status(200).json({ portalUrl: session.link });

  } catch (error) {
    console.error('Dodo Portal error:', error);
    return res.status(500).json({
      error: 'Portal access failed',
      details: error?.message || String(error),
      code: error?.status || error?.code,
    });
  }
}
