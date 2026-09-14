import type { Product, ProductSpec, Retailer, ProductRetailer, ProductCategory, BuyingGuide, BuyingGuideRecommendation } from '@/lib/types';

/**
 * Shopping-specific type definitions
 * Extends base types with shopping-specific fields
 */

export interface ProductWithSpecs extends Product {
  specs: ProductSpec[];
}

export interface ProductWithRetailers extends ProductWithSpecs {
  retailers: (ProductRetailer & { retailer: Retailer })[];
}

export interface BuyingGuideWithRecs extends BuyingGuide {
  recommendations: (BuyingGuideRecommendation & { product: Product })[];
}

export interface FeaturedProduct {
  category: string;
  product: ProductWithRetailers;
}

export interface ProductRecommendation {
  product: ProductWithRetailers;
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
}

export interface ScoreBreakdown {
  priceScore: number;
  priorityScore: number;
  useCaseScore: number;
  brandScore: number;
  ratingScore: number;
  specScore: number;
  total: number;
}

export interface RecommendationInput {
  categorySlug: string;
  budgetCents?: number;
  currency?: string;
  priorities: string[];
  useCases: string[];
  preferredBrands?: string[];
  excludedBrands?: string[];
  osPreferences?: string[];
  minRating?: number;
}

export interface RecommendationOutput {
  product: any;
  score: number;
  label: string;
  reasoning: string;
  pros: string[];
  cons: string[];
  scoreBreakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  priceScore: number;
  priorityScore: number;
  useCaseScore: number;
  brandScore: number;
  ratingScore: number;
  specScore: number;
  total: number;
}

export interface ShoppingQuery {
  query: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
}

export interface ParsedShoppingQuery {
  category?: string;
  categoryConfidence: number;
  budgetMin?: number;
  budgetMax?: number;
  priorities: string[];
  useCases: string[];
  preferredBrands: string[];
  excludedBrands: string[];
  osPreferences: string[];
  minRating?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  confidence: number;
  originalQuery: string;
  intent: 'shopping' | 'comparison' | 'research' | 'general';
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
  source: string;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  rate: number;
  rateTimestamp: string;
  source: string;
  isApproximate: boolean;
}

export interface ExchangeRateProvider {
  name: string;
  getRate(from: string, to: string): Promise<number | null>;
  getSupportedCurrencies(): string[];
  isEnabled(): boolean;
}

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
  priority: number;
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
  retailerId: string;
  price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
  url: string;
  affiliateUrl?: string;
  lastChecked: string;
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

export interface UnifiedProduct {
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

export interface UnifiedSearchResult {
  products: UnifiedProduct[];
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

export interface ProviderRegistryConfig {
  providers: {
    amazonIndia: {
      enabled: boolean;
      priority: number;
    };
    flipkart: {
      enabled: boolean;
      priority: number;
    };
    croma: {
      enabled: boolean;
      priority: number;
    };
    relianceDigital: {
      enabled: boolean;
      priority: number;
    };
  };
  fallbackOrder: string[];
  deduplication: {
    enabled: boolean;
    matchThreshold: number;
  };
}

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
  parsedQuery: any;
  recommendations: Array<{
    product: any;
    score: number;
    label: string;
    reasoning: string;
    pros: string[];
    cons: string[];
    scoreBreakdown: any;
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
  }>;
  specs: Array<{
    key: string;
    value: string;
    unit?: string;
    displayOrder: number;
  }>;
  buyingGuides: any[];
  relatedArticles: any[];
}

export interface ComparisonResult {
  products: any[];
  comparison: {
    specs: Record<string, Record<string, string>>;
    prices: Record<string, number>;
    verdict: string;
  };
}

export interface ProductComparisonInput {
  productSlugs: string[];
}

export interface BuyingGuideWithProducts extends BuyingGuide {
  recommendations: Array<BuyingGuideRecommendation & { product: any }>;
}