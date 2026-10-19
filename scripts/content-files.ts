import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { checkBundle, parseFiles, type ContentBundle, type RawFiles } from '../src/content/validate'
import { loadDictionary, mapStrings } from './i18n-core'

const root = join(import.meta.dirname, '..')
export const contentDir = join(root, 'content')

export function readContent(): { files: RawFiles; jsonErrors: string[] } {
  const files: RawFiles = {}
  const jsonErrors: string[] = []
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (f.endsWith('.json')) {
        const rel = relative(contentDir, p).replace(/\\/g, '/')
        try {
          files[rel] = JSON.parse(readFileSync(p, 'utf8'))
        } catch (e) {
          jsonErrors.push(`${rel}: invalid JSON — ${(e as Error).message}`)
        }
      }
    }
  }
  walk(contentDir)
  return { files, jsonErrors }
}

/**
 * Validate /content and write the normalised, code-split bundle the app imports from src/generated/:
 *   core.json      slim data for the home page and app shell
 *   content.json   positions, topics, matrix, glossary, sources + slim indexes
 *   passages.json, arguments.json, library.json, study.json, timelines.json   one per feature
 *   bible.json     Bible text (loaded on demand by the Passage Lab)
 */
export function generateContent(opts: { partial?: boolean } = {}) {
  const { files, jsonErrors } = readContent()
  const { bundle, errors } = parseFiles(files)
  errors.unshift(...jsonErrors)
  errors.push(...checkBundle(bundle, opts))
  emit(bundle, join(root, 'src', 'generated'))
  // Tamil: the same bundle with every readable string looked up in i18n/ta (English where missing).
  const ta = loadDictionary(join(root, 'i18n', 'ta'))
  emit(mapStrings(bundle, (x) => ta[x] ?? x) as ContentBundle, join(root, 'src', 'generated', 'ta'), { bible: false })
  writeUiStrings(ta)
  return { bundle, errors }
}

function emit(b: ContentBundle, out: string, opts: { bible?: boolean } = {}) {
  mkdirSync(out, { recursive: true })
  mkdirSync(out, { recursive: true })
  const write = (name: string, data: unknown) => writeFileSync(join(out, `${name}.json`), JSON.stringify(data))
  // Shared by most pages, plus slim indexes for cross-links into the per-feature files below.
  write('content', {
    positions: b.positions, combinations: b.combinations, topics: b.topics, matrix: b.matrix,
    glossary: b.glossary, sources: b.sources, tour: b.tour,
    index: {
      passages: b.passages.map((p) => ({ id: p.id, ref: p.ref, title: p.title, ranges: p.ranges, category: p.category, keyIssue: p.keyIssue, timeText: p.timeText, topics: p.topics, readers: p.readings.map((r) => r.position) })),
      arguments: b.arguments.map((a) => ({ id: a.id, title: a.title, question: a.question, topic: a.topic, positions: a.positions })),
      scholars: b.scholars.map((s) => ({ id: s.id, name: s.name, dates: s.dates })),
      quizzes: b.quizzes.length,
      threads: b.revThreads.map((t) => ({ id: t.id, title: t.title, kind: t.kind, summary: t.summary })),
      spiritualKeys: (b.spiritual?.keys ?? []).map((k) => ({ id: k.id, symbol: k.symbol, chapter: k.chapter, spiritual: k.spiritual })),
      revelation: [...b.revChapters]
        .sort((x, y) => x.chapter - y.chapter)
        .map((c) => ({ chapter: c.chapter, title: c.title, section: c.section, symbols: c.symbols.map((s) => ({ id: s.id, phrase: s.phrase, ref: s.ref, category: s.category })) })),
    },
  })
  write('passages', b.passages)
  write('arguments', b.arguments)
  write('library', { scholars: b.scholars, library: b.library })
  write('study', { quizzes: b.quizzes, flashcards: b.flashcards })
  write('timelines', { timelines: b.timelines, flowchart: b.flowchart })
  if (opts.bible !== false) write('bible', b.bible ?? { translations: {}, passages: {} })
  // Fold the Spiritual Understanding into each chapter's readings and symbol readings, so it appears beside the other views.
  const spiritual = b.spiritual
  const chapters = [...b.revChapters]
    .sort((x, y) => x.chapter - y.chapter)
    .map((c) => {
      const sc = spiritual?.chapters.find((x) => x.chapter === c.chapter)
      if (!sc) return c
      const insight = new Map(sc.symbolInsights.map((x) => [x.symbolId, x.insight]))
      return {
        ...c,
        readings: [...c.readings.filter((r) => r.position !== 'spiritual'), { position: 'spiritual', reading: `${sc.theme}. ${sc.reading}` }],
        symbols: c.symbols.map((sym) =>
          insight.has(sym.id) ? { ...sym, readings: [...sym.readings.filter((r) => r.position !== 'spiritual'), { position: 'spiritual', reading: insight.get(sym.id)! }] } : sym,
        ),
      }
    })
  write('revelation', { intro: b.revIntro, chapters, spiritual })
  write('connections', { threads: b.revThreads, books: b.revBooks, structure: b.revStructure, atlas: b.atlas })
  write('studies', { olivet: b.olivet, signs: b.signs, dating: b.dating, josephus: b.josephus, israel: b.israel, rapture: b.rapture })
  // A slim slice for the first screen (home page + app shell).
  write('core', {
    positions: b.positions.map(({ id, name, shortName, axis, color, initial, tagline, summary }) => ({ id, name, shortName, axis, color, initial, tagline, summary })),
    combinations: b.combinations,
    tour: b.tour,
    timelines: b.timelines.map((t) => ({ position: t.position, events: t.events.map(({ id, milestone, label, at, end }) => ({ id, milestone, label, at, end })) })),
    counts: {
      positions: b.positions.length, topics: b.topics.length, passages: b.passages.length, arguments: b.arguments.length,
      scholars: b.scholars.length, glossary: b.glossary.length, sources: b.sources.length, library: b.library.length,
    },
  })
}

/** The interface dictionary: only the strings used through t() in src (see scripts/i18n-extract.ts). */
function writeUiStrings(ta: Record<string, string>) {
  const keysFile = join(root, 'i18n', 'ui-keys.json')
  const keys: string[] = existsSync(keysFile) ? JSON.parse(readFileSync(keysFile, 'utf8')) : []
  const ui: Record<string, string> = {}
  for (const k of keys) if (ta[k]) ui[k] = ta[k]
  writeFileSync(join(root, 'src', 'generated', 'ta', 'strings.json'), JSON.stringify(ui))
}
