import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['recharts']
  },
  optimizeDeps: {
    include: ['recharts']
  }, // Added missing comma here
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Ensure Recharts is handled correctly during the build phase
  build: {
    commonjsOptions: {
      include: [/recharts/, /node_modules/],
    },
  },
})
