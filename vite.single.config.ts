import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

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

export default defineConfig({
  base: './',
  plugins: [
    staticLanguages(),
    react(),
    tailwindcss(),
    viteSingleFile(),
    { name: 'no-pwa', resolveId: (id) => (id === 'virtual:pwa-register' ? '\0pwa' : null), load: (id) => (id === '\0pwa' ? 'export const registerSW = () => () => {}' : null) },
  ],
  build: { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 20_000 },
})
