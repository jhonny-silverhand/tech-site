'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { Save, X, Edit, FileText } from 'lucide-react';

interface PrivateNotesProps {
  postId: string;
  initialNote: {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export function PrivateNotes({ postId, initialNote }: PrivateNotesProps) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote?.content || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(!initialNote); // Edit mode if no note exists

  const supabase = createClient();

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!note.trim() || saving) return;
    setSaving(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('private_notes')
      .upsert({
        post_id: postId,
        user_id: user.id,
        content: note.trim(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this private note?')) return;
    const { error } = await supabase
      .from('private_notes')
      .delete()
      .eq('post_id', postId);
    if (!error) {
      setNote('');
      setSaved(false);
      setEditing(true);
    }
  }

  if (!editing && initialNote) {
    return (
      <section className="mt-16 pt-10 border-t border-line">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-muted" />
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted">Private Note</h2>
        </div>
        <div className="prose-tech max-w-none">
          <p className="whitespace-pre-wrap">{initialNote.content}</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[12px] text-muted">
          <span>Updated {new Date(initialNote.updated_at).toLocaleDateString()}</span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-mono text-accent hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="font-mono text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 pt-10 border-t border-line">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={18} className="text-muted" />
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted">Private Note</h2>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        {error && <p className="font-mono text-[12px] text-red-600">{error}</p>}
        {saved && <p className="font-mono text-[12px] text-green-600">Note saved.</p>}
        <FieldGroup>
          <Label htmlFor="private-note">Your private note on this article</Label>
          <textarea
            id="private-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your thoughts, action items, or anything else… (only you can see this)"
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-mono text-[13.5px] leading-relaxed min-h-[120px] resize-y"
            maxLength={5000}
            disabled={saving}
          />
        </FieldGroup>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving || !note.trim()}>
            {saving ? 'Saving…' : 'Save note'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          {initialNote && (
            <Button type="button" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}