import { checkBundle, parseFiles, type ContentBundle, type RawFiles } from '../content/validate'
import type { Position } from '../content/schema'

const modules = import.meta.glob('../../content/**/*.json', { eager: true, import: 'default' })
const files: RawFiles = {}
for (const [path, data] of Object.entries(modules)) files[path.replace(/^.*\/content\//, '')] = data

const parsed = parseFiles(files)
export const contentErrors = [...parsed.errors, ...checkBundle(parsed.bundle, { partial: true })]
if (contentErrors.length && import.meta.env.DEV) console.warn('Content problems:', contentErrors)

export const content: ContentBundle = parsed.bundle

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]))
export const positionsById = byId(content.positions)
export const topicsById = byId(content.topics)
export const passagesById = byId(content.passages)
export const scholarsById = byId(content.scholars)
export const sourcesById = byId(content.sources)
export const glossaryById = byId(content.glossary)
export const argumentsById = byId(content.arguments)

const ORDER = [
  'postmil', 'amil', 'histpremil', 'disppremil',
  'partial-preterism', 'full-preterism', 'historicism', 'futurism', 'idealism', 'eclectic',
  'covenant-theology', 'dispensationalism', 'progressive-covenantalism',
]
const rank = (id: string) => (ORDER.indexOf(id) + 1 || 99)
export const positionsSorted = [...content.positions].sort((a, b) => rank(a.id) - rank(b.id))
export const millennialViews = positionsSorted.filter((p) => p.axis === 'millennial')
export const hermeneuticViews = positionsSorted.filter((p) => p.axis === 'hermeneutic')
export const frameworkViews = positionsSorted.filter((p) => p.axis === 'framework')
/** Positions compared in the matrix and timelines. */
export const views = positionsSorted.filter((p) => p.axis !== 'framework')

export function cell(position: string, topic: string) {
  return content.matrix.find((c) => c.position === position && c.topic === topic)
}

export type Agreement = 'agree' | 'partial' | 'disagree' | 'unknown'
export function agreement(topicId: string, a?: string, b?: string): Agreement {
  if (!a || !b) return 'unknown'
  if (a === b) return 'agree'
  const t = topicsById.get(topicId)
  const fa = t?.stances.find((s) => s.code === a)?.family
  const fb = t?.stances.find((s) => s.code === b)?.family
  return fa && fa === fb ? 'partial' : 'disagree'
}
export function stanceLabel(topicId: string, code?: string) {
  return topicsById.get(topicId)?.stances.find((s) => s.code === code)?.label ?? code ?? '—'
}

export function positionName(id: string, short = false): string {
  const p: Position | undefined = positionsById.get(id)
  return p ? (short ? p.shortName : p.name) : id
}
