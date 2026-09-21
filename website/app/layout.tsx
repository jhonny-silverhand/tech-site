import type { Metadata } from 'next';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-site.example'),
  title: {
    default: 'tech/site — practical guides across AI, code, and gadgets',
    template: '%s — tech/site',
  },
  description:
    'Practical answers, not filler — across code, devices, money, careers and AI. In-depth guides, product intelligence and honest recommendations.',
  openGraph: {
    type: 'website',
    siteName: 'tech/site',
    title: 'tech/site — practical guides across AI, code, and gadgets',
    description: 'Practical answers, not filler — across code, devices, and money.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('techsite-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-body bg-bg text-ink antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
