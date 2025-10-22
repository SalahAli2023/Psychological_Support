// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // الألوان الأساسية
        'primary-green': '#9EBF3B',
        'primary-pink': '#D6A29A',
        
        // ألوان إضافية يمكن استخدامها
        'secondary-green': '#8AA835',
        'secondary-pink': '#C49085',
        
        // ألوان النص
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'text-light': '#9CA3AF',
      },
      fontFamily: {
        'almarai': ['Almarai', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif'], // خط احتياطي
      },
      fontSize: {
        // نظام أحجام الخطوط المخصص
        'heading-1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-2': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-3': ['1.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-4': ['1.5rem', { lineHeight: '1.5', fontWeight: '600' }],
        
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-base': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 30px -4px rgba(0, 0, 0, 0.12)',
        'large': '0 20px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}