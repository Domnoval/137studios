// 137studios Email Notification System
// Handles transactional emails for orders, user registration, and admin notifications

interface EmailConfig {
  from: string;
  replyTo?: string;
  apiKey?: string;
  apiUrl?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

interface EmailData {
  to: string;
  template: EmailTemplate;
  data?: Record<string, any>;
}

// Email service configuration - supports multiple providers
const emailConfig: EmailConfig = {
  from: process.env.EMAIL_FROM || 'cosmic@137studios.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'artist@137studios.com',
  apiKey: process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY,
  apiUrl: process.env.RESEND_API_KEY ? 'https://api.resend.com/emails' : 'https://api.sendgrid.com/v3/mail/send'
};

// Email templates with cosmic/mystical theming
export const emailTemplates = {
  // User registration confirmation
  welcomeUser: {
    subject: '🌟 Welcome to the Cosmic Community - 137studios',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a, #1a0033); color: #e2e8f0; padding: 20px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(45deg, #a855f7, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5em; margin: 0;">137studios</h1>
        <p style="color: #cbd5e1; margin: 10px 0;">Where consciousness meets creation</p>
      </div>

      <div style="background: rgba(147, 51, 234, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #a855f7;">
        <h2 style="color: #e879f9; margin-top: 0;">🌟 Welcome to the Cosmic Community!</h2>
        <p>Greetings, fellow traveler of consciousness. You've successfully joined our mystical gallery where art transcends dimensions.</p>

        <h3 style="color: #fbbf24;">What's next in your journey:</h3>
        <ul style="color: #cbd5e1;">
          <li>🎨 Explore our collection of consciousness-inspired artwork</li>
          <li>✨ Save your favorite pieces to your cosmic collection</li>
          <li>🌌 Remix and blend artworks using AI-powered tools</li>
          <li>📦 Order high-quality prints delivered to your realm</li>
          <li>🔮 Receive updates on new mystical creations</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://137studios.com/gallery" style="background: linear-gradient(45deg, #a855f7, #06b6d4); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">🚀 Start Exploring</a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; color: #9ca3af; font-size: 0.8em;">
        <p>May your journey through consciousness be illuminating ✨</p>
        <p>© {{year}} 137studios - Sacred digital artistry</p>
      </div>
    </div>
    `,
    text: 'Welcome to 137studios! You have successfully joined our cosmic community. Visit https://137studios.com/gallery to start exploring consciousness-inspired artwork.'
  },

  // Order confirmation
  orderConfirmation: {
    subject: '🎯 Your Cosmic Order is Confirmed - Order #{{orderNumber}}',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a, #1a0033); color: #e2e8f0; padding: 20px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(45deg, #a855f7, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5em; margin: 0;">137studios</h1>
        <p style="color: #cbd5e1; margin: 10px 0;">Your mystical order is confirmed</p>
      </div>

      <div style="background: rgba(6, 182, 212, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #06b6d4;">
        <h2 style="color: #06b6d4; margin-top: 0;">🎯 Order Confirmed!</h2>
        <p><strong>Order Number:</strong> #{{orderNumber}}</p>
        <p><strong>Order Date:</strong> {{orderDate}}</p>

        <h3 style="color: #fbbf24;">Your Cosmic Items:</h3>
        <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 6px; margin: 15px 0;">
          {{#items}}
          <div style="border-bottom: 1px solid #374151; padding: 10px 0; margin-bottom: 10px;">
            <strong style="color: #e879f9;">{{title}}</strong><br>
            <span style="color: #cbd5e1;">{{productType}} - {{size}}</span><br>
            <span style="color: #fbbf24;">{{price}} x {{quantity}}</span>
          </div>
          {{/items}}
        </div>

        <div style="text-align: right; margin: 20px 0; padding: 15px; background: rgba(168, 85, 247, 0.1); border-radius: 6px;">
          <p style="margin: 5px 0;"><strong>Subtotal: {{subtotal}}</strong></p>
          <p style="margin: 5px 0;">Shipping: {{shipping}}</p>
          <h3 style="color: #a855f7; margin: 10px 0;">Total: {{total}}</h3>
        </div>

        <h3 style="color: #fbbf24;">Shipping Address:</h3>
        <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 6px; color: #cbd5e1;">
          {{shippingAddress}}
        </div>

        <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #fbbf24;">
          <h4 style="color: #fbbf24; margin: 0 0 10px 0;">🚀 What happens next?</h4>
          <p style="margin: 5px 0;">• Your order is being prepared by our cosmic print partners</p>
          <p style="margin: 5px 0;">• You'll receive tracking information once your items ship</p>
          <p style="margin: 5px 0;">• Expected delivery: 7-14 business days</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; color: #9ca3af; font-size: 0.8em;">
        <p>Thank you for supporting consciousness-inspired art ✨</p>
        <p>Questions? Reply to this email or visit our support portal</p>
        <p>© {{year}} 137studios</p>
      </div>
    </div>
    `,
    text: 'Your order #{{orderNumber}} has been confirmed! Total: {{total}}. Expected delivery: 7-14 business days. Thank you for supporting 137studios!'
  },

  // Order shipped
  orderShipped: {
    subject: '📦 Your Cosmic Art is on the Way - Order #{{orderNumber}}',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a, #1a0033); color: #e2e8f0; padding: 20px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(45deg, #a855f7, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5em; margin: 0;">137studios</h1>
        <p style="color: #cbd5e1; margin: 10px 0;">Your art is traveling through dimensions</p>
      </div>

      <div style="background: rgba(34, 197, 94, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e;">
        <h2 style="color: #22c55e; margin-top: 0;">📦 Your Order Has Shipped!</h2>
        <p><strong>Order Number:</strong> #{{orderNumber}}</p>
        <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
        <p><strong>Carrier:</strong> {{carrier}}</p>
        <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{trackingUrl}}" style="background: linear-gradient(45deg, #22c55e, #06b6d4); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">🔍 Track Your Package</a>
        </div>

        <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #fbbf24;">
          <h4 style="color: #fbbf24; margin: 0 0 10px 0;">📝 Care Instructions:</h4>
          <p style="margin: 5px 0;">• Handle with cosmic awareness</p>
          <p style="margin: 5px 0;">• Avoid direct sunlight for longevity</p>
          <p style="margin: 5px 0;">• Frame using archival materials for prints</p>
          <p style="margin: 5px 0;">• Display in spaces that honor the energy</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; color: #9ca3af; font-size: 0.8em;">
        <p>May your art bring consciousness and beauty to your space ✨</p>
        <p>© {{year}} 137studios</p>
      </div>
    </div>
    `,
    text: 'Your order #{{orderNumber}} has shipped! Tracking: {{trackingNumber}}. Estimated delivery: {{estimatedDelivery}}. Track at: {{trackingUrl}}'
  },

  // Admin notification for new order
  adminOrderNotification: {
    subject: '🛍️ New Cosmic Order Received - #{{orderNumber}}',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1f2937; color: #e2e8f0; padding: 20px; border-radius: 12px;">
      <h1 style="color: #fbbf24; text-align: center;">137studios Admin Portal</h1>

      <div style="background: rgba(168, 85, 247, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #a855f7;">
        <h2 style="color: #a855f7; margin-top: 0;">🛍️ New Order Received</h2>
        <p><strong>Order Number:</strong> #{{orderNumber}}</p>
        <p><strong>Customer:</strong> {{customerName}} ({{customerEmail}})</p>
        <p><strong>Total:</strong> {{total}}</p>
        <p><strong>Items:</strong> {{itemCount}}</p>
        <p><strong>Print Providers:</strong> {{printProviders}}</p>

        <div style="margin: 20px 0;">
          <a href="{{adminUrl}}/orders/{{orderNumber}}" style="background: #a855f7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">View Order Details</a>
        </div>
      </div>
    </div>
    `,
    text: 'New order #{{orderNumber}} from {{customerName}}. Total: {{total}}. View details at {{adminUrl}}/orders/{{orderNumber}}'
  }
};

// Template rendering with simple variable substitution
function renderTemplate(template: EmailTemplate, data: Record<string, any> = {}): EmailTemplate {
  const currentYear = new Date().getFullYear();
  const templateData = { ...data, year: currentYear };

  const renderString = (str: string): string => {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return (templateData as any)[key] || match;
    });
  };

  return {
    subject: renderString(template.subject),
    html: renderString(template.html),
    text: template.text ? renderString(template.text) : undefined
  };
}

// Email sending function - supports Resend and SendGrid
export async function sendEmail({ to, template, data = {} }: EmailData): Promise<boolean> {
  try {
    const renderedTemplate = renderTemplate(template, data);

    if (process.env.RESEND_API_KEY) {
      return await sendWithResend(to, renderedTemplate);
    } else if (process.env.SENDGRID_API_KEY) {
      return await sendWithSendGrid(to, renderedTemplate);
    } else {
      console.log('📧 EMAIL (Dev Mode):', {
        to,
        subject: renderedTemplate.subject,
        html: renderedTemplate.html.substring(0, 200) + '...'
      });
      return true; // Success in development
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Resend API implementation
async function sendWithResend(to: string, template: EmailTemplate): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailConfig.from,
        to: [to],
        subject: template.subject,
        html: template.html,
        text: template.text,
        reply_to: emailConfig.replyTo
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }

    console.log('✨ Email sent successfully via Resend to:', to);
    return true;
  } catch (error) {
    console.error('Resend email failed:', error);
    return false;
  }
}

// SendGrid API implementation
async function sendWithSendGrid(to: string, template: EmailTemplate): Promise<boolean> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: template.subject
        }],
        from: { email: emailConfig.from },
        reply_to: { email: emailConfig.replyTo },
        content: [
          {
            type: 'text/html',
            value: template.html
          },
          ...(template.text ? [{
            type: 'text/plain',
            value: template.text
          }] : [])
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }

    console.log('✨ Email sent successfully via SendGrid to:', to);
    return true;
  } catch (error) {
    console.error('SendGrid email failed:', error);
    return false;
  }
}

// Convenience functions for common email types
export const emailService = {
  // Send welcome email to new users
  sendWelcomeEmail: async (userEmail: string, userName: string) => {
    return sendEmail({
      to: userEmail,
      template: emailTemplates.welcomeUser,
      data: { userName }
    });
  },

  // Send order confirmation
  sendOrderConfirmation: async (orderData: {
    email: string;
    orderNumber: string;
    orderDate: string;
    items: Array<{
      title: string;
      productType: string;
      size: string;
      price: string;
      quantity: number;
    }>;
    subtotal: string;
    shipping: string;
    total: string;
    shippingAddress: string;
  }) => {
    return sendEmail({
      to: orderData.email,
      template: emailTemplates.orderConfirmation,
      data: orderData
    });
  },

  // Send shipping notification
  sendShippingNotification: async (shippingData: {
    email: string;
    orderNumber: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
    trackingUrl: string;
  }) => {
    return sendEmail({
      to: shippingData.email,
      template: emailTemplates.orderShipped,
      data: shippingData
    });
  },

  // Notify admin of new order
  notifyAdminNewOrder: async (orderData: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: string;
    itemCount: number;
    printProviders: string;
    adminUrl: string;
  }) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@137studios.com';
    return sendEmail({
      to: adminEmail,
      template: emailTemplates.adminOrderNotification,
      data: orderData
    });
  }
};

export default emailService;