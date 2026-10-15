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
  spiritual: S.SpiritualStudy | null
  revThreads: S.CanonThread[]
  revBooks: S.SourceBook[]
  revStructure: S.RevStructure | null
  atlas: S.Atlas | null
  olivet: S.OlivetStudy | null
  signs: S.SignsStudy | null
  dating: S.DatingStudy | null
  josephus: S.JosephusStory | null
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
  { match: (p) => p === 'revelation/spiritual.json', key: 'spiritual', schema: S.SpiritualStudy, single: true },
  { match: (p) => p.startsWith('revelation/threads/'), key: 'revThreads', schema: S.CanonThread },
  { match: (p) => p === 'revelation/books.json', key: 'revBooks', schema: S.SourceBook },
  { match: (p) => p === 'revelation/structure.json', key: 'revStructure', schema: S.RevStructure, single: true },
  { match: (p) => p === 'revelation/atlas.json', key: 'atlas', schema: S.Atlas, single: true },
  { match: (p) => p === 'studies/olivet.json', key: 'olivet', schema: S.OlivetStudy, single: true },
  { match: (p) => p === 'studies/signs.json', key: 'signs', schema: S.SignsStudy, single: true },
  { match: (p) => p === 'studies/dating.json', key: 'dating', schema: S.DatingStudy, single: true },
  { match: (p) => p === 'studies/josephus.json', key: 'josephus', schema: S.JosephusStory, single: true },
]

export { POSITION_IDS, VIEW_IDS, TOPIC_IDS, walkArg }

export function emptyBundle(): ContentBundle {
  return {
    positions: [], combinations: [], topics: [], matrix: [], passages: [], arguments: [], timelines: [],
    flowchart: null, scholars: [], library: [], glossary: [], quizzes: [], flashcards: [], sources: [], bible: null, tour: [], revChapters: [], revIntro: [], spiritual: null, revThreads: [], revBooks: [], revStructure: null, atlas: null, olivet: null, signs: null, dating: null, josephus: null,
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
  if (b.spiritual) {
    needSrc('spiritual', b.spiritual.sources)
    const keyIds = new Set(b.spiritual.keys.map((k) => k.id))
    b.spiritual.keys.forEach((k) => k.opposite && !keyIds.has(k.opposite) && errors.push(`spiritual key ${k.id}: unknown opposite "${k.opposite}"`))
    b.spiritual.chapters.forEach((c) => c.symbolInsights.forEach((x) => !symIds.has(x.symbolId) && errors.push(`spiritual ch ${c.chapter}: unknown symbol "${x.symbolId}"`)))
    if (!opts.partial) for (let n = 1; n <= 22; n++) if (!b.spiritual.chapters.some((c) => c.chapter === n)) errors.push(`spiritual: missing chapter ${n}`)
  }
  dup('canon thread', b.revThreads.map((t) => t.id))
  dup('source book', b.revBooks.map((t) => t.id))
  for (const t of b.revThreads) {
    needSrc(`thread ${t.id}`, t.sources)
    if (t.stops.at(-1)?.book !== 'Revelation') errors.push(`thread ${t.id}: last stop must be in Revelation`)
    const order = t.stops.map((x) => S.CANON.indexOf(x.book))
    if (order.some((o, i) => i > 0 && o < order[i - 1])) errors.push(`thread ${t.id}: stops are not in canonical order`)
  }
  b.revBooks.forEach((x) => needSrc(`source book ${x.id}`, x.sources))
  if (b.revStructure) {
    const st = b.revStructure
    needSrc('structure', st.sources)
    const pairs = (where: string, segs: { label: string }[], centre: string) => {
      const labels = segs.map((x) => x.label)
      if (!labels.includes(centre)) errors.push(`${where}: centre "${centre}" not a segment`)
      for (const l of labels) {
        const base = l.replace(/[′']/g, '')
        if (l !== centre && !labels.some((m) => m !== l && m.replace(/[′']/g, '') === base)) errors.push(`${where}: "${l}" has no partner`)
      }
    }
    st.outlines.forEach((o) => (needSrc(`outline ${o.id}`, o.sources), pairs(`outline ${o.id}`, o.segments, o.centre), o.segments.forEach((x) => x.endCh > 22 && errors.push(`outline ${o.id}: chapter > 22`))))
    st.prophetic.forEach((o) => (needSrc(`prophetic chiasm ${o.id}`, o.sources), pairs(`prophetic chiasm ${o.id}`, o.segments, o.centre)))
    st.sequences.forEach((o) => needSrc(`sequence ${o.id}`, o.sources))
  }
  if (b.atlas) {
    const a = b.atlas
    needSrc('atlas', a.sources)
    const eras = new Set(a.eras.map((e) => e.id))
    const places = new Set(a.places.map((p) => p.id))
    const thr = new Set(b.revThreads.map((t) => t.id))
    dup('atlas place', a.places.map((p) => p.id))
    for (const p of a.places) {
      p.eras.forEach((e) => !eras.has(e) && errors.push(`atlas ${p.id}: unknown era "${e}"`))
      p.threads.forEach((t) => !thr.has(t) && errors.push(`atlas ${p.id}: unknown thread "${t}"`))
    }
    for (const j of a.journeys) {
      if (!eras.has(j.era)) errors.push(`atlas journey ${j.id}: unknown era "${j.era}"`)
      j.stops.forEach((s) => !places.has(s) && errors.push(`atlas journey ${j.id}: unknown place "${s}"`))
    }
  }
  const posOk = (where: string, xs: { position: string }[]) => xs.forEach((r) => needPos(where, r.position))
  if (b.olivet) {
    const o = b.olivet
    needSrc('olivet', o.sources)
    o.context.forEach((c) => needSrc(`olivet context ${c.id}`, c.sources))
    posOk('olivet questions', o.questions.mappings)
    o.units.forEach((u) => (needSrc(`olivet ${u.id}`, u.sources), posOk(`olivet ${u.id}`, u.readings)))
    o.related.forEach((u) => (needSrc(`olivet related ${u.id}`, u.sources), posOk(`olivet related ${u.id}`, u.readings)))
    posOk('olivet generation', o.generation.readings)
  }
  if (b.signs) {
    needSrc('signs', b.signs.sources)
    b.signs.history.forEach((h) => needSrc(`signs ${h.id}`, h.sources))
    b.signs.modern.forEach((h) => needSrc(`signs ${h.id}`, h.sources))
  }
  if (b.josephus) {
    needSrc('josephus', b.josephus.sources)
    b.josephus.scenes.forEach((x) => needSrc(`josephus ${x.id}`, x.sources))
  }
  if (b.dating) {
    needSrc('dating', b.dating.sources)
    b.dating.evidence.forEach((e) => needSrc(`dating ${e.id}`, e.sources))
    posOk('dating', b.dating.implications)
  }
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
