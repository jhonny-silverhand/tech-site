import type { Metadata } from 'next';
// @ts-ignore: Implicitly treat fontsource side-effect imports as any/module
import '@fontsource-variable/fraunces';
// @ts-ignore: Implicitly treat fontsource side-effect imports as any/module
import '@fontsource-variable/cormorant-garamond';
// @ts-ignore: Implicitly treat fontsource side-effect imports as any/module
import '@fontsource-variable/inter';
// @ts-ignore: Implicitly treat fontsource side-effect imports as any/module
import '@fontsource-variable/jetbrains-mono';
// Allow importing global CSS in environments where TypeScript doesn't
// provide automatic declarations for side-effect CSS imports.
// @ts-ignore: Implicitly treat CSS import as any/module
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommandPalette } from '@/components/CommandPalette';
import { Analytics } from '@vercel/analytics/next';

// Brand typefaces, matched to the tech//site logo, self-hosted via
// Fontsource rather than next/font/google — same font files Google Fonts
// serves, but bundled into the app at build time with zero runtime request
// to any Google domain (better for privacy-conscious deployments, and it
// keeps working if fonts.googleapis.com is ever unreachable). Fraunces and
// Cormorant Garamond carry the editorial brand identity; Inter and
// JetBrains Mono (added for the v1.2 design pass) handle body copy and
// code/metadata chrome respectively. See Guides/03-what-to-edit.md for why
// these and not "Editorial New" / "Canela" / "SF Pro" (all suggested at
// some point — all paid or platform-locked, none redistributable here).

// Update to your real production domain once you have one — this is what
// lets the opengraph-image resolve to a full URL for social previews.
export const metadata: Metadata = {
  metadataBase: new URL('https://tech-site.example'),
  title: {
    default: 'tech/site — practical guides across AI, code, and gadgets',
    template: '%s — tech/site',
  },
  description:
    'Practical, no-fluff guides on AI tools, programming, Android, Windows & Linux, buying guides, gaming, careers, finance, and productivity.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CommandPalette />
        <Analytics />
      </body>
    </html>
  );
}
