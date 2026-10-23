import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor'
            }
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Enable image optimization
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  }
})
