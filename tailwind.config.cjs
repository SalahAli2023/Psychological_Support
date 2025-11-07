/** @type {import('tailwindcss').Config} */
module.exports = {
      darkMode: 'class',
      content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
      theme: {
            extend: {
                  colors: {
                        brand: {
                              DEFAULT: '#9EBF3B',
                              500: '#9EBF3B',
                        },
                        accent: {
                              DEFAULT: '#D6A29A',
                              500: '#D6A29A',
                        }
                  },
                  fontFamily: {
                        sans: ['Tajawal', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
                  }
            }
      },
      plugins: [
            require('@tailwindcss/forms'),
            require('@tailwindcss/typography'),
            require('tailwindcss-rtl')
      ]
};
