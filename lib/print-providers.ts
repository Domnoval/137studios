// 137studios Print-on-Demand Integration
// Handles both Printful and Printify APIs for maximum coverage

export interface PrintProduct {
  id: string;
  name: string;
  type: string;
  basePrice: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  provider: 'printful' | 'printify';
}

export interface PrintOrder {
  orderId: string;
  artworkId: string;
  productType: string;
  quantity: number;
  size?: string;
  color?: string;
  customerInfo: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
}

// Printful API Integration
export class PrintfulAPI {
  private apiKey: string;
  private baseUrl = 'https://api.printful.com';

  constructor() {
    this.apiKey = process.env.PRINTFUL_API_KEY || '';
  }

  private async request(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get available products
  async getProducts(): Promise<PrintProduct[]> {
    try {
      const response = await this.request('/products');
      return response.result.map((product: any) => ({
        id: product.id.toString(),
        name: product.title,
        type: product.type,
        basePrice: 25, // Base price, varies by product
        description: product.description,
        images: [product.image],
        sizes: ['S', 'M', 'L', 'XL'], // Simplified
        colors: ['Black', 'White', 'Navy'], // Simplified
        provider: 'printful' as const,
      }));
    } catch (error) {
      console.error('Failed to fetch Printful products:', error);
      return [];
    }
  }

  // Create a product with artwork
  async createProduct(artworkUrl: string, productType: string, artworkTitle: string): Promise<string | null> {
    try {
      const productData = {
        sync_product: {
          name: `${artworkTitle} - ${productType}`,
          thumbnail: artworkUrl,
        },
        sync_variants: [
          {
            retail_price: this.getRetailPrice(productType),
            variant_id: this.getVariantId(productType),
            files: [
              {
                type: 'default',
                url: artworkUrl,
                options: [
                  {
                    id: 'template_type',
                    value: 'native',
                  },
                ],
              },
            ],
          },
        ],
      };

      const response = await this.request('/store/products', 'POST', productData);
      return response.result.id;
    } catch (error) {
      console.error('Failed to create Printful product:', error);
      return null;
    }
  }

  // Submit order for fulfillment
  async createOrder(order: PrintOrder): Promise<string | null> {
    try {
      const orderData = {
        recipient: {
          name: order.customerInfo.name,
          email: order.customerInfo.email,
          address1: order.customerInfo.address.line1,
          address2: order.customerInfo.address.line2,
          city: order.customerInfo.address.city,
          state_code: order.customerInfo.address.state,
          country_code: order.customerInfo.address.country,
          zip: order.customerInfo.address.zip,
        },
        items: [
          {
            sync_variant_id: order.artworkId, // Would be the sync variant ID
            quantity: order.quantity,
          },
        ],
        retail_costs: {
          currency: 'USD',
          subtotal: 25.00, // Would be calculated
          discount: 0,
          shipping: 5.99,
          tax: 0,
        },
      };

      const response = await this.request('/orders', 'POST', orderData);
      return response.result.id;
    } catch (error) {
      console.error('Failed to create Printful order:', error);
      return null;
    }
  }

  private getRetailPrice(productType: string): string {
    const prices: Record<string, number> = {
      'canvas': 89,
      'poster': 25,
      'shirt': 35,
      'mug': 18,
      'phone-case': 22,
      'sticker': 8,
    };
    return (prices[productType] || 25).toFixed(2);
  }

  private getVariantId(productType: string): number {
    // Printful variant IDs (would need to be mapped properly)
    const variants: Record<string, number> = {
      'canvas': 7679, // Canvas 16x20
      'poster': 1, // Poster 18x24
      'shirt': 71, // Unisex T-shirt
      'mug': 19, // White mug 11oz
      'phone-case': 266, // iPhone case
      'sticker': 641, // Kiss cut stickers
    };
    return variants[productType] || 1;
  }
}

// Printify API Integration
export class PrintifyAPI {
  private apiKey: string;
  private baseUrl = 'https://api.printify.com/v1';

  constructor() {
    this.apiKey = process.env.PRINTIFY_API_KEY || '';
  }

  private async request(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get available print providers
  async getPrintProviders(): Promise<any[]> {
    try {
      const response = await this.request('/catalog/print_providers.json');
      return response;
    } catch (error) {
      console.error('Failed to fetch Printify providers:', error);
      return [];
    }
  }

  // Create product with artwork
  async createProduct(artworkUrl: string, productType: string, artworkTitle: string): Promise<string | null> {
    try {
      const shopId = process.env.PRINTIFY_SHOP_ID;

      const productData = {
        title: `${artworkTitle} - ${productType}`,
        description: `Mystical artwork from 137studios featuring ${artworkTitle}`,
        blueprint_id: this.getBlueprintId(productType),
        print_provider_id: this.getPrintProviderId(productType),
        variants: [
          {
            id: this.getVariantId(productType),
            price: Math.round(this.getRetailPrice(productType) * 100), // Cents
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [this.getVariantId(productType)],
            placeholders: [
              {
                position: 'front',
                images: [
                  {
                    id: await this.uploadImage(artworkUrl),
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
              },
            ],
          },
        ],
      };

      const response = await this.request(`/shops/${shopId}/products.json`, 'POST', productData);
      return response.id;
    } catch (error) {
      console.error('Failed to create Printify product:', error);
      return null;
    }
  }

  // Upload image to Printify
  private async uploadImage(imageUrl: string): Promise<string> {
    try {
      const uploadData = {
        file_name: `artwork_${Date.now()}.jpg`,
        url: imageUrl,
      };

      const response = await this.request('/uploads/images.json', 'POST', uploadData);
      return response.id;
    } catch (error) {
      console.error('Failed to upload image to Printify:', error);
      throw error;
    }
  }

  // Submit order for fulfillment
  async createOrder(order: PrintOrder): Promise<string | null> {
    try {
      const shopId = process.env.PRINTIFY_SHOP_ID;

      const orderData = {
        external_id: order.orderId,
        shipping_method: 1, // Standard shipping
        send_shipping_notification: true,
        address_to: {
          first_name: order.customerInfo.name.split(' ')[0],
          last_name: order.customerInfo.name.split(' ').slice(1).join(' '),
          email: order.customerInfo.email,
          address1: order.customerInfo.address.line1,
          address2: order.customerInfo.address.line2,
          city: order.customerInfo.address.city,
          state_code: order.customerInfo.address.state,
          country_code: order.customerInfo.address.country,
          zip: order.customerInfo.address.zip,
        },
        line_items: [
          {
            product_id: order.artworkId,
            variant_id: this.getVariantId(order.productType),
            quantity: order.quantity,
          },
        ],
      };

      const response = await this.request(`/shops/${shopId}/orders.json`, 'POST', orderData);
      return response.id;
    } catch (error) {
      console.error('Failed to create Printify order:', error);
      return null;
    }
  }

  private getBlueprintId(productType: string): number {
    // Printify blueprint IDs
    const blueprints: Record<string, number> = {
      'canvas': 384, // Canvas
      'poster': 5, // Poster
      'shirt': 6, // T-shirt
      'mug': 15, // Mug
      'phone-case': 26, // Phone case
      'sticker': 642, // Sticker
    };
    return blueprints[productType] || 5;
  }

  private getPrintProviderId(productType: string): number {
    // Printify print provider IDs (example)
    return 1; // Would vary by product and region
  }

  private getVariantId(productType: string): number {
    // Printify variant IDs
    const variants: Record<string, number> = {
      'canvas': 63217, // 16x20 Canvas
      'poster': 17241, // 18x24 Poster
      'shirt': 17241, // Unisex T-shirt
      'mug': 46657, // White mug 11oz
      'phone-case': 45270, // iPhone case
      'sticker': 89731, // Kiss cut stickers
    };
    return variants[productType] || 17241;
  }

  private getRetailPrice(productType: string): number {
    const prices: Record<string, number> = {
      'canvas': 89,
      'poster': 25,
      'shirt': 35,
      'mug': 18,
      'phone-case': 22,
      'sticker': 8,
    };
    return prices[productType] || 25;
  }
}

// Unified Print Manager
export class PrintManager {
  private printful: PrintfulAPI;
  private printify: PrintifyAPI;

  constructor() {
    this.printful = new PrintfulAPI();
    this.printify = new PrintifyAPI();
  }

  // Create products on both platforms
  async createProductOnAllPlatforms(artworkUrl: string, productType: string, artworkTitle: string) {
    const results = await Promise.allSettled([
      this.printful.createProduct(artworkUrl, productType, artworkTitle),
      this.printify.createProduct(artworkUrl, productType, artworkTitle),
    ]);

    return {
      printful: results[0].status === 'fulfilled' ? results[0].value : null,
      printify: results[1].status === 'fulfilled' ? results[1].value : null,
    };
  }

  // Route orders to the best provider
  async fulfillOrder(order: PrintOrder, preferredProvider?: 'printful' | 'printify') {
    const provider = preferredProvider || 'printful'; // Default to Printful

    try {
      if (provider === 'printful') {
        return await this.printful.createOrder(order);
      } else {
        return await this.printify.createOrder(order);
      }
    } catch (error) {
      console.error(`Failed to fulfill order with ${provider}, trying backup...`);

      // Try the other provider as backup
      const backupProvider = provider === 'printful' ? 'printify' : 'printful';

      if (backupProvider === 'printful') {
        return await this.printful.createOrder(order);
      } else {
        return await this.printify.createOrder(order);
      }
    }
  }

  // Get product catalog from both providers
  async getAllProducts(): Promise<PrintProduct[]> {
    const [printfulProducts] = await Promise.allSettled([
      this.printful.getProducts(),
    ]);

    const products: PrintProduct[] = [];

    if (printfulProducts.status === 'fulfilled') {
      products.push(...printfulProducts.value);
    }

    return products;
  }
}

export default PrintManager;