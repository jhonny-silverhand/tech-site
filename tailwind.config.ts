import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#EFF3F6',
        paper: '#FFFFFF',
        ink: '#12151A',
        void: '#09090B',
        mutedOnDark: '#9CA3AF',
        muted: '#5B6472',
        line: '#DBE1E6',
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
