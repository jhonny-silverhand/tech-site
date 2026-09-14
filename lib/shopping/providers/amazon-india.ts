import { BaseShoppingProvider } from './base';
import { 
  ProductSearchParams as SearchProductsParams,
  SearchResult as SearchProductsResult,
  ProviderProduct as ProductBySlugResult,
  ProviderProduct,
  CategoryInfo 
} from './base';

/**
 * Amazon India Product Provider (PA-API 5.0)
 * 
 * To use in production:
 * 1. Sign up for Amazon Associates Program India (affiliate-program.amazon.in)
 * 2. Apply for Product Advertising API 5.0 access
 * 3. Get Access Key, Secret Key, and Partner Tag
 * 4. Set environment variables:
 *    - AMAZON_PA_API_ACCESS_KEY
 *    - AMAZON_PA_API_SECRET_KEY
 *    - AMAZON_PA_API_PARTNER_TAG
 *    - AMAZON_PA_API_REGION (optional, default: 'us-east-1')
 * 
 * For development/testing without PA-API access, mock data is returned.
 * 
 * NOTE: PA-API requires Amazon Associates approval + 10 qualifying sales in 30 days
 * to maintain access. See: https://affiliate-program.amazon.in/help/topic/api/registration
 */

interface PAAPISearchItemsRequest {
  Keywords?: string;
  SearchIndex?: string;
  BrowseNodeId?: string;
  ItemCount?: number;
  ItemPage?: number;
  MinPrice?: number;
  MaxPrice?: number;
  SortBy?: string;
  Resources?: string[];
  PartnerTag: string;
  PartnerType?: string;
  Marketplace?: string;
}

interface PAAPISearchItemsResponse {
  SearchResult?: {
    Items?: PAAPIItem[];
    TotalResults?: number;
    SearchURL?: string;
  };
  Errors?: PAAPIError[];
}

interface PAAPIGetItemsRequest {
  ItemIds: string[];
  Resources?: string[];
  PartnerTag: string;
  PartnerType?: string;
  Marketplace?: string;
}

interface PAAPIGetItemsResponse {
  ItemsResult?: {
    Items?: PAAPIItem[];
  };
  Errors?: PAAPIError[];
}

interface PAAPIItem {
  ASIN?: string;
  ItemInfo?: {
    Title?: { DisplayValue?: string };
    ByLineInfo?: { Brand?: { DisplayValue?: string }; Manufacturer?: { DisplayValue?: string } };
    ProductInfo?: { 
      Model?: { DisplayValue?: string };
      Color?: { DisplayValue?: string };
      Size?: { DisplayValue?: string };
    };
    TechnicalInfo?: { DisplayValue?: string };
    Features?: { DisplayValues?: string[] };
    Classifications?: { ProductGroup?: { DisplayValue?: string } };
    ContentInfo?: { DisplayValue?: string };
  };
  Images?: {
    Primary?: { Large?: { URL?: string; Height?: number; Width?: number }; Medium?: { URL?: string }; Small?: { URL?: string } };
    Variants?: Array<{ Large?: { URL?: string }; Medium?: { URL?: string }; Small?: { URL?: string } }>;
  };
  Offers?: {
    Listings?: Array<{
      Price?: { Amount?: number; Currency?: string; DisplayAmount?: string; Savings?: { Amount?: number; Percentage?: number } };
      Availability?: { Message?: string; Type?: string; MinOrderQuantity?: number; MaxOrderQuantity?: number };
      DeliveryInfo?: { IsAmazonFulfilled?: boolean; IsFreeShippingEligible?: boolean; ShippingCharges?: { Amount?: number; Currency?: string } };
      IsBuyBoxWinner?: boolean;
      MerchantInfo?: { Name?: string; HomePage?: string; SellerId?: string; FeedbackScore?: string; FeedbackCount?: number };
      SavingBasis?: { Amount?: number; Currency?: string; DisplayAmount?: string };
    }>;
    Summaries?: Array<{
      LowestPrice?: { Amount?: number; Currency?: string; DisplayAmount?: string };
      HighestPrice?: { Amount?: number; Currency?: string; DisplayAmount?: string };
      OfferCount?: number;
      Condition?: string;
    }>;
  };
  CustomerReviews?: {
    StarRating?: number;
    Count?: number;
  };
  BrowseNodeInfo?: {
    BrowseNodes?: Array<{
      Id?: string;
      Name?: string;
      Ancestor?: { Id?: string; Name?: string };
    }>;
  };
}

interface PAAPIError {
  Code?: string;
  Message?: string;
}

const SEARCH_INDEX_MAP: Record<string, string> = {
  laptop: 'Computers',
  smartphone: 'Electronics',
  headphones: 'Electronics',
  tablet: 'Electronics',
  monitor: 'Electronics',
  keyboard: 'Electronics',
  mouse: 'Electronics',
  smartwatch: 'Electronics',
  camera: 'Electronics',
  tv: 'Electronics',
  gaming: 'VideoGames',
  components: 'Electronics',
};

const SORT_MAP: Record<string, string> = {
  relevance: 'Relevance',
  price_asc: 'Price:LowToHigh',
  price_desc: 'Price:HighToLow',
  rating: 'AvgCustomerReviews',
  newest: 'NewestArrivals',
};

const RESOURCES = [
  'ItemInfo.Title',
  'ItemInfo.ByLineInfo',
  'ItemInfo.ProductInfo',
  'ItemInfo.TechnicalInfo',
  'ItemInfo.Features',
  'ItemInfo.Classifications',
  'ItemInfo.ContentInfo',
  'Images.Primary.Large',
  'Images.Primary.Medium',
  'Images.Primary.Small',
  'Images.Variants.Large',
  'Images.Variants.Medium',
  'Images.Variants.Small',
  'Offers.Listings.Price',
  'Offers.Listings.Availability',
  'Offers.Listings.DeliveryInfo',
  'Offers.Listings.IsBuyBoxWinner',
  'Offers.Listings.MerchantInfo',
  'Offers.Summaries.LowestPrice',
  'Offers.Summaries.HighestPrice',
  'Offers.Summaries.OfferCount',
  'CustomerReviews.StarRating',
  'CustomerReviews.Count',
  'BrowseNodeInfo.BrowseNodes',
];

export class AmazonIndiaProvider {
  private config = {
    name: 'Amazon India',
    baseUrl: 'https://webservices.amazon.in/paapi5',
    accessKey: process.env.AMAZON_PA_API_ACCESS_KEY,
    secretKey: process.env.AMAZON_PA_API_SECRET_KEY,
    partnerTag: process.env.AMAZON_PA_API_PARTNER_TAG,
    region: process.env.AMAZON_PA_API_REGION || 'us-east-1',
    rateLimit: {
      requestsPerSecond: 1,
      requestsPerMinute: 30,
    },
    timeout: 15000,
    enabled: !!(process.env.AMAZON_PA_API_ACCESS_KEY && process.env.AMAZON_PA_API_SECRET_KEY && process.env.AMAZON_PA_API_PARTNER_TAG),
    priority: 1,
  };

  private requestCount = 0;
  private lastRequestTime = 0;

  getConfig() {
    return this.config;
  }

  getName(): string {
    return 'Amazon India';
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  async searchProducts(params: SearchProductsParams): Promise<SearchProductsResult> {
    // For development without PA-API access, return mock data
    if (!this.config.enabled) {
      return this.getMockSearchResults();
    }

    try {
      await this.rateLimit();
      
      const searchIndex = params.categorySlug ? SEARCH_INDEX_MAP[params.categorySlug] : 'All';
      const sortBy = params.sortBy ? SORT_MAP[params.sortBy] : 'Relevance';
      
      const requestBody: PAAPISearchItemsRequest = {
        Keywords: params.query || undefined,
        SearchIndex: searchIndex,
        ItemCount: params.limit || 20,
        ItemPage: Math.floor((params.offset || 0) / (params.limit || 20)) + 1,
        MinPrice: params.minPrice ? Math.round(params.minPrice * 100) : undefined, // Convert to paise
        MaxPrice: params.maxPrice ? Math.round(params.maxPrice * 100) : undefined,
        SortBy: sortBy,
        Resources: RESOURCES,
        PartnerTag: this.config.partnerTag!,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.in',
      };

      if (params.brand) {
        requestBody.Keywords = `${params.brand} ${requestBody.Keywords || ''}`.trim();
      }

      const response = await this.makePAAPIRequest<PAAPISearchItemsResponse>('POST', '/searchitems', requestBody);
      
      if (response.Errors && response.Errors.length > 0) {
        throw new Error(`PA-API Error: ${response.Errors[0].Code} - ${response.Errors[0].Message}`);
      }

      const products: ProviderProduct[] = (response.SearchResult?.Items || []).map((item, index) => 
        this.transformPAAPIItem(item, index)
      ).filter(Boolean) as ProviderProduct[];

      return {
        products,
        totalCount: response.SearchResult?.TotalResults || products.length,
        hasMore: (response.SearchResult?.TotalResults || 0) > products.length,
        query: params,
      };
    } catch (error) {
      console.error('[AmazonIndiaProvider] searchProducts error:', error);
      // Fall back to mock data on error
      return this.getMockSearchResults();
    }
  }

  async getProductBySlug(slug: string): Promise<ProductBySlugResult | null> {
    if (!this.config.enabled) {
      return this.getMockProductBySlug();
    }

    try {
      await this.rateLimit();
      
      // Try to extract ASIN from slug if it looks like one
      const asinMatch = slug.match(/^amzn-([A-Z0-9]{10})$/);
      const asin = asinMatch ? asinMatch[1] : slug;
      
      const requestBody: PAAPIGetItemsRequest = {
        ItemIds: [asin],
        Resources: RESOURCES,
        PartnerTag: this.config.partnerTag!,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.in',
      };

      const response = await this.makePAAPIRequest<PAAPIGetItemsResponse>('POST', '/getitems', requestBody);
      
      if (response.Errors && response.Errors.length > 0) {
        throw new Error(`PA-API Error: ${response.Errors[0].Code} - ${response.Errors[0].Message}`);
      }

      const item = response.ItemsResult?.Items?.[0];
      if (!item) return null;

      return this.transformPAAPIItem(item, 0)!;
    } catch (error) {
      console.error('[AmazonIndiaProvider] getProductBySlug error:', error);
      return this.getMockProductBySlug();
    }
  }

  async getProductsByCategory(categorySlug: string, limit = 50): Promise<ProviderProduct[]> {
    if (!this.config.enabled) {
      return this.getMockProductsByCategory(categorySlug, limit);
    }

    try {
      await this.rateLimit();
      
      const searchIndex = SEARCH_INDEX_MAP[categorySlug] || 'All';
      const browseNodeId = this.getBrowseNodeId(categorySlug);
      
      const requestBody: PAAPISearchItemsRequest = {
        SearchIndex: searchIndex,
        BrowseNodeId: browseNodeId,
        ItemCount: limit,
        Resources: RESOURCES,
        PartnerTag: this.config.partnerTag!,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.in',
      };

      const response = await this.makePAAPIRequest<PAAPISearchItemsResponse>('POST', '/searchitems', requestBody);
      
      if (response.Errors && response.Errors.length > 0) {
        throw new Error(`PA-API Error: ${response.Errors[0].Code} - ${response.Errors[0].Message}`);
      }

      return (response.SearchResult?.Items || []).map((item, index) => 
        this.transformPAAPIItem(item, index)
      ).filter(Boolean) as ProviderProduct[];
    } catch (error) {
      console.error('[AmazonIndiaProvider] getProductsByCategory error:', error);
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

  private getBrowseNodeId(categorySlug: string): string | undefined {
    const browseNodes: Record<string, string> = {
      laptop: '1375424031', // Computers & Accessories > Laptops
      smartphone: '1389401031', // Electronics > Mobile Phones
      headphones: '1389432031', // Electronics > Headphones
      tablet: '1389412031', // Electronics > Tablets
      monitor: '1375431031', // Computers & Accessories > Monitors
      keyboard: '1375433031', // Computers & Accessories > Keyboards
      mouse: '1375434031', // Computers & Accessories > Mice
      smartwatch: '1389403031', // Electronics > Smartwatches
      camera: '1389405031', // Electronics > Cameras
      tv: '1389407031', // Electronics > TVs
      gaming: '468642', // Video Games
      components: '1375425031', // Computer Components
    };
    return browseNodes[categorySlug];
  }

  private async makePAAPIRequest<T>(method: string, path: string, body: object): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const payload = JSON.stringify(body);
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const date = timestamp.slice(0, 8);
    
    const canonicalHeaders = `content-type:application/json\nhost:webservices.amazon.in\nx-amz-date:${timestamp}\n`;
    const signedHeaders = 'content-type;host;x-amz-date';
    
    const hashedPayload = await this.sha256(payload);
    const canonicalRequest = `${method}\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;
    
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${await this.sha256(canonicalRequest)}`;
    
    const signingKey = await this.getSigningKey(this.config.secretKey!, date, this.config.region, 'ProductAdvertisingAPI');
    const signature = await this.hmacSha256(signingKey, stringToSign);
    
    const authorization = `${algorithm} Credential=${this.config.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Host': 'webservices.amazon.in',
        'X-Amz-Date': timestamp,
        'Authorization': authorization,
      },
      body: payload,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    this.requestCount++;
    this.lastRequestTime = Date.now();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PA-API HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  private async sha256(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async hmacSha256(key: CryptoKey, message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async getSigningKey(secretKey: string, date: string, region: string, service: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const kDate = await crypto.subtle.importKey('raw', encoder.encode(`AWS4${secretKey}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const dateKey = await crypto.subtle.sign('HMAC', kDate, encoder.encode(date));
    const regionKey = await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', dateKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), encoder.encode(region));
    const serviceKey = await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', regionKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), encoder.encode(service));
    return await crypto.subtle.importKey('raw', await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', serviceKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), encoder.encode('aws4_request')), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / (this.config.rateLimit?.requestsPerSecond || 1);
    
    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private transformPAAPIItem(item: PAAPIItem, index: number): ProviderProduct | null {
    if (!item.ASIN || !item.ItemInfo?.Title?.DisplayValue) return null;

    const title = item.ItemInfo.Title.DisplayValue;
    const manufacturer = item.ItemInfo.ByLineInfo?.Brand?.DisplayValue || 
                         item.ItemInfo.ByLineInfo?.Manufacturer?.DisplayValue || 'Unknown';
    const model = item.ItemInfo.ProductInfo?.Model?.DisplayValue || '';
    
    // Extract specs from technical info and features
    const specs = this.extractSpecs(item);
    
    // Extract retailer info from offers
    const retailers = this.extractRetailers(item);

    return {
      externalId: `amzn-${item.ASIN}`,
      name: title,
      slug: item.ASIN.toLowerCase(),
      description: item.ItemInfo.ContentInfo?.DisplayValue || item.ItemInfo.Features?.DisplayValues?.join(' ') || '',
      imageUrl: item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL || item.Images?.Primary?.Small?.URL || '',
      manufacturer,
      model,
      releaseDate: undefined,
      categorySlug: this.inferCategory(item),
      specs,
      retailers,
      availability: this.getAvailability(item),
      rating: item.CustomerReviews?.StarRating,
      reviewCount: item.CustomerReviews?.Count,
      lastUpdated: new Date().toISOString(),
    };
  }

  private extractSpecs(item: PAAPIItem): Array<{ key: string; value: string; unit?: string; displayOrder: number }> {
    const specs: Array<{ key: string; value: string; unit?: string; displayOrder: number }> = [];
    let order = 1;

    // Guard against undefined ItemInfo
    if (!item.ItemInfo) return specs;

    // CPU/Processor
    if (item.ItemInfo.TechnicalInfo?.DisplayValue) {
      specs.push({ key: 'cpu', value: item.ItemInfo.TechnicalInfo.DisplayValue, displayOrder: order++ });
    }

    // Extract from features
    if (item.ItemInfo.Features?.DisplayValues) {
      for (const feature of item.ItemInfo.Features.DisplayValues) {
        const lower = feature.toLowerCase();
        if (lower.includes('ram') || lower.includes('memory')) {
          const match = feature.match(/(\d+)\s*(gb|mb)/i);
          if (match) {
            specs.push({ key: 'ram', value: match[1], unit: match[2].toUpperCase(), displayOrder: order++ });
          }
        } else if (lower.includes('storage') || lower.includes('ssd') || lower.includes('hdd')) {
          const match = feature.match(/(\d+)\s*(gb|tb)/i);
          if (match) {
            specs.push({ key: 'storage', value: match[1], unit: match[2].toUpperCase(), displayOrder: order++ });
          }
        } else if (lower.includes('display') || lower.includes('screen') || lower.includes('inch')) {
          const match = feature.match(/(\d+\.?\d*)\s*(inch|")/i);
          if (match) {
            specs.push({ key: 'display', value: match[1], unit: 'inches', displayOrder: order++ });
          }
        } else if (lower.includes('resolution')) {
          const match = feature.match(/(\d+x\d+)/i);
          if (match) {
            specs.push({ key: 'resolution', value: match[1], displayOrder: order++ });
          }
        } else if (lower.includes('battery')) {
          const match = feature.match(/(\d+)\s*(hour|hr)/i);
          if (match) {
            specs.push({ key: 'battery_life', value: match[1], unit: 'hours', displayOrder: order++ });
          }
        } else if (lower.includes('weight')) {
          const match = feature.match(/(\d+\.?\d*)\s*(kg|lb|g)/i);
          if (match) {
            specs.push({ key: 'weight', value: match[1], unit: match[2], displayOrder: order++ });
          }
        } else if (lower.includes('refresh') || lower.includes('hz')) {
          const match = feature.match(/(\d+)\s*hz/i);
          if (match) {
            specs.push({ key: 'refresh_rate', value: match[1], unit: 'Hz', displayOrder: order++ });
          }
        }
      }
    }

    // Product info
    if (item.ItemInfo.ProductInfo?.Model?.DisplayValue) {
      specs.push({ key: 'model', value: item.ItemInfo.ProductInfo.Model.DisplayValue, displayOrder: order++ });
    }

    return specs;
  }

  private extractRetailers(item: PAAPIItem): Array<{
    retailerId: string;
    price: number;
    currency: string;
    availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
    url: string;
    affiliateUrl?: string;
    lastChecked: string;
  }> {
    const retailers: Array<{
      retailerId: string;
      price: number;
      currency: string;
      availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
      url: string;
      affiliateUrl?: string;
      lastChecked: string;
    }> = [];

    if (item.Offers?.Listings) {
      for (const listing of item.Offers.Listings) {
        if (listing.Price?.Amount && listing.Price.Currency) {
          const isAmazon = listing.IsBuyBoxWinner || listing.MerchantInfo?.Name?.includes('Amazon');
          const merchantName = listing.MerchantInfo?.Name || 'Amazon';
          
          retailers.push({
            retailerId: isAmazon ? 'amazon' : merchantName.toLowerCase().replace(/\s+/g, '-'),
            price: listing.Price.Amount,
            currency: listing.Price.Currency,
            availability: listing.Availability?.Message?.includes('In Stock') ? 'in_stock' : 
                          listing.Availability?.Message?.includes('Pre-order') ? 'pre_order' : 'unknown',
            url: `https://www.amazon.in/dp/${item.ASIN}`,
            affiliateUrl: `https://www.amazon.in/dp/${item.ASIN}?tag=${this.config.partnerTag}`,
            lastChecked: new Date().toISOString(),
          });
        }
      }
    }

    // Add summary offers
    if (item.Offers?.Summaries) {
      for (const summary of item.Offers.Summaries) {
        if (summary.LowestPrice?.Amount && summary.LowestPrice.Currency) {
          retailers.push({
            retailerId: 'amazon',
            price: summary.LowestPrice.Amount,
            currency: summary.LowestPrice.Currency,
            availability: 'in_stock',
            url: `https://www.amazon.in/dp/${item.ASIN}`,
            affiliateUrl: `https://www.amazon.in/dp/${item.ASIN}?tag=${this.config.partnerTag}`,
            lastChecked: new Date().toISOString(),
          });
        }
      }
    }

    // Deduplicate by retailerId
    const seen = new Set<string>();
    return retailers.filter(r => {
      if (seen.has(r.retailerId)) return false;
      seen.add(r.retailerId);
      return true;
    });
  }

  private inferCategory(item: PAAPIItem): string {
    if (!item.ItemInfo) return 'electronics';
    const productGroup = item.ItemInfo.Classifications?.ProductGroup?.DisplayValue?.toLowerCase() || '';
    const browseNodes = item.BrowseNodeInfo?.BrowseNodes || [];
    
    if (productGroup.includes('laptop') || productGroup.includes('notebook') || browseNodes.some(n => n.Name?.toLowerCase().includes('laptop'))) {
      return 'laptop';
    }
    if (productGroup.includes('phone') || productGroup.includes('mobile') || browseNodes.some(n => n.Name?.toLowerCase().includes('phone'))) {
      return 'smartphone';
    }
    if (productGroup.includes('headphone') || productGroup.includes('headset') || browseNodes.some(n => n.Name?.toLowerCase().includes('headphone'))) {
      return 'headphones';
    }
    if (productGroup.includes('tablet') || browseNodes.some(n => n.Name?.toLowerCase().includes('tablet'))) {
      return 'tablet';
    }
    if (productGroup.includes('monitor') || browseNodes.some(n => n.Name?.toLowerCase().includes('monitor'))) {
      return 'monitor';
    }
    return 'electronics';
  }

  private getAvailability(item: PAAPIItem): 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown' {
    if (item.Offers?.Listings) {
      for (const listing of item.Offers.Listings) {
        if (listing.Availability?.Message?.includes('In Stock')) return 'in_stock';
        if (listing.Availability?.Message?.includes('Pre-order')) return 'pre_order';
        if (listing.Availability?.Message?.includes('Limited')) return 'limited';
      }
    }
    return 'unknown';
  }

  // Mock data methods for development without PA-API access
  private getMockSearchResults(): SearchProductsResult {
    return {
      products: [
        {
          externalId: 'amzn-B0B3CJZL6H',
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
            { retailerId: 'amazon', price: 94900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0B3CJZL6H', affiliateUrl: `https://amazon.in/dp/B0B3CJZL6H?tag=${this.config.partnerTag}`, lastChecked: new Date().toISOString() },
            { retailerId: 'flipkart', price: 92900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-macbook-air-m2/p/itm...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
            { retailerId: 'croma', price: 97900, currency: 'INR', availability: 'in_stock', url: 'https://croma.com/apple-macbook-air-m2', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
          ],
          availability: 'in_stock',
          rating: 4.5,
          reviewCount: 1247,
          lastUpdated: new Date().toISOString(),
        },
        {
          externalId: 'amzn-B0BN...',
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
            { retailerId: 'amazon', price: 108900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0BN...', affiliateUrl: `https://amazon.in/dp/B0BN...?tag=${this.config.partnerTag}`, lastChecked: new Date().toISOString() },
            { retailerId: 'croma', price: 112900, currency: 'INR', availability: 'in_stock', url: 'https://croma.com/dell-xps-13', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
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
      externalId: 'amzn-B0B3CJZL6H',
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
        { retailerId: 'amazon', price: 94900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0B3CJZL6H', affiliateUrl: `https://amazon.in/dp/B0B3CJZL6H?tag=${this.config.partnerTag}`, lastChecked: new Date().toISOString() },
        { retailerId: 'flipkart', price: 92900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-macbook-air-m2/p/itm...', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
        { retailerId: 'croma', price: 97900, currency: 'INR', availability: 'in_stock', url: 'https://croma.com/apple-macbook-air-m2', affiliateUrl: undefined, lastChecked: new Date().toISOString() },
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