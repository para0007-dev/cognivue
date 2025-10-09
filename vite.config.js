import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Get backend configuration from environment variables
  const backendHost = process.env.VITE_DEV_BACKEND_HOST || '127.0.0.1'
  const backendPort = process.env.VITE_DEV_BACKEND_PORT || '8000'
  const backendTarget = `http://${backendHost}:${backendPort}`

  return {
    plugins: [vue()],
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5173,
      proxy: {
        '^/vitamin-d-helper/': { target: backendTarget, changeOrigin: true },
        '^/insights/': { target: backendTarget, changeOrigin: true },
        '^/timer/': { target: backendTarget, changeOrigin: true },
        '^/brain-health-news/': { target: backendTarget, changeOrigin: true },
        '^/simpleauth/': { target: backendTarget, changeOrigin: true },
        '^/nutrition/': { target: backendTarget, changeOrigin: true },
      },
    },
  }
})
