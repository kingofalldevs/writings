import DodoPayments from 'dodopayments';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { customerId, userEmail } = req.body || {};

    const apiKey = process.env.DODO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DODO_API_KEY env variable is not set' });
    }

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: process.env.DODO_ENVIRONMENT || 'test_mode',
    });

    // If customerId is missing, try to find it by email
    if (!customerId && userEmail) {
      console.log(`Searching for customer by email: ${userEmail}`);
      const customers = await client.customers.list({ email: userEmail });
      
      // PagePromise usually has an 'items' array or similar
      const customer = customers.items?.find(c => c.email === userEmail);
      if (customer) {
        customerId = customer.customer_id;
        console.log(`Found customerId: ${customerId} for ${userEmail}`);
      }
    }

    if (!customerId) {
      return res.status(400).json({ error: 'Customer not found. Please ensure you have an active subscription.' });
    }

    // Create a customer portal session
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
