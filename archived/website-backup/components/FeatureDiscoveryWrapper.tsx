'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const FeatureDiscovery = dynamic(() => import('@/components/FeatureDiscovery').then(m => m.FeatureDiscovery), { ssr: false });

export function FeatureDiscoveryWrapper({ children }: { children: ReactNode }) {
  return <FeatureDiscovery>{children}</FeatureDiscovery>;
}
