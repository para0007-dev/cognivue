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
      '^/vitamin-d-helper/': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '^/insights/': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '^/timer/': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '^/brain-health-news/': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
})
