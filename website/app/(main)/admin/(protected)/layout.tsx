import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdminRequest();
  if (!ok) redirect('/admin/login');
  return (
    <div className="min-h-screen bg-bg">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
