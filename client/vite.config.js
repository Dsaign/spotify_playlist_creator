import 'vite/modulepreload-polyfill'
export default defineConfig({
    server: {
      cors: {
        // the origin you will be accessing via browser
        origin: 'http://127.0.0.1:8080/',
      },
    },
    build: {
      // generate .vite/manifest.json in outDir
      manifest: true,
      rollupOptions: {
        // overwrite default .html entry
        input: '/src/main.ts',
      },
    },
  })