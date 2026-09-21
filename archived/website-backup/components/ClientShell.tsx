'use client';

import dynamic from 'next/dynamic';
import { ProductModalProvider } from '@/components/ProductDetailModal';

const CommandPalette = dynamic(() => import('@/components/CommandPalette').then(m => m.CommandPalette), { ssr: false });
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(m => m.SpeedInsights), { ssr: false });

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ProductModalProvider>
      <CommandPalette />
      <SpeedInsights />
      {children}
    </ProductModalProvider>
  );
}
