import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // Polling also picks up edits made through desktop sandbox file operations.
    watch: { usePolling: true, interval: 500, ignored: ['**/.pnpm-store/**'] },
  },
});
