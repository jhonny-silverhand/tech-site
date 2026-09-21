import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeatureDiscoveryWrapper } from '@/components/FeatureDiscoveryWrapper';

/** Every route in this group gets the normal public site chrome. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureDiscoveryWrapper>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </FeatureDiscoveryWrapper>
  );
}
