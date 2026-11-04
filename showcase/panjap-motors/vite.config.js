import { defineConfig } from 'vite'
import { seoPlugin } from './seo/plugin.mjs'

// The dev server is intentionally reachable from the Arena preview proxy:
// bind to all interfaces and allow the generated *.e2b.app host header.
export default defineConfig({
  plugins: [seoPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    // Three.js lives in its own async chunk (loaded for the Spatial Studio).
    chunkSizeWarningLimit: 700,
  },
})
