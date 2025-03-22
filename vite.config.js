import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ["2129-197-157-184-238.ngrok-free.app"]
  }
})