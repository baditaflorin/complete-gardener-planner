import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/complete-gardener-planner/',
  build: {
    outDir: 'docs',
    emptyOutDir: false,
    sourcemap: true,
  },
  plugins: [
    react(),
    {
      name: 'serve-generated-data-in-dev',
      configureServer(server) {
        server.middlewares.use('/complete-gardener-planner/data/v1', async (request, response, next) => {
          const url = new URL(request.url ?? '', 'http://localhost')
          const fileName = path.basename(url.pathname)
          if (!fileName.endsWith('.json')) {
            next()
            return
          }
          try {
            const payload = await readFile(path.join(process.cwd(), 'docs/data/v1', fileName))
            response.setHeader('content-type', 'application/json; charset=utf-8')
            response.end(payload)
          } catch {
            next()
          }
        })
      },
    },
  ],
})
