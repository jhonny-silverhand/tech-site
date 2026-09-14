import type { Product, ProductSpec, Retailer, ProductRetailer, ProductCategory } from '@/lib/types';

/**
 * Base interfaces for all shopping data providers
 * All providers must implement these interfaces
 */

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  timeout?: number;
  enabled: boolean;
  priority: number; // lower = higher priority
}

export interface ProductSearchParams {
  query: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
  filters?: Record<string, string[]>;
}

export interface ProviderProduct {
  externalId: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  manufacturer: string;
  model: string;
  releaseDate?: string;
  categorySlug: string;
  specs: ProviderSpec[];
  retailers: ProviderRetailer[];
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
  rating?: number;
  reviewCount?: number;
  lastUpdated: string;
}

export interface ProviderSpec {
  key: string;
  value: string;
  unit?: string;
  displayOrder: number;
}

export interface ProviderRetailer {
  retailerId: string; // maps to our retailer slug
  price: number; // in minor currency unit (paise for INR)
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
  url: string;
  affiliateUrl?: string;
  lastChecked: string;
}

export interface SearchResult {
  products: ProviderProduct[];
  totalCount: number;
  hasMore: boolean;
  query: ProductSearchParams;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  description: string;
  specSchema: Record<string, unknown>;
  productCount: number;
}

export interface PriceHistoryPoint {
  price: number;
  currency: string;
  retailerId: string;
  timestamp: string;
}

export interface ProviderCapabilities {
  supportsSearch: boolean;
  supportsCategoryBrowse: boolean;
  supportsProductDetail: boolean;
  supportsPriceHistory: boolean;
  supportsReviews: boolean;
  supportsSpecs: boolean;
  supportsImages: boolean;
  maxConcurrentRequests: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  supportedCategories: string[];
  supportedCurrencies: string[];
  supportedRegions: string[];
}

export interface ProviderHealth {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastCheck: string;
  errorRate: number;
  lastError?: string;
}

/**
 * Base class for all shopping data providers
 * All providers must extend this class
 */
export abstract class BaseShoppingProvider {
  protected config: ProviderConfig;
  protected health: ProviderHealth;
  protected requestCount: number = 0;
  protected errorCount: number = 0;
  protected lastRequestTime: number = 0;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.health = {
      status: 'healthy',
      latency: 0,
      lastCheck: new Date().toISOString(),
      errorRate: 0,
    };
  }

  getConfig(): ProviderConfig {
    return this.config;
  }

  getName(): string {
    return this.config.name;
  }

  getHealth(): ProviderHealth {
    return this.health;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getPriority(): number {
    return this.config.priority;
  }

  abstract getCapabilities(): ProviderCapabilities;

  abstract searchProducts(params: ProductSearchParams): Promise<SearchResult>;
  abstract getProductBySlug(slug: string): Promise<ProviderProduct | null>;
  abstract getProductsByCategory(categorySlug: string, limit?: number): Promise<ProviderProduct[]>;
  abstract getProductSpecs(productId: string): Promise<ProviderSpec[]>;
  abstract getProductRetailers(productId: string): Promise<ProviderRetailer[]>;
  abstract getCategories(): Promise<CategoryInfo[]>;

  /**
   * Optional methods - override if supported
   */
  getPriceHistory?(productId: string): Promise<PriceHistoryPoint[]> {
    return Promise.resolve([]);
  }

  getReviews?(productId: string): Promise<ProviderReview[]> {
    return Promise.resolve([]);
  }

  async checkHealth(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      // Default health check - try to get categories
      await this.getCategories();
      this.health.status = 'healthy';
      this.health.latency = Date.now() - start;
      this.health.lastCheck = new Date().toISOString();
      this.health.errorRate = this.errorCount / Math.max(this.requestCount, 1);
    } catch (error) {
      this.health.status = 'down';
      this.health.latency = Date.now() - start;
      this.health.lastCheck = new Date().toISOString();
      this.health.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.errorCount++;
    }
    return this.health;
  }

  protected async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 10000);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'User-Agent': 'tech-site/1.0',
      ...options.headers,
    };

    if (this.config.apiKey) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    this.requestCount++;
    const start = Date.now();

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const latency = Date.now() - start;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.errorCount++;
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Rate limiting helper
   */
  protected async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 60000 / (this.config.rateLimit?.requestsPerMinute || 60);

    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }
}

export interface ProviderReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}