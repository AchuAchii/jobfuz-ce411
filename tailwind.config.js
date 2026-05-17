/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          2: 'rgb(var(--surface2) / <alpha-value>)',
          3: 'rgb(var(--surface3) / <alpha-value>)',
        },
        surface2: 'rgb(var(--surface2) / <alpha-value>)',
        surface3: 'rgb(var(--surface3) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          dim: 'rgb(var(--brand-soft) / <alpha-value>)',
          hover: 'rgb(var(--brand-strong) / <alpha-value>)',
        },
        brand2: 'rgb(var(--accent) / <alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--text) / <alpha-value>)',
          muted: 'rgb(var(--muted) / <alpha-value>)',
          subtle: 'rgb(var(--subtle) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
        },
        muted: 'rgb(var(--muted) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          light: 'rgb(var(--success-soft) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          light: 'rgb(var(--danger-soft) / <alpha-value>)',
        },
        warn: {
          DEFAULT: 'rgb(var(--warn) / <alpha-value>)',
          light: 'rgb(var(--warn-soft) / <alpha-value>)',
        },
        'surface-0': 'rgb(var(--bg))',
        'surface-1': 'rgb(var(--surface2))',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        card: 'var(--radius)',
        panel: 'var(--radius-xl)',
        pill: '9999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        panel: 'var(--shadow-panel)',
        brand: '0 0 0 3px rgb(var(--brand) / 0.18)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '320ms',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--accent)) 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgb(var(--surface)) 0%, rgb(var(--surface2)) 100%)',
      },
    },
  },
  plugins: [],
};
