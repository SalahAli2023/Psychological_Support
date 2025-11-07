/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#9EBF3B',
        },
        accent: {
          500: '#D6A29A',
        }
      },
    },
  },
  plugins: [],
}