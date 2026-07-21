import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backed by CSS variables (globals.css) that flip value under the
        // .dark class — every existing bg-bg / text-ink / border-line
        // usage across the codebase becomes theme-aware automatically.
        // The <alpha-value> placeholder is Tailwind's own substitution
        // for opacity modifiers (bg-paper/60 etc.) to keep working.
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        // Fixed — identical in both themes, see the comment in globals.css.
        void: '#09090B',
        mutedOnDark: '#9CA3AF',
        accent: '#4F7DFF',
        warn: '#FF6B35',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Iowan Old Style', 'Georgia', 'Times New Roman', 'serif'],
        tagline: ['"Cormorant Garamond Variable"', 'Georgia', 'serif'],
        body: ['"Inter Variable"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: [
          '"JetBrains Mono Variable"',
          'ui-monospace',
          'SF Mono',
          'Cascadia Code',
          'Consolas',
          'Courier New',
          'monospace',
        ],
      },
      borderRadius: {
        folder: '7px',
      },
      keyframes: {
        slashBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'slash-blink': 'slashBlink 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
