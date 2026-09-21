export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  niche: string;
  cover_image_url: string | null;
  status: 'draft' | 'published';
  author_id: string | null;
  author_name: string;
  author_avatar: string | null;
  reading_time: number;
  featured: boolean;
  tags: string[];
  niche_color: string | null;
  is_ai_assisted: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export type PostCard = Omit<Post, 'content'>;

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  social_links: Record<string, string>;
  favorite_niches: string[];
  created_at: string;
  updated_at: string;
}

export interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export interface Highlight {
  id: string;
  user_id: string;
  post_id: string;
  selected_text: string;
  note: string | null;
  location_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PrivateNote {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  post_count?: number;
}

export interface BuyingGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_slug: string | null;
  cover_image_url: string | null;
  status: string;
  author_id: string | null;
  author_name: string | null;
  is_ai_assisted: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ProductSpec {
  spec_key: string;
  spec_value: string;
  unit?: string | null;
  display_order?: number;
}

export interface ProductRetailer {
  retailer_name: string;
  retailer_slug: string;
  url: string;
  price_cents: number | null;
  currency: string;
  availability: string;
  affiliate_url: string | null;
}

export interface Product {
  id: string;
  category_slug: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  manufacturer: string | null;
  model: string | null;
  release_date: string | null;
  status: string;
  specs: ProductSpec[];
  retailers: ProductRetailer[];
  created_at: string;
  updated_at: string;
  /** True when fetched live from Gemini at request time (prices are AI estimates). */
  live?: boolean;
}

export interface LiveWinner {
  spec_key: string;
  winner_index: number;
  reason: string;
}

export interface LiveCompareProduct extends Product {
  pros: string[];
  cons: string[];
  best_for: string;
}

export interface LiveCompareResult {
  products: LiveCompareProduct[];
  winners: LiveWinner[];
  verdict: string;
  price_guidance: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  description: string | null;
}

export interface GuideRecommendation {
  id: string;
  label: string;
  reason: string | null;
  pros: string[];
  cons: string[];
  display_order: number;
  product: Product | null;
}

export interface AIRecommendation {
  name: string;
  manufacturer?: string;
  model?: string;
  label: string;
  reasoning: string;
  pros: string[];
  cons: string[];
  estimated_price_inr?: number;
  buy_links?: { retailer: string; url: string }[];
  product_slug?: string;
}

export interface PCComponent {
  category: string;
  name: string;
  price_inr: number;
  reasoning: string;
  buy_link?: string;
}

export interface PCBuild {
  tier: string;
  total_inr: number;
  use_case: string;
  components: PCComponent[];
  notes: string;
}

export interface SearchIndexItem {
  type: 'post' | 'niche' | 'product' | 'guide';
  title: string;
  slug: string;
  url: string;
  excerpt?: string;
  niche?: string;
}
