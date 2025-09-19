import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      // forward all /insights/* requests to Django dev server
      '^/insights/': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '^/nutrition/': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
    },
  },
})
