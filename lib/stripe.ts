import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Helper function to create checkout session
export async function createCheckoutSession({
  artworkTitle,
  artworkId,
  price,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  artworkTitle: string;
  artworkId: string;
  price: number;
  userEmail?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${artworkTitle} - Limited Edition Print`,
            description: 'High-quality art print from 137studios',
            images: [], // Add artwork image URLs here
          },
          unit_amount: price * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      artworkId,
      artworkTitle,
      studio: '137studios',
    },
  });

  return session;
}

// Helper to list customers (for your example)
export async function listCustomers() {
  const customers = await stripe.customers.list({
    limit: 10,
  });
  return customers;
}
