import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: { 50: '#effcf8', 500: '#16a085', 600: '#0e8a72', 700: '#08715e' } },
      boxShadow: { panel: '0 1px 3px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.03)' }
    }
  },
  plugins: []
} satisfies Config
