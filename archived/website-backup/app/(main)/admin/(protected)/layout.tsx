import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) redirect('/admin/login');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-8">
      <AdminNav />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
