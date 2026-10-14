import { z } from 'zod'
import * as S from './schema'
import { POSITION_IDS, TOPIC_IDS, VIEW_IDS, walkArg } from './ids'

/** Raw JSON keyed by path relative to /content, e.g. "positions/millennial.json". */
export type RawFiles = Record<string, unknown>

export type ContentBundle = {
  positions: S.Position[]
  combinations: S.Combination[]
  topics: S.Topic[]
  matrix: S.MatrixCell[]
  passages: S.Passage[]
  arguments: S.ArgumentTree[]
  timelines: S.Timeline[]
  flowchart: S.Flowchart | null
  scholars: S.Scholar[]
  library: S.Exchange[]
  glossary: S.GlossaryEntry[]
  quizzes: S.QuizSet[]
  flashcards: S.FlashDeck[]
  sources: S.Source[]
  bible: S.Bible | null
  tour: S.TourStep[]
  revChapters: S.RevChapter[]
  revIntro: S.RevIntroSection[]
}

const routes: { match: (p: string) => boolean; key: keyof ContentBundle; schema: z.ZodTypeAny; single?: boolean }[] = [
  { match: (p) => p.startsWith('positions/'), key: 'positions', schema: S.Position },
  { match: (p) => p === 'combinations.json', key: 'combinations', schema: S.Combination },
  { match: (p) => p.startsWith('topics/'), key: 'topics', schema: S.Topic },
  { match: (p) => p.startsWith('matrix/'), key: 'matrix', schema: S.MatrixCell },
  { match: (p) => p.startsWith('passages/'), key: 'passages', schema: S.Passage },
  { match: (p) => p.startsWith('arguments/'), key: 'arguments', schema: S.ArgumentTree },
  { match: (p) => p === 'timelines.json', key: 'timelines', schema: S.Timeline },
  { match: (p) => p === 'flowchart.json', key: 'flowchart', schema: S.Flowchart, single: true },
  { match: (p) => p === 'scholars.json', key: 'scholars', schema: S.Scholar },
  { match: (p) => p === 'library.json', key: 'library', schema: S.Exchange },
  { match: (p) => p === 'glossary.json', key: 'glossary', schema: S.GlossaryEntry },
  { match: (p) => p === 'study/quizzes.json', key: 'quizzes', schema: S.QuizSet },
  { match: (p) => p === 'study/flashcards.json', key: 'flashcards', schema: S.FlashDeck },
  { match: (p) => p.startsWith('sources/'), key: 'sources', schema: S.Source },
  { match: (p) => p === 'bible.json', key: 'bible', schema: S.Bible, single: true },
  { match: (p) => p === 'tour.json', key: 'tour', schema: S.TourStep },
  { match: (p) => p.startsWith('revelation/chapters'), key: 'revChapters', schema: S.RevChapter },
  { match: (p) => p === 'revelation/intro.json', key: 'revIntro', schema: S.RevIntroSection },
]

export { POSITION_IDS, VIEW_IDS, TOPIC_IDS, walkArg }

export function emptyBundle(): ContentBundle {
  return {
    positions: [], combinations: [], topics: [], matrix: [], passages: [], arguments: [], timelines: [],
    flowchart: null, scholars: [], library: [], glossary: [], quizzes: [], flashcards: [], sources: [], bible: null, tour: [], revChapters: [], revIntro: [],
  }
}

/** Parse raw files into a bundle. Returns errors rather than throwing. */
export function parseFiles(files: RawFiles): { bundle: ContentBundle; errors: string[] } {
  const bundle = emptyBundle()
  const errors: string[] = []
  for (const [path, raw] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
    const route = routes.find((r) => r.match(path))
    if (!route) continue
    if (route.single) {
      const res = route.schema.safeParse(raw)
      if (!res.success) errors.push(...fmt(path, res.error))
      else (bundle as Record<string, unknown>)[route.key] = res.data
      continue
    }
    if (!Array.isArray(raw)) {
      errors.push(`${path}: expected a JSON array`)
      continue
    }
    raw.forEach((item, i) => {
      const res = route.schema.safeParse(item)
      const label = `${path}[${i}${item && typeof item === 'object' && 'id' in item ? ` ${(item as { id: string }).id}` : ''}]`
      if (!res.success) errors.push(...fmt(label, res.error))
      else (bundle[route.key] as unknown[]).push(res.data)
    })
  }
  // Sources: merge duplicates (first definition wins).
  const seen = new Map<string, S.Source>()
  for (const s of bundle.sources) if (!seen.has(s.id)) seen.set(s.id, s)
  bundle.sources = [...seen.values()]
  return { bundle, errors }
}

function fmt(label: string, err: z.ZodError): string[] {
  return err.issues.slice(0, 6).map((i) => `${label} ${i.path.join('.')}: ${i.message}`)
}

/** Cross-reference and completeness checks. `partial` skips completeness rules. */
export function checkBundle(b: ContentBundle, opts: { partial?: boolean } = {}): string[] {
  const errors: string[] = []
  const src = new Set(b.sources.map((s) => s.id))
  const pos = new Set<string>(POSITION_IDS)
  const top = new Set<string>(TOPIC_IDS)
  const sch = new Set(b.scholars.map((s) => s.id))
  const needSrc = (where: string, ids: string[]) =>
    ids.forEach((id) => !src.has(id) && errors.push(`${where}: unknown source "${id}"`))
  const needPos = (where: string, id: string) => !pos.has(id) && errors.push(`${where}: unknown position "${id}"`)

  const dup = (kind: string, ids: string[]) => {
    const s = new Set<string>()
    ids.forEach((id) => (s.has(id) ? errors.push(`duplicate ${kind} id "${id}"`) : s.add(id)))
  }
  dup('position', b.positions.map((p) => p.id))
  dup('passage', b.passages.map((p) => p.id))
  dup('argument', b.arguments.map((p) => p.id))
  dup('scholar', b.scholars.map((p) => p.id))
  dup('glossary', b.glossary.map((p) => p.id))

  for (const p of b.positions) {
    needPos(`position ${p.id}`, p.id)
    needSrc(`position ${p.id}`, p.sources)
    if (!opts.partial) p.scholars.forEach((s) => !sch.has(s) && errors.push(`position ${p.id}: unknown scholar "${s}"`))
    p.related.forEach((r) => needPos(`position ${p.id} related`, r))
  }
  for (const c of b.combinations) {
    needPos('combination', c.millennial)
    needPos('combination', c.hermeneutic)
  }
  const stances = new Map(b.topics.map((t) => [t.id, new Set(t.stances.map((s) => s.code))]))
  for (const t of b.topics) if (!top.has(t.id)) errors.push(`topic ${t.id}: not in TOPIC_IDS`)
  const cellKeys = new Set<string>()
  for (const c of b.matrix) {
    const where = `matrix ${c.position}/${c.topic}`
    needPos(where, c.position)
    if (!top.has(c.topic)) errors.push(`${where}: unknown topic`)
    const st = stances.get(c.topic)
    if (st && !st.has(c.stance)) errors.push(`${where}: stance "${c.stance}" not defined on topic`)
    needSrc(where, c.sources)
    if (cellKeys.has(`${c.position}/${c.topic}`)) errors.push(`${where}: duplicate cell`)
    cellKeys.add(`${c.position}/${c.topic}`)
  }
  for (const p of b.passages) {
    needSrc(`passage ${p.id}`, p.sources)
    p.readings.forEach((r) => {
      needPos(`passage ${p.id}`, r.position)
      needSrc(`passage ${p.id}/${r.position}`, r.sources)
    })
    p.topics.forEach((t) => !top.has(t) && errors.push(`passage ${p.id}: unknown topic "${t}"`))
  }
  for (const a of b.arguments) {
    if (!top.has(a.topic)) errors.push(`argument ${a.id}: unknown topic "${a.topic}"`)
    a.positions.forEach((p) => needPos(`argument ${a.id}`, p))
    const ids = new Set<string>()
    walkArg(a.root, (n, parent) => {
      const where = `argument ${a.id}/${n.id}`
      if (ids.has(n.id)) errors.push(`${where}: duplicate node id`)
      ids.add(n.id)
      needPos(where, n.position)
      needSrc(where, n.sources)
      if (!parent && n.kind !== 'claim') errors.push(`${where}: root must be a claim`)
      if (!opts.partial) {
        if (n.kind === 'claim' && !n.children.some((c) => c.kind === 'objection'))
          errors.push(`${where}: claim has no objection`)
        if (n.kind === 'objection' && !n.children.some((c) => c.kind === 'rebuttal'))
          errors.push(`${where}: objection has no rebuttal`)
      }
    })
  }
  for (const t of b.timelines) {
    needPos(`timeline ${t.position}`, t.position)
    needSrc(`timeline ${t.position}`, t.sources)
  }
  for (const s of b.scholars) {
    s.positions.forEach((p) => needPos(`scholar ${s.id}`, p))
    needSrc(`scholar ${s.id}`, s.sources)
  }
  for (const e of b.library) {
    e.positions.forEach((p) => needPos(`library ${e.id}`, p))
    needSrc(`library ${e.id}`, e.sources)
  }
  const gl = new Set(b.glossary.map((g) => g.id))
  for (const g of b.glossary) g.related.forEach((r) => !gl.has(r) && errors.push(`glossary ${g.id}: unknown related "${r}"`))
  for (const q of b.quizzes) {
    if (q.set !== 'general') needPos(`quiz ${q.set}`, q.set)
    q.questions.forEach((x) => x.answer >= x.options.length && errors.push(`quiz ${q.set}/${x.id}: answer out of range`))
  }
  b.tour.forEach((t, i) => t.focus.forEach((f) => needPos(`tour[${i}]`, f)))
  const symIds = new Set<string>()
  const chapters = new Set<number>()
  for (const c of b.revChapters) {
    const where = `revelation ${c.chapter}`
    if (chapters.has(c.chapter)) errors.push(`${where}: duplicate chapter`)
    chapters.add(c.chapter)
    needSrc(where, c.sources)
    c.readings.forEach((r) => needPos(where, r.position))
    for (const s of c.symbols) {
      if (symIds.has(s.id)) errors.push(`${where}: duplicate symbol id "${s.id}"`)
      symIds.add(s.id)
      needSrc(`${where}/${s.id}`, s.sources)
      s.readings.forEach((r) => needPos(`${where}/${s.id}`, r.position))
    }
  }
  b.revIntro.forEach((x) => needSrc(`revelation intro ${x.id}`, x.sources))
  if (!opts.partial && b.revChapters.length)
    for (let n = 1; n <= 22; n++) if (!chapters.has(n)) errors.push(`missing Revelation chapter ${n}`)
  if (b.flowchart) errors.push(...checkFlowchart(b.flowchart))

  if (!opts.partial) {
    for (const id of POSITION_IDS) if (!b.positions.some((p) => p.id === id)) errors.push(`missing position "${id}"`)
    for (const id of TOPIC_IDS) if (!b.topics.some((t) => t.id === id)) errors.push(`missing topic "${id}"`)
    for (const v of VIEW_IDS)
      for (const t of TOPIC_IDS) if (!cellKeys.has(`${v}/${t}`)) errors.push(`missing matrix cell ${v}/${t}`)
    for (const v of VIEW_IDS) if (!b.timelines.some((t) => t.position === v)) errors.push(`missing timeline "${v}"`)
    if (!b.flowchart) errors.push('missing flowchart.json')
  }
  return errors
}

/** Every option must lead somewhere real, every node must be reachable, and there must be no cycles. */
export function checkFlowchart(f: S.Flowchart): string[] {
  const errors: string[] = []
  const nodes = new Map(f.nodes.map((n) => [n.id, n]))
  const results = new Set(f.results.map((r) => r.id))
  if (!nodes.has(f.start)) errors.push(`flowchart: start "${f.start}" missing`)
  for (const n of f.nodes)
    for (const o of n.options) {
      if (!!o.next === !!o.result) errors.push(`flowchart ${n.id}: option "${o.label}" needs exactly one of next/result`)
      if (o.next && !nodes.has(o.next)) errors.push(`flowchart ${n.id}: unknown next "${o.next}"`)
      if (o.result && !results.has(o.result)) errors.push(`flowchart ${n.id}: unknown result "${o.result}"`)
    }
  const reached = new Set<string>()
  const reachedResults = new Set<string>()
  const visit = (id: string, stack: Set<string>) => {
    if (stack.has(id)) {
      errors.push(`flowchart: cycle through "${id}"`)
      return
    }
    const n = nodes.get(id)
    if (!n) return
    reached.add(id)
    stack.add(id)
    n.options.forEach((o) => (o.next ? visit(o.next, stack) : o.result && reachedResults.add(o.result)))
    stack.delete(id)
  }
  visit(f.start, new Set())
  f.nodes.forEach((n) => !reached.has(n.id) && errors.push(`flowchart: node "${n.id}" unreachable`))
  f.results.forEach((r) => !reachedResults.has(r.id) && errors.push(`flowchart: result "${r.id}" unreachable`))
  return errors
}
