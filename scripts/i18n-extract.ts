/**
 * Collects every string still needing Tamil into i18n/source/NNN.json batches (arrays of English
 * strings, about 30k characters each), and writes i18n/ui-keys.json (the t('…') strings in src).
 *   npx vite-node scripts/i18n-extract.ts
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseFiles } from '../src/content/validate'
import { readContent } from './content-files'
import { loadDictionary, mapStrings } from './i18n-core'

const root = join(import.meta.dirname, '..')
const ta = loadDictionary(join(root, 'i18n', 'ta'))

// 1. Interface strings: literal first arguments of t( … ).
const ui = new Set<string>()
const walk = (dir: string) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name)
    if (f.isDirectory()) f.name !== 'generated' && walk(p)
    else if (/\.(tsx?|mjs)$/.test(f.name)) {
      const src = readFileSync(p, 'utf8')
      for (const m of src.matchAll(/\bt\(\s*(['"`])((?:\\.|(?!\1).)*?)\1/gs)) ui.add(m[2].replace(/\\(['"`\\])/g, '$1').replace(/\\n/g, '\n'))
    }
  }
}
walk(join(root, 'src'))
writeFileSync(join(root, 'i18n', 'ui-keys.json'), JSON.stringify([...ui].sort(), null, 1))

// 2. Content strings, in reading order.
const { files } = readContent()
const { bundle } = parseFiles(files)
const seen = new Set<string>()
const todo: string[] = []
const add = (s: string) => {
  if (!seen.has(s) && !ta[s]) todo.push(s)
  seen.add(s)
  return s
}
;[...ui].forEach(add)
mapStrings(bundle, add)

// 3. Batches.
const dir = join(root, 'i18n', 'source')
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })
let batch: string[] = []
let size = 0
let n = 0
const flush = () => {
  if (!batch.length) return
  writeFileSync(join(dir, `${String(++n).padStart(3, '0')}.json`), JSON.stringify(batch, null, 1))
  batch = []
  size = 0
}
for (const s of todo) {
  batch.push(s)
  size += s.length
  if (size > 30000) flush()
}
flush()
console.log(`ui keys: ${ui.size}; strings to translate: ${todo.length} (${todo.reduce((a, s) => a + s.length, 0)} chars) in ${n} batches; already translated: ${Object.keys(ta).length}`)
