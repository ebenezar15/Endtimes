/**
 * Generates content/bible.json from public-domain / openly-licensed Bible texts bundled as
 * npm devDependencies, pulling only the verses referenced by Passage Lab `ranges`.
 *
 *   BSB — Berean Study Bible 2016/2020 (via @bible-help/get-bible-verses; free license, successor BSB is public domain)
 *   KJV — King James Version, 1769 (via `kjv`)
 *   WEB — World English Bible (via `world-english-bible`), public domain
 *
 * Usage: npm run bible
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const nm = (p) => join(root, 'node_modules', p)

const kjv = JSON.parse(readFileSync(nm('kjv/json/verses-1769.json'), 'utf8'))
const keys = Object.keys(kjv) // canonical order, 31,102 verses
const index = new Map(keys.map((k, i) => [k, i]))
const bsb = JSON.parse(readFileSync(nm('@bible-help/get-bible-verses/data/berean/berean_verses.json'), 'utf8')).verses

const webCache = new Map()
function webBook(book) {
  const file = book.toLowerCase().replace(/\s+/g, '').replace('songofsolomon', 'songofsolomon')
  if (!webCache.has(file)) {
    const p = nm(`world-english-bible/json/${file}.json`)
    const map = new Map()
    if (existsSync(p)) {
      for (const e of JSON.parse(readFileSync(p, 'utf8'))) {
        if (e.verseNumber == null) continue
        const k = `${e.chapterNumber}:${e.verseNumber}`
        map.set(k, ((map.get(k) ?? '') + ' ' + e.value).replace(/\s+/g, ' ').trim())
      }
    }
    webCache.set(file, map)
  }
  return webCache.get(file)
}

const ALIASES = { Psalm: 'Psalms', 'Song of Songs': 'Song of Solomon', Revelations: 'Revelation' }

/** Expand "Book C:V-V", "Book C:V-C:V", "Book C" or "Book C:V" into canonical KJV keys. */
export function expand(range) {
  const m = range.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?(?:\s*[-–]\s*(?:(\d+):)?(\d+))?$/)
  if (!m) throw new Error(`Cannot parse range "${range}"`)
  let [, book, c1, v1, c2, v2] = m
  book = ALIASES[book] ?? book
  const start = `${book} ${c1}:${v1 ?? 1}`
  let end
  if (!v1) {
    // whole chapter
    let v = 1
    while (index.has(`${book} ${c1}:${v + 1}`)) v++
    end = `${book} ${c1}:${v}`
  } else if (v2) end = `${book} ${c2 ?? c1}:${v2}`
  else end = start
  const a = index.get(start)
  const b = index.get(end)
  if (a == null || b == null || b < a) throw new Error(`Unknown verses in "${range}" (${start} → ${end})`)
  return keys.slice(a, b + 1)
}

const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim()

function verses(range) {
  const ks = expand(range)
  return {
    BSB: ks.map((k) => ({ ref: k, text: clean(bsb[index.get(k)]) })),
    KJV: ks.map((k) => ({ ref: k, text: clean(kjv[k]).replace(/\[([^\]]+)\]/g, '$1') })),
    WEB: ks.map((k) => {
      const [, book, cv] = k.match(/^(.+) (\d+:\d+)$/)
      return { ref: k, text: webBook(book).get(cv) ?? '' }
    }),
  }
}

const passages = {}
const dir = join(root, 'content', 'passages')
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  for (const p of JSON.parse(readFileSync(join(dir, f), 'utf8'))) {
    const out = { BSB: [], KJV: [], WEB: [] }
    for (const r of p.ranges) {
      const v = verses(r)
      for (const t of Object.keys(out)) out[t].push(...v[t])
    }
    passages[p.id] = out
  }
}

const bible = {
  translations: {
    BSB: {
      name: 'Berean Study Bible',
      license:
        'Berean Study Bible text (2016/2020 edition, bundled via @bible-help/get-bible-verses), released by Bible Hub under free licensing; its successor, the Berean Standard Bible, was dedicated to the public domain in 2023.',
      url: 'https://berean.bible/',
    },
    KJV: { name: 'King James Version (1769)', license: 'Public domain (outside the UK).', url: 'https://www.kingjamesbibleonline.org/' },
    WEB: { name: 'World English Bible', license: 'Public domain.', url: 'https://worldenglish.bible/' },
  },
  passages,
}
writeFileSync(join(root, 'content', 'bible.json'), JSON.stringify(bible))
console.log(`bible.json: ${Object.keys(passages).length} passages`)
