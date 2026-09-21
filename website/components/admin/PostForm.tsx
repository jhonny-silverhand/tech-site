'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload } from 'lucide-react';
import { NICHES } from '@/lib/niches';
import { Input, Textarea, Field } from '../ui/Field';
import { Button } from '../ui/Button';

export function PostForm({
  initial,
}: {
  initial?: { id?: string; title: string; excerpt: string; content: string; niche: string; status: string; featured: boolean; cover_image_url?: string | null };
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [content, setContent] = useState(initial?.content || '');
  const [cover, setCover] = useState(initial?.cover_image_url || '');
  const [niche, setNiche] = useState(initial?.niche || 'programming');
  const [status, setStatus] = useState(initial?.status || 'draft');
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  async function generate() {
    if (!title.trim() || generating) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, niche }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Generation failed');
      setContent(json.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || uploading) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setContent((c) => `${c}\n\n![${file.name}](${json.url})\n`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const url = isEdit ? `/api/admin/posts/${initial!.id}` : '/api/admin/posts';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, content, niche, status, featured, cover_image_url: cover.trim() || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <Field label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Article title…" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Topic">
          <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full rounded-folder border border-line bg-paper px-3 py-2 text-sm">
            {NICHES.map((n) => (
              <option key={n.slug} value={n.slug}>{n.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-folder border border-line bg-paper px-3 py-2 text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <label className="flex items-end gap-2 pb-2 text-sm text-ink">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
      </div>
      <Field label="Excerpt">
        <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One-sentence summary…" />
      </Field>
      <Field label="Cover picture" hint="Paste a URL, upload below, or leave empty — a picture is auto-generated.">
        <Input value={cover} onChange={(e) => setCover(e.target.value)} inputMode="url" placeholder="https://… (optional)" aria-label="Cover picture URL, optional" />
      </Field>
      {cover.trim() && (
        <div className="overflow-hidden rounded-lg border border-line bg-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.trim()} alt="Cover preview" className="aspect-[16/9] w-full object-cover" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={generate} disabled={generating || !title.trim()}>
          <Sparkles size={15} /> {generating ? 'Generating…' : 'AI Generate Draft'}
        </Button>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-folder border border-line bg-paper px-4 py-2 text-sm font-medium text-ink hover:border-ink">
          <Upload size={15} /> {uploading ? 'Uploading…' : 'Upload image'}
          <input type="file" accept="image/*" className="hidden" onChange={upload} />
        </label>
      </div>
      <Field label="Content (Markdown)">
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={22} className="font-mono text-[13px]" />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={busy} className="self-start">
        {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create post'}
      </Button>
    </form>
  );
}
