// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss() // ✅ هنا داخل المصفوفة وليس خارجها
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // يضمن أن @ تشير إلى مجلد src
    }
  }
})
