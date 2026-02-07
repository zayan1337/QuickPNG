import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    exclude: ['@imgly/background-removal'],
  },
});
