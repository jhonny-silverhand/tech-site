'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field';
import { NICHES } from '@/lib/niches';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/lib/types';

interface UserPostFormProps {
  initialPost?: Post;
  userId: string;
  authorName: string;
}

export function UserPostForm({ initialPost, userId, authorName }: UserPostFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(initialPost?.id);

  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [slug, setSlug] = useState(initialPost?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [niche, setNiche] = useState(initialPost?.niche ?? NICHES[0].slug);
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '');
  const [content, setContent] = useState(initialPost?.content ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(status: Post['status']) {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('Title, slug, and content are required.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title,
      slug,
      niche,
      excerpt: excerpt || content.slice(0, 160),
      content,
      cover_image_url: coverImageUrl || `https://picsum.photos/seed/${slug}/1200/675`,
      author_id: userId,
      author_name: authorName,
      is_ai_assisted: false,
      seo_title: title,
      seo_description: excerpt || content.slice(0, 155),
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    };

    const { error: dbError } = isEdit
      ? await supabase.from('posts').update(payload).eq('id', initialPost!.id)
      : await supabase.from('posts').insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {error}
        </div>
      )}
      <FieldGroup>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Your article title" />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="niche">Niche</Label>
        <select
          id="niche"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-[14px]"
        >
          {NICHES.map((n) => (
            <option key={n.slug} value={n.slug}>
              {n.label}
            </option>
          ))}
        </select>
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="cover">Cover image URL (optional)</Label>
        <Input id="cover" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://…" />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea id="content" rows={16} value={content} onChange={(e) => setContent(e.target.value)} />
      </FieldGroup>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" disabled={saving} onClick={() => handleSubmit('draft')}>
          Save draft
        </Button>
        <Button type="button" variant="primary" disabled={saving} onClick={() => handleSubmit('published')}>
          {saving ? 'Saving…' : 'Publish'}
        </Button>
      </div>
    </div>
  );
}
