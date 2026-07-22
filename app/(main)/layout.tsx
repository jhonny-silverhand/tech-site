import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

/** Every route in this group gets the normal public site chrome. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
