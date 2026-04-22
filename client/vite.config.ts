import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // URL do backend Flask
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: '/src/main.tsx',
    },
  },
});
