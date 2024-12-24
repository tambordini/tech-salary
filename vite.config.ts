import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  base: '/tech-salary/',
  plugins: [svelte()],
  server: {
    open: true,
  },
});
