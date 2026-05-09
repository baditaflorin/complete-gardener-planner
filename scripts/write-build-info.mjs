import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

function run(command, fallback) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return fallback
  }
}

const existingPath = new URL('../src/generated/buildInfo.ts', import.meta.url)
const existing = readExistingBuildInfo(existingPath)
const reuse = process.env.REFRESH_BUILD_INFO !== '1' && existing

const info = {
  version: pkg.version,
  commit: reuse ? existing.commit : run('git rev-parse --short HEAD', 'uncommitted'),
  branch: run('git rev-parse --abbrev-ref HEAD', 'local'),
  builtAt: reuse ? existing.builtAt : new Date().toISOString(),
  repositoryUrl: 'https://github.com/baditaflorin/complete-gardener-planner',
  paypalUrl: 'https://www.paypal.com/paypalme/florinbadita',
  pagesUrl: 'https://baditaflorin.github.io/complete-gardener-planner/',
}

mkdirSync(new URL('../src/generated', import.meta.url), { recursive: true })
writeFileSync(existingPath, `export const buildInfo = ${JSON.stringify(info, null, 2)} as const\n`)

function readExistingBuildInfo(path) {
  if (!existsSync(path)) {
    return null
  }
  const source = readFileSync(path, 'utf8')
  const commit = source.match(/"commit": "([^"]+)"/)?.[1]
  const builtAt = source.match(/"builtAt": "([^"]+)"/)?.[1]
  return commit && builtAt ? { commit, builtAt } : null
}
