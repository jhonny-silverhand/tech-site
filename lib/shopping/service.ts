import { parseShoppingQuery, ParsedShoppingQuery } from './query-parser';
import { shoppingRegistry } from './providers';
import { compareRetailerPrices } from './currency';
import type { ProductWithRetailers, ProductRecommendation, RecommendationInput as RecInput } from './types';
import { getRecommendations, RecommendationInput } from '@/lib/products';

/**
 * Unified Shopping Intelligence Service
 * Orchestrates query parsing, product search, recommendations, and currency conversion
 */

export interface ShoppingRequest {
  query?: string;
  categorySlug?: string;
  budgetMin?: number;
  budgetMax?: number;
  priorities?: string[];
  useCases?: string[];
  preferredBrands?: string[];
  excludedBrands?: string[];
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
}

export interface ShoppingResponse {
  query: ParsedShoppingQuery;
  recommendations: Array<{
    product: any;
    score: number;
    label: string;
    reasoning: string;
    pros: string[];
    cons: string[];
    scoreBreakdown: {
      priceScore: number;
      priorityScore: number;
      useCaseScore: number;
      brandScore: number;
      ratingScore: number;
      specScore: number;
      total: number;
    };
  }>;
  searchResults: Array<{
    product: any;
    source: string;
  }>;
  buyingGuides: any[];
  metadata: {
    totalProducts: number;
    searchTimeMs: number;
    providersUsed: string[];
    timestamp: string;
  };
}

export interface ProductDetailData {
    cheapest: any;
    mostExpensive: any;
    averagePrice: number;
    priceRange: { min: number; max: number };
    savings: number;
    savingsPercent: number;
    allPrices: Array<{
      name: string;
      price: number;
      currency: string;
      availability: string;
    }>;
    relatedArticles: Array<{
      title: string;
      slug: string;
    }>;
}

export class ShoppingService {
  private static instance: ShoppingService;

  static getInstance(): ShoppingService {
    if (!ShoppingService.instance) {
      ShoppingService.instance = new ShoppingService();
    }
    return ShoppingService.instance;
  }

/**
   * Main entry point: process a shopping query and return recommendations
   */
  async processShoppingQuery(request: ShoppingRequest): Promise<ShoppingResponse> {
    const startTime = Date.now();
    // 1. Parse the query
    const parsedQuery = request.query 
      ? (await import('./query-parser')).parseShoppingQuery(request.query)
      : (await import('./query-parser')).parseShoppingQuery('');

    // 2. Determine category if not explicitly provided
    const categorySlug = request.categorySlug || 
      (await import('./query-parser')).parseShoppingQuery(request.query || '').category ||
      'laptop';

    // 3. Get recommendations using the recommendation engine
    const recommendationInput: RecommendationInput = {
      categorySlug: request.categorySlug || 'laptop',
      budgetCents: request.budgetMax ? request.budgetMax * 100 : undefined,
      currency: 'INR',
      priorities: request.priorities || [],
      useCases: request.useCases || [],
      preferredBrands: request.preferredBrands || [],
      excludedBrands: request.excludedBrands || [],
      osPreferences: [],
    };

    // Override with parsed query data
    if (parsedQuery.budgetMax) {
      recommendationInput.budgetCents = parsedQuery.budgetMax * 100;
    }
    if (parsedQuery.priorities.length > 0) {
      recommendationInput.priorities = parsedQuery.priorities;
    }
    if (parsedQuery.useCases.length > 0) {
      recommendationInput.useCases = parsedQuery.useCases;
    }
    if (parsedQuery.preferredBrands.length > 0) {
      recommendationInput.preferredBrands = parsedQuery.preferredBrands;
    }

    // 4. Get recommendations
    const recommendations = await getRecommendations(recommendationInput);

    // 4b. Get search results from all providers
    const searchResults = await shoppingRegistry.searchProducts({
      query: request.query || '',
      categorySlug: categorySlug,
      minPrice: request.budgetMin,
      maxPrice: request.budgetMax,
      sortBy: request.sortBy,
      limit: request.limit || 20,
      offset: request.offset || 0,
    });

    // 5. Get buying guides for the category
    const { getBuyingGuides } = await import('../products');
    const buyingGuides = await getBuyingGuides(categorySlug);

    const searchTimeMs = Date.now() - startTime;

    // Format recommendations with price conversion
    const formattedRecommendations = await this.formatRecommendations(recommendations);

    return {
      query: parsedQuery,
      recommendations: formattedRecommendations,
      searchResults: searchResults.products.map(p => ({ product: p, source: p.source })),
      buyingGuides: buyingGuides.slice(0, 3),
      metadata: {
        totalProducts: searchResults.totalCount,
        searchTimeMs: Date.now() - startTime,
        providersUsed: [], // Would be populated from registry
        timestamp: new Date().toISOString(),
      },
    };
  }

  private async formatRecommendations(recommendations: any[]) {
    // Add price conversion for display
    const { CurrencyConverter } = await import('./currency');
    const converter = new (await import('./currency')).CurrencyConverter();

    return recommendations.map(rec => {
      const minPrice = Math.min(
        ...rec.product.retailers
          .filter((r: { price_cents?: number }) => r.price_cents)
          .map((r: { price_cents: number }) => r.price_cents / 100)
      );
      return {
        ...rec,
        product: {
          ...rec.product,
          formattedPrice: rec.product.retailers.some((r: { price_cents?: number }) => r.price_cents)
            ? `₹${minPrice.toLocaleString('en-IN')}`
            : 'Price not available',
        },
      };
    });
  }

  /**
   * Get detailed product data for product page
   */
  async getProductDetail(slug: string): Promise<{
    product: any;
    retailers: Array<{
      name: string;
      price: number;
      currency: string;
      availability: string;
      url: string;
      affiliateUrl?: string;
      logoUrl?: string;
      isOfficial: boolean;
      lastChecked: string;
      priceUpdatedAt?: string;
    }>;
    specs: Array<{
      key: string;
      value: string;
      unit?: string;
      displayOrder: number;
    }>;
    buyingGuides: any[];
    relatedProducts: any[];
    priceComparison: {
      cheapest: any;
      mostExpensive: any;
      averagePrice: number;
      priceRange: { min: number; max: number };
      savings: number;
      savingsPercent: number;
      allPrices: Array<{
        name: string;
        price: number;
        currency: string;
        availability: string;
      }>;
    };
relatedArticles: Array<{
    title: string;
    slug: string;
  }>;
}> {
    const { getProductWithRetailers, getBuyingGuidesForProduct } = await import('../products');
    const { CurrencyConverter: CurrencyConverter2 } = await import('./currency');

    const product = await (await import('../products')).getProductWithRetailers(slug);
    if (!product) return null as any;

    const buyingGuides = await (await import('../products')).getBuyingGuidesForProduct(product.id);
    
    // Format retailers with price conversion
    const converter = new CurrencyConverter2();

    const availableRetailers = product.retailers
      .filter(r => r.price_cents !== null && r.availability !== 'out_of_stock')
      .sort((a, b) => (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity));

    const bestPrice = availableRetailers[0];
    const priceRange = availableRetailers.length > 1
      ? `₹${(availableRetailers[0].price_cents! / 100).toLocaleString()} – ₹${(availableRetailers[availableRetailers.length - 1].price_cents! / 100).toLocaleString()}`
      : bestPrice
        ? `₹${(bestPrice.price_cents! / 100).toLocaleString()}`
        : 'Price not available';

    const priceComparison = {
      cheapest: availableRetailers[0] || null,
      mostExpensive: availableRetailers[availableRetailers.length - 1] || null,
      averagePrice: availableRetailers.length > 0
        ? Math.round(availableRetailers.reduce((a, b) => a + (b.price_cents || 0), 0) / availableRetailers.length / 100)
        : 0,
      priceRange: {
        min: (availableRetailers[0]?.price_cents ?? 0) / 100,
        max: (availableRetailers[availableRetailers.length - 1]?.price_cents ?? 0) / 100,
      },
      savings: availableRetailers.length > 1 
        ? Math.round((availableRetailers[availableRetailers.length - 1].price_cents! - availableRetailers[0].price_cents!) / 100)
        : 0,
      savingsPercent: availableRetailers.length > 1
        ? Math.round(((availableRetailers[availableRetailers.length - 1].price_cents! - availableRetailers[0].price_cents!) / availableRetailers[availableRetailers.length - 1].price_cents!) * 100)
        : 0,
      allPrices: availableRetailers.map(pr => ({
        name: pr.retailer.name,
        price: pr.price_cents ? pr.price_cents / 100 : 0,
        currency: pr.currency,
        availability: pr.availability,
      })),
    };

    // Format retailers with price freshness
    const { CurrencyConverter } = await import('./currency');
    const retailers = product.retailers.map(r => ({
      name: r.retailer.name,
      price: r.price_cents ? r.price_cents / 100 : 0,
      currency: r.currency,
      availability: r.availability,
      url: r.url,
      affiliateUrl: r.affiliate_url ?? undefined,
      logoUrl: r.retailer.logo_url ?? undefined,
      isOfficial: r.retailer.is_official,
      lastChecked: r.last_checked || r.updated_at || new Date().toISOString(),
      priceUpdatedAt: r.last_checked ?? undefined,
    }));

    return {
      product: {
        ...product,
        formattedPrice: priceRange,
      },
      retailers,
      specs: product.specs.map(s => ({
        key: s.spec_key,
        value: s.spec_value,
        unit: s.unit ?? undefined,
        displayOrder: s.display_order,
      })),
      buyingGuides: [],
      relatedProducts: [],
      priceComparison,
      relatedArticles: [],
    };
  }

  /**
   * Compare products
   */
async compareProducts(productSlugs: string[]) {
    const { getProductWithRetailers } = await import('../products');
    
    const products = await Promise.all(
      productSlugs.slice(0, 4).map(slug => getProductWithRetailers(slug))
    );
    
    const validProducts = products.filter(Boolean);
    
    if (validProducts.length < 2) {
      throw new Error('Need at least 2 valid products to compare');
    }

    // Get all unique spec keys
    const allSpecKeys = new Set<string>();
    validProducts.forEach((p: any) => {
      p.specs.forEach((s: any) => allSpecKeys.add(s.spec_key));
    });

    const specKeys = Array.from(allSpecKeys);
    
    // Build comparison data
    const comparison = {
      specs: {} as Record<string, Record<string, string>>,
      prices: {} as Record<string, number>,
      verdict: '',
    };

    // For now, return basic structure
    return {
      products: validProducts,
      comparison: {
        specs: {},
        prices: {},
        verdict: 'Comparison feature under development',
      },
    };
  }

  /**
   * Get buying guides for a category
   */
  async getBuyingGuides(categorySlug?: string): Promise<any[]> {
    const { getBuyingGuides } = await import('../products');
    return getBuyingGuides(categorySlug);
  }

  /**
   * Get personalized recommendations for logged-in user
   */
  async getPersonalizedRecommendations(userId: string): Promise<any[]> {
    // Would use user's followed topics, reading history, etc.
    return [];
  }
}

// Export singleton
export const shoppingService = ShoppingService.getInstance();

// Export helper functions
export async function searchProducts(query: string, options?: {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}) {
  const service = ShoppingService.getInstance();
  return service.processShoppingQuery({ query, ...options });
}

export async function getRecommendationsForCategory(categorySlug: string, options?: {
  budgetMax?: number;
  priorities?: string[];
  useCases?: string[];
}) {
  const service = ShoppingService.getInstance();
  return service.processShoppingQuery({
    categorySlug,
    budgetMax: options?.budgetMax,
    priorities: options?.priorities,
    useCases: options?.useCases,
  });
}

export async function getProductComparison(slugs: string[]) {
  const service = ShoppingService.getInstance();
  return service.compareProducts(slugs);
}

export async function getProductDetails(slug: string) {
  const service = ShoppingService.getInstance();
  return service.getProductDetail(slug);
}

export async function getBuyingGuides(categorySlug?: string) {
  const service = ShoppingService.getInstance();
  return service.getBuyingGuides(categorySlug);
}