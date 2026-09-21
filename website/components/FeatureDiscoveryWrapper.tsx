'use client';

import dynamic from 'next/dynamic';

const FeatureDiscovery = dynamic(() => import('./FeatureDiscovery').then((m) => m.FeatureDiscovery), {
  ssr: false,
});

export function FeatureDiscoveryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FeatureDiscovery />
      {children}
    </>
  );
}
