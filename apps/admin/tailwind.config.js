/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b7355',
          light: '#a08b6d',
          dark: '#6b5a43',
        },
        heading: '#1a1a2e',
        body: '#334155',
        sub: '#64748b',
        muted: '#94a3b8',
        border: {
          DEFAULT: '#e8e4df',
          input: '#d4d0cb',
        },
        surface: {
          DEFAULT: '#fff',
          main: '#f8f7f5',
          hover: '#faf9f7',
          sub: '#f1f0ee',
        },
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#2563eb',
      },
      fontFamily: {
        serif: ["'Noto Serif JP'", 'serif'],
        mono: ["'DM Mono'", 'monospace'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.5' }],
        sm: ['12px', { lineHeight: '1.5' }],
        base: ['13px', { lineHeight: '1.6' }],
        md: ['14px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.4' }],
        xl: ['26px', { lineHeight: '1.3' }],
        '2xl': ['30px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        DEFAULT: '10px',
        lg: '14px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};
