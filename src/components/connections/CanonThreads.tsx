import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CANON, type CanonThread } from '../../content/schema'
import { Gloss } from '../Gloss'

/** Sections of the canon, coloured on the strip. */
const SECTIONS: { name: string; from: string; tint: string }[] = [
  { name: 'Law', from: 'Genesis', tint: 'var(--rubric)' },
  { name: 'History', from: 'Joshua', tint: 'color-mix(in srgb, var(--rubric) 55%, var(--gold-bright))' },
  { name: 'Wisdom', from: 'Job', tint: 'var(--gold-bright)' },
  { name: 'Major prophets', from: 'Isaiah', tint: 'var(--accent)' },
  { name: 'Minor prophets', from: 'Hosea', tint: 'color-mix(in srgb, var(--accent) 60%, var(--gold-bright))' },
  { name: 'Gospels and Acts', from: 'Matthew', tint: 'var(--agree)' },
  { name: 'Letters', from: 'Romans', tint: 'color-mix(in srgb, var(--agree) 55%, var(--accent))' },
  { name: 'Revelation', from: 'Revelation', tint: 'var(--gold-bright)' },
]
const sectionOf = (i: number) => {
  let s = SECTIONS[0]
  for (const x of SECTIONS) if (CANON.indexOf(x.from as (typeof CANON)[number]) <= i) s = x
  return s
}
const KIND_LABEL: Record<string, string> = {
  image: 'Images', symbol: 'Symbols', metaphor: 'Metaphors', phrase: 'Phrases', number: 'Numbers', colour: 'Colours', creature: 'Creatures', place: 'Places', title: 'Titles', theme: 'Themes',
}
const TABS = [
  { key: 'meaning', label: 'Meaning' },
  { key: 'culture', label: 'Cultural context' },
  { key: 'compare', label: 'How Revelation uses it' },
  { key: 'views', label: 'Across the views' },
] as const

/**
 * A golden thread drawn across the 66 books: pick a theme and watch it hop from its first
 * appearance to Revelation, then read each stop, its meaning, context and comparison.
 */
export function CanonThreads({ threads, initial }: { threads: CanonThread[]; initial?: string | null }) {
  const kinds = useMemo(() => [...new Set(threads.map((t) => t.kind))], [threads])
  const [kind, setKind] = useState<string>('all')
  const [id, setId] = useState(initial && threads.some((t) => t.id === initial) ? initial : threads[0]?.id)
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('meaning')
  const [stop, setStop] = useState<number | null>(null)
  const t = threads.find((x) => x.id === id) ?? threads[0]
  if (!t) return null
  const list = threads.filter((x) => kind === 'all' || x.kind === kind)

  const W = 1000
  const N = CANON.length
  const bx = (book: string) => 10 + (CANON.indexOf(book as (typeof CANON)[number]) + 0.5) * ((W - 20) / N)
  const stripY = 150
  // Consecutive stops in the same book sit on the same tick; offset their arcs a little.
  const pts = t.stops.map((s, i) => ({ ...s, x: bx(s.book) + (i > 0 && t.stops[i - 1].book === s.book ? 5 : 0) }))
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${stripY}`
    const prev = pts[i - 1]
    const span = Math.abs(p.x - prev.x)
    const h = Math.min(130, 24 + span * 0.45)
    return `${acc} C${prev.x},${stripY - h} ${p.x},${stripY - h} ${p.x},${stripY}`
  }, '')

  return (
    <div>
      <div className="scroll-x -mx-1 flex gap-1.5 px-1 pb-2" role="tablist" aria-label="Kind">
        {['all', ...kinds].map((k) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)} className={`chip shrink-0 cursor-pointer ${kind === k ? 'border-accent text-accent' : ''}`}>
            {k === 'all' ? 'Everything' : KIND_LABEL[k] ?? k}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {list.map((x) => (
          <motion.button
            layout
            key={x.id}
            type="button"
            onClick={() => (setId(x.id), setStop(null))}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition-colors ${x.id === t.id ? 'bg-accent text-[var(--accent-ink)] ring-accent' : 'bg-surface ring-rule hover:ring-accent'}`}
          >
            {x.title}
          </motion.button>
        ))}
      </div>

      <div className="leaf mt-5 overflow-hidden p-3">
        <p className="px-1 text-xs font-bold uppercase tracking-widest text-accent">{KIND_LABEL[t.kind] ?? t.kind}</p>
        <h3 className="px-1 text-2xl font-bold">{t.title}</h3>
        <p className="px-1 text-ink-soft">{t.summary}</p>
        <svg viewBox={`0 0 ${W} 200`} className="mt-2 h-auto w-full" role="img" aria-label={`${t.title} traced through ${t.stops.length} books of the Bible`}>
          {/* the canon strip */}
          {CANON.map((b, i) => {
            const sec = sectionOf(i)
            const hit = t.stops.some((s) => s.book === b)
            return (
              <rect key={b} x={10 + i * ((W - 20) / N) + 0.6} y={stripY + 4} width={(W - 20) / N - 1.2} height={hit ? 22 : 14} rx={2} fill={sec.tint} opacity={hit ? 1 : 0.35}>
                <title>{b}</title>
              </rect>
            )
          })}
          {SECTIONS.map((s, si) => (
            <text key={s.name} x={bx(s.from) - (W - 20) / N / 2} y={stripY + (si % 2 ? 46 : 38)} fontSize={11} fill="var(--ink-soft)">
              {s.name === 'Revelation' ? '' : s.name}
            </text>
          ))}
          <motion.path key={t.id + 'p'} d={d} fill="none" stroke="var(--gold-bright)" strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
          <motion.circle key={t.id + 'dot'} r={7} fill="var(--gold-bright)" style={{ offsetPath: `path("${d}")`, filter: 'drop-shadow(0 0 6px rgb(var(--glow) / .8))' }} initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
          {pts.map((p, i) => (
            <g key={t.id + i} className="cursor-pointer" onClick={() => setStop(i)}>
              <motion.circle cx={p.x} cy={stripY} r={stop === i ? 10 : 7} fill={p.book === 'Revelation' ? 'var(--gold-bright)' : 'var(--surface)'} stroke="var(--accent)" strokeWidth={2.5} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + (i / pts.length) * 1.6 }} style={{ transformOrigin: `${p.x}px ${stripY}px` }} />
            </g>
          ))}
          <text x={W - 12} y={stripY - 14} textAnchor="end" fontSize={12} fontWeight={700} fill="var(--accent)">
            Revelation
          </text>
          <text x={12} y={stripY - 14} fontSize={12} fontWeight={700} fill="var(--rubric)">
            Genesis
          </text>
        </svg>

        <ol className="scroll-x mt-1 flex gap-2 px-1 pb-2">
          {t.stops.map((s, i) => (
            <motion.li key={t.id + s.ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }} className="w-56 shrink-0">
              <button type="button" onClick={() => setStop(i)} className={`h-full w-full rounded-xl p-3 text-left text-sm ring-1 transition-colors ${stop === i ? 'bg-surface-2 ring-accent' : 'ring-rule hover:ring-accent'}`}>
                <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: sectionOf(CANON.indexOf(s.book)).tint }}>
                  {i + 1}. {s.ref}
                </span>
                <span className="mt-1 block">{s.note}</span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Read about">
        {TABS.filter((x) => x.key !== 'views' || t.views).map((x) => (
          <button key={x.key} type="button" role="tab" aria-selected={tab === x.key} onClick={() => setTab(x.key)} className={`btn text-sm ${tab === x.key ? 'btn-primary' : ''}`}>
            {x.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={t.id + tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="leaf mt-3 p-5">
          <p className="prose-measure leading-relaxed">
            <Gloss>{(tab === 'views' ? t.views : t[tab]) ?? ''}</Gloss>
          </p>
          <p className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="text-ink-soft">In Revelation:</span>
            {t.chapters.map((c) => (
              <Link key={c} to={`/revelation/${c}`} className="chip no-underline hover:border-accent">
                Chapter {c}
              </Link>
            ))}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
