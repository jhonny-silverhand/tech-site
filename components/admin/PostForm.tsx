'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field';
import { NICHES, getNiche } from '@/lib/niches';
import { slugify } from '@/lib/utils';
import type { Post } from '@/lib/types';

interface PostFormProps {
  initialPost?: Post;
}

export function PostForm({ initialPost }: PostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialPost?.id);

  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [slug, setSlug] = useState(initialPost?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [niche, setNiche] = useState(initialPost?.niche ?? NICHES[0].slug);
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '');
  const [content, setContent] = useState(initialPost?.content ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url ?? '');
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title ?? '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seo_description ?? '');
  const [isAiAssisted, setIsAiAssisted] = useState(initialPost?.is_ai_assisted ?? false);

  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleGenerate() {
    if (!topic.trim()) {
      setError('Enter a topic first.');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, niche }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed.');
      setTitle(data.title);
      if (!slugTouched) setSlug(slugify(data.title));
      setExcerpt(data.excerpt);
      setContent(data.content);
      setSeoTitle(data.seo_title);
      setSeoDescription(data.seo_description);
      setIsAiAssisted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      setCoverImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(nextStatus: Post['status']) {
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
      cover_image_url: coverImageUrl,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      is_ai_assisted: isAiAssisted,
      status: nextStatus,
    };
    try {
      const res = await fetch(isEdit ? `/api/admin/posts/${initialPost!.id}` : '/api/admin/posts', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed.');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div>
        {error && (
          <div className="mb-4 rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            {error}
          </div>
        )}

        <FieldGroup>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Article title" />
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
            placeholder="article-title"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="One or two sentences shown on cards and in search results"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="## Start writing, or generate a draft from the panel on the right"
          />
        </FieldGroup>

        <div className="grid grid-cols-2 gap-4">
          <FieldGroup>
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title || 'Defaults to title'}
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="seoDescription">SEO description</Label>
            <Input
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder={excerpt || 'Defaults to excerpt'}
            />
          </FieldGroup>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-folder border border-line bg-paper p-4">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-3">Generate draft — admin only</p>
          <Textarea
            rows={2}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic, e.g. 'how to reduce Docker image size'"
            className="mb-2"
          />
          <Button type="button" variant="secondary" className="w-full" disabled={generating} onClick={handleGenerate}>
            {generating ? 'Generating…' : 'Generate draft'}
          </Button>
          <p className="mt-2 text-[12px] text-muted leading-relaxed">
            Fills the fields on the left. Always read and edit before publishing — an unedited AI dump is a search
            ranking risk, not just a quality one.
          </p>
        </div>

        <div className="rounded-folder border border-line bg-paper p-4">
          <Label htmlFor="niche">Niche</Label>
          <select
            id="niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-[14px] mb-4"
          >
            {NICHES.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.label}
              </option>
            ))}
          </select>

          <Label htmlFor="cover">Cover image URL</Label>
          <Input
            id="cover"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://…"
            className="mb-2"
          />
          <label className="block">
            <span className="sr-only">Upload cover image</span>
            <input
              type="file"
              accept="image/*"
              className="text-[12px] font-mono"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
          {uploading && <p className="text-[12px] text-muted mt-1">Uploading…</p>}
          {coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="mt-3 rounded-folder aspect-[16/9] object-cover w-full" />
          )}

          <label className="mt-4 flex items-center gap-2 text-[13px] text-ink">
            <input type="checkbox" checked={isAiAssisted} onChange={(e) => setIsAiAssisted(e.target.checked)} />
            AI-assisted draft
          </label>
        </div>

        <div className="rounded-folder border border-line bg-paper p-4 space-y-2">
          <Button type="button" variant="ghost" className="w-full" disabled={saving} onClick={() => handleSubmit('draft')}>
            Save draft
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-full border-0"
            style={{ backgroundColor: getNiche(niche)?.color }}
            title="Adopts the selected niche's color"
            disabled={saving}
            onClick={() => handleSubmit('published')}
          >
            {saving ? 'Saving…' : 'Publish'}
          </Button>
        </div>
      </aside>
    </div>
  );
}
