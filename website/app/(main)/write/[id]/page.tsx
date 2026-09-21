import { notFound } from 'next/navigation';
import { getPostBySlugForEdit } from '@/lib/data';
import { UserPostForm } from '@/components/UserPostForm';
import { DeletePostButton } from '@/components/DeletePostButton';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const metadata = { title: 'Edit article' };

export default async function EditWritePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostBySlugForEdit(id);
  if (!post) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Write', href: '/write' }, { label: 'Edit' }]} />
      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Edit article</h1>
        <DeletePostButton postId={post.id} />
      </div>
      <div className="mt-6">
        <UserPostForm initial={{ title: post.title, excerpt: post.excerpt || '', content: post.content, niche: post.niche, cover_image_url: post.cover_image_url }} />
      </div>
    </div>
  );
}
