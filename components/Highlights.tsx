'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { Edit, Trash2, Save, X, Highlighter } from 'lucide-react';

interface HighlightsProps {
  postId: string;
  initialHighlights: Array<{
    id: string;
    selected_text: string;
    note: string | null;
    created_at: string;
    updated_at: string;
  }>;
}

export function Highlights({ postId, initialHighlights }: HighlightsProps) {
  const router = useRouter();
  const [highlights, setHighlights] = useState(initialHighlights);
  const [newHighlight, setNewHighlight] = useState('');
  const [newNote, setNewNote] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handlePost(e: FormEvent) {
    e.preventDefault();
    if (!newHighlight.trim() || posting) return;
    setPosting(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      setPosting(false);
      return;
    }

    const { data, error } = await supabase
      .from('highlights')
      .insert({
        post_id: postId,
        user_id: user.id,
        selected_text: newHighlight.trim(),
        note: newNote.trim() || null,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setPosting(false);
      return;
    }

    setHighlights(prev => [...prev, data]);
    setNewHighlight('');
    setNewNote('');
    setPosting(false);
  }

  function startEdit(highlight: typeof highlights[0]) {
    setEditingId(highlight.id);
    setEditNote(highlight.note || '');
  }

  async function handleEdit(highlightId: string) {
    const { error } = await supabase
      .from('highlights')
      .update({ note: editNote.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', highlightId);
    if (!error) {
      setHighlights(prev => prev.map(h => 
        h.id === highlightId ? { ...h, note: editNote.trim() || null, updated_at: new Date().toISOString() } : h
      ));
    }
    setEditingId(null);
    setEditNote('');
  }

  async function handleDelete(highlightId: string) {
    if (!confirm('Delete this highlight?')) return;
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', highlightId);
    if (!error) {
      setHighlights(prev => prev.filter(h => h.id !== highlightId));
    }
  }

  return (
    <section className="mt-16 pt-10 border-t border-line">
      <div className="flex items-center gap-2 mb-6">
        <Highlighter size={18} className="text-accent" />
        <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted">
          Your Highlights ({highlights.length})
        </h2>
      </div>

      {/* Add Highlight Form */}
      <form onSubmit={handlePost} className="mb-10 space-y-4">
        <FieldGroup>
          <Label htmlFor="highlight-text">Highlighted text</Label>
          <textarea
            id="highlight-text"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Paste the text you want to save…"
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-mono text-[13.5px] leading-relaxed min-h-[80px] resize-y"
            maxLength={2000}
            disabled={posting}
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="highlight-note">Your note (optional)</Label>
          <textarea
            id="highlight-note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a personal note about why this matters…"
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-mono text-[13.5px] leading-relaxed min-h-[60px] resize-y"
            maxLength={1000}
            disabled={posting}
          />
        </FieldGroup>
        {error && <p className="font-mono text-[12px] text-red-600">{error}</p>}
        <Button type="submit" disabled={posting || !newHighlight.trim()}>
          {posting ? 'Saving…' : 'Save highlight'}
        </Button>
      </form>

      {/* Highlights List */}
      {highlights.length === 0 ? (
        <p className="font-mono text-[13px] text-muted text-center py-8">
          No highlights yet. Select text on any article and save it here.
        </p>
      ) : (
        <ul className="space-y-4">
          {highlights.map((highlight) => (
            <li key={highlight.id} className="bg-paper/50 rounded-folder border border-line p-4">
              <blockquote className="text-[15px] leading-relaxed text-ink border-l-2 border-accent pl-4 italic">
                {highlight.selected_text}
              </blockquote>
              {highlight.note && (
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  <span className="font-mono text-[11px] text-accent">Note:</span>{' '}
                  {highlight.note}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted">
                  {new Date(highlight.created_at).toLocaleDateString()}
                </span>
                {editingId === highlight.id ? (
                  <>
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEdit(highlight.id)}
                      className="flex-1 rounded-md border border-line bg-paper px-3 py-1.5 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                      autoFocus
                    />
                    <button type="button" onClick={() => handleEdit(highlight.id)} className="text-accent hover:underline font-mono text-[11px]">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-muted hover:text-ink font-mono text-[11px]">Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => startEdit(highlight)} className="font-mono text-[11px] text-muted hover:text-ink">Edit note</button>
                    <button type="button" onClick={() => handleDelete(highlight.id)} className="font-mono text-[11px] text-red-600 hover:text-red-700">Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}