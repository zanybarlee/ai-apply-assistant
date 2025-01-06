import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 8080,
    strictPort: true, // Fail if port is already in use
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})