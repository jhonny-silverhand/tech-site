export {};

/**
 * Natural Language Shopping Query Parser
 * 
 * Parses natural language shopping queries into structured search parameters
 * Examples:
 * - "best laptop for coding under 80k" -> { category: 'laptop', maxPrice: 80000, useCases: ['programming'] }
 * - "best phone under 30k with good camera" -> { category: 'smartphone', maxPrice: 30000, priorities: ['camera'] }
 * - "headphones for travel with good ANC" -> { category: 'headphones', useCases: ['travel'], priorities: ['anc'] }
 */

export interface ParsedShoppingQuery {
  category?: string;
  categoryConfidence: number;
  budgetMin?: number; // in INR
  budgetMax?: number; // in INR
  priorities: string[]; // e.g., ['performance', 'battery']
  useCases: string[]; // e.g., ['programming', 'gaming']
  preferredBrands: string[];
  excludedBrands: string[];
  osPreferences: string[];
  minRating?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  confidence: number; // Overall confidence 0-1
  originalQuery: string;
  intent: 'shopping' | 'comparison' | 'research' | 'general';
}

interface ParsedEntity {
  type: 'budget' | 'category' | 'priority' | 'useCase' | 'brand' | 'rating' | 'sort';
  value: string | number;
  confidence: number;
  originalText: string;
}

// Category mapping from natural language to internal slugs
const CATEGORY_PATTERNS = [
  { slug: 'headphones', patterns: [/headphone|headset|earphone|earbud|airpod|airpods|earbud/i], weight: 10 },
  { slug: 'laptop', patterns: [/laptop|notebook|macbook|ultrabook|chromebook|thinkpad|xps|surface|ideapad/i], weight: 10 },
  { slug: 'smartphone', patterns: [/\bphone\b|smartphone|iphone|android|mobile|galaxy|pixel/i], weight: 10 },
  { slug: 'earbuds', patterns: [/earbud|airpod|airpods|tw|true wireless/i], weight: 8 },
  { slug: 'tablet', patterns: [/tablet|ipad|surface pro|galaxy tab/i], weight: 8 },
  { slug: 'monitor', patterns: [/monitor|display|screen|ultrawide|gaming monitor/i], weight: 8 },
  { slug: 'keyboard', patterns: [/keyboard|mechanical keyboard|keypad/i], weight: 6 },
  { slug: 'mouse', patterns: [/mouse|gaming mouse|trackpad/i], weight: 6 },
  { slug: 'smartwatch', patterns: [/smartwatch|apple watch|galaxy watch|fitbit|wearable/i], weight: 7 },
  { slug: 'camera', patterns: [/camera|dslr|mirrorless|action cam|gopro/i], weight: 7 },
  { slug: 'tv', patterns: [/tv|television|smart tv|oled|qled|4k tv/i], weight: 7 },
  { slug: 'gaming', patterns: [/gaming|console|ps5|xbox|switch|steam deck/i], weight: 7 },
  { slug: 'components', patterns: [/gpu|graphics card|rtx|rtx 40|rtx 30|amd radeon|nvidia/i], weight: 6 },
  { slug: 'monitor', patterns: [/monitor|display/i], weight: 5 },
  { slug: 'tablet', patterns: [/tablet|ipad/i], weight: 5 },
  { slug: 'earbuds', patterns: [/earbud|airpod|true wireless/i], weight: 5 }
];

// Budget patterns - extracts min/max price in INR
const BUDGET_PATTERNS = [
  // "under X", "below X", "less than X"
  { pattern: /(?:under|below|less than|upto|up to|max|maximum)\s*(?:rs\.?|₹|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:k|K|thousand)?/i, type: 'max', multiplier: 1000 },
  // "above X", "over X", "more than X"
  { pattern: /(?:above|over|more than|minimum|at least)\s*(?:rs\.?|₹|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:k|K|thousand)?/i, type: 'min', multiplier: 1000 },
  // "between X and Y" or "X to Y"
  { pattern: /(?:between|from)\s*(?:rs\.?|₹|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:k|K|thousand)?\s*(?:to|and|-)\s*(?:rs\.?|₹|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:k|K|thousand)?/i, type: 'range', multiplier: 1000 },
  // "X to Y" or "X - Y"
  { pattern: /(?:rs\.?|₹|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:k|K|thousand)?\s*(?:to|-)\s*(?:rs\.?|₹|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:k|K|thousand)?/i, type: 'range', multiplier: 1000 },
  // Exact price "X" or "X k"
  { pattern: /^(?:rs\.?|₹|inr)?\s*(\d+(?:[.,]\d+)?)\s*(?:k|K|thousand)?$/i, type: 'exact', multiplier: 1000 },
  // "Xk" or "X K" (standalone, not after "under/above")
  { pattern: /(?:^|\s)(\d+(?:[.,]\d+)?)\s*[kK]\b(?!\s*(?:or|to|-))/i, type: 'exact', multiplier: 1000 },
  // "X thousand"
  { pattern: /(\d+(?:[.,]\d+)?)\s*thousand/i, type: 'exact', multiplier: 1000 },
  // "X lakh" or "X L"
  { pattern: /(\d+(?:[.,]\d+)?)\s*[lL](?:akh)?\b/i, type: 'exact', multiplier: 100000 },
];

// Priority keywords
const PRIORITY_KEYWORDS: Record<string, { keyword: string; weight: number }[]> = {
  performance: [
    { keyword: 'performance', weight: 10 },
    { keyword: 'speed', weight: 8 },
    { keyword: 'fast', weight: 7 },
    { keyword: 'powerful', weight: 8 },
    { keyword: 'processor', weight: 7 },
    { keyword: 'cpu', weight: 7 },
    { keyword: 'gpu', weight: 7 },
    { keyword: 'graphics', weight: 7 },
    { keyword: 'multitasking', weight: 6 },
    { keyword: 'heavy', weight: 5 },
    { keyword: 'demanding', weight: 6 },
  ],
  battery: [
    { keyword: 'battery', weight: 10 },
    { keyword: 'battery life', weight: 10 },
    { keyword: 'long battery', weight: 9 },
    { keyword: 'all day', weight: 8 },
    { keyword: 'endurance', weight: 7 },
    { keyword: 'charging', weight: 5 },
    { keyword: 'fast charging', weight: 6 },
  ],
  display: [
    { keyword: 'display', weight: 8 },
    { keyword: 'screen', weight: 7 },
    { keyword: 'resolution', weight: 7 },
    { keyword: 'refresh rate', weight: 8 },
    { keyword: 'hz', weight: 6 },
    { keyword: 'color', weight: 5 },
    { keyword: 'brightness', weight: 6 },
    { keyword: 'oled', weight: 7 },
    { keyword: 'amoled', weight: 7 },
    { keyword: 'retina', weight: 6 },
  ],
  camera: [
    { keyword: 'camera', weight: 10 },
    { keyword: 'photo', weight: 8 },
    { keyword: 'photography', weight: 9 },
    { keyword: 'megapixel', weight: 7 },
    { keyword: 'mp', weight: 6 },
    { keyword: 'zoom', weight: 6 },
    { keyword: 'portrait', weight: 6 },
    { keyword: 'night mode', weight: 7 },
    { keyword: 'video', weight: 6 },
    { keyword: 'cinematic', weight: 6 },
  ],
  gaming: [
    { keyword: 'gaming', weight: 10 },
    { keyword: 'game', weight: 7 },
    { keyword: 'fps', weight: 8 },
    { keyword: 'rtx', weight: 8 },
    { keyword: 'graphics', weight: 7 },
    { keyword: 'fps', weight: 8 },
    { keyword: 'competitive', weight: 6 },
    { keyword: 'esports', weight: 6 },
  ],
  portability: [
    { keyword: 'portable', weight: 8 },
    { keyword: 'lightweight', weight: 8 },
    { keyword: 'light', weight: 6 },
    { keyword: 'thin', weight: 7 },
    { keyword: 'compact', weight: 7 },
    { keyword: 'travel', weight: 7 },
    { keyword: 'carry', weight: 5 },
  ],
  sound: [
    { keyword: 'sound', weight: 8 },
    { keyword: 'audio', weight: 7 },
    { keyword: 'bass', weight: 6 },
    { keyword: 'quality', weight: 5 },
  ],
  anc: [
    { keyword: 'anc', weight: 10 },
    { keyword: 'noise cancellation', weight: 10 },
    { keyword: 'noise cancelling', weight: 10 },
    { keyword: 'anc', weight: 10 },
  ],
  comfort: [
    { keyword: 'comfort', weight: 8 },
    { keyword: 'comfortable', weight: 8 },
    { keyword: 'ergonomic', weight: 7 },
    { keyword: 'fit', weight: 5 },
    { keyword: 'lightweight', weight: 6 },
  ],
  microphone: [
    { keyword: 'microphone', weight: 8 },
    { keyword: 'mic', weight: 7 },
    { keyword: 'voice', weight: 5 },
    { keyword: 'call', weight: 5 },
    { keyword: 'meeting', weight: 5 },
  ],
  value: [
    { keyword: 'value', weight: 8 },
    { keyword: 'budget', weight: 8 },
    { keyword: 'cheap', weight: 7 },
    { keyword: 'affordable', weight: 8 },
    { keyword: 'worth', weight: 6 },
    { keyword: 'bang for buck', weight: 8 },
    { keyword: 'price', weight: 6 },
  ],
  build: [
    { keyword: 'build', weight: 7 },
    { keyword: 'build quality', weight: 8 },
    { keyword: 'durable', weight: 7 },
    { keyword: 'premium', weight: 7 },
    { keyword: 'metal', weight: 6 },
    { keyword: 'glass', weight: 5 },
    { keyword: 'durability', weight: 7 },
  ],
  software: [
    { keyword: 'software', weight: 6 },
    { keyword: 'os', weight: 6 },
    { keyword: 'android', weight: 5 },
    { keyword: 'ios', weight: 5 },
    { keyword: 'updates', weight: 6 },
    { keyword: 'clean', weight: 5 },
    { keyword: 'bloatware', weight: 5 },
  ],
};

const USE_CASE_KEYWORDS: Record<string, string[]> = {
  programming: ['programming', 'coding', 'development', 'developer', 'code', 'ide', 'compile', 'docker', 'virtual machine', 'vm', 'container', 'kubernetes', 'k8s'],
  gaming: ['gaming', 'game', 'gamer', 'fps', 'esports', 'competitive', 'stream', 'streaming'],
  college: ['college', 'student', 'university', 'campus', 'study', 'lecture', 'assignment', 'thesis'],
  travel: ['travel', 'traveling', 'trip', 'vacation', 'holiday', 'backpack', 'commute', 'commuter'],
  photography: ['photography', 'photo', 'picture', 'camera', 'shoot', 'portrait', 'landscape', 'macro', 'wildlife'],
  content_creation: ['content creation', 'creator', 'youtube', 'streaming', 'video editing', 'video', 'edit', 'render', 'after effects', 'premiere', 'da vinci', 'blender', '3d', 'motion graphics', 'animation'],
  office: ['office', 'work', 'work from home', 'wfh', 'meeting', 'zoom', 'teams', 'document', 'spreadsheet', 'presentation'],
  study: ['study', 'research', 'reading', 'note taking', 'notes', 'pdf', 'textbook', 'learning'],
  professional: ['professional', 'workstation', 'business', 'enterprise', 'corporate', 'productivity'],
  entertainment: ['entertainment', 'movie', 'netflix', 'prime', 'streaming', 'media', 'watch'],
};

const BRAND_KEYWORDS: Record<string, string[]> = {
  apple: ['apple', 'macbook', 'mac', 'iphone', 'ipad', 'airpods', 'apple watch', 'macbook', 'imac', 'mac mini', 'mac studio', 'ipad pro', 'ipad air'],
  samsung: ['samsung', 'galaxy', 'galaxy s', 'galaxy z', 'galaxy a', 'galaxy m', 'galaxy book', 'galaxy tab', 'galaxy watch', 'galaxy buds'],
  dell: ['dell', 'xps', 'inspiron', 'latitude', 'vostro', 'alienware', 'g series'],
  hp: ['hp', 'pavilion', 'envy', 'spectre', 'omen', 'victus', 'probook', 'elitebook'],
  lenovo: ['lenovo', 'thinkpad', 'ideapad', 'legion', 'yoga', 'legion', 'thinkbook'],
  asus: ['asus', 'rog', 'zephyrus', 'tuf', 'vivobook', 'zenbook', 'rog phone'],
  xiaomi: ['xiaomi', 'redmi', 'poco', 'mi'],
  oneplus: ['oneplus', 'one plus', 'nord'],
  google: ['google', 'pixel', 'nest'],
  sony: ['sony', 'xperia', 'wh-1000xm', 'wh-1000xm4', 'wh-1000xm5', 'a7', 'a7iv', 'a7r', 'a1', 'alpha'],
  bose: ['bose', 'quietcomfort', 'qc', 'soundlink', 'noise cancelling'],
  jbl: ['jbl', 'flip', 'charge', 'xtreme', 'partybox'],
  microsoft: ['microsoft', 'surface', 'surface pro', 'surface laptop', 'surface book', 'surface go'],
  lg: ['lg', 'gram', 'ultragear', 'ultrafine'],
  acer: ['acer', 'predator', 'nitro', 'swift', 'aspire'],
  msi: ['msi', 'stealth', 'raider', 'vector', 'crosshair', 'pulse', 'katana', 'sword'],
  razer: ['razer', 'blade', 'deathadder', 'viper', 'basilisk', 'kraken', 'blackshark'],
  logitech: ['logitech', 'mx master', 'mx keys', 'g pro', 'g502', 'g305', 'g915', 'g815'],
  intel: ['intel', 'core i3', 'core i5', 'core i7', 'core i9', 'xeon', 'evo', 'arc'],
  amd: ['amd', 'ryzen', 'ryzen 5', 'ryzen 7', 'ryzen 9', 'radeon', 'rx 6000', 'rx 7000'],
  nvidia: ['nvidia', 'rtx', 'rtx 30', 'rtx 40', 'gtx', 'geforce', 'quadro'],
  qualcomm: ['qualcomm', 'snapdragon', 'snapdragon 8', 'snapdragon 7', 'snapdragon 6'],
  mediatek: ['mediatek', 'dimensity', 'heilo'],
};

const SORT_KEYWORDS = {
  'price_asc': ['cheap', 'cheapest', 'lowest price', 'low price', 'affordable', 'budget', 'lowest'],
  'price_desc': ['expensive', 'premium', 'high end', 'highest price', 'costly', 'luxury'],
  'rating': ['best rated', 'highest rated', 'top rated', 'best reviewed', 'highest rating'],
  'newest': ['newest', 'latest', 'new', 'recent', '2024', '2025'],
};

const INTENT_KEYWORDS = {
  shopping: ['buy', 'purchase', 'get', 'looking for', 'need', 'want', 'recommend', 'suggest', 'which', 'best', 'top'],
  comparison: ['compare', 'versus', 'vs', 'versus', 'difference', 'better', 'which is better'],
  research: ['review', 'guide', 'how to', 'what is', 'explain', 'understand', 'learn', 'difference'],
  general: ['tech', 'technology', 'gadget', 'device', 'gadget'],
};

function normalizePrice(value: string): number {
  // Remove commas, spaces, currency symbols
  const cleaned = value.replace(/[₹,\s]/g, '').toLowerCase();
  
  // Handle "k" or "K" suffix
  if (cleaned.endsWith('k')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000;
  }
  
  // Handle "lakh" or "l"
  if (cleaned.endsWith('lakh') || cleaned.endsWith('l')) {
    return parseFloat(cleaned.replace(/lakh|l/, '')) * 100000;
  }
  
  return parseFloat(cleaned) || 0;
}

function extractBudget(query: string): { min?: number; max?: number; confidence: number } {
  const lowerQuery = query.toLowerCase();
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  let confidence = 0;

  for (const { pattern, type, multiplier } of BUDGET_PATTERNS) {
    const match = lowerQuery.match(pattern);
    if (match) {
      confidence = Math.max(confidence, 0.8);
      if (type === 'max') {
        maxPrice = normalizePrice(match[1]) * multiplier;
      } else if (type === 'min') {
        minPrice = normalizePrice(match[1]) * multiplier;
      } else if (type === 'range') {
        minPrice = normalizePrice(match[1]) * multiplier;
        maxPrice = normalizePrice(match[2]) * multiplier;
      } else if (type === 'exact') {
        const price = normalizePrice(match[1]) * multiplier;
        minPrice = Math.floor(price * 0.9);
        maxPrice = Math.ceil(price * 1.1);
      }
      break; // Stop after first match to avoid overwriting
    }
  }

  // Handle "under X k" format
  const underMatch = lowerQuery.match(/(?:under|below|less than|under)\s*(\d+(?:[.,]\d+)?)\s*[kK]\b/);
  if (underMatch) {
    maxPrice = parseFloat(underMatch[1]) * 1000;
    confidence = Math.max(confidence, 0.9);
  }

  // Handle "Xk to Yk" or "Xk - Yk"
  const rangeMatch = lowerQuery.match(/(\d+(?:[.,]\d+)?)\s*[kK]\s*(?:to|-|–)\s*(\d+(?:[.,]\d+)?)\s*[kK]/);
  if (rangeMatch) {
    minPrice = parseFloat(rangeMatch[1]) * 1000;
    maxPrice = parseFloat(rangeMatch[2]) * 1000;
    confidence = Math.max(confidence, 0.9);
  }

  return { min: minPrice, max: maxPrice, confidence: Math.min(confidence, 1) };
}

function extractCategory(query: string): { category: string; confidence: number } | null {
  const lowerQuery = query.toLowerCase();
  let bestMatch: { slug: string; confidence: number } | null = null;

  for (const { slug, patterns, weight } of CATEGORY_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(lowerQuery)) {
        const confidence = weight / 10;
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { slug, confidence };
        }
      }
    }
  }

  return bestMatch ? { category: bestMatch.slug, confidence: bestMatch.confidence } : null;
}

function extractPriorities(query: string): { priorities: string[]; confidence: number } {
  const lowerQuery = query.toLowerCase();
  const found: Record<string, number> = {};

  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    let maxWeight = 0;
    for (const { keyword, weight } of keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        maxWeight = Math.max(maxWeight, weight);
      }
    }
    if (maxWeight > 0) {
      found[priority] = maxWeight;
    }
  }

  const priorities = Object.entries(found)
    .sort((a, b) => b[1] - a[1])
    .map(([p]) => p);

  const confidence = Object.values(found).length > 0 
    ? Math.min(Object.values(found).reduce((a, b) => a + b, 0) / 50, 1)
    : 0;

  return { priorities, confidence };
}

function extractUseCases(query: string): { useCases: string[]; confidence: number } {
  const lowerQuery = query.toLowerCase();
  const found: string[] = [];

  for (const [useCase, keywords] of Object.entries(USE_CASE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        found.push(useCase);
        break;
      }
    }
  }

  const confidence = found.length > 0 ? Math.min(found.length / 3, 1) : 0;
  return { useCases: found, confidence };
}

function extractBrands(query: string): { preferred: string[]; excluded: string[] } {
  const lowerQuery = query.toLowerCase();
  const preferred: string[] = [];
  const excluded: string[] = [];

  // Check for "not X" or "no X" or "avoid X" or "except X"
  const excludePatterns = [
    /(?:not|no|avoid|except|without|skip)\s+(apple|samsung|dell|hp|lenovo|asus|xiaomi|oneplus|google|sony|bose|jbl|sony|microsoft|lg|acer|msi|razer|logitech|intel|amd|nvidia|qualcomm|mediatek)/gi,
    /(?:don't|dont|do not)\s+(?:want|like|prefer)\s+(apple|samsung|dell|hp|lenovo|asus|xiaomi|oneplus|google|sony|bose|jbl|sony|microsoft|lg|acer|msi|razer|logitech|intel|amd|nvidia|qualcomm|mediatek)/gi,
  ];

  for (const pattern of excludePatterns) {
    const matches = lowerQuery.matchAll(pattern);
    for (const match of matches) {
      excluded.push(match[1].toLowerCase());
    }
  }

  // Check for preferred brands
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        if (!excluded.includes(brand.toLowerCase())) {
          preferred.push(brand);
        }
        break;
      }
    }
  }

  return { preferred: [...new Set(preferred)], excluded: [...new Set(excluded)] };
}

function extractRating(query: string): { minRating?: number; confidence: number } {
  const lowerQuery = query.toLowerCase();
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:\+?\s*stars?|stars?)/i,
    /rating\s*(?:above|above|over|more than|>)\s*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\+?\s*(?:star|stars)/i,
    /rated\s+(\d+(?:\.\d+)?)/i,
    /rating\s*(?:of|:)?\s*(\d+(?:\.\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      const rating = parseFloat(match[1]);
      if (rating >= 1 && rating <= 5) {
        return { minRating: rating, confidence: 0.8 };
      }
    }
  }

  return { minRating: undefined, confidence: 0 };
}

function extractSortBy(query: string): { sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'; confidence: number } {
  const lowerQuery = query.toLowerCase();

  for (const [sortBy, keywords] of Object.entries(SORT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return { sortBy: sortBy as 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest', confidence: 0.8 };
      }
    }
  }

  return { sortBy: undefined, confidence: 0 };
}

function detectIntent(query: string): { intent: 'shopping' | 'comparison' | 'research' | 'general'; confidence: number } {
  const lowerQuery = query.toLowerCase();
  const scores: Record<string, number> = { shopping: 0, comparison: 0, research: 0, general: 0 };

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        scores[intent] += 1;
      }
    }
  }

  let maxIntent = 'general';
  let maxScore = 0;
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent;
    }
  }

  return { intent: maxIntent as 'shopping' | 'comparison' | 'research' | 'general', confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3 };
}

/**
 * Main entry point for parsing a shopping query
 */
export function parseShoppingQuery(query: string): ParsedShoppingQuery {
  if (!query || query.trim().length === 0) {
    return {
      category: undefined,
      categoryConfidence: 0,
      budgetMin: undefined,
      budgetMax: undefined,
      priorities: [],
      useCases: [],
      preferredBrands: [],
      excludedBrands: [],
      osPreferences: [],
      minRating: undefined,
      sortBy: undefined,
      confidence: 0,
      originalQuery: query,
      intent: 'general',
    };
  }

  const trimmedQuery = query.trim();
  
  // Extract all entities
  const { category, confidence: categoryConfidence } = extractCategory(trimmedQuery) || { category: undefined, confidence: 0 };
  const { min: budgetMin, max: budgetMax, confidence: budgetConfidence } = extractBudget(trimmedQuery);
  const { priorities, confidence: prioritiesConfidence } = extractPriorities(trimmedQuery);
  const { useCases, confidence: useCasesConfidence } = extractUseCases(trimmedQuery);
  const { preferred: preferredBrands, excluded: excludedBrands } = extractBrands(trimmedQuery);
  const { minRating, confidence: ratingConfidence } = extractRating(trimmedQuery);
  const { sortBy, confidence: sortConfidence } = extractSortBy(trimmedQuery);
  const { intent, confidence: intentConfidence } = detectIntent(trimmedQuery);

  // Calculate overall confidence
  const confidences = [
    categoryConfidence,
    budgetConfidence,
    prioritiesConfidence,
    useCasesConfidence,
    ratingConfidence,
    sortConfidence,
    intentConfidence,
  ].filter(c => c > 0);

  const overallConfidence = confidences.length > 0 
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length 
    : 0;

  // Determine category - if not explicitly mentioned, infer from use cases
  let finalCategory = category;
  if (!finalCategory) {
    if (useCases.includes('programming') || useCases.includes('coding')) {
      finalCategory = 'laptop';
    } else if (useCases.includes('gaming')) {
      finalCategory = 'laptop';
    } else if (useCases.includes('travel')) {
      finalCategory = 'laptop';
    } else if (useCases.includes('photography')) {
      finalCategory = 'smartphone';
    } else if (useCases.includes('content_creation')) {
      finalCategory = 'laptop';
    }
  }

  return {
    category: finalCategory,
    categoryConfidence: categoryConfidence,
    budgetMin: budgetMin,
    budgetMax: budgetMax,
    priorities,
    useCases,
    preferredBrands: preferredBrands,
    excludedBrands: excludedBrands,
    osPreferences: [],
    minRating: minRating,
    sortBy: sortBy,
    confidence: overallConfidence,
    originalQuery: query,
    intent: intent,
  };
}

// Export functions
export {
  extractCategory,
  extractBudget,
  extractPriorities,
  extractUseCases,
  extractBrands,
  extractRating,
  extractSortBy,
  detectIntent,
  CATEGORY_PATTERNS,
  BUDGET_PATTERNS,
  PRIORITY_KEYWORDS,
  USE_CASE_KEYWORDS,
  BRAND_KEYWORDS,
  SORT_KEYWORDS,
  INTENT_KEYWORDS,
};