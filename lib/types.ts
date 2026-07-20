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
