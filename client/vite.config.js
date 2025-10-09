import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://stock-pilot-2.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
