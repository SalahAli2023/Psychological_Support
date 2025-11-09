// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  // base: process.env.NODE_ENV === 'production' ? '/psychological_support/' : './',
  base: '/Psychological_Support/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') 
    }
  }
})
