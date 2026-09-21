import { PostForm } from '@/components/admin/PostForm';

export const metadata = { title: 'New Post' };

export default function AdminNewPostPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">New post</h1>
      <p className="mt-1 text-sm text-muted">AI draft generation + image upload included.</p>
      <div className="mt-6"><PostForm /></div>
    </div>
  );
}
