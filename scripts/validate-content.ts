/**
 * Validate everything in /content.
 *   npm run validate                 full check (used by `npm run build`)
 *   npm run validate -- --partial    schema + cross-references only (skip completeness)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { checkBundle, parseFiles, type RawFiles } from '../src/content/validate'

const root = join(import.meta.dirname, '..', 'content')
const files: RawFiles = {}
const walk = (dir: string) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (f.endsWith('.json')) {
      const rel = relative(root, p).replace(/\\/g, '/')
      try {
        files[rel] = JSON.parse(readFileSync(p, 'utf8'))
      } catch (e) {
        console.error(`✗ ${rel}: invalid JSON — ${(e as Error).message}`)
        process.exitCode = 1
      }
    }
  }
}
walk(root)

const partial = process.argv.includes('--partial')
const { bundle, errors } = parseFiles(files)
errors.push(...checkBundle(bundle, { partial }))

const counts = Object.entries(bundle)
  .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : v ? 'ok' : '—'}`)
  .join(', ')
console.log(`Content: ${counts}`)
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`)
  errors.slice(0, 200).forEach((e) => console.error('  - ' + e))
  process.exit(1)
}
console.log('✓ Content is valid')
