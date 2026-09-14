import { AmazonIndiaProvider } from './amazon-india';
import { FlipkartProvider } from './flipkart';
import { CromaProvider } from './croma';
import { RelianceDigitalProvider } from './reliance-digital';
import {
  BaseShoppingProvider,
  ProviderConfig,
  ProductSearchParams,
  SearchResult,
  CategoryInfo,
  ProviderCapabilities,
  ProviderProduct,
  ProviderSpec,
  ProviderRetailer,
} from './base';
import { UnifiedProduct, UnifiedSearchResult, ProviderRegistryConfig } from '../types';
import { circuitBreakerRegistry, CircuitBreakerRegistry } from '../circuit-breaker';
import { requestDeduplicator, DeduplicationKeys } from '../request-dedup';

/**
 * Unified Shopping Provider Registry
 * Manages all data providers and provides a unified interface
 */

interface SearchProductsParams {
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

interface SearchProductsResult {
  products: Array<{
    externalId: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    manufacturer: string;
    model: string;
    releaseDate?: string;
    categorySlug: string;
    specs: Array<{
      key: string;
      value: string;
      unit?: string;
      displayOrder: number;
    }>;
    retailers: Array<{
      retailerId: string;
      price: number;
      currency: string;
      availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
      url: string;
      affiliateUrl?: string;
      lastChecked: string;
    }>;
    availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
    rating?: number;
    reviewCount?: number;
    lastUpdated: string;
    source: string;
  }>;
  totalCount: number;
  hasMore: boolean;
  query: {
    query: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
    limit?: number;
    offset?: number;
    filters?: Record<string, string[]>;
  };
}

interface ProductBySlugResult {
  externalId: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  manufacturer: string;
  model: string;
  releaseDate?: string;
  categorySlug: string;
  specs: Array<{
    key: string;
    value: string;
    unit?: string;
    displayOrder: number;
  }>;
  retailers: Array<{
    retailerId: string;
    price: number;
    currency: string;
    availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
    url: string;
    affiliateUrl?: string;
    lastChecked: string;
  }>;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
  rating?: number;
  reviewCount?: number;
  lastUpdated: string;
  source: string;
}

interface ProductsByCategoryResult {
  externalId: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  manufacturer: string;
  model: string;
  releaseDate?: string;
  categorySlug: string;
  specs: Array<{
    key: string;
    value: string;
    unit?: string;
    displayOrder: number;
  }>;
  retailers: Array<{
    retailerId: string;
    price: number;
    currency: string;
    availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
    url: string;
    affiliateUrl?: string;
    lastChecked: string;
  }>;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
  rating?: number;
  reviewCount?: number;
  lastUpdated: string;
  source: string;
}

export class ShoppingProviderRegistry {
  private providers: Map<string, any> = new Map();
  private config: Required<ProviderRegistryConfig>;
  private initialized = false;
  private circuitBreakers: CircuitBreakerRegistry;

  constructor(config: ProviderRegistryConfig = DEFAULT_CONFIG) {
    this.circuitBreakers = new CircuitBreakerRegistry({
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 30000, // 30 seconds before retry
      monitorWindow: 60000, // 1 minute window
    });
    
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      providers: {
        ...DEFAULT_CONFIG.providers,
        ...config.providers,
      },
      fallbackOrder: config.fallbackOrder || DEFAULT_CONFIG.fallbackOrder,
      deduplication: {
        ...DEFAULT_CONFIG.deduplication,
        ...config.deduplication,
      },
    };

    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Amazon India
    if (this.config.providers.amazonIndia.enabled) {
      try {
        const { AmazonIndiaProvider } = require('./amazon-india');
        const provider = new AmazonIndiaProvider();
        if (provider.isEnabled()) {
          this.providers.set('amazonIndia', provider);
        }
      } catch (e) {
        console.warn('[ShoppingRegistry] Failed to initialize Amazon India provider:', e);
      }
    }

    // Flipkart
    if (this.config.providers.flipkart.enabled) {
      try {
        const { FlipkartProvider } = require('./flipkart');
        const provider = new FlipkartProvider();
        if (provider.isEnabled?.() || provider.getConfigSync?.().enabled) {
          this.providers.set('flipkart', provider);
        }
      } catch (e) {
        console.warn('[ShoppingRegistry] Failed to initialize Flipkart provider:', e);
      }
    }

    // Croma
    if (this.config.providers.croma.enabled) {
      try {
        const { CromaProvider } = require('./croma');
        const provider = new CromaProvider();
        if (provider.isEnabled?.() || provider.getConfigSync?.().enabled) {
          this.providers.set('croma', provider);
        }
      } catch (e) {
        console.warn('[ShoppingRegistry] Failed to initialize Croma provider:', e);
      }
    }

    // Reliance Digital
    if (this.config.providers.relianceDigital.enabled) {
      try {
        const { RelianceDigitalProvider } = require('./reliance-digital');
        const provider = new RelianceDigitalProvider();
        if (provider.isEnabled?.()) {
          this.providers.set('relianceDigital', provider);
        }
      } catch (e) {
        console.warn('[ShoppingRegistry] Failed to initialize Reliance Digital provider:', e);
      }
    }

    this.initialized = true;
  }

  getProviders(): Map<string, any> {
    return this.providers;
  }

  getEnabledProviders(): Array<{ name: string; provider: any }> {
    const enabled: Array<{ name: string; provider: any }> = [];
    
    for (const [name, provider] of this.providers) {
      if (provider.isEnabled?.() || provider.getConfigSync?.().enabled || provider.getConfigSync?.().enabled) {
        enabled.push({ name, provider });
      }
    }

    // Sort by priority
    return enabled.sort((a, b) => {
      const configA = a.provider.getConfigSync?.() || a.provider.getConfig();
      const configB = b.provider.getConfigSync?.() || b.provider.getConfig();
      return (configA.priority || 999) - (configB.priority || 999);
    });
  }

  getProvider(name: string) {
    return this.providers.get(name);
  }

  getAllProviders() {
    return Array.from(this.providers.values());
  }

  async searchProducts(params: SearchProductsParams): Promise<SearchProductsResult> {
    // Use deduplication for identical concurrent requests
    const key = DeduplicationKeys.search(params);
    return requestDeduplicator.execute(
      key,
      async () => {
        const enabledProviders = this.getEnabledProviders();
        
        if (enabledProviders.length === 0) {
          return {
            products: [],
            totalCount: 0,
            hasMore: false,
            query: { query: '', limit: 20 },
          };
        }

        // Collect results from all enabled providers (with circuit breaker)
        const allResults: Array<{ name: string; results: SearchProductsResult }> = [];
        
        for (const { name, provider } of enabledProviders) {
          // Check circuit breaker before attempting request
          if (!this.circuitBreakers.canExecute(name)) {
            console.warn(`[ShoppingRegistry] Provider ${name} circuit is OPEN, skipping`);
            continue;
          }
          
          try {
            const results = await provider.searchProducts({
              query: params.query,
              categorySlug: params.categorySlug,
              minPrice: params.minPrice,
              maxPrice: params.maxPrice,
              brand: params.brand,
              sortBy: params.sortBy,
              limit: params.limit,
              offset: params.offset,
              filters: params.filters,
            });
            
            // Record success
            this.circuitBreakers.recordSuccess(name);
            
            if (results.products.length > 0) {
              allResults.push({ name, results });
            }
          } catch (error) {
            // Record failure
            this.circuitBreakers.recordFailure(name);
            console.warn(`[ShoppingRegistry] Provider ${name} failed:`, error);
          }
        }

        // Merge and deduplicate products from all providers
        const allProducts: ProviderProduct[] = [];
        for (const { name, results } of allResults) {
          const productsWithSource = results.products.map((p: ProviderProduct) => ({
            ...p,
            source: name,
          }));
          allProducts.push(...productsWithSource);
        }

        // Deduplicate products based on identity matching
        const deduplicatedProducts = this.deduplicateProducts(allProducts);

        // Sort by relevance/price if needed
        const sortedProducts = this.sortProducts(deduplicatedProducts, params.sortBy);

        return {
          products: sortedProducts as any,
          totalCount: sortedProducts.length,
          hasMore: false,
          query: params,
        };
      },
      { useCache: true, cacheTTL: 1000 * 60 * 2 } // Cache for 2 minutes
    );
  }

  /**
   * Deduplicate products based on identity matching
   * Matches products by manufacturer, model, and key specifications
   * Uses variant-aware matching with confidence scoring
   */
  private deduplicateProducts(products: ProviderProduct[]): ProviderProduct[] {
    if (!this.config.deduplication?.enabled) return products;

    const deduplicated: ProviderProduct[] = [];
    const productGroups: Map<string, ProviderProduct[]> = new Map();

    // Group products by potential identity matches
    for (const product of products) {
      const identityKey = this.createProductIdentityKey(product);
      const variantKey = this.createVariantKey(product);
      
      // Try exact match first, then variant match
      const matchKey = productGroups.has(identityKey) ? identityKey : variantKey;
      
      if (!productGroups.has(matchKey)) {
        productGroups.set(matchKey, []);
      }
      productGroups.get(matchKey)!.push(product);
    }

    // Merge products within each group
    for (const [, group] of productGroups) {
      if (group.length === 1) {
        deduplicated.push(group[0]);
        continue;
      }

      // Find the "best" product to use as base (most complete data)
      const sorted = group.sort((a, b) => {
        const aScore = this.calculateProductCompleteness(a);
        const bScore = this.calculateProductCompleteness(b);
        return bScore - aScore;
      });

      const base = sorted[0];
      const mergedRetailers = this.mergeAllRetailers(sorted.map(p => p.retailers));
      const mergedSpecs = this.mergeSpecs(sorted.map(p => p.specs));

      deduplicated.push({
        ...base,
        retailers: mergedRetailers,
        specs: mergedSpecs,
        // Use the best image if base doesn't have one
        imageUrl: base.imageUrl || sorted.find(p => p.imageUrl)?.imageUrl || '',
        // Use the best description
        description: base.description || sorted.find(p => p.description && p.description.length > base.description?.length)?.description || base.description,
      });
    }

    return deduplicated;
  }

  /**
   * Calculate product completeness score (higher = more complete data)
   */
  private calculateProductCompleteness(product: ProviderProduct): number {
    let score = 0;
    if (product.name) score += 10;
    if (product.description && product.description.length > 50) score += 15;
    if (product.imageUrl) score += 10;
    if (product.specs.length > 3) score += 20;
    if (product.retailers.length > 0) score += 15;
    if (product.rating) score += 10;
    if (product.reviewCount && product.reviewCount > 0) score += 10;
    if (product.releaseDate) score += 5;
    return score;
  }

  /**
   * Merge retailers from multiple product instances, keeping best price per retailer
   */
  private mergeAllRetailers(retailerLists: ProviderRetailer[][]): ProviderRetailer[] {
    const retailerMap = new Map<string, ProviderRetailer>();
    
    for (const retailers of retailerLists) {
      for (const r of retailers) {
        const existing = retailerMap.get(r.retailerId);
        if (!existing || (r.price && r.price < (existing.price || Infinity))) {
          retailerMap.set(r.retailerId, { ...r });
        }
      }
    }
    
    return Array.from(retailerMap.values());
  }

  /**
   * Merge specs from multiple product instances, keeping most detailed values
   */
  private mergeSpecs(specLists: ProviderSpec[][]): ProviderSpec[] {
    const specMap = new Map<string, ProviderSpec>();
    
    for (const specs of specLists) {
      for (const spec of specs) {
        const existing = specMap.get(spec.key);
        if (!existing || (spec.value && spec.value.length > (existing.value?.length || 0))) {
          specMap.set(spec.key, { ...spec });
        }
      }
    }
    
    return Array.from(specMap.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Create a normalized identity key for exact product matching
   */
  private createProductIdentityKey(product: ProviderProduct): string {
    const manufacturer = this.normalizeString(product.manufacturer || '');
    const model = this.normalizeModel(product.model || '');
    const category = product.categorySlug || '';
    
    return `${category}:${manufacturer}:${model}`;
  }

  /**
   * Create a variant key for fuzzy product matching
   * Handles cases like "MacBook Air M2 8/256" vs "MacBook Air M2 16/512"
   */
  private createVariantKey(product: ProviderProduct): string {
    const manufacturer = this.normalizeString(product.manufacturer || '');
    const model = this.normalizeModel(product.model || '');
    const category = product.categorySlug || '';
    
    // Extract base model without variant-specific specs
    const baseModel = this.extractBaseModel(model);
    
    return `${category}:${manufacturer}:${baseModel}`;
  }

  /**
   * Normalize string for comparison
   */
  private normalizeString(str: string): string {
    return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  }

  /**
   * Normalize model name for comparison
   * Handles common variations like "Gen", "Generation", etc.
   */
  private normalizeModel(model: string): string {
    return model
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '') // Keep spaces for word matching
      .replace(/\b(gen|generation|version|ver|v)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract base model name without variant-specific specifications
   * Example: "MacBook Air M2 8/256" -> "macbook air m2"
   * Example: "iPhone 15 Pro 256GB" -> "iphone 15 pro"
   */
  private extractBaseModel(normalizedModel: string): string {
    // Remove storage specs (e.g., "256gb", "512gb", "1tb", "8/256", "16/512")
    let base = normalizedModel
      .replace(/\d+\s*\/\s*\d+/g, '') // "8/256" format
      .replace(/\d+\s*gb/gi, '') // "256gb" format
      .replace(/\d+\s*tb/gi, '') // "1tb" format
      .replace(/\d+\s*mb/gi, '') // "64mb" format
      .trim();
    
    // Remove RAM specs (e.g., "8gb ram", "16gb")
    base = base
      .replace(/\d+\s*gb\s*(ram)?/gi, '')
      .trim();
    
    // Remove color variants if they appear at the end
    base = base
      .replace(/\b(space gray|midnight|starlight|silver|gold|blue|green|purple|red|black|white|graphite|sierra blue|alpine green|deep purple)\b/gi, '')
      .trim();
    
    // Remove common suffixes
    base = base
      .replace(/\b(with retina display|with m\d chip|wifi|cellular|gps)\b/gi, '')
      .trim();
    
    return base || normalizedModel; // Fallback to full model if extraction fails
  }

  /**
   * Merge retailers from two product lists, keeping best price per retailer
   */
  private mergeRetailers(existing: ProviderRetailer[], incoming: ProviderRetailer[]): ProviderRetailer[] {
    const retailerMap = new Map<string, ProviderRetailer>();
    
    // Add existing retailers
    for (const r of existing) {
      retailerMap.set(r.retailerId, { ...r });
    }
    
    // Merge incoming retailers, keeping lower price
    for (const r of incoming) {
      const existing = retailerMap.get(r.retailerId);
      if (!existing || (r.price && r.price < (existing.price || Infinity))) {
        retailerMap.set(r.retailerId, { ...r });
      }
    }
    
    return Array.from(retailerMap.values());
  }

  /**
   * Sort products by specified criteria
   */
  private sortProducts(products: ProviderProduct[], sortBy?: string): ProviderProduct[] {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => {
          const aMin = Math.min(...a.retailers.filter(r => r.price).map(r => r.price!));
          const bMin = Math.min(...b.retailers.filter(r => r.price).map(r => r.price!));
          return aMin - bMin;
        });
      case 'price_desc':
        return sorted.sort((a, b) => {
          const aMin = Math.min(...a.retailers.filter(r => r.price).map(r => r.price!));
          const bMin = Math.min(...b.retailers.filter(r => r.price).map(r => r.price!));
          return bMin - aMin;
        });
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      default:
        return sorted; // relevance - keep original order
    }
  }

  async getProductBySlug(slug: string): Promise<ProductBySlugResult | null> {
    return requestDeduplicator.execute(
      DeduplicationKeys.productDetail(slug),
      async () => {
        const enabledProviders = this.getEnabledProviders();

        for (const { name, provider } of enabledProviders) {
          // Check circuit breaker
          if (!this.circuitBreakers.canExecute(name)) {
            continue;
          }
          
          try {
            const product = await provider.getProductBySlug(slug);
            this.circuitBreakers.recordSuccess(name);
            
            if (product) {
              return {
                ...product,
                source: name,
              };
            }
          } catch (error) {
            this.circuitBreakers.recordFailure(name);
            console.warn(`[ShoppingRegistry] Provider ${name} failed to get product:`, error);
          }
        }

        return null;
      },
      { useCache: true, cacheTTL: 1000 * 60 * 5 } // Cache for 5 minutes
    );
  }

  async getProductsByCategory(categorySlug: string, limit = 50): Promise<ProductsByCategoryResult[]> {
    return requestDeduplicator.execute(
      DeduplicationKeys.categoryProducts(categorySlug, limit),
      async () => {
        const enabledProviders = this.getEnabledProviders();
        
        if (enabledProviders.length === 0) {
          return [];
        }

        // Try first provider, fallback to next if empty
        for (const { name, provider } of enabledProviders) {
          // Check circuit breaker
          if (!this.circuitBreakers.canExecute(name)) {
            continue;
          }
          
          try {
            const products = await provider.getProductsByCategory(categorySlug, limit);
            this.circuitBreakers.recordSuccess(name);
            
            if (products.length > 0) {
              return products.map((p: ProviderProduct) => ({ ...p, source: name }));
            }
          } catch (error) {
            this.circuitBreakers.recordFailure(name);
            console.warn(`[ShoppingRegistry] Provider ${name} failed for category:`, error);
          }
        }

        return [];
      },
      { useCache: true, cacheTTL: 1000 * 60 * 10 } // Cache for 10 minutes
    );
  }

  async getCategories(): Promise<Array<{
    slug: string;
    name: string;
    description: string;
    specSchema: Record<string, unknown>;
    productCount: number;
    source: string;
  }>> {
    const enabledProviders = this.getEnabledProviders();
    const allCategories = new Map<string, any>();

    for (const { name, provider } of enabledProviders) {
      // Check circuit breaker
      if (!this.circuitBreakers.canExecute(name)) {
        continue;
      }
      
      try {
        const categories = await provider.getCategories();
        this.circuitBreakers.recordSuccess(name);
        
        for (const cat of categories) {
          if (!allCategories.has(cat.slug)) {
            allCategories.set(cat.slug, { ...cat, source: name });
          }
        }
      } catch (error) {
        this.circuitBreakers.recordFailure(name);
        console.warn(`[ShoppingRegistry] Provider ${name} failed for categories:`, error);
      }
    }

    return Array.from(allCategories.values());
  }

  /**
   * Get circuit breaker status for all providers
   */
  getCircuitBreakerStatus(): Record<string, { status: string; failures: number; lastFailure: string | null }> {
    const status: Record<string, { status: string; failures: number; lastFailure: string | null }> = {};
    
    for (const [name] of this.providers) {
      const breaker = this.circuitBreakers.getBreaker(name);
      const state = breaker.getState();
      status[name] = {
        status: state.status,
        failures: state.failureCount,
        lastFailure: state.lastFailureTime ? new Date(state.lastFailureTime).toISOString() : null,
      };
    }
    
    return status;
  }

  /**
   * Reset circuit breaker for a specific provider
   */
  resetCircuitBreaker(providerName: string): void {
    this.circuitBreakers.reset(providerName);
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers(): void {
    this.circuitBreakers.resetAll();
  }

  getEnabledProviderNames(): string[] {
    return this.getEnabledProviders().map(p => p.name);
  }

  isInitialized(): boolean {
    return this.providers.size > 0;
  }
}

const DEFAULT_CONFIG: Required<ProviderRegistryConfig> = {
  providers: {
    amazonIndia: {
      enabled: true,
      priority: 1,
    },
    flipkart: {
      enabled: true,
      priority: 2,
    },
    croma: {
      enabled: true,
      priority: 3,
    },
    relianceDigital: {
      enabled: true,
      priority: 4,
    },
  },
  fallbackOrder: ['amazonIndia', 'flipkart', 'croma', 'relianceDigital'],
  deduplication: {
    enabled: true,
    matchThreshold: 0.85,
  },
};

// Export singleton instance
export const shoppingRegistry = new ShoppingProviderRegistry();

// Export types
export type {
  UnifiedProduct,
  UnifiedSearchResult,
  ProviderRegistryConfig,
};