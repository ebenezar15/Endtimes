import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync } from 'node:fs'
import { deflateRawSync } from 'node:zlib'
import { dirname, resolve } from 'node:path'

/**
 * The app as ONE self-contained HTML file (both languages, no service worker), for downloading
 * and opening anywhere: `npm run build:single` → dist-single/index.html.
 *
 * The web build loads each language's data with top-level `await import(…)`. Inside a single
 * inlined chunk those awaits would run before the inlined data is defined, so this build rewrites
 * them into static imports of both languages and picks one at start-up.
 */
function staticLanguages(): Plugin {
  let n = 0
  return {
    name: 'static-languages',
    enforce: 'pre',
    transform(code, id) {
      if (!/\/src\/(lib|main)/.test(id) || id.includes('node_modules')) return null
      let out = code
      const imports: string[] = []
      // const data = (LANG === 'ta' ? await import('A') : await import('B')).default
      out = out.replace(/\(LANG === 'ta' \? await import\('([^']+)'\) : await import\('([^']+)'\)\)\.default/g, (_m, ta: string, en: string) => {
        const a = `__ta${n}`
        const b = `__en${n++}`
        imports.push(`import ${a} from '${ta}'`, `import ${b} from '${en}'`)
        return `(LANG === 'ta' ? ${a} : ${b})`
      })
      if (id.endsWith('/src/lib/i18n.ts')) {
        imports.push(`import __strings from '../generated/ta/strings.json'`)
        out = out.replace('let dict: Record<string, string> = {}', "let dict: Record<string, string> = LANG === 'ta' ? (__strings as Record<string, string>) : {}")
        out = out.replace(/export async function loadStrings\(\) \{[\s\S]*?\n\}/, 'export async function loadStrings() {}')
      }
      if (id.endsWith('/src/main.tsx')) {
        out = out.replace("await loadStrings()\nconst { App } = await import('./app/App')", '')
        imports.push(`import { App } from './app/App'`)
      }
      return out === code ? null : imports.join('\n') + '\n' + out
    },
  }
}

/**
 * The generated content is most of the file's weight (and Tamil is three bytes a character).
 * Each JSON file under src/generated is stored deflated and base64-encoded, and inflated
 * synchronously on start-up, which keeps the single file well under the 16 MB artifact limit.
 */
function compressedData(): Plugin {
  const PREFIX = '\0gz:'
  return {
    name: 'compressed-data',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source.endsWith('.json') || !importer) return null
      const abs = resolve(dirname(importer.replace(PREFIX, '').replace(/\.gz\.js$/, '')), source)
      return abs.includes('/src/generated/') ? PREFIX + abs + '.gz.js' : null
    },
    load(id) {
      if (!id.startsWith(PREFIX)) return null
      const raw = readFileSync(id.slice(PREFIX.length, -'.gz.js'.length))
      const json = JSON.stringify(JSON.parse(raw.toString('utf8')))
      const b64 = deflateRawSync(Buffer.from(json, 'utf8'), { level: 9 }).toString('base64')
      return `import { inflateSync, strFromU8 } from 'fflate'
const b = atob(${JSON.stringify(b64)})
const u = new Uint8Array(b.length)
for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i)
export default JSON.parse(strFromU8(inflateSync(u)))`
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    staticLanguages(),
    compressedData(),
    react(),
    tailwindcss(),
    viteSingleFile(),
    { name: 'no-pwa', resolveId: (id) => (id === 'virtual:pwa-register' ? '\0pwa' : null), load: (id) => (id === '\0pwa' ? 'export const registerSW = () => () => {}' : null) },
  ],
  build: { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 20_000 },
})
