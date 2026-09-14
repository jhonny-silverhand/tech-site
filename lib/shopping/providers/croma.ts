import { BaseShoppingProvider } from './base';
import { 
  ProductSearchParams as SearchProductsParams,
  SearchResult as SearchProductsResult,
  ProviderProduct as ProductBySlugResult,
  ProviderProduct,
  CategoryInfo 
} from './base';

/**
 * Croma Product Provider (via Apify Actor API)
 * 
 * NOTE: Croma doesn't have a public affiliate API. Options for production:
 * 1. Direct partnership with Croma (Infiniti Retail Ltd / Tata)
 * 2. Use third-party data aggregators like:
 *    - Apify Croma Product Scraper (sian.agency~croma-product-scraper)
 *    - Actowiz Solutions Croma Data Scraping
 *    - Bright Data Croma Scraper
 * 
 * For development/testing, we use mock data.
 * For production, configure CROMA_APIFY_TOKEN to use Apify Actor API.
 * 
 * Apify Actor: https://apify.com/sian.agency/croma-product-scraper
 * Documentation: https://apify.com/sian.agency/croma-product-scraper/api
 */

interface CromaProduct {
  productTitle?: string;
  brand?: string;
  model_number?: string;
  item_code?: string;
  ean?: string;
  price?: number;
  original_price?: number;
  currency?: string;
  discount?: string;
  rating?: number;
  review_count?: number;
  category?: string;
  breadcrumbs?: string[];
  images?: string[];
  highlights?: string[];
  specs?: Record<string, string>;
  description?: string;
  productUrl?: string;
}

interface CromaSearchResponse {
  data?: CromaProduct[];
  totalResults?: number;
  error?: string;
}

interface CromaProductDetailResponse {
  product?: CromaProduct;
  error?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  laptop: 'laptops',
  smartphone: 'mobile-phones',
  headphones: 'audio/headphones',
  tablet: 'tablets',
  monitor: 'computers/monitors',
  keyboard: 'computers/keyboards',
  mouse: 'computers/mice',
  smartwatch: 'wearables/smartwatches',
  camera: 'cameras',
  tv: 'televisions',
  gaming: 'gaming',
  components: 'components',
};

export class CromaProvider {
  private config = {
    name: 'Croma',
    baseUrl: 'https://api.apify.com/v2',
    actorId: 'sian.agency~croma-product-scraper',
    apiToken: process.env.CROMA_APIFY_TOKEN,
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerHour: 100,
    },
    timeout: 30000,
    enabled: !!process.env.CROMA_APIFY_TOKEN,
    priority: 3,
  };

  private requestCount = 0;
  private lastRequestTime = 0;

  getConfig() {
    return this.config;
  }

  getName(): string {
    return 'Croma';
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

      const keywords = params.query ? [params.query] : [];
      const categories = params.categorySlug ? [CATEGORY_MAP[params.categorySlug] || ''] : [];
      
      // Use Apify Actor run-sync for synchronous results
      const url = `${this.config.baseUrl}/acts/${this.config.actorId}/run-sync-get-dataset-items`;
      
      const body = {
        keywords: keywords.length > 0 ? keywords : undefined,
        categories: categories.length > 0 ? categories : undefined,
        scrapeMode: 'overview',
        sort: this.mapSort(params.sortBy),
        maxResults: params.limit || 20,
      };

      // Remove undefined values
      const cleanBody = Object.fromEntries(
        Object.entries(body).filter(([_, v]) => v !== undefined)
      );

      const response = await this.makeApifyRequest<CromaProduct[]>(url, cleanBody);
      
      const products: ProviderProduct[] = (response || []).map((item, index) => 
        this.transformCromaProduct(item, index)
      ).filter(Boolean) as ProviderProduct[];

      return {
        products,
        totalCount: products.length,
        hasMore: false,
        query: params,
      };
    } catch (error) {
      console.error('[CromaProvider] searchProducts error:', error);
      return this.getMockSearchResults();
    }
  }

  async getProductBySlug(slug: string): Promise<ProductBySlugResult | null> {
    if (!this.config.enabled) {
      return this.getMockProductBySlug();
    }

    try {
      await this.rateLimit();

      // For product detail, use detail mode with specific keyword
      const url = `${this.config.baseUrl}/acts/${this.config.actorId}/run-sync-get-dataset-items`;
      
      const body = {
        keywords: [slug],
        scrapeMode: 'detail',
        maxResults: 1,
      };

      const response = await this.makeApifyRequest<CromaProduct[]>(`${this.config.baseUrl}/acts/${this.config.actorId}/run-sync-get-dataset-items`, body);
      
      if (response.length === 0) return null;

      return this.transformCromaProduct(response[0], 0)!;
    } catch (error) {
      console.error('[CromaProvider] getProductBySlug error:', error);
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

      const url = `${this.config.baseUrl}/acts/${this.config.actorId}/run-sync-get-dataset-items`;
      
      const body = {
        categories: [categoryPath],
        scrapeMode: 'overview',
        sort: 'popular',
        maxResults: Math.min(limit, 50),
      };

      const response = await this.makeApifyRequest<CromaProduct[]>(`${this.config.baseUrl}/acts/${this.config.actorId}/run-sync-get-dataset-items`, body);
      
      return (response || []).map((item, index) => 
        this.transformCromaProduct(item, index)
      ).filter(Boolean) as ProviderProduct[];
    } catch (error) {
      console.error('[CromaProvider] getProductsByCategory error:', error);
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

  private async makeApifyRequest<T>(url: string, body: object): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    this.requestCount++;
    this.lastRequestTime = Date.now();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Apify API HTTP ${response.status}: ${errorText}`);
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

  private mapSort(sortBy?: string): string | undefined {
    const sortMap: Record<string, string> = {
      'price_asc': 'price_low',
      'price_desc': 'price_high',
      'rating': 'top_rated',
      'newest': 'newest',
      'relevance': 'relevance',
    };
    return sortMap[sortBy || ''];
  }

  private transformCromaProduct(item: CromaProduct, index: number): ProviderProduct | null {
    if (!item.productTitle) return null;

    const title = item.productTitle;
    const manufacturer = item.brand || 'Unknown';
    const model = item.model_number || '';
    
    // Extract specs
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
    
    if (item.price && item.productUrl) {
      retailers.push({
        retailerId: 'croma',
        price: Math.round(item.price * 100), // Convert to paise
        currency: item.currency || 'INR',
        availability: 'in_stock',
        url: item.productUrl || '',
        affiliateUrl: undefined,
        lastChecked: new Date().toISOString(),
      });
    }

    if (item.original_price && item.original_price !== item.price) {
      retailers.push({
        retailerId: 'croma-mrp',
        price: Math.round(item.original_price * 100),
        currency: 'INR',
        availability: 'unknown',
        url: item.productUrl || '',
        lastChecked: new Date().toISOString(),
      });
    }

    return {
      externalId: `croma-${item.item_code || item.ean || `product-${index}`}`,
      name: item.productTitle,
      slug: (item.item_code || item.ean || `croma-product-${index}`).toLowerCase(),
      description: item.description || item.highlights?.join(' ') || '',
      imageUrl: item.images?.[0] || '',
      manufacturer: item.brand || 'Unknown',
      model: item.model_number || '',
      releaseDate: undefined,
      categorySlug: this.inferCategory(item),
      specs: this.extractSpecs(item),
      retailers,
      availability: 'in_stock',
      rating: item.rating,
      reviewCount: item.review_count,
      lastUpdated: new Date().toISOString(),
    };
  }

  private extractSpecs(item: CromaProduct): Array<{ key: string; value: string; unit?: string; displayOrder: number }> {
    const specs: Array<{ key: string; value: string; unit?: string; displayOrder: number }> = [];
    let order = 1;

    if (!item.specs) return specs;

    const specsMap = item.specs;
    
    // CPU/Processor
    if (specsMap['Processor'] || specsMap['Processor Name'] || specsMap['CPU']) {
      specs.push({ key: 'cpu', value: specsMap['Processor'] || specsMap['Processor Name'] || specsMap['CPU']!, displayOrder: order++ });
    }
    
    // RAM
    if (specsMap['RAM'] || specsMap['RAM Capacity'] || specsMap['Memory']) {
      const ram = specsMap['RAM'] || specsMap['RAM Capacity'] || specsMap['Memory'];
      const match = ram?.match(/(\d+)\s*(GB|MB)/i);
      if (match) {
        specs.push({ key: 'ram', value: match[1], unit: match[2].toUpperCase(), displayOrder: order++ });
      } else {
        specs.push({ key: 'ram', value: ram!, displayOrder: order++ });
      }
    }
    
    // Storage
    if (specsMap['Storage'] || specsMap['Internal Storage'] || specsMap['ROM']) {
      const storage = specsMap['Storage'] || specsMap['Internal Storage'] || specsMap['ROM'];
      const match = storage?.match(/(\d+)\s*(GB|TB)/i);
      if (match) {
        specs.push({ key: 'storage', value: match[1], unit: match[2].toUpperCase(), displayOrder: order++ });
      } else {
        specs.push({ key: 'storage', value: storage!, displayOrder: order++ });
      }
    }
    
    // Display
    if (specsMap['Display Size'] || specsMap['Screen Size']) {
      const match = (specsMap['Display Size'] || specsMap['Screen Size'])?.match(/(\d+\.?\d*)\s*(inch|")/i);
      if (match) {
        specs.push({ key: 'display', value: match[1], unit: 'inches', displayOrder: order++ });
      }
    }
    
    // Resolution
    if (specsMap['Resolution'] || specsMap['Screen Resolution']) {
      specs.push({ key: 'resolution', value: specsMap['Resolution'] || specsMap['Screen Resolution']!, displayOrder: order++ });
    }
    
    // Battery
    if (specsMap['Battery Capacity'] || specsMap['Battery']) {
      const match = (specsMap['Battery Capacity'] || specsMap['Battery'])?.match(/(\d+)\s*(mAh|mah)/i);
      if (match) {
        specs.push({ key: 'battery', value: match[1], unit: 'mAh', displayOrder: order++ });
      } else {
        specs.push({ key: 'battery', value: specsMap['Battery Capacity'] || specsMap['Battery']!, displayOrder: order++ });
      }
    }
    
    // Weight
    if (specsMap['Weight'] || specsMap['Weight (g)']) {
      specs.push({ key: 'weight', value: specsMap['Weight'] || specsMap['Weight (g)']!, unit: 'g', displayOrder: order++ });
    }

    // Camera
    if (specsMap['Rear Camera'] || specsMap['Primary Camera']) {
      specs.push({ key: 'camera', value: specsMap['Rear Camera'] || specsMap['Primary Camera']!, unit: 'MP', displayOrder: order++ });
    }

    return specs;
  }

  private inferCategory(item: CromaProduct): string {
    const category = item.category?.toLowerCase() || '';
    const title = item.productTitle?.toLowerCase() || '';
    const breadcrumbs = item.breadcrumbs?.join(' ').toLowerCase() || '';
    const allText = `${category} ${title} ${breadcrumbs}`;
    
    if (allText.includes('laptop') || allText.includes('notebook')) return 'laptop';
    if (allText.includes('mobile') || allText.includes('phone') || allText.includes('smartphone')) return 'smartphone';
    if (allText.includes('headphone') || allText.includes('earphone') || allText.includes('earbud')) return 'headphones';
    if (allText.includes('tablet') || allText.includes('ipad')) return 'tablet';
    if (allText.includes('monitor') || allText.includes('display')) return 'monitor';
    if (allText.includes('watch') || allText.includes('smartwatch')) return 'smartwatch';
    if (allText.includes('camera') || allText.includes('dslr') || allText.includes('mirrorless')) return 'camera';
    if (allText.includes('tv') || allText.includes('television')) return 'tv';
    if (allText.includes('gaming') || allText.includes('console')) return 'gaming';
    return 'electronics';
  }

  private getMockSearchResults(): SearchProductsResult {
    return {
      products: [
        {
          externalId: 'croma-macbook-air-m2',
          name: 'MacBook Air (M2, 2022)',
          slug: 'macbook-air-m2-2022',
          description: 'Apple\'s fanless ultraportable with the M2 chip — exceptional battery life, silent operation, and enough power for most workflows.',
          imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
          manufacturer: 'Apple',
          model: 'MacBook Air 13" (M2)',
          releaseDate: '2022-07-15',
          categorySlug: 'laptop',
          specs: [
            { key: 'cpu', value: 'Apple M2', displayOrder: 1 },
            { key: 'gpu', value: 'Apple M2 8-core', displayOrder: 2 },
            { key: 'ram', value: '8', unit: 'GB', displayOrder: 3 },
            { key: 'storage', value: '256', unit: 'GB', displayOrder: 4 },
            { key: 'display', value: '13.6', unit: 'inches', displayOrder: 5 },
            { key: 'resolution', value: '2560x1664', displayOrder: 6 },
            { key: 'battery_life', value: '18', unit: 'hours', displayOrder: 7 },
            { key: 'weight', value: '1.24', unit: 'kg', displayOrder: 8 },
            { key: 'refresh_rate', value: '60', unit: 'Hz', displayOrder: 9 },
          ],
          retailers: [
            { retailerId: 'croma', price: 97900, currency: 'INR', availability: 'in_stock', url: 'https://croma.com/apple-macbook-air-m2', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
            { retailerId: 'amazon', price: 94900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0B3CJZL6H', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
            { retailerId: 'flipkart', price: 92900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-macbook-air-m2/p/itm...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
          ],
          availability: 'in_stock',
          rating: 4.5,
          reviewCount: 1247,
          lastUpdated: new Date().toISOString(),
        },
        {
          externalId: 'croma-dell-xps-13',
          name: 'Dell XPS 13 (2023)',
          slug: 'dell-xps-13-2023',
          description: 'Ultra-compact Windows ultraportable with 12th/13th Gen Intel chips, stunning display options, and premium build.',
          imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop',
          manufacturer: 'Dell',
          model: 'XPS 13 9320',
          releaseDate: '2023-02-01',
          categorySlug: 'laptop',
          specs: [
            { key: 'cpu', value: 'Intel Core i7-1260P', displayOrder: 1 },
            { key: 'ram', value: '16', unit: 'GB', displayOrder: 2 },
            { key: 'storage', value: '512', unit: 'GB', displayOrder: 3 },
            { key: 'display', value: '13.4', unit: 'inches', displayOrder: 4 },
            { key: 'resolution', value: '1920x1200', displayOrder: 5 },
            { key: 'battery_life', value: '12', unit: 'hours', displayOrder: 6 },
            { key: 'weight', value: '1.17', unit: 'kg', displayOrder: 7 },
            { key: 'refresh_rate', value: '60', unit: 'Hz', displayOrder: 8 },
          ],
          retailers: [
            { retailerId: 'croma', price: 112900, currency: 'INR', availability: 'in_stock', url: 'https://croma.com/dell-xps-13', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
            { retailerId: 'amazon', price: 108900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0BN...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
          ],
          availability: 'in_stock',
          rating: 4.3,
          reviewCount: 892,
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
      externalId: 'croma-macbook-air-m2',
      name: 'MacBook Air (M2, 2022)',
      slug: 'macbook-air-m2-2022',
      description: 'Apple\'s fanless ultraportable with the M2 chip — exceptional battery life, silent operation, and enough power for most workflows.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      manufacturer: 'Apple',
      model: 'MacBook Air 13" (M2)',
      releaseDate: '2022-07-15',
      categorySlug: 'laptop',
      specs: [
        { key: 'cpu', value: 'Apple M2', displayOrder: 1 },
        { key: 'gpu', value: 'Apple M2 8-core', displayOrder: 2 },
        { key: 'ram', value: '8', unit: 'GB', displayOrder: 3 },
        { key: 'storage', value: '256', unit: 'GB', displayOrder: 4 },
        { key: 'display', value: '13.6', unit: 'inches', displayOrder: 5 },
        { key: 'resolution', value: '2560x1664', displayOrder: 6 },
        { key: 'battery_life', value: '18', unit: 'hours', displayOrder: 7 },
        { key: 'weight', value: '1.24', unit: 'kg', displayOrder: 8 },
        { key: 'refresh_rate', value: '60', unit: 'Hz', displayOrder: 9 },
      ],
      retailers: [
        { retailerId: 'croma', price: 97900, currency: 'INR', availability: 'in_stock', url: 'https://croma.com/apple-macbook-air-m2', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
        { retailerId: 'amazon', price: 94900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0B3CJZL6H', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
        { retailerId: 'flipkart', price: 92900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-macbook-air-m2/p/itm...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
      ],
      availability: 'in_stock',
      rating: 4.5,
      reviewCount: 1247,
      lastUpdated: new Date().toISOString(),
    };
  }

  private getMockProductsByCategory(categorySlug: string, limit = 50): ProviderProduct[] {
    return this.getMockSearchResults().products
      .filter(p => p.categorySlug === categorySlug)
      .slice(0, limit);
  }
}