import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      app: path.resolve(import.meta.dirname, 'src'),
    },
  },
});
