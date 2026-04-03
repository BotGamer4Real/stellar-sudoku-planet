import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 1500 // Lessons Learned: prevents Phaser build warnings
  },
  server: {
    port: 5173,
    open: true
  }
});