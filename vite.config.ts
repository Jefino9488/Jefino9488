import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Brotli compression for all JS/CSS assets (modern browsers prefer it)
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(png|jpg|jpeg|webp|gif|svg|ico|woff|woff2)$/],
    }),
    // Gzip as fallback for older CDN/servers
    compression({
      algorithm: 'gzip',
      exclude: [/\.(png|jpg|jpeg|webp|gif|svg|ico|woff|woff2)$/],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  build: {
    // Target modern browsers for smaller, faster bundles
    target: 'es2020',
    // esbuild minification is fast and produces great output
    minify: 'esbuild',
    // Split CSS by chunk for better caching granularity
    cssCodeSplit: true,
    // Limit aggressive inlining — keep assets as separate cacheable files
    assetsInlineLimit: 4096,
    // Sourcemaps in production for error tracking (comment out to disable)
    sourcemap: false,
    rollupOptions: {
      output: {
        // Filename patterns include content hash for immutable caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // React and routing — most stable, cache longest
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          // Three.js ecosystem — large, loaded lazily for Background
          if (
            id.includes('@react-three') ||
            id.includes('three') ||
            id.includes('maath')
          ) {
            return 'three-vendor';
          }
          // Framer Motion — animation library
          if (id.includes('framer-motion')) {
            return 'framer-vendor';
          }
          // Radix UI + Lucide icons
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          // Markdown rendering (blog pages only — defer)
          if (
            id.includes('react-markdown') ||
            id.includes('rehype') ||
            id.includes('remark') ||
            id.includes('react-syntax-highlighter')
          ) {
            return 'markdown-vendor';
          }
          // Google Generative AI (Chatbot only — defer)
          if (id.includes('@google/genai')) {
            return 'ai-vendor';
          }
        },
      },
      // Ensure server-only packages never enter the client bundle
      external: (id) => {
        // These packages must never be in the browser bundle
        const serverOnly = ['express', 'dotenv', 'node-fetch', 'next'];
        return serverOnly.some((pkg) => id === pkg || id.startsWith(pkg + '/'));
      },
    },
    // Warn on chunks > 400KB (stricter — aim for < 250KB per chunk)
    chunkSizeWarningLimit: 400,
  },
  // Optimize deps pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
  },
})
