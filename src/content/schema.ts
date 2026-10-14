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
