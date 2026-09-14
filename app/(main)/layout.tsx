import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeatureDiscovery } from '@/components/FeatureDiscovery';

/** Every route in this group gets the normal public site chrome. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureDiscovery>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </FeatureDiscovery>
  );
}
