import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        postcss: true,
      }),
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/entrypoint.ts',
      name: 'WonderCall',
      fileName: () => 'default.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true,
        inlineDynamicImports: true,
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

})