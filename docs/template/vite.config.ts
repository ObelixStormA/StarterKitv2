import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  // Use root-relative asset paths so nested routes work after refresh/direct visits.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'adminex-spa-fallback',
      closeBundle() {
        const indexHtmlPath = path.resolve(__dirname, 'dist/index.html')
        const notFoundHtmlPath = path.resolve(__dirname, 'dist/404.html')
        if (fs.existsSync(indexHtmlPath)) {
          fs.copyFileSync(indexHtmlPath, notFoundHtmlPath)
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
