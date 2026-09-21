export type PostStatus = 'draft' | 'published';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // markdown
  niche: string; // niche slug, see lib/niches.ts
  cover_image_url: string;
  status: PostStatus;
  author_id: string | null; // null for admin-authored posts
  author_name: string;
  is_ai_assisted: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export type NewPost = Omit<Post, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export interface Niche {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  color: string; // hex, used for the dot/tag system
}

export interface GeneratedDraft {
  title: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Highlight {
  id: string;
  user_id: string;
  post_id: string;
  selected_text: string;
  note: string | null;
  location_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  posts?: { title: string; slug: string } | null;
}

export interface PrivateNote {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  posts?: { title: string; slug: string } | null;
}

export interface ReadingQueueItem {
  id: string;
  user_id: string;
  post_id: string;
  added_at: string;
  posts?: Post | null;
}

export interface AuthorFollow {
  id: string;
  user_id: string;
  author_id: string;
  created_at: string;
}

export interface TopicFollow {
  id: string;
  user_id: string;
  niche_slug: string;
  created_at: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  description: string | null;
  spec_schema: Record<string, unknown>;
  created_at: string;
}

export interface Product {
  id: string;
  category_slug: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  manufacturer: string | null;
  model: string | null;
  release_date: string | null;
  status: 'active' | 'discontinued' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_key: string;
  spec_value: string;
  unit: string | null;
  display_order: number;
}

export interface Retailer {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  logo_url: string | null;
  is_official: boolean;
  affiliate_base_url: string | null;
  created_at: string;
}

export interface ProductRetailer {
  id: string;
  product_id: string;
  retailer_id: string;
  url: string;
  price_cents: number | null;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
  affiliate_url: string | null;
  last_checked: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuyingGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_slug: string;
  cover_image_url: string | null;
  status: 'draft' | 'published';
  author_id: string | null;
  author_name: string;
  is_ai_assisted: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BuyingGuideRecommendation {
  id: string;
  guide_id: string;
  product_id: string;
  label: string;
  reason: string | null;
  pros: string[];
  cons: string[];
  display_order: number;
  created_at: string;
}
