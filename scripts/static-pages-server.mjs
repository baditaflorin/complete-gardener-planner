import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const port = Number(process.argv[2] ?? process.env.PAGES_PORT ?? 4173)
const root = process.env.PAGES_ROOT ?? path.resolve(fileURLToPath(new URL('../docs', import.meta.url)))

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.wasm', 'application/wasm'],
])

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`)
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
  let filePath = path.join(root, safePath)
  try {
    const stats = statSync(filePath)
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
  } catch {
    filePath = path.join(root, 'complete-gardener-planner', 'index.html')
  }
  response.setHeader('content-type', types.get(path.extname(filePath)) ?? 'application/octet-stream')
  createReadStream(filePath)
    .on('error', () => {
      response.statusCode = 404
      response.end('Not found')
    })
    .pipe(response)
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} on http://127.0.0.1:${port}/complete-gardener-planner/`)
})
