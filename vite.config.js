import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // Listen on all local IP addresses (localhost & local network)
    open: true, // Automatically open browser on localhost when running dev server
  },
  preview: {
    port: 3000,
    open: true,
  },
});
