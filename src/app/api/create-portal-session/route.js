import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // For Polar.sh, the customer management happens at their purchases page
    // We return this URL so the frontend can redirect the user
    return NextResponse.json({ 
      portalUrl: 'https://polar.sh/purchases' 
    });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
