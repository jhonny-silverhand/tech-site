import { BaseShoppingProvider } from './base';
import { 
  ProductSearchParams as SearchProductsParams,
  SearchResult as SearchProductsResult,
  ProviderProduct as ProductBySlugResult,
  ProviderProduct,
  CategoryInfo 
} from './base';

/**
 * Flipkart Product Provider (Affiliate API 1.0)
 * 
 * To use in production:
 * 1. Register for Flipkart Affiliate Program (affiliate.flipkart.com)
 * 2. Generate API Token from API > API Token in affiliate dashboard
 * 3. Set environment variables:
 *    - FLIPKART_AFFILIATE_ID (Tracking ID)
 *    - FLIPKART_AFFILIATE_TOKEN (API Token)
 * 
 * API Documentation: https://affiliate.flipkart.com/api-docs
 * 
 * For development/testing without API access, mock data is returned.
 */

interface FlipkartProduct {
  productId?: string;
  productTitle?: string;
  productUrl?: string;
  imageUrl?: string;
  productDescription?: string;
  category?: string;
  brand?: string;
  mrp?: number;
  sellingPrice?: number;
  discountPercentage?: number;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  productAttributes?: Record<string, string>;
}

interface FlipkartSearchResponse {
  products?: FlipkartProduct[];
  totalProducts?: number;
  error?: string;
}

interface FlipkartProductDetailResponse {
  product?: FlipkartProduct;
  error?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  laptop: 'computers/laptops',
  smartphone: 'mobiles',
  headphones: 'electronics/headphones',
  tablet: 'computers/tablets',
  monitor: 'computers/monitors',
  keyboard: 'computers/keyboards',
  mouse: 'computers/mice',
  smartwatch: 'electronics/smart-watches',
  camera: 'electronics/cameras',
  tv: 'electronics/televisions',
  gaming: 'electronics/gaming',
  components: 'computers/components',
};

export class FlipkartProvider {
  private config = {
    name: 'Flipkart',
    baseUrl: 'https://affiliate-api.flipkart.net',
    affiliateId: process.env.FLIPKART_AFFILIATE_ID,
    apiToken: process.env.FLIPKART_AFFILIATE_TOKEN,
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerHour: 1000,
    },
    timeout: 10000,
    enabled: !!(process.env.FLIPKART_AFFILIATE_ID && process.env.FLIPKART_AFFILIATE_TOKEN),
    priority: 2,
  };

  private requestCount = 0;
  private lastRequestTime = 0;

  getConfig() {
    return this.config;
  }

  getName(): string {
    return 'Flipkart';
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  async searchProducts(params: SearchProductsParams): Promise<SearchProductsResult> {
    if (!this.config.enabled) {
      return this.getMockSearchResults();
    }

    try {
      await this.rateLimit();

      const categoryPath = params.categorySlug ? CATEGORY_MAP[params.categorySlug] : '';
      const query = params.query || '';
      
      let url = `${this.config.baseUrl}/1.0/search.json`;
      const params_search = new URLSearchParams();
      
      if (query) {
        params_search.append('query', query);
      }
      if (categoryPath) {
        params_search.append('category', categoryPath);
      }
      if (params.minPrice) {
        params_search.append('minPrice', String(params.minPrice));
      }
      if (params.maxPrice) {
        params_search.append('maxPrice', String(params.maxPrice));
      }
      if (params.limit) {
        params_search.append('resultCount', String(Math.min(params.limit, 50)));
      }
      if (params.offset) {
        params_search.append('startIndex', String(params.offset));
      }

      url += `?${params_search.toString()}`;

      const response = await this.makeFlipkartRequest<FlipkartSearchResponse>(url);
      
      if (response.error) {
        throw new Error(`Flipkart API Error: ${response.error}`);
      }

      const products: ProviderProduct[] = (response.products || []).map((item, index) => 
        this.transformFlipkartProduct(item, index)
      ).filter(Boolean) as ProviderProduct[];

      return {
        products,
        totalCount: response.totalProducts || products.length,
        hasMore: (response.totalProducts || 0) > products.length,
        query: params,
      };
    } catch (error) {
      console.error('[FlipkartProvider] searchProducts error:', error);
      return this.getMockSearchResults();
    }
  }

  async getProductBySlug(slug: string): Promise<ProductBySlugResult | null> {
    if (!this.config.enabled) {
      return this.getMockProductBySlug();
    }

    try {
      await this.rateLimit();

      // Try to extract product ID from slug
      const productIdMatch = slug.match(/^fk-([a-zA-Z0-9]+)$/);
      const productId = productIdMatch ? productIdMatch[1] : slug;

      const url = `${this.config.baseUrl}/1.0/product.json?id=${productId}`;
      const response = await this.makeFlipkartRequest<FlipkartProductDetailResponse>(url);
      
      if (response.error) {
        throw new Error(`Flipkart API Error: ${response.error}`);
      }

      if (!response.product) return null;

      return this.transformFlipkartProduct(response.product, 0)!;
    } catch (error) {
      console.error('[FlipkartProvider] getProductBySlug error:', error);
      return this.getMockProductBySlug();
    }
  }

  async getProductsByCategory(categorySlug: string, limit = 50): Promise<ProviderProduct[]> {
    if (!this.config.enabled) {
      return this.getMockProductsByCategory(categorySlug, limit);
    }

    try {
      await this.rateLimit();

      const categoryPath = CATEGORY_MAP[categorySlug] || '';
      if (!categoryPath) return [];

      const url = `${this.config.baseUrl}/1.0/feeds/${this.config.affiliateId}/category/${categoryPath}.json?resultCount=${Math.min(limit, 50)}`;
      
      const response = await this.makeFlipkartRequest<FlipkartSearchResponse>(url);
      
      if (response.error) {
        throw new Error(`Flipkart API Error: ${response.error}`);
      }

      return (response.products || []).map((item, index) => 
        this.transformFlipkartProduct(item, index)
      ).filter(Boolean) as ProviderProduct[];
    } catch (error) {
      console.error('[FlipkartProvider] getProductsByCategory error:', error);
      return this.getMockProductsByCategory(categorySlug, limit);
    }
  }

  async getCategories(): Promise<CategoryInfo[]> {
    return [
      { slug: 'laptop', name: 'Laptops', description: 'Laptops and notebooks', specSchema: {}, productCount: 0 },
      { slug: 'smartphone', name: 'Smartphones', description: 'Mobile phones', specSchema: {}, productCount: 0 },
      { slug: 'headphones', name: 'Headphones', description: 'Headphones and earphones', specSchema: {}, productCount: 0 },
    ];
  }

  private async makeFlipkartRequest<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Fk-Affiliate-Id': this.config.affiliateId!,
        'Fk-Affiliate-Token': this.config.apiToken!,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(this.config.timeout),
    });

    this.requestCount++;
    this.lastRequestTime = Date.now();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flipkart API HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 60000 / (this.config.rateLimit?.requestsPerMinute || 60);
    
    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private transformFlipkartProduct(item: FlipkartProduct, index: number): ProviderProduct | null {
    if (!item.productId || !item.productTitle) return null;

    const title = item.productTitle;
    const manufacturer = item.brand || 'Unknown';
    const model = item.productAttributes?.Model || '';
    
    // Extract specs from product attributes
    const specs = this.extractSpecs(item);
    
    // Build retailer info
    const retailers: Array<{
      retailerId: string;
      price: number;
      currency: string;
      availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
      url: string;
      affiliateUrl?: string;
      lastChecked: string;
    }> = [];
    
    if (item.sellingPrice && item.productUrl) {
      retailers.push({
        retailerId: 'flipkart',
        price: item.sellingPrice,
        currency: 'INR',
        availability: item.availability?.toLowerCase().includes('in stock') ? 'in_stock' : 
                      item.availability?.toLowerCase().includes('pre') ? 'pre_order' : 'unknown',
        url: item.productUrl,
        affiliateUrl: this.buildAffiliateUrl(item.productUrl),
        lastChecked: new Date().toISOString(),
      });
    }

    if (item.mrp && item.mrp !== item.sellingPrice) {
      retailers.push({
        retailerId: 'flipkart-mrp',
        price: item.mrp,
        currency: 'INR',
        availability: 'unknown',
        url: item.productUrl || '',
        affiliateUrl: this.buildAffiliateUrl(item.productUrl),
        lastChecked: new Date().toISOString(),
      });
    }

    return {
      externalId: `fk-${item.productId}`,
      name: item.productTitle,
      slug: item.productId.toLowerCase(),
      description: item.productDescription || '',
      imageUrl: item.imageUrl || '',
      manufacturer,
      model,
      releaseDate: undefined,
      categorySlug: this.inferCategory(item),
      specs,
      retailers,
      availability: item.availability?.toLowerCase().includes('in stock') ? 'in_stock' : 
                    item.availability?.toLowerCase().includes('pre') ? 'pre_order' : 'unknown',
      rating: item.rating,
      reviewCount: item.reviewCount,
      lastUpdated: new Date().toISOString(),
    };
  }

  private buildAffiliateUrl(productUrl?: string): string | undefined {
    if (!productUrl) return undefined;
    // Flipkart affiliate URLs automatically include tracking ID
    return productUrl;
  }

  private extractSpecs(item: FlipkartProduct): Array<{ key: string; value: string; unit?: string; displayOrder: number }> {
    const specs: Array<{ key: string; value: string; unit?: string; displayOrder: number }> = [];
    let order = 1;

    if (!item.productAttributes) return specs;

    const attrs = item.productAttributes;
    
    // CPU/Processor
    if (attrs['Processor'] || attrs['Processor Name'] || attrs['CPU']) {
      specs.push({ key: 'cpu', value: attrs['Processor'] || attrs['Processor Name'] || attrs['CPU']!, displayOrder: order++ });
    }
    
    // RAM
    if (attrs['RAM'] || attrs['RAM Capacity'] || attrs['Memory']) {
      const ram = attrs['RAM'] || attrs['RAM Capacity'] || attrs['Memory'];
      const match = ram?.match(/(\d+)\s*(GB|MB)/i);
      if (match) {
        specs.push({ key: 'ram', value: match[1], unit: match[2].toUpperCase(), displayOrder: order++ });
      } else {
        specs.push({ key: 'ram', value: ram!, displayOrder: order++ });
      }
    }
    
    // Storage
    if (attrs['Storage'] || attrs['Internal Storage'] || attrs['ROM']) {
      const storage = attrs['Storage'] || attrs['Internal Storage'] || attrs['ROM'];
      const match = storage?.match(/(\d+)\s*(GB|TB)/i);
      if (match) {
        specs.push({ key: 'storage', value: match[1], unit: match[2].toUpperCase(), displayOrder: order++ });
      } else {
        specs.push({ key: 'storage', value: storage!, displayOrder: order++ });
      }
    }
    
    // Display
    if (attrs['Display Size'] || attrs['Screen Size']) {
      const match = (attrs['Display Size'] || attrs['Screen Size'])?.match(/(\d+\.?\d*)\s*(inch|")/i);
      if (match) {
        specs.push({ key: 'display', value: match[1], unit: 'inches', displayOrder: order++ });
      }
    }
    
    // Resolution
    if (attrs['Resolution'] || attrs['Screen Resolution']) {
      specs.push({ key: 'resolution', value: attrs['Resolution'] || attrs['Screen Resolution']!, displayOrder: order++ });
    }
    
    // Battery
    if (attrs['Battery Capacity'] || attrs['Battery']) {
      const match = (attrs['Battery Capacity'] || attrs['Battery'])?.match(/(\d+)\s*(mAh|mah)/i);
      if (match) {
        specs.push({ key: 'battery', value: match[1], unit: 'mAh', displayOrder: order++ });
      } else {
        specs.push({ key: 'battery', value: attrs['Battery Capacity'] || attrs['Battery']!, displayOrder: order++ });
      }
    }
    
    // Weight
    if (attrs['Weight'] || attrs['Weight (g)']) {
      specs.push({ key: 'weight', value: attrs['Weight'] || attrs['Weight (g)']!, unit: 'g', displayOrder: order++ });
    }

    // Camera
    if (attrs['Rear Camera'] || attrs['Primary Camera']) {
      specs.push({ key: 'camera', value: attrs['Rear Camera'] || attrs['Primary Camera']!, unit: 'MP', displayOrder: order++ });
    }

    return specs;
  }

  private inferCategory(item: FlipkartProduct): string {
    const category = item.category?.toLowerCase() || '';
    const title = item.productTitle?.toLowerCase() || '';
    
    if (category.includes('laptop') || category.includes('notebook') || title.includes('laptop') || title.includes('notebook')) {
      return 'laptop';
    }
    if (category.includes('mobile') || category.includes('phone') || title.includes('mobile') || title.includes('iphone') || title.includes('galaxy') || title.includes('pixel')) {
      return 'smartphone';
    }
    if (category.includes('headphone') || category.includes('earphone') || title.includes('headphone') || title.includes('earphone') || title.includes('airpod')) {
      return 'headphones';
    }
    if (category.includes('tablet') || title.includes('tablet') || title.includes('ipad')) {
      return 'tablet';
    }
    if (category.includes('monitor') || title.includes('monitor')) {
      return 'monitor';
    }
    if (category.includes('watch') || title.includes('watch')) {
      return 'smartwatch';
    }
    return 'electronics';
  }

  private getMockSearchResults(): SearchProductsResult {
    return {
      products: [
        {
          externalId: 'fk-iphone-15',
          name: 'iPhone 15',
          slug: 'iphone-15',
          description: 'Apple\'s mainstream iPhone with Dynamic Island, USB-C, and the A16 Bionic — great all-rounder for most people.',
          imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
          manufacturer: 'Apple',
          model: 'iPhone 15',
          releaseDate: '2023-09-22',
          categorySlug: 'smartphone',
          specs: [
            { key: 'cpu', value: 'Apple A16 Bionic', displayOrder: 1 },
            { key: 'ram', value: '6', unit: 'GB', displayOrder: 2 },
            { key: 'storage', value: '128', unit: 'GB', displayOrder: 3 },
            { key: 'display', value: '6.1', unit: 'inches', displayOrder: 4 },
            { key: 'camera', value: '48', unit: 'MP', displayOrder: 5 },
            { key: 'battery', value: '20', unit: 'hours', displayOrder: 6 },
            { key: 'weight', value: '171', unit: 'g', displayOrder: 7 },
          ],
          retailers: [
            { retailerId: 'flipkart', price: 69900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-iphone-15/p/itm...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
            { retailerId: 'amazon', price: 71900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0CH...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
          ],
          availability: 'in_stock',
          rating: 4.6,
          reviewCount: 2847,
          lastUpdated: new Date().toISOString(),
        },
        {
          externalId: 'fk-samsung-s24',
          name: 'Samsung Galaxy S24',
          slug: 'galaxy-s24',
          description: 'Compact flagship with 7 years of updates, excellent cameras, and Galaxy AI features — the Android flagship to beat.',
          imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
          manufacturer: 'Samsung',
          model: 'Galaxy S24',
          releaseDate: '2024-01-31',
          categorySlug: 'smartphone',
          specs: [
            { key: 'cpu', value: 'Exynos 2400 / Snapdragon 8 Gen 3', displayOrder: 1 },
            { key: 'ram', value: '8', unit: 'GB', displayOrder: 2 },
            { key: 'storage', value: '128', unit: 'GB', displayOrder: 3 },
            { key: 'display', value: '6.2', unit: 'inches', displayOrder: 4 },
            { key: 'camera', value: '50', unit: 'MP', displayOrder: 5 },
            { key: 'battery', value: '24', unit: 'hours', displayOrder: 6 },
          ],
          retailers: [
            { retailerId: 'flipkart', price: 69999, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/samsung-galaxy-s24/p/itm...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
            { retailerId: 'amazon', price: 72999, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0C...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
            { retailerId: 'samsung', price: 79999, currency: 'INR', availability: 'in_stock', url: 'https://samsung.com/in/smartphones/galaxy-s24', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
          ],
          availability: 'in_stock',
          rating: 4.5,
          reviewCount: 1823,
          lastUpdated: new Date().toISOString(),
        },
      ],
      totalCount: 2,
      hasMore: false,
      query: { query: '', limit: 20 },
    };
  }

  private getMockProductBySlug(): ProductBySlugResult {
    return {
      externalId: 'fk-iphone-15',
      name: 'iPhone 15',
      slug: 'iphone-15',
      description: 'Apple\'s mainstream iPhone with Dynamic Island, USB-C, and the A16 Bionic — great all-rounder for most people.',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
      manufacturer: 'Apple',
      model: 'iPhone 15',
      releaseDate: '2023-09-22',
      categorySlug: 'smartphone',
      specs: [
        { key: 'cpu', value: 'Apple A16 Bionic', displayOrder: 1 },
        { key: 'ram', value: '6', unit: 'GB', displayOrder: 2 },
        { key: 'storage', value: '128', unit: 'GB', displayOrder: 3 },
        { key: 'display', value: '6.1', unit: 'inches', displayOrder: 4 },
        { key: 'camera', value: '48', unit: 'MP', displayOrder: 5 },
        { key: 'battery', value: '20', unit: 'hours', displayOrder: 6 },
        { key: 'weight', value: '171', unit: 'g', displayOrder: 7 },
      ],
      retailers: [
        { retailerId: 'flipkart', price: 69900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-iphone-15/p/itm...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
        { retailerId: 'amazon', price: 71900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0CH...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
      ],
      availability: 'in_stock',
      rating: 4.6,
      reviewCount: 2847,
      lastUpdated: new Date().toISOString(),
    };
  }

  private getMockProductsByCategory(categorySlug: string, limit = 50): ProviderProduct[] {
    return this.getMockSearchResults().products
      .filter(p => p.categorySlug === categorySlug)
      .slice(0, limit);
  }
}