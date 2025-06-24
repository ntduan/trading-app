import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
    exclude: ['**/automation/tests/**', '**/node_modules/**', '**/dist/**'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/src/workers/orderbook.worker.ts',
        '**/layout.tsx',
        '**/page.tsx',
      ],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/*': path.resolve(__dirname, './src/*'),
    },
  },
});
