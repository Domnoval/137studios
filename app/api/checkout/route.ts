import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artworkId, artworkTitle, remixData, printSize, userEmail } = body;

    // Validate inputs
    if (!artworkId || !artworkTitle) {
      return NextResponse.json(
        { success: false, error: 'Artwork ID and title are required' },
        { status: 400 }
      );
    }

    const price = 137; // The mystical price
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      artworkTitle,
      artworkId,
      price,
      userEmail,
      successUrl: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/?canceled=true`,
    });

    // Log order for tracking (in production, save to database)
    console.log('Order created:', {
      sessionId: session.id,
      artworkId,
      artworkTitle,
      price,
      userEmail,
      printSize,
      remixData: remixData ? 'included' : 'none',
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      message: 'Your artistic vision is manifesting into physical reality...'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initiate cosmic transaction'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '137 Studios Checkout API',
    endpoints: {
      POST: '/api/checkout - Create a new print order'
    }
  });
}