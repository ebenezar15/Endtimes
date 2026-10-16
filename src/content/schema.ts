/**
 * Content schema for "Last Things".
 * Every JSON file in /content is validated against these schemas at build time
 * (`npm run validate`) and in unit tests. See /content/README.md for the
 * human-readable version.
 */
import { z } from 'zod'

export const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are kebab-case')
/** A Bible reference such as "Revelation 20:1-6" or "Matthew 24". */
export const Ref = z.string().min(3)
const Text = z.string().min(1)

export const SourceType = z.enum([
  'book',
  'article',
  'debate',
  'blog',
  'lecture',
  'encyclopedia',
  'video',
  'creed',
  'primary',
])

export const Source = z.object({
  id: Id,
  title: Text,
  author: Text,
  url: z.string().url().optional(),
  /** Position id this source argues for, or "multi" (multi-view), "reference", "critic". */
  camp: z.string().min(1),
  type: SourceType,
  year: z.string().optional(),
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** One- or two-sentence paraphrased description (for the Library). */
  summary: z.string().optional(),
  /** false = could not be verified online during research; shown with a flag. */
  verified: z.boolean(),
  note: z.string().optional(),
})

export const Axis = z.enum(['millennial', 'hermeneutic', 'framework'])

export const Position = z.object({
  id: Id,
  name: Text,
  shortName: Text,
  axis: Axis,
  /** Hex colour used consistently in every chart. Users can override in settings. */
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  /** One-letter initial used on the illuminated badges. */
  initial: z.string().length(1),
  tagline: Text,
  /** How proponents describe their own view (their vocabulary). */
  selfDescription: Text,
  summary: Text,
  coreBeliefs: z.array(Text).min(3),
  history: z.array(z.object({ era: Text, text: Text })).min(2),
  keyTexts: z.array(Ref).min(3),
  scholars: z.array(Id),
  strengths: z.array(Text).min(2),
  critiques: z.array(z.object({ critique: Text, response: Text })).min(2),
  subViews: z.array(z.object({ id: Id, name: Text, summary: Text })),
  /** Factual note where a view sits outside historic creedal orthodoxy. */
  orthodoxyNote: z.string().optional(),
  related: z.array(Id).default([]),
  sources: z.array(Id).min(1),
})

export const Frequency = z.enum(['common', 'occasional', 'rare', 'incompatible'])
export const Combination = z.object({
  millennial: Id,
  hermeneutic: Id,
  frequency: Frequency,
  note: Text,
  exemplars: z.array(z.string()).default([]),
})

export const Stance = z.object({
  code: Id,
  label: Text,
  /** Stances sharing a family count as "partly agree" in the comparison matrix. */
  family: z.string().optional(),
})

export const Topic = z.object({
  id: Id,
  name: Text,
  question: Text,
  description: Text,
  stances: z.array(Stance).min(2),
})

export const Consensus = z.enum(['strong', 'majority', 'divided'])
export const MatrixCell = z.object({
  position: Id,
  topic: Id,
  stance: Id,
  statement: Text,
  keyTexts: z.array(Ref),
  /** How unified proponents of this position are on this topic. */
  consensus: Consensus,
  note: z.string().optional(),
  sources: z.array(Id).min(1),
})

export const Reading = z.object({
  position: Id,
  reading: Text,
  support: Text,
  objection: Text,
  sources: z.array(Id).min(1),
})

export const Passage = z.object({
  id: Id,
  title: Text,
  /** Display reference, e.g. "Revelation 20:1–10". */
  ref: Text,
  /** Machine ranges used to pull Bible text, e.g. ["Revelation 20:1-10"]. */
  ranges: z.array(Ref).min(1),
  category: z.enum(['revelation', 'olivet', 'daniel', 'epistles', 'prophets', 'psalms', 'gospels', 'acts']),
  summary: Text,
  keyIssue: Text,
  timeText: z.boolean().default(false),
  /** Topic ids this passage bears on. */
  topics: z.array(Id).default([]),
  readings: z.array(Reading).min(3),
  sources: z.array(Id).min(1),
})

export const NodeKind = z.enum(['claim', 'objection', 'rebuttal', 'counter-rebuttal'])
export type ArgNode = {
  id: string
  kind: z.infer<typeof NodeKind>
  position: string
  text: string
  passages: string[]
  sources: string[]
  children: ArgNode[]
}
export const ArgNodeSchema: z.ZodType<ArgNode> = z.lazy(() =>
  z.object({
    id: Id,
    kind: NodeKind,
    position: Id,
    text: Text,
    passages: z.array(Ref).default([]),
    sources: z.array(Id).min(1),
    children: z.array(ArgNodeSchema).default([]),
  }),
) as z.ZodType<ArgNode>

export const ArgumentTree = z.object({
  id: Id,
  title: Text,
  question: Text,
  topic: Id,
  summary: Text,
  positions: z.array(Id).min(2),
  root: ArgNodeSchema,
})

export const Milestone = z.enum([
  'cross',
  'pentecost',
  'ad70',
  'church-age',
  'great-tribulation',
  'antichrist',
  'rapture',
  'satan-bound',
  'millennium',
  'israel-conversion',
  'apostasy',
  'parousia',
  'resurrection',
  'judgment',
  'new-creation',
  'other',
])
/**
 * Timeline scale (shared by every position so overlays line up):
 * 0 = the Cross (c. AD 30) · 10 = AD 70 · 10–60 = church history to the present (60 ≈ today)
 * 60–100 = the future, ending with the new creation at 100.
 * Use `end` for spans (e.g. the millennium).
 */
export const TimelineEvent = z.object({
  id: Id,
  milestone: Milestone,
  label: Text,
  at: z.number().min(0).max(100),
  end: z.number().min(0).max(100).optional(),
  description: Text,
  texts: z.array(Ref).default([]),
})
export const Timeline = z.object({
  position: Id,
  summary: Text,
  events: z.array(TimelineEvent).min(5),
  sources: z.array(Id).min(1),
})

export const Scholar = z.object({
  id: Id,
  name: Text,
  dates: Text,
  positions: z.array(Id).min(1),
  tradition: Text,
  bio: Text,
  works: z.array(Text).default([]),
  sources: z.array(Id).min(1),
})

export const Exchange = z.object({
  id: Id,
  title: Text,
  kind: z.enum(['debate', 'multi-view-book', 'book', 'lecture-series']),
  participants: z.array(Text).min(1),
  year: Text,
  positions: z.array(Id).min(1),
  summary: Text,
  keyPoints: z.array(Text).min(2),
  sources: z.array(Id).min(1),
  verified: z.boolean(),
})

export const GlossaryEntry = z.object({
  id: Id,
  term: Text,
  aliases: z.array(z.string()).default([]),
  definition: Text,
  origin: z.string().optional(),
  related: z.array(Id).default([]),
})

export const QuizQuestion = z.object({
  id: Id,
  q: Text,
  options: z.array(Text).min(2).max(5),
  answer: z.number().int().min(0),
  explanation: Text,
})
export const QuizSet = z.object({
  /** Position id, or "general". */
  set: Id,
  title: Text,
  questions: z.array(QuizQuestion).min(4),
})
export const FlashDeck = z.object({
  set: Id,
  title: Text,
  cards: z.array(z.object({ id: Id, front: Text, back: Text })).min(4),
})

export const FlowOption = z.object({
  label: Text,
  next: Id.optional(),
  result: Id.optional(),
})
export const FlowNode = z.object({
  id: Id,
  question: Text,
  explanation: Text,
  texts: z.array(Ref).default([]),
  options: z.array(FlowOption).min(2),
})
export const FlowResult = z.object({
  id: Id,
  title: Text,
  positions: z.array(Id).min(1),
  summary: Text,
})
export const Flowchart = z.object({
  start: Id,
  nodes: z.array(FlowNode).min(3),
  results: z.array(FlowResult).min(3),
})

export const TourStep = z.object({ focus: z.array(Id).default([]), title: Text, text: Text })
export type TourStep = z.infer<typeof TourStep>

export const BibleVerse = z.object({ ref: z.string(), text: z.string() })
export const Bible = z.object({
  translations: z.record(z.string(), z.object({ name: z.string(), license: z.string(), url: z.string() })),
  passages: z.record(z.string(), z.record(z.string(), z.array(BibleVerse))),
})

export type Source = z.infer<typeof Source>
export type Position = z.infer<typeof Position>
export type Combination = z.infer<typeof Combination>
export type Topic = z.infer<typeof Topic>
export type MatrixCell = z.infer<typeof MatrixCell>
export type Passage = z.infer<typeof Passage>
export type Reading = z.infer<typeof Reading>
export type ArgumentTree = z.infer<typeof ArgumentTree>
export type Timeline = z.infer<typeof Timeline>
export type TimelineEvent = z.infer<typeof TimelineEvent>
export type Scholar = z.infer<typeof Scholar>
export type Exchange = z.infer<typeof Exchange>
export type GlossaryEntry = z.infer<typeof GlossaryEntry>
export type QuizSet = z.infer<typeof QuizSet>
export type FlashDeck = z.infer<typeof FlashDeck>
export type Flowchart = z.infer<typeof Flowchart>
export type FlowNode = z.infer<typeof FlowNode>
export type Bible = z.infer<typeof Bible>

/* ---------- Revelation Study ------------------------------------------------------------ */

export const SymbolCategory = z.enum([
  'number', 'colour', 'creature', 'person', 'place', 'object', 'action', 'time', 'title', 'cosmic', 'worship', 'body',
])
export const ViewReading = z.object({ position: Id, reading: Text })

/** One phrase or image in Revelation, explained from its backgrounds outward. */
export const RevSymbol = z.object({
  id: Id,
  phrase: Text,
  /** Verse(s), e.g. "Revelation 1:16". */
  ref: Ref,
  /** Words to highlight in the chapter text (lower-case substrings that occur in the BSB wording). */
  keywords: z.array(z.string()).default([]),
  category: SymbolCategory,
  /** Old Testament and Second Temple Jewish background (Daniel, Ezekiel, Zechariah, 1 Enoch, 4 Ezra, Qumran, temple practice…). */
  jewish: Text,
  /** Greco-Roman / Asia Minor cultural and historical context. Empty string if none is relevant. */
  cultural: z.string(),
  /** What the image means, as broadly agreed by interpreters, with uncertainty flagged. */
  meaning: Text,
  /** How the different views read it, where they differ. */
  readings: z.array(ViewReading).default([]),
  texts: z.array(Ref).default([]),
  sources: z.array(Id).min(1),
})

export const RevChapter = z.object({
  chapter: z.number().int().min(1).max(22),
  title: Text,
  /** Which movement of the book it belongs to (e.g. "The seven seals"). */
  section: Text,
  summary: Text,
  outline: z.array(z.object({ range: Text, heading: Text })).min(2),
  /** The chapter's overall Jewish and cultural setting. */
  context: Text,
  symbols: z.array(RevSymbol).min(4),
  /** Chapter-level readings: at least partial-preterism, historicism, futurism, idealism; others where relevant. */
  readings: z.array(ViewReading).min(4),
  questions: z.array(Text).default([]),
  sources: z.array(Id).min(1),
})

export const RevIntroSection = z.object({
  id: Id,
  title: Text,
  body: Text,
  /** Optional facts table (label → value), e.g. for the seven cities. */
  facts: z.array(z.object({ label: Text, value: Text })).default([]),
  sources: z.array(Id).min(1),
})

export type RevSymbol = z.infer<typeof RevSymbol>
export type RevChapter = z.infer<typeof RevChapter>
export type RevIntroSection = z.infer<typeof RevIntroSection>
export type ViewReading = z.infer<typeof ViewReading>

/* ---------- Spiritual understanding of Revelation ---------------------------------------- */

export const SpiritualKey = z.object({
  id: Id,
  symbol: Text,
  /** The common surface or future-event reading it is contrasted with. */
  surface: Text,
  /** The Christ-centred spiritual meaning. */
  spiritual: Text,
  /** What it says about Christ and the cross. */
  christ: Text,
  /** Pairs with its opposite in the "two cities" map (e.g. babylon ↔ new-jerusalem). */
  opposite: Id.optional(),
  chapter: z.number().int().min(1).max(22),
  texts: z.array(Ref).default([]),
})

export const SpiritualChapter = z.object({
  chapter: z.number().int().min(1).max(22),
  /** Short theme, e.g. "The unveiling of the risen Christ". */
  theme: Text,
  /** How Christ is revealed in this chapter. */
  christRevealed: Text,
  /** The chapter read as a spiritual reality for the believer now. */
  reading: Text,
  insights: z.array(Text).min(2),
  /** Optional per-symbol insights keyed by RevSymbol id. */
  symbolInsights: z.array(z.object({ symbolId: Id, insight: Text })).default([]),
  /** Longer verse-by-verse notes for chapters this view has taught in depth. */
  depth: z.array(z.object({ title: Text, text: Text, texts: z.array(Ref).default([]) })).default([]),
  texts: z.array(Ref).default([]),
})

export const SpiritualStudy = z.object({
  overview: Text,
  principles: z.array(z.object({ id: Id, title: Text, text: Text, texts: z.array(Ref).default([]) })).min(4),
  /** Stages of the inner journey through the book, for the journey map. */
  journey: z.array(z.object({ id: Id, chapters: Text, stage: Text, text: Text })).min(5),
  keys: z.array(SpiritualKey).min(12),
  chapters: z.array(SpiritualChapter),
  critiques: z.array(z.object({ critique: Text, response: Text })).min(2),
  /** How this view sets itself against the popular end-times reading, row by row. */
  contrasts: z.array(z.object({ topic: Text, popular: Text, spiritual: Text, texts: z.array(Ref).default([]) })).default([]),
  /** The way of reading: the steps from outward signs to Christ revealed within. */
  method: z.array(z.object({ id: Id, step: Text, text: Text, texts: z.array(Ref).default([]) })).default([]),
  /** Old Testament patterns used as keys (creation, Exodus, tabernacle, feasts...). */
  patterns: z.array(z.object({ id: Id, pattern: Text, text: Text, links: z.array(z.object({ from: Text, to: Text })).default([]), texts: z.array(Ref).default([]) })).default([]),
  /** The seven promises "to the one who overcomes" and where each is fulfilled. */
  overcomer: z.array(z.object({ church: Text, promise: Text, ref: Ref, fulfilled: Text, fulfilledRef: Ref, meaning: Text })).default([]),
  /** Short lines that sum up the view, paraphrased. */
  lines: z.array(Text).default([]),
  sources: z.array(Id).min(1),
})
export type SpiritualStudy = z.infer<typeof SpiritualStudy>
export type SpiritualKey = z.infer<typeof SpiritualKey>

/* ---------- Revelation and the whole Bible ---------------------------------------------- */

/** Canonical book names, in order, used by the canon thread map. */
export const CANON = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
  '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Songs',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
  'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter',
  '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation',
] as const
export const CanonBook = z.enum(CANON)

/** One stop on a theme's path through the Bible. */
export const CanonStop = z.object({ book: CanonBook, ref: Ref, note: Text })

/** A theme, image, symbol, metaphor or phrase traced from its first appearance to Revelation. */
export const CanonThread = z.object({
  id: Id,
  title: Text,
  kind: z.enum(['image', 'symbol', 'metaphor', 'phrase', 'number', 'colour', 'creature', 'place', 'title', 'theme']),
  /** One-line hook. */
  summary: Text,
  /** In canonical order; the last stops are in Revelation. */
  stops: z.array(CanonStop).min(3),
  /** What the image means across the canon. */
  meaning: Text,
  /** Ancient Near Eastern, Second Temple Jewish and Greco-Roman context. */
  culture: Text,
  /** How Revelation reuses, intensifies or reverses the source. */
  compare: Text,
  /** How the main schools of interpretation take it in Revelation (brief, even-handed). */
  views: Text.optional(),
  chapters: z.array(z.number().int().min(1).max(22)).min(1),
  sources: z.array(Id).default([]),
})
export type CanonThread = z.infer<typeof CanonThread>

/** A book Revelation draws on, with the specific echoes. */
export const SourceBook = z.object({
  id: Id,
  book: CanonBook,
  /** Date and setting, e.g. "6th century BC, among the exiles in Babylon". */
  era: Text,
  setting: Text,
  themes: z.array(Text).min(2),
  /** How and why Revelation uses this book. */
  summary: Text,
  links: z.array(z.object({ ot: Ref, rev: Ref, image: Text, note: Text })).min(3),
  sources: z.array(Id).default([]),
})
export type SourceBook = z.infer<typeof SourceBook>

const Segment = z.object({ label: z.string().min(1).max(4), title: Text, range: Text, startCh: z.number().int().min(1), endCh: z.number().int().min(1) })

/** A proposed chiastic (concentric) outline. Segments are in reading order; matching labels pair up (A ... A′). */
export const ChiasmOutline = z.object({
  id: Id,
  name: Text,
  /** Who proposed it (scholar), shown as attribution. */
  proposer: Text,
  segments: z.array(Segment).min(3),
  /** Label of the centre segment. */
  centre: z.string().min(1).max(4),
  note: Text,
  sources: z.array(Id).default([]),
})
export type ChiasmOutline = z.infer<typeof ChiasmOutline>

export const RevStructure = z.object({
  intro: Text,
  /** What a chiasm is and why ancient authors used it. */
  chiasmIntro: Text,
  outlines: z.array(ChiasmOutline).min(2),
  /** Verbal echoes between the opening and close of the book. */
  bookends: z.array(z.object({ a: Ref, aText: Text, b: Ref, bText: Text, note: Text })).min(4),
  critiques: z.array(z.object({ critique: Text, response: Text })).min(1),
  /** Concentric structures in other prophetic books. Segments use chapter numbers of that book. */
  prophetic: z.array(
    z.object({
      id: Id,
      book: CanonBook,
      passage: Text,
      summary: Text,
      segments: z.array(Segment).min(3),
      centre: z.string().min(1).max(4),
      link: Text,
      sources: z.array(Id).default([]),
    }),
  ).min(4),
  /** Whole sequences Revelation follows from an earlier book. */
  sequences: z.array(
    z.object({
      id: Id,
      title: Text,
      book: CanonBook,
      intro: Text,
      pairs: z.array(z.object({ ot: Ref, otTitle: Text, rev: Ref, revTitle: Text, note: Text })).min(4),
      sources: z.array(Id).default([]),
    }),
  ).min(3),
  sources: z.array(Id).min(1),
})
export type RevStructure = z.infer<typeof RevStructure>

/* ---------- Atlas of Revelation ----------------------------------------------------------- */

export const AtlasEra = z.object({ id: Id, label: Text, years: Text, summary: Text })
export const AtlasPlace = z.object({
  id: Id,
  name: Text,
  /** Decimal degrees. */
  lat: z.number().min(15).max(50),
  lon: z.number().min(5).max(60),
  kind: z.enum(['city', 'region', 'mountain', 'river', 'island', 'sea', 'valley']),
  /** Era ids in which the place matters. */
  eras: z.array(Id).min(1),
  /** What happened there in the Bible's story. */
  story: Text,
  /** How Revelation uses the place or its memory. */
  revelation: Text,
  /** Historical or archaeological context. */
  context: Text,
  refs: z.array(Ref).min(1),
  /** Canon thread ids this place belongs to. */
  threads: z.array(Id).default([]),
})
export const AtlasJourney = z.object({ id: Id, title: Text, era: Id, stops: z.array(Id).min(2), note: Text, refs: z.array(Ref).default([]) })
export const Atlas = z.object({
  intro: Text,
  eras: z.array(AtlasEra).min(3),
  places: z.array(AtlasPlace).min(10),
  journeys: z.array(AtlasJourney).min(2),
  sources: z.array(Id).min(1),
})
export type Atlas = z.infer<typeof Atlas>

/* ---------- Investigations: Olivet Discourse, fulfilment claims, dating ------------------ */


export const OlivetUnit = z.object({
  id: Id,
  /** e.g. "Matthew 24:1-2". */
  ref: Ref,
  parallels: z.array(Ref).default([]),
  title: Text,
  summary: Text,
  /** First-century Jewish and Roman setting of these verses. */
  context: Text,
  readings: z.array(ViewReading).min(4),
  /** Historical evidence offered for and against an AD 70 fulfilment. */
  evidence: z.array(z.object({ side: z.enum(['ad70', 'future', 'both']), title: Text, text: Text, source: Text })).default([]),
  keyIssue: Text,
  sources: z.array(Id).default([]),
})

export const OlivetStudy = z.object({
  intro: Text,
  /** Setting: temple, audience, Rome, Zealots, Josephus as witness... */
  context: z.array(z.object({ id: Id, title: Text, text: Text, refs: z.array(Ref).default([]), sources: z.array(Id).default([]) })).min(4),
  /** The disciples' questions and how each view maps the discourse onto them. */
  questions: z.object({ text: Text, items: z.array(z.object({ q: Text, ref: Ref })).min(2), mappings: z.array(ViewReading).min(4) }),
  units: z.array(OlivetUnit).min(8),
  /** Other Gospel passages with a time element. */
  related: z.array(z.object({ id: Id, ref: Ref, title: Text, text: Text, readings: z.array(ViewReading).min(3), sources: z.array(Id).default([]) })).min(5),
  /** "This generation" and other time indicators. */
  generation: z.object({ text: Text, uses: z.array(z.object({ ref: Ref, text: Text })).min(5), readings: z.array(ViewReading).min(3) }),
  /** Prophecy-to-history pairs, chiefly from Josephus and Tacitus. */
  fulfilments: z.array(z.object({ prophecy: Ref, prophecyText: Text, event: Text, year: Text, source: Text, note: Text })).min(8),
  /** Events from AD 30 to AD 73. */
  timeline: z.array(z.object({ year: z.number(), label: Text, text: Text, source: Text })).min(10),
  sources: z.array(Id).min(1),
})
export type OlivetStudy = z.infer<typeof OlivetStudy>

export const SignsStudy = z.object({
  intro: Text,
  /** Claims through church history that the end was near. */
  history: z.array(
    z.object({
      id: Id,
      year: z.number(),
      yearLabel: Text,
      who: Text,
      kind: z.enum(['date-setting', 'identification', 'movement', 'sign']),
      claim: Text,
      basis: Text,
      outcome: Text,
      lesson: Text,
      sources: z.array(Id).default([]),
    }),
  ).min(20),
  /** Modern events read as fulfilment by dispensational and other premillennial writers. */
  modern: z.array(
    z.object({
      id: Id,
      title: Text,
      period: Text,
      claim: Text,
      proponents: Text,
      argument: Text,
      criticism: Text,
      /** How dispensationalists or premillennialists themselves answer or qualify the claim. */
      response: Text,
      verdict: Text,
      refs: z.array(Ref).default([]),
      sources: z.array(Id).default([]),
    }),
  ).min(10),
  /** Why the pattern recurs. */
  cycle: z.array(z.object({ id: Id, title: Text, text: Text })).min(4),
  principles: z.array(z.object({ id: Id, title: Text, text: Text, refs: z.array(Ref).default([]) })).min(5),
  /** The best case for watching the signs, in its proponents' words. */
  steelman: Text,
  sources: z.array(Id).min(1),
})
export type SignsStudy = z.infer<typeof SignsStudy>

export const DatingStudy = z.object({
  intro: Text,
  sides: z.array(z.object({ id: z.enum(['early', 'late']), label: Text, date: Text, summary: Text, scholars: z.array(Text).min(3) })).length(2),
  evidence: z.array(
    z.object({
      id: Id,
      kind: z.enum(['external', 'internal']),
      side: z.enum(['early', 'late']),
      title: Text,
      claim: Text,
      /** Primary source or passage. */
      source: Text,
      /** 1 = suggestive, 2 = significant, 3 = strong, as its advocates rate it. */
      weight: z.number().int().min(1).max(3),
      counter: Text,
      sources: z.array(Id).default([]),
    }),
  ).min(16),
  /** What hangs on the date for each view. */
  implications: z.array(ViewReading).min(4),
  verdict: Text,
  sources: z.array(Id).min(1),
})
export type DatingStudy = z.infer<typeof DatingStudy>

/* ---------- Josephus and the fall of Jerusalem ---------------------------------------- */

/** Areas drawn on the Jerusalem siege map. */
export const JERUSALEM_AREAS = ['temple', 'antonia', 'upper-city', 'lower-city', 'bezetha', 'third-wall', 'second-wall', 'first-wall', 'mount-of-olives', 'mount-scopus', 'siege-wall', 'herods-palace', 'siloam'] as const
const Area = z.enum(JERUSALEM_AREAS)

export const JosephusStory = z.object({
  intro: Text,
  /** Who Josephus was, and how far to trust him. */
  about: Text,
  caveats: z.array(z.object({ title: Text, text: Text })).min(3),
  scenes: z.array(
    z.object({
      id: Id,
      /** For ordering and the time scrubber, e.g. 66.4 for spring AD 66. */
      at: z.number(),
      date: Text,
      title: Text,
      /** Where it happens, for the caption. */
      place: Text,
      narrative: Text,
      quotes: z.array(z.object({ text: Text, cite: Text })).min(1),
      /** Map state for this scene. */
      map: z.object({
        focus: z.array(Area).default([]),
        romans: z.array(Area).default([]),
        fire: z.array(Area).default([]),
        breached: z.array(Area).default([]),
        siegeWall: z.boolean().default(false),
      }),
      /** Gospel sayings that readers connect to this event. */
      prophecy: z.array(z.object({ ref: Ref, text: Text })).default([]),
      sources: z.array(Id).default([]),
    }),
  ).min(12),
  portents: z.array(z.object({ id: Id, icon: z.enum(['star', 'comet', 'light', 'gate', 'chariots', 'voice', 'heifer', 'woe']), title: Text, quote: Text, cite: Text, note: Text })).min(6),
  figures: z.array(z.object({ id: Id, name: Text, role: Text, text: Text, side: z.enum(['roman', 'jewish', 'christian', 'other']) })).min(8),
  numbers: z.array(z.object({ id: Id, label: Text, value: z.number(), display: Text, cite: Text, note: Text })).min(4),
  sources: z.array(Id).min(1),
})
export type JosephusStory = z.infer<typeof JosephusStory>

/* ---------- Israel in prophecy: promises, fulfilment, the modern state, the kingdom ---- */

/** fulfilment = the promises are fulfilled in Christ and his people (covenantal, amil, postmil, progressive covenantal);
 *  future = a distinct future for national/ethnic Israel (dispensational, many historic premillennialists). */
const Camp = z.enum(['fulfilment', 'future'])
const RefText = z.object({ ref: Ref, text: Text })
const PromiseStage = z.enum(['promise', 'type', 'christ', 'church', 'consummation'])
export const ISRAEL_CATEGORIES = ['land', 'seed', 'nation', 'throne', 'temple', 'return', 'new-covenant', 'nations', 'zion', 'people'] as const

export const IsraelStudy = z.object({
  intro: Text,
  /** Why the question matters. */
  stakes: z.array(z.object({ id: Id, title: Text, text: Text })).min(3),
  /** The views, from full fulfilment to a distinct national future. */
  camps: z.array(
    z.object({
      id: Id,
      family: Camp,
      name: Text,
      summary: Text,
      /** Who "Israel" is in the promises. */
      israel: Text,
      land: Text,
      kingdom: Text,
      modernState: Text,
      romans11: Text,
      scholars: z.array(Text).min(2),
      keyTexts: z.array(Ref).min(2),
      sources: z.array(Id).default([]),
    }),
  ).min(5),
  /** A mind map: the centre and its branches. */
  mindmap: z.object({
    center: Text,
    branches: z.array(z.object({ id: Id, label: Text, text: Text, children: z.array(z.object({ label: Text, ref: Ref, text: Text })).min(2) })).min(6),
  }),
  /** Jesus relives Israel's story (typology). */
  recapitulation: z.array(z.object({ id: Id, israel: Text, israelRef: Ref, jesus: Text, jesusRef: Ref })).min(10),
  /** The Old Testament promises and prophecies, traced to where the New Testament says they land. */
  promises: z.array(
    z.object({
      id: Id,
      category: z.enum(ISRAEL_CATEGORIES),
      title: Text,
      /** The Old Testament text, e.g. "Genesis 12:1-3". */
      ref: Ref,
      promise: Text,
      /** The path from promise to fulfilment, in order. */
      path: z.array(z.object({ stage: PromiseStage, ref: Ref, text: Text })).min(3),
      /** Historical evidence and setting. */
      history: Text,
      /** How it reaches believers today. */
      toUs: Text,
      /** The future-for-Israel reading, as its proponents put it. */
      futurist: Text,
      /** The fulfilment camp's reply. */
      reply: Text,
      /** The future camp's answer back. */
      rejoinder: Text,
      sources: z.array(Id).default([]),
    }),
  ).min(20),
  /** The land promise widening from Canaan to the whole renewed earth. */
  landWidening: z.array(z.object({ id: Id, label: Text, ref: Ref, text: Text })).min(5),
  /** The modern State of Israel. */
  modern: z.object({
    intro: Text,
    timeline: z.array(z.object({ year: z.number(), label: Text, text: Text, kind: z.enum(['religious', 'political', 'diplomatic', 'war', 'theological']) })).min(15),
    /** Political, secular and diplomatic factors behind the state's founding. */
    factors: z.array(z.object({ id: Id, title: Text, text: Text })).min(5),
    /** Texts said to predict 1948 and after. */
    claims: z.array(
      z.object({ id: Id, ref: Ref, claim: Text, proponents: Text, argument: Text, criticism: Text, response: Text, verdict: Text, sources: z.array(Id).default([]) }),
    ).min(8),
    /** On love for the Jewish people, and what the debate is not. */
    caution: Text,
  }),
  /** Present reigning kingdom versus a future earthly kingdom. */
  kingdom: z.object({
    intro: Text,
    arguments: z.array(
      z.object({ id: Id, side: z.enum(['present', 'future']), title: Text, claim: Text, refs: z.array(Ref).min(1), counter: Text, rebuttal: Text, sources: z.array(Id).default([]) }),
    ).min(16),
    /** David's throne, promise to the risen Christ. */
    throne: z.array(RefText).min(6),
  }),
  romans11: z.object({
    text: Text,
    readings: z.array(z.object({ id: Id, label: Text, reading: Text, holders: Text, strengths: Text, weaknesses: Text })).min(4),
  }),
  /** How each family reads the Old Testament. */
  hermeneutics: z.array(z.object({ id: Id, title: Text, fulfilment: Text, future: Text, refs: z.array(Ref).default([]) })).min(6),
  /** Argument, counter, answer. */
  exchanges: z.array(z.object({ id: Id, by: Camp, title: Text, argument: Text, counter: Text, answer: Text, refs: z.array(Ref).default([]), sources: z.array(Id).default([]) })).min(14),
  /** Caricatures of each camp, and what they actually hold. */
  strawmen: z.array(z.object({ id: Id, against: Camp, strawman: Text, whyFalse: Text, accurate: Text })).min(8),
  /** A decision path through the key questions. */
  flow: z.object({
    start: Id,
    nodes: z.array(z.object({ id: Id, q: Text, help: Text, options: z.array(z.object({ label: Text, next: Id })).min(2) })).min(5),
    results: z.array(z.object({ id: Id, camp: Id, title: Text, text: Text })).min(3),
  }),
  quiz: z.array(z.object({ q: Text, options: z.array(Text).min(3), answer: z.number().int().min(0), explain: Text })).min(10),
  /** Each family's best case in a paragraph. */
  bestCase: z.object({ fulfilment: Text, future: Text }),
  sources: z.array(Id).min(1),
})
export type IsraelStudy = z.infer<typeof IsraelStudy>
