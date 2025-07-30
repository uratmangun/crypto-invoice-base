import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    watch: {
      // Ignore storage directory and data files to prevent page reloads
      ignored: ['**/storage/**', '**/data/**', '**/*.json']
    }
  }
})
