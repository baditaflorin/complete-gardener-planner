import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/complete-gardener-planner/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [react()],
})
