import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { RawFiles } from '../src/content/validate'

export function loadRawContent(): RawFiles {
  const root = join(import.meta.dirname, '..', 'content')
  const files: RawFiles = {}
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (f.endsWith('.json')) files[relative(root, p).replace(/\\/g, '/')] = JSON.parse(readFileSync(p, 'utf8'))
    }
  }
  walk(root)
  return files
}
