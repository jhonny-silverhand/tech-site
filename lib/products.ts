import { createClient } from './supabase/server';
import { withTimeout, SUPABASE_CALL_TIMEOUT_MS } from './with-timeout';
import { isSupabaseConfigured } from './supabase/config';
import { getSeedProducts, getSeedProductsByCategory, getSeedProductWithRetailers, getSeedRetailers } from '@/content/seed-products';
import type { Product, ProductSpec, Retailer, ProductRetailer, ProductCategory, BuyingGuide, BuyingGuideRecommendation } from './types';

export interface ProductWithSpecs extends Product {
  specs: ProductSpec[];
}

export interface ProductWithRetailers extends ProductWithSpecs {
  retailers: (ProductRetailer & { retailer: Retailer })[];
}

export interface BuyingGuideWithRecs extends BuyingGuide {
  recommendations: (BuyingGuideRecommendation & { product: Product })[];
}

// ============ Product Categories ============

export async function getProductCategories(): Promise<ProductCategory[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from('product_categories').select('*').order('name');
      if (data && data.length > 0) {
        return data as ProductCategory[];
      }
    } catch (err) {
      console.error('[products] getProductCategories Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed categories
  return [
    { slug: 'laptop', name: 'Laptops', description: 'Notebooks, ultrabooks, and gaming laptops', spec_schema: {}, created_at: new Date().toISOString() },
    { slug: 'smartphone', name: 'Smartphones', description: 'Mobile phones and phablets', spec_schema: {}, created_at: new Date().toISOString() },
    { slug: 'headphones', name: 'Headphones', description: 'Over-ear, on-ear, and earbuds', spec_schema: {}, created_at: new Date().toISOString() },
  ] as ProductCategory[];
}

export async function getProductCategory(slug: string): Promise<ProductCategory | null> {
  const categories = await getProductCategories();
  return categories.find(c => c.slug === slug) ?? null;
}

// ============ Products ============

export async function getProductsByCategory(categorySlug: string, limit = 50): Promise<Product[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', categorySlug)
        .eq('status', 'active')
        .order('name')
        .limit(limit);
      
      // If we got products from DB, return them
      if (data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.error('[products] getProductsByCategory Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  return getSeedProductsByCategory(categorySlug, limit).map(p => ({
    ...p,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductWithSpecs | null> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();
      
      if (product) {
        const { data: productSpecs } = await supabase
          .from('product_specs')
          .select('*')
          .eq('product_id', product.id)
          .order('display_order');
        return { ...product, specs: (productSpecs as ProductSpec[]) ?? [] };
      }
    } catch (err) {
      console.error('[products] getProductBySlug Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  const seedProduct = getSeedProductWithRetailers(slug);
  if (seedProduct) {
    return {
      ...seedProduct,
      specs: (seedProduct as any).specs ?? [],
    } as ProductWithSpecs;
  }
  return null;
}

export async function getProductWithRetailers(slug: string): Promise<ProductWithRetailers | null> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();
      
      if (product) {
        const [{ data: specs }, { data: retailerData }] = await Promise.all([
          supabase.from('product_specs').select('*').eq('product_id', product.id).order('display_order'),
          supabase.from('product_retailers').select('*, retailers(*)').eq('product_id', product.id),
        ]);
        return {
          ...product,
          specs: (specs as ProductSpec[]) ?? [],
          retailers: ((retailerData ?? []).map(r => ({ ...r, retailer: r.retailers })) as (ProductRetailer & { retailer: Retailer })[]),
        };
      }
    } catch (err) {
      console.error('[products] getProductWithRetailers Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  return getSeedProductWithRetailers(slug) as ProductWithRetailers | null;
}

export async function searchProducts(query: string, categorySlug?: string, limit = 20): Promise<Product[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let q = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(limit);
      if (categorySlug) {
        q = q.eq('category_slug', categorySlug);
      }
      const { data } = await q;
      if (data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.error('[products] searchProducts Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  const allSeedProducts = getSeedProducts();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  return allSeedProducts.filter(p => {
    const nameMatch = queryWords.some(w => p.name.toLowerCase().includes(w)) || p.slug.includes(queryLower.replace(/\s+/g, '-'));
    const catMatch = categorySlug ? p.category_slug === categorySlug : true;
    return nameMatch && catMatch;
  }).slice(0, limit).map(p => ({
    ...p,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

// ============ Retailers ============

export async function getRetailers(): Promise<Retailer[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from('retailers').select('*').order('name');
      if (data && data.length > 0) {
        return data as Retailer[];
      }
    } catch (err) {
      console.error('[products] getRetailers Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  const seedRetailers = getSeedProducts().flatMap(p => p.retailers);
  const uniqueRetailers = new Map<string, Retailer>();
  for (const r of seedRetailers) {
    if (!uniqueRetailers.has(r.slug)) {
      uniqueRetailers.set(r.slug, {
        id: `seed-retailer-${r.slug}`,
        name: r.name,
        slug: r.slug,
        website: r.url,
        logo_url: r.logo_url,
        is_official: r.is_official,
        affiliate_base_url: r.affiliate_url ?? r.url,
        created_at: new Date().toISOString(),
      });
    }
  }
  return Array.from(uniqueRetailers.values());
}

// ============ Featured Products for Hero ============

export interface FeaturedProduct {
  category: string;
  product: ProductWithRetailers;
}

export async function getFeaturedProductsForHero(): Promise<FeaturedProduct[]> {
  const categories = ['laptop', 'smartphone', 'headphones'];
  const featuredProducts: FeaturedProduct[] = [];

  if (isSupabaseConfigured()) {
    // Try to get real products from Supabase
    for (const cat of categories) {
      try {
        const products = await getProductsByCategory(cat, 1);
        if (products.length > 0) {
          const withRetailers = await getProductWithRetailers(products[0].slug);
          if (withRetailers) {
            featuredProducts.push({ category: cat, product: withRetailers });
          }
        }
      } catch {}
    }
  }

  // Fallback to seed data if Supabase not configured or no products found
  if (featuredProducts.length === 0) {
    for (const cat of categories) {
      try {
        const products = getSeedProductsByCategory(cat, 1);
        if (products.length > 0) {
          const withRetailers = getSeedProductWithRetailers(products[0].slug);
          if (withRetailers) {
            featuredProducts.push({ category: cat, product: withRetailers });
          }
        }
      } catch {}
    }
  }

  return featuredProducts;
}

// ============ Buying Guides ============

export async function getBuyingGuides(categorySlug?: string): Promise<BuyingGuide[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let q = supabase
        .from('buying_guides')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (categorySlug) {
        q = q.eq('category_slug', categorySlug);
      }
      const { data } = await q;
      if (data && data.length > 0) {
        return data as BuyingGuide[];
      }
    } catch (err) {
      console.error('[products] getBuyingGuides Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  const seedGuides: BuyingGuide[] = [
    {
      id: 'seed-guide-1',
      title: 'Best Laptops for Programming in 2024',
      slug: 'best-laptops-programming-2024',
      excerpt: 'Our curated list of the best laptops for developers and programmers.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: null,
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops for Programming 2024',
      seo_description: 'Find the perfect laptop for coding.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-2',
      title: 'Best Smartphones Under ₹30,000',
      slug: 'best-smartphones-under-30000',
      excerpt: 'Top picks for the best smartphones under 30k budget.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: null,
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Smartphones Under 30000',
      seo_description: 'Affordable smartphones with great features.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-3',
      title: 'Best Headphones for Travel',
      slug: 'best-headphones-travel',
      excerpt: 'Noise-cancelling and comfortable headphones for travelers.',
      content: '',
      category_slug: 'headphones',
      cover_image_url: null,
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Headphones for Travel',
      seo_description: 'Travel-friendly headphones with ANC.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
  ];
  if (categorySlug) {
    return seedGuides.filter(g => g.category_slug === categorySlug);
  }
  return seedGuides;
}

export async function getBuyingGuideBySlug(slug: string): Promise<BuyingGuideWithRecs | null> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: guide } = await supabase
        .from('buying_guides')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (guide) {
        const { data: recs } = await supabase
          .from('buying_guide_recommendations')
          .select('*, products(*)')
          .eq('guide_id', guide.id)
          .order('display_order');
        return {
          ...guide,
          recommendations: ((recs ?? []).map(r => ({ ...r, product: r.products })) as (BuyingGuideRecommendation & { product: Product })[]),
        };
      }
    } catch (err) {
      console.error('[products] getBuyingGuideBySlug Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  const guides = await getBuyingGuides();
  const guide = guides.find(g => g.slug === slug);
  if (!guide) return null;
  return { ...guide, recommendations: [] };
}

export async function getBuyingGuidesForProduct(productId: string): Promise<BuyingGuide[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('buying_guide_recommendations')
        .select('guide:buying_guides(*)')
        .eq('product_id', productId);
      const guides = ((data ?? []).map(r => r.guide).filter(Boolean)) as unknown as BuyingGuide[];
      if (guides.length > 0) {
        return guides;
      }
    } catch (err) {
      console.error('[products] getBuyingGuidesForProduct Supabase failed, falling back to seed:', err);
    }
  }
  
  // Fallback to seed data
  const guides = await getBuyingGuides();
  return guides.slice(0, 2);
}

// ============ Shopping Intelligence / Recommendations ============

export interface RecommendationInput {
  categorySlug: string;
  budgetCents?: number;
  currency?: string;
  priorities: string[]; // e.g., ['performance', 'battery']
  useCases: string[];   // e.g., ['programming', 'gaming']
  preferredBrands?: string[];
  excludedBrands?: string[];
  osPreferences?: string[];
}

export interface ProductRecommendation {
  product: ProductWithRetailers;
  score: number;
  label: string; // 'Best Overall', 'Best Value', etc.
  reasoning: string;
  pros: string[];
  cons: string[];
}

function calculateProductScore(
  product: ProductWithRetailers,
  input: RecommendationInput
): { score: number; pros: string[]; cons: string[]; label: string } {
  let score = 0;
  const pros: string[] = [];
  const cons: string[] = [];

  // Price scoring
  if (input.budgetCents) {
    const minPrice = product.retailers
      .filter(r => r.price_cents !== null)
      .map(r => r.price_cents!)
      .reduce((a, b) => Math.min(a, b), Infinity);

    if (minPrice !== Infinity) {
      const ratio = minPrice / input.budgetCents;
      if (ratio <= 0.8) {
        score += 30;
        pros.push('Well within budget');
      } else if (ratio <= 1.0) {
        score += 20;
        pros.push('Fits your budget');
      } else if (ratio <= 1.2) {
        score += 10;
        cons.push('Slightly above budget');
      } else {
        score -= 20;
        cons.push('Significantly above budget');
      }
    }
  }

  // Spec matching based on priorities
  const specMap = new Map(product.specs.map(s => [s.spec_key, s]));
  
  for (const priority of input.priorities) {
    const matched = matchPriorityToSpecs(priority, product.category_slug, specMap);
    if (matched) {
      score += matched.score;
      if (matched.pro) pros.push(matched.pro);
      if (matched.con) cons.push(matched.con);
    }
  }

  // Use case matching
  for (const useCase of input.useCases) {
    const matched = matchUseCaseToSpecs(useCase, product.category_slug, specMap);
    if (matched) {
      score += matched.score;
      if (matched.pro) pros.push(matched.pro);
      if (matched.con) cons.push(matched.con);
    }
  }

  // Brand preferences
  if (input.preferredBrands?.length && product.manufacturer) {
    if (input.preferredBrands.some(b => b.toLowerCase() === product.manufacturer!.toLowerCase())) {
      score += 15;
      pros.push(`Preferred brand: ${product.manufacturer}`);
    }
  }
  if (input.excludedBrands?.length && product.manufacturer) {
    if (input.excludedBrands.some(b => b.toLowerCase() === product.manufacturer!.toLowerCase())) {
      score -= 30;
      cons.push(`Excluded brand: ${product.manufacturer}`);
    }
  }

  // Determine label based on score and attributes
  let label = 'Recommended';
  if (score >= 80) label = 'Best Overall';
  else if (score >= 60 && input.budgetCents) label = 'Best Value';
  else if (score >= 50) label = 'Strong Contender';

  return { score: Math.max(0, Math.min(100, score)), pros, cons, label };
}

function matchPriorityToSpecs(
  priority: string,
  categorySlug: string,
  specs: Map<string, ProductSpec>
): { score: number; pro?: string; con?: string } | null {
  const priorityMap: Record<string, { keys: string[]; pro: string; con: string; weight: number }> = {
    // Laptop priorities
    performance: { keys: ['cpu', 'processor', 'gpu', 'graphics'], pro: 'Excellent performance', con: '', weight: 25 },
    battery: { keys: ['battery', 'battery_life'], pro: 'Great battery life', con: 'Average battery life', weight: 25 },
    display: { keys: ['display', 'screen', 'resolution', 'refresh_rate'], pro: 'Excellent display', con: 'Average display', weight: 20 },
    portability: { keys: ['weight', 'thickness', 'dimensions'], pro: 'Highly portable', con: 'Less portable', weight: 20 },
    gaming: { keys: ['gpu', 'graphics', 'refresh_rate', 'cooling'], pro: 'Great for gaming', con: 'Limited gaming capability', weight: 25 },
    programming: { keys: ['cpu', 'ram', 'storage', 'keyboard'], pro: 'Excellent for programming', con: 'Basic for programming', weight: 25 },
    build: { keys: ['build', 'material', 'chassis'], pro: 'Premium build quality', con: 'Average build', weight: 15 },
    
    // Phone priorities
    camera: { keys: ['camera', 'megapixels', 'aperture', 'zoom'], pro: 'Excellent camera', con: 'Average camera', weight: 30 },
    software: { keys: ['os', 'software', 'updates'], pro: 'Clean software experience', con: 'Bloated software', weight: 20 },
    design: { keys: ['design', 'material', 'weight', 'thickness'], pro: 'Premium design', con: 'Basic design', weight: 15 },
    
    // Headphones priorities
    anc: { keys: ['anc', 'noise_cancellation'], pro: 'Excellent ANC', con: 'Weak ANC', weight: 30 },
    sound: { keys: ['driver', 'frequency_response', 'codec'], pro: 'Superb sound quality', con: 'Average sound', weight: 30 },
    comfort: { keys: ['weight', 'earcup', 'headband', 'clamping_force'], pro: 'Very comfortable', con: 'Can be fatiguing', weight: 20 },
    microphone: { keys: ['microphone', 'mic_quality'], pro: 'Clear microphone', con: 'Average microphone', weight: 15 },
  };

  const config = priorityMap[priority.toLowerCase()];
  if (!config) return null;

  for (const key of config.keys) {
    if (specs.has(key)) {
      return { score: config.weight, pro: config.pro };
    }
  }
  return { score: -config.weight / 2, con: config.con };
}

function matchUseCaseToSpecs(
  useCase: string,
  categorySlug: string,
  specs: Map<string, ProductSpec>
): { score: number; pro?: string; con?: string } | null {
  const useCaseMap: Record<string, { keys: string[]; pro: string; con: string; weight: number }> = {
    programming: { keys: ['cpu', 'ram', 'storage', 'keyboard', 'display'], pro: 'Ideal for programming', con: 'May struggle with heavy workloads', weight: 20 },
    gaming: { keys: ['gpu', 'graphics', 'refresh_rate', 'cooling', 'cpu'], pro: 'Great gaming performance', con: 'Not suitable for gaming', weight: 25 },
    college: { keys: ['battery', 'weight', 'portability', 'price'], pro: 'Perfect for campus life', con: 'Less suitable for daily carry', weight: 20 },
    travel: { keys: ['battery', 'weight', 'size', 'portability'], pro: 'Excellent travel companion', con: 'Bulky for travel', weight: 20 },
    photography: { keys: ['camera', 'megapixels', 'sensor', 'lens'], pro: 'Outstanding for photography', con: 'Basic camera capabilities', weight: 25 },
    content_creation: { keys: ['cpu', 'gpu', 'ram', 'storage', 'display', 'color_accuracy'], pro: 'Excellent for content creation', con: 'Limited for professional work', weight: 25 },
    office: { keys: ['battery', 'keyboard', 'display', 'ports', 'weight'], pro: 'Great for office work', con: 'Average for productivity', weight: 15 },
    study: { keys: ['battery', 'portability', 'price', 'display'], pro: 'Perfect for students', con: 'Less suitable for long sessions', weight: 15 },
    professional: { keys: ['cpu', 'ram', 'storage', 'display', 'build', 'ports'], pro: 'Professional-grade performance', con: 'May be overkill', weight: 20 },
    entertainment: { keys: ['display', 'audio', 'battery', 'storage'], pro: 'Immersive entertainment', con: 'Basic media experience', weight: 15 },
  };

  const config = useCaseMap[useCase.toLowerCase()];
  if (!config) return null;

  let matched = false;
  for (const key of config.keys) {
    if (specs.has(key)) {
      matched = true;
      break;
    }
  }
  return matched ? { score: config.weight, pro: config.pro } : { score: -config.weight / 2, con: config.con };
}

export async function getRecommendations(input: RecommendationInput): Promise<ProductRecommendation[]> {
  try {
    const products = await getProductsByCategory(input.categorySlug, 100);
    if (products.length === 0) return [];

    // Fetch full product data with specs and retailers for top candidates
    const productsWithData = await Promise.all(
      products.slice(0, 30).map(async (p) => {
        const withRetailers = await getProductWithRetailers(p.slug);
        return withRetailers;
      })
    );

    const validProducts = productsWithData.filter(Boolean) as ProductWithRetailers[];
    if (validProducts.length === 0) return [];

    const scored = validProducts.map(product => ({
      product,
      ...calculateProductScore(product, input),
    }));

    scored.sort((a, b) => b.score - a.score);

    // Assign dynamic labels based on sorted score position
    const topResults = scored.slice(0, 6);
    const labelPool = ['Best Overall', 'Best Value', 'Strong Contender', 'Budget Pick', 'Premium Pick', 'Recommended'];
    
    return topResults.map((r, i) => {
      // Assign label based on score rank
      let label: string;
      if (r.score <= 0) {
        label = 'Also Considered';
      } else if (i < labelPool.length) {
        label = labelPool[i];
      } else {
        label = 'Recommended';
      }
      
      return {
        product: r.product,
        score: r.score,
        label,
        reasoning: generateReasoning(r, input),
        pros: r.pros,
        cons: r.cons,
      };
    });
  } catch (err) {
    console.error('[products] getRecommendations failed:', err);
    return [];
  }
}

function generateReasoning(
  r: { score: number; pros: string[]; cons: string[]; label: string },
  input: RecommendationInput
): string {
  const parts: string[] = [];
  
  if (r.pros.length > 0) {
    parts.push(r.pros.slice(0, 2).join(' and '));
  }
  if (r.cons.length > 0) {
    parts.push(`Trade-off: ${r.cons[0]}`);
  }
  
  if (input.budgetCents) {
    const budget = (input.budgetCents / 100).toLocaleString();
    parts.push(`Fits your ₹${budget} budget`);
  }
  
  if (input.priorities.length > 0) {
    parts.push(`Optimized for ${input.priorities.slice(0, 2).join(' and ')}`);
  }
  
  return parts.join('. ') || `${r.label} for your requirements.`;
}