import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx'],
    }) as any,
  ],
  build: {
    lib: {
      // Two entries: `index` (components + everything) and `mode` (the
      // light/dark helper, standalone). `mode.ts` has zero React/hook usage,
      // but the main `index` bundle contains components that do - and a
      // Next.js Server Component (e.g. a root layout) cannot import *any*
      // export from a module whose bundle contains client-hook-using code,
      // even an unrelated one. A dedicated entry keeps `mode` importable
      // from server code. See package.json's `exports["./mode"]`.
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        mode: resolve(__dirname, 'src/utils/mode.ts'),
      },
      name: 'JasmineDesignSystem',
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-feather'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-feather': 'ReactFeather',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          if (assetInfo.name === 'tokens.css') return 'tokens.css';
          return assetInfo.name || '';
        },
      },
    },
    cssCodeSplit: false,
  },
});
