import type { Metadata } from 'next';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import { CommandPalette } from '@/components/CommandPalette';

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

// Runs synchronously before paint, so the correct theme applies before
// the browser ever renders a frame — without this, a saved 'dark'
// preference would flash light for an instant on every load. Reads
// localStorage first, falls back to OS preference if nothing's been
// chosen yet. Wrapped in try/catch since localStorage can throw in some
// privacy/incognito configurations, and a theme flash is a much smaller
// problem than a broken page.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

/**
 * Deliberately minimal — just html/body/fonts/theme-init/command-palette.
 * Header and Footer used to live here, but that meant every route got the
 * public site chrome whether it made sense or not. They now live in
 * (main)/layout.tsx instead; (auth)/layout.tsx renders its own editorial
 * shell with no site header/footer at all — see the 3.5 auth work for why.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-body antialiased bg-bg text-ink transition-colors">
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
