import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'

// Cargar .env desde la raíz
dotenv.config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
  plugins: [react()],
  esbuild: {
    include: [/\.jsx?$/, /\.tsx?$/],
    loader: 'tsx',
    exclude: [],
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
      '/images': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        cliente: 'frontend/cliente/index.html',
        admin: 'frontend/admin/index.html',
        login: 'frontend/login/index.html',
      },
    },
  },
  define: {
    'process.env': process.env,
  },
})