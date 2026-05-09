/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F47B3F',
        secondary: '#7FB6CC',
        cream: '#FAF3E0',
      },
    },
  },
  plugins: [],
};
