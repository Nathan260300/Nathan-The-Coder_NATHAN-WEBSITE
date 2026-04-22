import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':            resolve(__dirname, 'src'),
      '@components':  resolve(__dirname, 'src/components'),
      '@pages':       resolve(__dirname, 'src/pages'),
      '@hooks':       resolve(__dirname, 'src/hooks'),
      '@services':    resolve(__dirname, 'src/services'),
      '@lib':         resolve(__dirname, 'src/lib'),
      '@styles':      resolve(__dirname, 'src/styles'),
    },
  },
  build: {
    target:            'esnext',
    minify:            'esbuild',
    cssCodeSplit:      true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react';
            if (id.includes('react-router-dom')) return 'router';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            return 'vendor';
          }
        }
      },
    },
  },
});