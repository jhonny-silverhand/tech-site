import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        paper: 'var(--paper)',
        sunken: 'var(--paper-2)',
        elev: 'var(--elev)',
        ink: 'var(--ink)',
        ink2: 'var(--ink-2)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        linestrong: 'var(--line-strong)',
        void: '#09090B',
        accent: 'var(--accent)',
        accentink: 'var(--accent-ink)',
        accentsoft: 'var(--accent-soft)',
        successsoft: 'var(--success-soft)',
        dangersoft: 'var(--danger-soft)',
        warnsoft: 'var(--warn-soft)',
        warn: '#FF6B35',
        success: 'var(--success)',
        danger: 'var(--danger)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        tagline: ['"Cormorant Garamond Variable"', 'Georgia', 'serif'],
        body: ['"Inter Variable"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        folder: '8px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        popover: '0 8px 24px -8px rgb(0 0 0 / 0.18), 0 2px 8px -2px rgb(0 0 0 / 0.12)',
        modal: '0 24px 64px -16px rgb(0 0 0 / 0.28), 0 4px 16px -4px rgb(0 0 0 / 0.16)',
        card: '0 1px 2px rgb(0 0 0 / 0.05)',
        lift: '0 4px 16px -4px rgb(0 0 0 / 0.12), 0 1px 4px rgb(0 0 0 / 0.06)',
      },
      animation: {
        'slash-blink': 'slash-blink 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.24s cubic-bezier(0.16, 1, 0.3, 1) both',
        popover: 'popover 0.14s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slash-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        popover: {
          from: { opacity: '0', transform: 'translateY(-3px) scale(0.99)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
