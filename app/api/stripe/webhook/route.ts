import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { emailService } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
});

const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('✨ Processing completed checkout:', session.id);

    // Retrieve full session details with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'line_items.data.price.product']
    });

    if (!fullSession.customer_details?.email) {
      console.error('No customer email found in session');
      return;
    }

    // Generate order number
    const orderNumber = generateOrderNumber();
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Process line items
    const items = fullSession.line_items?.data.map(item => {
      const product = item.price?.product as Stripe.Product;
      return {
        title: product.name,
        productType: product.metadata?.type || 'Print',
        size: extractSizeFromDescription(product.description || ''),
        price: formatCurrency(item.amount_total || 0),
        quantity: item.quantity || 1
      };
    }) || [];

    // Calculate totals
    const subtotal = formatCurrency(fullSession.amount_subtotal || 0);
    const shipping = formatCurrency((fullSession.total_details?.amount_shipping || 0));
    const total = formatCurrency(fullSession.amount_total || 0);

    // Format shipping address
    const shippingAddress = formatShippingAddress((fullSession as any).shipping?.address);

    // Save order to database
    const order = await saveOrder({
      orderNumber,
      customerEmail: fullSession.customer_details.email,
      customerName: fullSession.customer_details.name || 'Customer',
      stripeSessionId: session.id,
      amount: fullSession.amount_total || 0,
      items,
      shippingAddress
    });

    // Send order confirmation email
    const emailSent = await emailService.sendOrderConfirmation({
      email: fullSession.customer_details.email,
      orderNumber,
      orderDate,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress
    });

    // Notify admin of new order
    await emailService.notifyAdminNewOrder({
      orderNumber,
      customerName: fullSession.customer_details.name || 'Customer',
      customerEmail: fullSession.customer_details.email,
      total,
      itemCount: items.length,
      printProviders: 'Printful, Printify',
      adminUrl: process.env.NEXTAUTH_URL || 'https://137studios.com'
    });

    console.log(`✅ Order ${orderNumber} processed successfully. Email sent: ${emailSent}`);

  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💰 Payment succeeded:', paymentIntent.id);
  // Additional payment processing logic could go here
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('📄 Invoice payment succeeded:', invoice.id);
  // Subscription or recurring payment logic could go here
}

async function saveOrder(orderData: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  stripeSessionId: string;
  amount: number;
  items: any[];
  shippingAddress: string;
}) {
  try {
    // Find or create customer
    let user = await prisma.user.findUnique({
      where: { email: orderData.customerEmail }
    });

    if (!user) {
      // Create guest user
      user = await prisma.user.create({
        data: {
          email: orderData.customerEmail,
          name: orderData.customerName,
          role: 'USER'
        }
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        userId: user.id,
        status: 'CONFIRMED',
        totalAmount: orderData.amount / 100, // Convert from cents
        shippingAddress: orderData.shippingAddress,
        stripeSessionId: orderData.stripeSessionId,
        items: {
          create: orderData.items.map(item => ({
            type: 'PRINT',
            quantity: item.quantity,
            price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
            productDetails: JSON.stringify(item)
          }))
        }
      },
      include: {
        items: true,
        user: true
      }
    });

    return order;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `137-${timestamp}-${random}`;
}

function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amountInCents / 100);
}

function extractSizeFromDescription(description: string): string {
  const sizeMatch = description.match(/(\d+x\d+|\d+"\s*x\s*\d+")/i);
  return sizeMatch ? sizeMatch[0] : 'Standard';
}

function formatShippingAddress(address: Stripe.Address | null): string {
  if (!address) return 'No shipping address provided';

  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ].filter(Boolean);

  return parts.join(', ');
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};