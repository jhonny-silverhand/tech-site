'use client';

import dynamic from 'next/dynamic';
import { RouteProgress } from './RouteProgress';
import { ThemeCelebration } from './ThemeCelebration';
import { SiteToast } from './SiteToast';

const CommandPalette = dynamic(() => import('./CommandPalette').then((m) => m.CommandPalette), {
  ssr: false,
});
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then((m) => m.SpeedInsights), {
  ssr: false,
});

export function ClientShell({ children }: { children: React.ReactNode }) {
  // SpeedInsights script is only served on Vercel — self-hosted `next start`
  // 404s on /_vercel/speed-insights/script.js, so render it there only.
  const onVercel = !!process.env.NEXT_PUBLIC_VERCEL_ENV;
  return (
    <>
      <RouteProgress />
      <ThemeCelebration />
      {children}
      <CommandPalette />
      <SiteToast />
      {onVercel && <SpeedInsights />}
    </>
  );
}
