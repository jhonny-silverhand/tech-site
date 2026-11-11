'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageIcon } from 'lucide-react';
import { NICHES } from '@/lib/niches';
import { Input, Textarea, Field } from './ui/Field';
import { Button } from './ui/Button';

export function UserPostForm({ initial }: { initial?: { title: string; excerpt: string; content: string; niche: string; cover_image_url?: string | null } }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [content, setContent] = useState(initial?.content || '');
  const [niche, setNiche] = useState(initial?.niche || 'programming');
  const [cover, setCover] = useState(initial?.cover_image_url || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/user-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, content, niche, cover_image_url: cover.trim() || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Publish failed');
      router.push(`/articles/${json.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Title" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={10} placeholder="A clear, specific title…" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Topic" required>
          <select value={niche} onChange={(e) => setNiche(e.target.value)} aria-label="Topic" className="h-10 w-full cursor-pointer appearance-none rounded-md border border-line bg-paper px-3 pr-8 text-sm text-ink hover:border-linestrong focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring">
            {NICHES.map((n) => (
              <option key={n.slug} value={n.slug}>{n.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Excerpt" required hint="One sentence — shown on cards and search.">
          <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required minLength={20} placeholder="One-sentence summary…" />
        </Field>
      </div>
      <Field
        label="Cover picture"
        hint="Paste an image URL, or leave empty — every article automatically gets a picture."
      >
        <Input
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          inputMode="url"
          placeholder="https://… (optional)"
          aria-label="Cover picture URL, optional"
        />
      </Field>
      {cover.trim() ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-line bg-sunken">
          <Image src={cover.trim()} alt="Cover preview" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
        </div>
      ) : (
        <p className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-linestrong bg-paper px-3 py-2.5 text-[13px] text-muted">
          <ImageIcon size={14} aria-hidden className="flex-none text-faint" />
          No URL pasted — a picture will be auto-generated for this article.
        </p>
      )}
      <Field label="Content (Markdown)" required>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} required minLength={200} rows={18} className="font-mono" placeholder="Write your article in Markdown…" />
      </Field>
      {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
      <Button type="submit" size="lg" loading={busy} className="self-start">
        {busy ? 'Publishing…' : 'Publish article'}
      </Button>
    </form>
  );
}
