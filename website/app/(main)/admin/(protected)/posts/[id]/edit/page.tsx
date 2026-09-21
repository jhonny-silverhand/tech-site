import { notFound } from 'next/navigation';
import { getPostBySlugForEdit } from '@/lib/data';
import { PostForm } from '@/components/admin/PostForm';

export const metadata = { title: 'Edit Post' };

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostBySlugForEdit(id);
  if (!post) notFound();
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Edit post</h1>
      <div className="mt-6">
        <PostForm initial={{ id: post.id, title: post.title, excerpt: post.excerpt || '', content: post.content, niche: post.niche, status: post.status, featured: post.featured, cover_image_url: post.cover_image_url }} />
      </div>
    </div>
  );
}
