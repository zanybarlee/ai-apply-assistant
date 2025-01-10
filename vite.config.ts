import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
}))