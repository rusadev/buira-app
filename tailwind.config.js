/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        coffee: {
          50: '#faf6f0',
          100: '#f4ece1',
          500: '#8c5946',
          600: '#734435',
          700: '#5a3327',
          800: '#43251c',
          900: '#2d1812',
        },
        geprek: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      }
    },
  },
  plugins: [],
}
