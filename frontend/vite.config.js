import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    cssMinify: 'esbuild',
    // Raise warning threshold (admin chunks are large but rarely visited)
    chunkSizeWarningLimit: 1500,
    // Minify with esbuild (faster than terser, nearly same output)
    minify: 'esbuild',
    // Enable source maps only in dev; skip for prod to reduce output size
    sourcemap: false,
    rollupOptions: {
      output: {
        // Fine-grained manual chunks — splits vendor code for better caching
        manualChunks(id) {
          // Three.js + react-three ecosystem — largest chunk, rarely changes
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor'
          }
          // React core — changes rarely, should be cached long-term
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor'
          }
          // React Router
          if (id.includes('react-router')) {
            return 'router-vendor'
          }
          // Admin panel — only visited by admins, large, isolated chunk
          if (id.includes('/Admin/')) {
            return 'admin'
          }
          // Everything else from node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
  // Pre-bundle heavy deps so dev server starts fast
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
})
