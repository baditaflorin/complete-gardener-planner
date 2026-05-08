import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

function run(command, fallback) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return fallback
  }
}

const info = {
  version: pkg.version,
  commit: run('git rev-parse --short HEAD', 'uncommitted'),
  branch: run('git rev-parse --abbrev-ref HEAD', 'local'),
  builtAt: new Date().toISOString(),
  repositoryUrl: 'https://github.com/baditaflorin/complete-gardener-planner',
  paypalUrl: 'https://www.paypal.com/paypalme/florinbadita',
  pagesUrl: 'https://baditaflorin.github.io/complete-gardener-planner/',
}

mkdirSync(new URL('../src/generated', import.meta.url), { recursive: true })
writeFileSync(
  new URL('../src/generated/buildInfo.ts', import.meta.url),
  `export const buildInfo = ${JSON.stringify(info, null, 2)} as const\n`,
)
