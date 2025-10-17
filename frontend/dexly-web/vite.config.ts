import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        // opcional: si tu backend NO tiene el prefijo /api, descomenta:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})