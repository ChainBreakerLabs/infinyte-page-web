import { defineConfig } from 'vite';

export default defineConfig({
  base: '/infinyte-page-web/',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: ['index.html', 'privacy.html', 'terms.html', 'delete-account.html'],
    },
  },
  server: { port: 5180, strictPort: true },
  preview: { port: 4180, strictPort: true },
});
