import type {
  Product,
  ProductSpec,
  ProductCategory,
} from '@/lib/types';
import type { ProductWithRetailers } from '@/lib/shopping/types';

/**
 * Category-Aware Recommendation Engine
 * 
 * Implements category-specific scoring algorithms for different product types
 * Each category has its own scoring weights and logic
 */

export interface RecommendationInput {
  categorySlug: string;
  budgetCents?: number;
  currency?: string;
  priorities: string[]; // e.g., ['performance', 'battery']
  useCases: string[];   // e.g., ['programming', 'gaming']
  preferredBrands?: string[];
  excludedBrands?: string[];
  osPreferences?: string[];
  minRating?: number;
}

export interface ProductRecommendation {
  product: ProductWithRetailers;
  score: number;
  label: string; // 'Best Overall', 'Best Value', etc.
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

/**
 * Category-specific scoring weights
 */
interface CategoryWeights {
  price: number;
  priorities: Record<string, number>;
  useCases: Record<string, number>;
  brand: number;
  rating: number;
  specs: number;
}

const CATEGORY_WEIGHTS: Record<string, CategoryWeights> = {
  laptop: {
    price: 25,
    priorities: {
      performance: 25,
      battery: 25,
      display: 20,
      portability: 20,
      gaming: 25,
      programming: 25,
      build: 15,
    },
    useCases: {
      programming: 20,
      gaming: 25,
      college: 20,
      travel: 20,
      content_creation: 25,
      office: 15,
      study: 15,
      professional: 20,
      entertainment: 15,
    },
    brand: 15,
    rating: 10,
    specs: 20,
  },
  smartphone: {
    price: 25,
    priorities: {
      performance: 20,
      battery: 25,
      display: 20,
      camera: 30,
      gaming: 20,
      software: 15,
      design: 15,
    },
    useCases: {
      programming: 15,
      gaming: 20,
      college: 20,
      travel: 20,
      photography: 25,
      content_creation: 20,
      office: 15,
      study: 15,
      professional: 15,
      entertainment: 15,
    },
    brand: 15,
    rating: 10,
    specs: 15,
  },
  headphones: {
    price: 20,
    priorities: {
      anc: 30,
      sound: 30,
      comfort: 20,
      battery: 20,
      microphone: 15,
      portability: 15,
    },
    useCases: {
      travel: 20,
      office: 15,
      entertainment: 15,
      commute: 15,
    },
    brand: 15,
    rating: 10,
    specs: 15,
  },
  // Default weights for unknown categories
  default: {
    price: 25,
    priorities: {
      performance: 20,
      battery: 20,
      display: 15,
      camera: 15,
      gaming: 15,
      portability: 15,
      build: 15,
    },
    useCases: {
      programming: 15,
      gaming: 15,
      college: 15,
      travel: 15,
      photography: 15,
      content_creation: 15,
      office: 10,
      study: 10,
      professional: 15,
      entertainment: 10,
    },
    brand: 15,
    rating: 10,
    specs: 15,
  },
};

/**
 * Category-specific spec key mappings
 */
const CATEGORY_SPEC_KEYS: Record<string, Record<string, string[]>> = {
  laptop: {
    performance: ['cpu', 'processor', 'gpu', 'graphics', 'cpu_benchmark', 'gpu_benchmark'],
    battery: ['battery', 'battery_life', 'battery_capacity', 'battery_hours'],
    display: ['display', 'screen', 'resolution', 'refresh_rate', 'brightness', 'color_gamut', 'panel_type'],
    portability: ['weight', 'thickness', 'dimensions', 'weight_kg', 'thickness_mm'],
    gaming: ['gpu', 'graphics', 'refresh_rate', 'cooling', 'gpu_memory', 'gpu_tdp'],
    programming: ['cpu', 'ram', 'storage', 'keyboard', 'display', 'ports', 'linux_support'],
    build: ['build', 'material', 'chassis', 'durability', 'hinge'],
  },
  smartphone: {
    camera: ['camera', 'megapixels', 'aperture', 'zoom', 'sensor_size', 'ois', 'night_mode'],
    battery: ['battery', 'battery_life', 'battery_capacity', 'charging_speed', 'wireless_charging'],
    performance: ['cpu', 'processor', 'ram', 'storage', 'chipset', 'benchmark'],
    display: ['display', 'screen', 'resolution', 'refresh_rate', 'brightness', 'panel_type'],
    gaming: ['gpu', 'graphics', 'refresh_rate', 'cooling', 'touch_sampling_rate'],
    software: ['os', 'software', 'updates', 'ui', 'bloatware'],
    design: ['design', 'material', 'weight', 'dimensions', 'ip_rating'],
  },
  headphones: {
    anc: ['anc', 'noise_cancellation', 'anc_level', 'transparency_mode'],
    sound: ['driver', 'frequency_response', 'codec', 'ldac', 'aptx', 'aac', 'sbc', 'spatial_audio', 'impedance', 'sensitivity'],
    battery: ['battery', 'battery_life', 'charging_speed', 'quick_charge'],
    comfort: ['weight', 'earcup', 'headband', 'clamping_force', 'earpad_material'],
    microphone: ['microphone', 'mic_quality', 'call_quality', 'voice_pickup'],
    portability: ['weight', 'foldable', 'carrying_case', 'compact'],
  },
};

/**
 * Get category weights for scoring
 */
function getCategoryWeights(categorySlug: string) {
  return CATEGORY_WEIGHTS[categorySlug] || CATEGORY_WEIGHTS.default;
}

/**
 * Get spec key mappings for a category
 */
function getSpecKeys(categorySlug: string) {
  return CATEGORY_SPEC_KEYS[categorySlug] || CATEGORY_SPEC_KEYS.laptop;
}

/**
 * Calculate price score based on budget
 */
function calculatePriceScore(
  product: {
    retailers: Array<{ price_cents: number | null; currency: string }>;
  },
  budgetCents?: number
): { score: number; pro?: string; con?: string } {
  if (!budgetCents) return { score: 0 };

  const minPrice = product.retailers
    .filter(r => r.price_cents !== null)
    .map(r => r.price_cents!)
    .reduce((a, b) => Math.min(a, b), Infinity);

  if (minPrice === Infinity) return { score: 0 };

  const ratio = minPrice / budgetCents;
  
  if (ratio <= 0.8) {
    return { score: 30, pro: 'Well within budget' };
  } else if (ratio <= 1.0) {
    return { score: 20, pro: 'Fits your budget' };
  } else if (ratio <= 1.2) {
    return { score: 10, con: 'Slightly above budget' };
  } else {
    return { score: -20, con: 'Significantly above budget' };
  }
}

/**
 * Match priority to product specs
 */
function matchPriorityToSpecs(
  priority: string,
  categorySlug: string,
  specs: Map<string, { spec_key: string; spec_value: string; unit: string | null }>
): { score: number; pro?: string; con?: string } | null {
  const specKeys = getSpecKeys(categorySlug);
  const relevantKeys = specKeys[priority.toLowerCase()];
  
  if (!relevantKeys || relevantKeys.length === 0) return null;

  // Check if product has any of the relevant spec keys
  for (const key of relevantKeys) {
    if (specs.has(key)) {
      const spec = specs.get(key)!;
      return { score: 10, pro: `Strong ${priority}: ${spec.spec_value} ${spec.unit || ''}` };
    }
  }
  
  return { score: -5, con: `Missing ${priority} specifications` };
}

/**
 * Match use case to product specs
 */
function matchUseCaseToSpecs(
  useCase: string,
  categorySlug: string,
  specs: Map<string, { spec_key: string; spec_value: string; unit: string | null }>
): { score: number; pro?: string; con?: string } | null {
  const specKeys = getSpecKeys(categorySlug);
  const relevantKeys = specKeys[useCase.toLowerCase()] || CATEGORY_SPEC_KEYS.default?.[useCase.toLowerCase()];
  
  if (!relevantKeys || relevantKeys.length === 0) return null;

  let matched = false;
  for (const key of relevantKeys) {
    if (specs.has(key)) {
      matched = true;
      break;
    }
  }
  
  return matched ? { score: 10, pro: `Suited for ${useCase}` } : { score: -5, con: `Not ideal for ${useCase}` };
}

/**
 * Calculate product score
 */
function calculateProductScore(
  product: {
    retailers: Array<{ price_cents: number | null; currency: string }>;
    specs: Array<{ spec_key: string; spec_value: string; unit: string | null; display_order: number }>;
    manufacturer: string | null;
    rating?: number;
    review_count?: number;
  },
  input: {
    categorySlug: string;
    budgetCents?: number;
    priorities: string[];
    useCases: string[];
    preferredBrands?: string[];
    excludedBrands?: string[];
  }
): { score: number; pros: string[]; cons: string[]; label: string; breakdown: any } {
  const weights = getCategoryWeights(input.categorySlug);
  const specsMap = new Map(product.specs.map(s => [s.spec_key, s]));
  
  let score = 0;
  const pros: string[] = [];
  const cons: string[] = [];
  const breakdown: Record<string, number> = {};

  // Price scoring
  const priceResult = calculatePriceScore(product, input.budgetCents);
  score += priceResult.score;
  breakdown.price = priceResult.score;
  if (priceResult.pro) pros.push(priceResult.pro);
  if (priceResult.con) cons.push(priceResult.con);

  // Priority scoring
  let priorityScore = 0;
  for (const priority of input.priorities) {
    const matched = matchPriorityToSpecs(priority, input.categorySlug, 
      new Map(product.specs.map(s => [s.spec_key, { spec_key: s.spec_key, spec_value: s.spec_value, unit: s.unit }])));
    if (matched) {
      priorityScore += matched.score;
      if (matched.pro) pros.push(matched.pro);
      if (matched.con) cons.push(matched.con);
    }
  }
  score += priorityScore;
  breakdown.priorities = priorityScore;

  // Use case scoring
  let useCaseScore = 0;
  for (const useCase of input.useCases) {
    const matched = matchUseCaseToSpecs(useCase, input.categorySlug,
      new Map(product.specs.map(s => [s.spec_key, { spec_key: s.spec_key, spec_value: s.spec_value, unit: s.unit }])));
    if (matched) {
      useCaseScore += matched.score;
      if (matched.pro) pros.push(matched.pro);
      if (matched.con) cons.push(matched.con);
    }
  }
  score += useCaseScore;
  breakdown.useCases = useCaseScore;

  // Brand preferences
  let brandScore = 0;
  if (input.preferredBrands?.length && product.manufacturer) {
    if (input.preferredBrands.some(b => b.toLowerCase() === product.manufacturer!.toLowerCase())) {
      brandScore += 15;
      pros.push(`Preferred brand: ${product.manufacturer}`);
    }
  }
  if (input.excludedBrands?.length && product.manufacturer) {
    if (input.excludedBrands.some(b => b.toLowerCase() === product.manufacturer!.toLowerCase())) {
      brandScore -= 30;
      cons.push(`Excluded brand: ${product.manufacturer}`);
    }
  }
  score += brandScore;
  breakdown.brand = brandScore;

  // Rating score
  let ratingScore = 0;
  if (product.rating) {
    if (product.rating >= 4.5) ratingScore = 10;
    else if (product.rating >= 4.0) ratingScore = 7;
    else if (product.rating >= 3.5) ratingScore = 4;
    else ratingScore = 0;
  }
  score += ratingScore;
  breakdown.rating = ratingScore;

  // Spec completeness score
  let specScore = 0;
  const specKeys = Object.keys(CATEGORY_SPEC_KEYS[input.categorySlug] || CATEGORY_SPEC_KEYS.default);
  let matchedSpecs = 0;
  for (const key of specKeys.flatMap(k => Object.values(k).flat())) {
    if (product.specs.some(s => s.spec_key === key)) {
      matchedSpecs++;
    }
  }
  specScore = Math.min(20, matchedSpecs * 2);
  score += specScore;
  breakdown.specs = specScore;

  // Determine label
  let label = 'Recommended';
  const totalScore = Math.max(0, Math.min(100, score));
  if (totalScore >= 80) label = 'Best Overall';
  else if (totalScore >= 60 && input.budgetCents) label = 'Best Value';
  else if (totalScore >= 50) label = 'Strong Contender';
  else if (totalScore >= 40) label = 'Good Option';
  else if (totalScore >= 30) label = 'Budget Pick';
  else label = 'Recommended';

  return {
    score: totalScore,
    pros: pros.slice(0, 4),
    cons: cons.slice(0, 3),
    label,
    breakdown,
  };
}

/**
 * Generate human-readable reasoning
 */
function generateReasoning(
  r: { score: number; pros: string[]; cons: string[]; label: string },
  input: {
    budgetCents?: number;
    priorities: string[];
    useCases: string[];
  }
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

/**
 * Main recommendation function
 */
export async function getRecommendations(input: {
  categorySlug: string;
  budgetCents?: number;
  currency?: string;
  priorities: string[];
  useCases: string[];
  preferredBrands?: string[];
  excludedBrands?: string[];
  osPreferences?: string[];
  minRating?: number;
}): Promise<Array<{
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
}>> {
  // This would normally fetch from database
  // For now, return mock structure
  return [];
}

/**
 * Generate comparison reasoning
 */
export function generateComparisonReasoning(
  products: Array<{
    name: string;
    score: number;
    pros: string[];
    cons: string[];
  }>
): string {
  if (products.length < 2) return '';
  
  const sorted = [...products].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const runnerUp = sorted[1];
  
  return `${winner.name} edges out ${runnerUp.name} primarily due to ${winner.pros.slice(0, 2).join(' and ')}. ${runnerUp.name} ${runnerUp.cons[0] ? `but ${runnerUp.cons[0].toLowerCase()}` : 'is a close alternative'}.`;
}

export {
  calculateProductScore,
  generateReasoning,
  getCategoryWeights,
  matchPriorityToSpecs,
  matchUseCaseToSpecs,
  calculatePriceScore,
  matchPriorityToSpecs as matchPriority,
  matchUseCaseToSpecs as matchUseCase,
  getSpecKeys,
  CATEGORY_WEIGHTS,
  CATEGORY_SPEC_KEYS,
};