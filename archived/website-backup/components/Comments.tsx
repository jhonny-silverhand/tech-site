'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { Edit, Trash2, Save, X } from 'lucide-react';
import type { CommentWithProfile } from '@/lib/library';

interface CommentsProps {
  postId: string;
  initialComments: CommentWithProfile[];
}

export function Comments({ postId, initialComments }: CommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentsProps['initialComments']>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user on mount
  const supabase = createClient();
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (user) setUserId(user.id);
  });

  async function handlePost(e: FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || posting) return;
    setPosting(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      setPosting(false);
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content: newComment.trim() })
      .select('*, profiles!user_id(display_name, username, avatar_url)')
      .single();

    if (error) {
      setError(error.message);
      setPosting(false);
      return;
    }

    setComments(prev => [...prev, data as CommentWithProfile]);
    setNewComment('');
    setPosting(false);
  }

  function startEdit(comment: CommentWithProfile) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  async function handleEdit(commentId: string) {
    if (!editContent.trim()) return;
    const { error } = await supabase
      .from('comments')
      .update({ content: editContent.trim(), updated_at: new Date().toISOString() })
      .eq('id', commentId);
    if (!error) {
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, content: editContent.trim(), updated_at: new Date().toISOString() } : c
      ));
    }
    setEditingId(null);
    setEditContent('');
  }

  async function handleDelete(commentId: string) {
    if (!confirm('Delete this comment?')) return;
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  }

  function canManage(comment: CommentWithProfile): boolean {
    return userId === comment.user_id;
  }

  return (
    <section aria-label="Comments" className="rounded-folder border border-line bg-paper p-5">
      <h2 className="font-display text-xl font-semibold text-ink">
        Comments ({comments.length})
      </h2>

      {comments.length === 0 && (
        <p className="mt-2 text-sm text-muted">No comments yet. Start the discussion.</p>
      )}

      {/* Comment Form */}
      <form onSubmit={handlePost} className="mt-4 flex flex-col gap-2">
        <FieldGroup>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts…"
            aria-label="Write a comment"
            className="w-full rounded-folder border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent leading-relaxed min-h-[90px] resize-y"
            maxLength={2000}
            disabled={posting}
          />
        </FieldGroup>
        {error && <p className="mt-2 font-mono text-[12px] text-red-600">{error}</p>}
        <Button type="submit" disabled={posting || !newComment.trim()} className="self-start">
          {posting ? 'Posting…' : 'Post comment'}
        </Button>
      </form>

      {/* Comments List */}
      {comments.length > 0 && (
        <ul className="mt-6 space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10">
                {comment.profiles?.avatar_url ? (
                  <Image
                    src={comment.profiles.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="font-display text-lg text-accent">
                      {(comment.profiles?.display_name || comment.profiles?.username || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-[15px] text-ink">
                    {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
                  </p>
                  {comment.profiles?.username && (
                    <span className="font-mono text-[11px] text-muted">@{comment.profiles.username}</span>
                  )}
                  <span className="font-mono text-[11px] text-muted">
                    {formatDate(comment.created_at)}
                  </span>
                  {comment.updated_at !== comment.created_at && (
                    <span className="font-mono text-[11px] text-muted/60">(edited)</span>
                  )}
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-ink whitespace-pre-wrap">{comment.content}</p>
                {canManage(comment) && (
                  <div className="mt-2 flex items-center gap-2">
                    {editingId === comment.id ? (
                      <>
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEdit(comment.id)}
                          className="flex-1 rounded-md border border-line bg-paper px-3 py-1.5 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                          autoFocus
                        />
                        <button type="button" onClick={() => handleEdit(comment.id)} className="text-accent hover:underline font-mono text-[11px]">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="text-muted hover:text-ink font-mono text-[11px]">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEdit(comment)} className="font-mono text-[11px] text-muted hover:text-ink">Edit</button>
                        <button type="button" onClick={() => handleDelete(comment.id)} className="font-mono text-[11px] text-red-600 hover:text-red-700">Delete</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}