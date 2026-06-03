import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f0ff',
          500: '#6c63ff',
          600: '#5a52e0',
          700: '#4840c0',
        },
      },
    },
  },
  plugins: [],
}

export default config
