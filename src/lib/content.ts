import type {
  Bible, Combination, GlossaryEntry, MatrixCell, Passage, Position, Source, Topic, TourStep, ArgumentTree,
} from '../content/schema'
// Generated and validated from /content by `npm run validate` (and live by the dev server).
import data from '../generated/content.json'

export type PassageIndex = Pick<Passage, 'id' | 'ref' | 'title' | 'ranges' | 'category' | 'keyIssue' | 'timeText' | 'topics'> & { readers: string[] }
export type ArgumentIndex = Pick<ArgumentTree, 'id' | 'title' | 'question' | 'topic' | 'positions'>

export const content = data as unknown as {
  positions: Position[]
  combinations: Combination[]
  topics: Topic[]
  matrix: MatrixCell[]
  glossary: GlossaryEntry[]
  sources: Source[]
  tour: TourStep[]
  /** Slim indexes of the per-feature files (see src/lib/data/). */
  index: {
    passages: PassageIndex[]
    arguments: ArgumentIndex[]
    scholars: { id: string; name: string; dates: string }[]
    quizzes: number
    spiritualKeys: { id: string; symbol: string; chapter: number; spiritual: string }[]
    revelation: { chapter: number; title: string; section: string; symbols: { id: string; phrase: string; ref: string; category: string }[] }[]
  }
}

/** Bible text is large and only needed in the Passage Lab, so it loads on demand. */
let biblePromise: Promise<Bible> | null = null
export const loadBible = () => (biblePromise ??= import('../generated/bible.json').then((m) => m.default as unknown as Bible))

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]))
export const positionsById = byId(content.positions)
export const topicsById = byId(content.topics)
export const sourcesById = byId(content.sources)
export const glossaryById = byId(content.glossary)
export const passageIndex = byId(content.index.passages)
export const argumentIndex = byId(content.index.arguments)
export const scholarIndex = byId(content.index.scholars)

export { positionsSorted, millennialViews, hermeneuticViews, frameworkViews, views, positionName } from './core'

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
