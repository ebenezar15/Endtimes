import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import type { Plugin } from 'vite'
import { generateContent } from './scripts/content-files'

/** Regenerates src/generated/*.json whenever a file in /content changes during `npm run dev`. */
function contentPlugin(): Plugin {
  const run = () => {
    const { errors } = generateContent({ partial: true })
    if (errors.length) console.warn(`[content] ${errors.length} problem(s):\n  - ` + errors.slice(0, 20).join('\n  - '))
  }
  return {
    name: 'last-things-content',
    buildStart: run,
    configureServer(server) {
      server.watcher.add('content')
      server.watcher.on('change', (f) => /[\\/]content[\\/].*\.json$/.test(f) && !f.endsWith('bible.json') ? run() : undefined)
    },
  }
}

// BASE is set by the GitHub Pages workflow (e.g. "/Endtimes/"); "/" locally.
const base = process.env.BASE ?? '/'

/** Preload the body and UI fonts so text doesn't reflow when they arrive. */
function preloadFonts(): Plugin {
  return {
    name: 'last-things-preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => /alegreya(-sans)?-latin-(400|500)-normal.*\.woff2$/.test(f))
        const tags: { tag: string; injectTo: 'head'; attrs?: Record<string, string>; children?: string }[] = files.map((f) => ({
          tag: 'link',
          injectTo: 'head',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: `${base}${f}` },
        }))
        // Deep links (anything but the home page) need the shared content chunk at once: start fetching it early.
        const contentChunk = Object.keys(ctx.bundle ?? {}).find((f) => /assets\/content-[\w-]+\.js$/.test(f))
        if (contentChunk)
          tags.push({
            tag: 'script',
            injectTo: 'head',
            children: `if(location.hash.length>2){var l=document.createElement('link');l.rel='modulepreload';l.href='${base}${contentChunk}';document.head.appendChild(l)}`,
          })
        return tags
      },
    },
  }
}

export default defineConfig({
  base,
  plugins: [
    contentPlugin(),
    preloadFonts(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Last Things — A Study of Christian Eschatology',
        short_name: 'Last Things',
        description: 'Compare the major Christian views of the end times: positions, passages, arguments and timelines.',
        theme_color: '#1f2d5c',
        background_color: '#f2efe6',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'node',
  },
} as never)
