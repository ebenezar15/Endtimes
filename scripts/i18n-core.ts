import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Translation of content: every human-readable string is looked up, as a whole, in a dictionary of
 * English → target-language strings (i18n/<lang>/*.json). Identifiers, Bible references, codes,
 * citations and bibliographic data are never translated.
 */
export const NEVER = new Set([
  'id', 'sources', 'texts', 'position', 'positions', 'ref', 'refs', 'keywords', 'keyTexts', 'category', 'book', 'symbolId',
  'stance', 'consensus', 'related', 'kind', 'topic', 'topics', 'milestone', 'scholars', 'code', 'family', 'eras', 'threads',
  'set', 'millennial', 'hermeneutic', 'frequency', 'opposite', 'stops', 'result', 'axis', 'color', 'initial', 'next', 'centre',
  'focus', 'start', 'a', 'b', 'ot', 'rev', 'ranges', 'passages', 'fulfilledRef', 'prophecy', 'parallels', 'side', 'participants',
  'exemplars', 'works', 'proposer', 'url', 'accessed', 'type', 'camp', 'dates', 'source', 'era', 'chapters', 'author',
])
// `era` is prose in source books but an id in atlas journeys; source books' era is handled by ERA_PROSE below.
const PROSE_UNDER = new Set(['books', 'revBooks'])
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)+$/
const REF = /^(?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?(?: \d+(?:[:.]\d+)?(?:[–\-,; ]+\d+(?:[:.]\d+)?)*)+$/

export function translatable(key: string | undefined, s: string, ctx: string[] = []): boolean {
  if (key === 'era' && ctx.some((c) => PROSE_UNDER.has(c))) return /[A-Za-z]/.test(s) && s.length > 3
  if (key && NEVER.has(key)) return false
  if (!/[A-Za-z]/.test(s) || s.trim().length < 3) return false
  if (ID.test(s) || REF.test(s.trim())) return false
  return true
}

/** Walks any JSON value and calls `f` for each translatable string, returning a copy with replacements. */
export function mapStrings(x: unknown, f: (s: string) => string, key?: string, ctx: string[] = []): unknown {
  if (typeof x === 'string') return translatable(key, x, ctx) ? f(x) : x
  if (Array.isArray(x)) return x.map((v) => mapStrings(v, f, key, ctx))
  if (x && typeof x === 'object') {
    const o: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(x)) o[k] = mapStrings(v, f, k, key ? [...ctx, key] : ctx)
    return o
  }
  return x
}

export function loadDictionary(dir: string): Record<string, string> {
  const d: Record<string, string> = {}
  if (!existsSync(dir)) return d
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) Object.assign(d, JSON.parse(readFileSync(join(dir, f), 'utf8')))
  return d
}
