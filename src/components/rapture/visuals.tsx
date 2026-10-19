import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RaptureStudy } from '../../content/schema'
import { positionsById } from '../../lib/core'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { usePositionColors } from '../../lib/theme'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'
import { Refs } from '../Refs'
import { Sources } from '../Sources'
import { ViewReadings } from '../studies/ViewReadings'

type R = RaptureStudy
type TribId = R['tribViews'][number]['id']
export const TRIB_COLOR: Record<TribId, string> = {
  pretrib: '#2563eb',
  midtrib: '#7c3aed',
  prewrath: '#c2410c',
  posttrib: '#be123c',
  partial: '#ca8a04',
  'one-coming': '#0f766e',
}

/* ---------- The timing machine: where each view puts the rapture, the wrath and the return ---------- */

const X0 = 18
const X1 = 560
const xAt = (y: number) => X0 + (y / 7) * (X1 - X0)

export function TimingMachine({ views }: { views: R['tribViews'] }) {
  const [sel, setSel] = useState<TribId>(views[0]?.id)
  const v = views.find((x) => x.id === sel) ?? views[0]
  const [tab, setTab] = useState<'timing' | 'origin' | 'strengths' | 'weaknesses'>('timing')
  const LANE = 62
  const H = views.length * LANE + 40
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="leaf p-3 sm:p-4">
        <svg viewBox={`0 0 ${X1 + 60} ${H}`} className="h-auto w-full" role="group" aria-label={t('Where each view places the rapture')}>
          {[0, 3.5, 7].map((y) => (
            <g key={y}>
              <line x1={xAt(y)} x2={xAt(y)} y1={8} y2={H - 26} stroke="var(--rule)" strokeDasharray="3 4" />
              <text x={xAt(y)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
                {y === 0 ? t('Year 0') : y === 7 ? t('Year 7') : '3½'}
              </text>
            </g>
          ))}
          <text x={X1 + 34} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
            {t('Return')}
          </text>
          {views.map((x, i) => {
            const y = 8 + i * LANE
            const on = x.id === v.id
            const c = TRIB_COLOR[x.id]
            return (
              <g key={x.id} role="button" tabIndex={0} aria-pressed={on} aria-label={x.name} onClick={() => setSel(x.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(x.id)} className="cursor-pointer outline-none" opacity={on ? 1 : 0.5}>
                <rect x={0} y={y - 4} width={X1 + 60} height={LANE - 4} rx={10} fill={on ? 'var(--surface-2)' : 'transparent'} />
                <text x={X0} y={y + 12} fontSize={12.5} fontWeight={800} fill={c}>
                  {x.name}
                </text>
                {x.rapture === null ? (
                  <>
                    <motion.rect x={X0} y={y + 22} height={14} rx={7} fill={c} opacity={0.25} initial={{ width: 0 }} animate={{ width: X1 + 30 - X0 }} transition={{ duration: 1 }} />
                    <text x={X0 + 10} y={y + 33} fontSize={10.5} fill="var(--ink)">
                      {t('The present age: no future seven-year period')}
                    </text>
                  </>
                ) : (
                  <>
                    <rect x={X0} y={y + 22} width={X1 - X0} height={14} rx={7} fill="var(--rule)" opacity={0.6} />
                    {x.wrathStart !== null && (
                      <motion.rect y={y + 22} height={14} rx={7} fill="#be123c" opacity={0.55} initial={{ x: X1, width: 0 }} animate={{ x: xAt(x.wrathStart), width: X1 - xAt(x.wrathStart) }} transition={{ duration: 0.9, delay: 0.2 }} />
                    )}
                    <motion.g initial={{ x: X0 }} animate={{ x: xAt(x.rapture) }} transition={{ type: 'spring', stiffness: 60, damping: 12, delay: 0.1 + i * 0.08 }}>
                      <circle cx={0} cy={y + 29} r={11} fill={c} stroke="var(--surface)" strokeWidth={2.5} />
                      <path d={`M0 ${y + 35} V${y + 23} M-4.5 ${y + 27.5} L0 ${y + 23} L4.5 ${y + 27.5}`} stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.g>
                  </>
                )}
                <g transform={`translate(${X1 + 34} ${y + 29})`}>
                  <circle r={12} fill="var(--gold)" />
                  <path d="M-6 4h12M-6 4l-1.5-7 4 3L0 -5l3.5 5 4-3L6 4" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinejoin="round" />
                </g>
              </g>
            )
          })}
        </svg>
        <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <span className="inline-block size-3 rounded-full bg-[var(--ink-soft)]" /> {t('Rapture')}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-5 rounded-full bg-[#be123c] opacity-60" /> {t('God’s wrath poured out')}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-3 rounded-full bg-[var(--gold)]" /> {t('Visible return of Christ')}
          </span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={v.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="leaf min-w-0 p-5" style={{ borderTop: `5px solid ${TRIB_COLOR[v.id]}` }}>
          <h3 className="text-2xl font-bold" style={{ color: TRIB_COLOR[v.id] }}>
            {v.name}
          </h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{v.summary}</Gloss>
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5" role="tablist">
            {(
              [
                ['timing', t('Timing')],
                ['origin', t('Origin')],
                ['strengths', t('Strengths')],
                ['weaknesses', t('Weaknesses')],
              ] as const
            ).map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="chip cursor-pointer" style={tab === k ? { background: TRIB_COLOR[v.id], color: '#fff', borderColor: TRIB_COLOR[v.id] } : undefined}>
                {label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-surface-2 p-4 leading-relaxed">
              <Gloss>{v[tab]}</Gloss>
            </motion.p>
          </AnimatePresence>
          <p className="mt-3 text-sm">
            <span className="font-bold">{t('Representative scholars:')} </span>
            {v.scholars.join(' · ')}
          </p>
          <Refs refs={v.keyTexts} className="mt-3" />
          <div className="mt-2">
            <Sources ids={v.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Key texts: one passage, read by every view ---------- */

export function TextLens({ texts, views }: { texts: R['texts']; views: R['tribViews'] }) {
  const [id, setId] = useState(texts[0]?.id)
  const x = texts.find((y) => y.id === id) ?? texts[0]
  const [all, setAll] = useState(false)
  const [view, setView] = useState<TribId>(x.readings[0].view)
  const name = (v: TribId) => views.find((y) => y.id === v)?.name ?? v
  const r = x.readings.find((y) => y.view === view) ?? x.readings[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <ul className="scroll-x flex gap-1.5 lg:flex-col">
        {texts.map((y) => (
          <li key={y.id} className="shrink-0">
            <button type="button" onClick={() => setId(y.id)} aria-current={y.id === x.id} className={`w-52 rounded-xl px-3 py-2 text-left text-sm lg:w-full ${y.id === x.id ? 'bg-accent text-[var(--accent-ink)]' : 'hover:bg-surface-2'}`}>
              <span className="block font-semibold leading-snug">{refLabel(y.ref)}</span>
              <span className="block text-xs opacity-80">{y.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={x.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf min-w-0 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(x.ref)}</p>
          <h3 className="text-xl font-bold">{x.title}</h3>
          <p className="mt-2 flex items-start gap-2 font-serif text-lg italic">
            <Icon name="question" size={18} className="mt-1 shrink-0 text-accent" /> {x.question}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {!all &&
              x.readings.map((y) => (
                <button key={y.view} type="button" onClick={() => setView(y.view)} className="chip cursor-pointer" style={y.view === r.view ? { background: TRIB_COLOR[y.view], color: '#fff', borderColor: TRIB_COLOR[y.view] } : { borderColor: TRIB_COLOR[y.view] }}>
                  {name(y.view)}
                </button>
              ))}
            <button type="button" className={`btn ml-auto text-xs ${all ? 'btn-primary' : ''}`} onClick={() => setAll(!all)} aria-pressed={all}>
              <Icon name="layers" size={13} /> {t('All side by side')}
            </button>
          </div>
          {all ? (
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {x.readings.map((y, k) => (
                <motion.div key={y.view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.05 }} className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: `4px solid ${TRIB_COLOR[y.view]}` }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TRIB_COLOR[y.view] }}>
                    {name(y.view)}
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed">
                    <Gloss>{y.reading}</Gloss>
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={r.view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-surface-2 p-4 leading-relaxed" style={{ borderLeft: `5px solid ${TRIB_COLOR[r.view]}` }}>
                <Gloss>{r.reading}</Gloss>
              </motion.div>
            </AnimatePresence>
          )}
          <div className="mt-2">
            <Sources ids={x.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- How the doctrine developed ---------- */

export function RaptureHistory({ items, views }: { items: R['history']; views: R['tribViews'] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [f, setF] = useState<'all' | TribId>('all')
  const name = (v: TribId) => views.find((y) => y.id === v)?.name ?? v
  const list = sorted.filter((x) => f === 'all' || x.view === f)
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setF('all')} className={`chip cursor-pointer ${f === 'all' ? 'border-accent text-accent' : ''}`}>
          {t('Everything')}
        </button>
        {views.map((v) => (
          <button key={v.id} type="button" onClick={() => setF(v.id)} className="chip cursor-pointer gap-1.5" style={f === v.id ? { borderColor: TRIB_COLOR[v.id], color: TRIB_COLOR[v.id] } : undefined}>
            <span className="size-2.5 rounded-full" style={{ background: TRIB_COLOR[v.id] }} /> {v.name}
          </button>
        ))}
      </div>
      <ol className="relative mt-5 ml-3 border-l-2 border-rule pl-6">
        {list.map((x, i) => {
          const c = x.view ? TRIB_COLOR[x.view] : 'var(--ink-soft)'
          return (
            <motion.li key={x.year + x.label} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: (i % 4) * 0.05 }} className="relative pb-5">
              <span className="absolute -left-[2.05rem] top-1 size-4 rounded-full ring-4 ring-[var(--bg)]" style={{ background: c }} />
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-serif text-2xl font-bold tabular-nums" style={{ color: c }}>
                  {x.year < 0 ? `${-x.year} BC` : x.year < 1000 ? `AD ${x.year}` : x.year}
                </span>
                <span className="font-bold">{x.label}</span>
                {x.view && <span className="chip py-0 text-[0.7rem]">{name(x.view)}</span>}
              </p>
              <p className="mt-1 max-w-[70ch] text-[0.95rem] text-ink-soft">
                <Gloss>{x.text}</Gloss>
              </p>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

/* ---------- The four millennial views: their order of events, side by side ---------- */

const KIND_COLOR: Record<R['millViews'][number]['sequence'][number]['kind'], string> = {
  age: 'var(--ink-soft)',
  event: 'var(--accent)',
  kingdom: 'var(--gold)',
  eternal: '#1d4ed8',
}

export function MillSequences({ views }: { views: R['millViews'] }) {
  const color = usePositionColors()
  const [sel, setSel] = useState(views[0]?.id)
  const [tab, setTab] = useState<'rev20' | 'satanBound' | 'firstResurrection' | 'thousand' | 'strengths' | 'weaknesses'>('rev20')
  const v = views.find((x) => x.id === sel) ?? views[0]
  const TABS = [
    ['rev20', t('Revelation 20')],
    ['satanBound', t('Satan bound?')],
    ['firstResurrection', t('First resurrection')],
    ['thousand', t('The thousand years')],
    ['strengths', t('Strengths')],
    ['weaknesses', t('Weaknesses')],
  ] as const
  return (
    <div>
      <ul className="space-y-3">
        {views.map((x, i) => {
          const c = color(x.id)
          const on = x.id === v.id
          return (
            <motion.li key={x.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <button type="button" onClick={() => setSel(x.id)} aria-pressed={on} className={`w-full rounded-2xl p-3 text-left ring-1 transition ${on ? 'bg-surface-2 ring-transparent' : 'ring-rule hover:bg-surface-2'}`} style={on ? { boxShadow: `inset 5px 0 0 ${c.base}` } : undefined}>
                <p className="text-sm font-bold" style={{ color: c.text }}>
                  {positionsById.get(x.id)?.name ?? x.id}
                </p>
                <ol className="mt-2 flex flex-wrap items-center gap-1">
                  {x.sequence.map((s, k) => (
                    <motion.li key={k} className="flex items-center gap-1" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + k * 0.09 + i * 0.05 }}>
                      {k > 0 && <span className="text-ink-soft" aria-hidden>→</span>}
                      <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${s.kind === 'event' ? 'text-white' : ''}`} style={s.kind === 'event' ? { background: KIND_COLOR[s.kind] } : { boxShadow: `inset 0 0 0 1.5px ${KIND_COLOR[s.kind]}`, color: s.kind === 'age' ? undefined : KIND_COLOR[s.kind] }}>
                        {s.label}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </button>
            </motion.li>
          )
        })}
      </ul>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded ring-1 ring-[var(--ink-soft)]" /> {t('An age or period')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-accent" /> {t('An event')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded ring-2 ring-[var(--gold)]" /> {t('The millennial kingdom')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded ring-2 ring-[#1d4ed8]" /> {t('The eternal state')}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-5 p-5" style={{ borderTop: `5px solid ${color(v.id).base}` }}>
          <h3 className="text-2xl font-bold">
            <Link to={`/positions/${v.id}`}>{positionsById.get(v.id)?.name ?? v.id}</Link>
          </h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{v.summary}</Gloss>
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5" role="tablist">
            {TABS.map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="chip cursor-pointer" style={tab === k ? { background: color(v.id).base, color: color(v.id).ink, borderColor: color(v.id).base } : undefined}>
                {label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-surface-2 p-4 leading-relaxed">
              <Gloss>{v[tab]}</Gloss>
            </motion.p>
          </AnimatePresence>
          <p className="mt-3 text-sm">
            <span className="font-bold">{t('Representative scholars:')} </span>
            {v.scholars.join(' · ')}
          </p>
          <Refs refs={v.keyTexts} className="mt-3" />
          <div className="mt-2">
            <Sources ids={v.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** The shape each view expects history to take before Christ returns. */
export function ShapeOfHistory({ views }: { views: R['millViews'] }) {
  const color = usePositionColors()
  const [sel, setSel] = useState(views[0]?.id)
  const W = 560
  const H = 240
  const px = (i: number) => 40 + (i / 5) * (W - 70)
  const py = (v: number) => H - 30 - (v / 10) * (H - 50)
  const path = (pts: number[]) => {
    const p = pts.map((v, i) => [px(i), py(v)])
    let d = `M${p[0][0]},${p[0][1]}`
    for (let i = 1; i < p.length; i++) {
      const [x0, y0] = p[i - 1]
      const [x1, y1] = p[i]
      const cx = (x0 + x1) / 2
      d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`
    }
    return d
  }
  const v = views.find((x) => x.id === sel) ?? views[0]
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="leaf p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t('The shape of history before the return, as each view expects it')}>
          <line x1={40} x2={W - 30} y1={H - 30} y2={H - 30} stroke="var(--rule)" />
          <line x1={40} x2={40} y1={14} y2={H - 30} stroke="var(--rule)" />
          <text x={44} y={22} fontSize={11} fill="var(--ink-soft)">
            {t('Gospel influence in the world')}
          </text>
          <text x={40} y={H - 12} fontSize={11} fill="var(--ink-soft)">
            {t('Now')}
          </text>
          <text x={W - 30} y={H - 12} fontSize={11} fill="var(--ink-soft)" textAnchor="end">
            {t('Christ returns')}
          </text>
          {views.map((x, i) => {
            const on = x.id === v.id
            return (
              <motion.path key={x.id} d={path(x.shape)} fill="none" stroke={color(x.id).base} strokeWidth={on ? 5 : 2.5} strokeLinecap="round" opacity={on ? 1 : 0.35} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: i * 0.2 }} onClick={() => setSel(x.id)} className="cursor-pointer" />
            )
          })}
          <motion.circle key={v.id} cx={px(5)} cy={py(v.shape[5])} r={7} fill={color(v.id).base} initial={{ scale: 0 }} animate={{ scale: 1 }} />
        </svg>
      </div>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {views.map((x) => (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} className="chip cursor-pointer gap-1.5" style={x.id === v.id ? { background: color(x.id).base, color: color(x.id).ink, borderColor: color(x.id).base } : { borderColor: color(x.id).base }}>
              {positionsById.get(x.id)?.shortName ?? x.id}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-3 p-4 leading-relaxed" style={{ borderLeft: `5px solid ${color(v.id).base}` }}>
            <Gloss>{v.shapeNote}</Gloss>
          </motion.p>
        </AnimatePresence>
        <p className="mt-2 text-xs text-ink-soft">{t('A simplified picture. Every view expects both the gospel’s spread and real opposition until the end.')}</p>
      </div>
    </div>
  )
}

/** Millennium questions, each read by all four views. */
export function MillDebates({ items }: { items: R['millDebates'] }) {
  const [id, setId] = useState(items[0]?.id)
  const x = items.find((y) => y.id === id) ?? items[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <ul className="scroll-x flex gap-1.5 lg:flex-col">
        {items.map((y, i) => (
          <li key={y.id} className="shrink-0">
            <button type="button" onClick={() => setId(y.id)} aria-current={y.id === x.id} className={`flex w-56 items-start gap-2 rounded-xl px-3 py-2 text-left text-sm lg:w-full ${y.id === x.id ? 'bg-accent text-[var(--accent-ink)]' : 'hover:bg-surface-2'}`}>
              <span className="font-bold opacity-70">{i + 1}.</span>
              <span className="font-semibold leading-snug">{y.question}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={x.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf min-w-0 p-5">
          <h3 className="text-xl font-bold">{x.question}</h3>
          <Refs refs={x.refs} className="mt-2" />
          <div className="mt-4">
            <ViewReadings readings={x.readings} />
          </div>
          <div className="mt-2">
            <Sources ids={x.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Establishing or stewarding: a spectrum of kingdom models ---------- */

const ROWS = [
  ['whoBrings', () => t('Who brings the kingdom')],
  ['churchTask', () => t('The church’s task now')],
  ['culture', () => t('Culture and society')],
  ['strengths', () => t('Strengths')],
  ['critique', () => t('Critique')],
  ['response', () => t('Response')],
] as const

export function KingdomSpectrum({ models }: { models: R['kingdomModels'] }) {
  const sorted = useMemo(() => [...models].sort((a, b) => a.place - b.place), [models])
  const [sel, setSel] = useState(sorted[0]?.id)
  const m = sorted.find((x) => x.id === sel) ?? sorted[0]
  const hue = (p: number) => `hsl(${215 - p * 17} 70% ${42}%)`
  return (
    <div>
      <div className="leaf p-4">
        <div className="relative mx-2 mt-2 h-4 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(215 70% 42%), hsl(130 55% 38%), hsl(45 80% 42%), hsl(15 75% 45%))' }} aria-hidden>
          {sorted.map((x) => (
            <motion.button key={x.id} type="button" aria-label={x.name} onClick={() => setSel(x.id)} className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--surface)] shadow" style={{ left: `${x.place * 10}%`, background: hue(x.place) }} animate={{ scale: x.id === m.id ? 1.5 : 1 }} whileHover={{ scale: 1.3 }} />
          ))}
        </div>
        <div className="mt-3 flex justify-between gap-4 text-xs font-bold uppercase tracking-widest">
          <span className="text-[hsl(215_70%_42%)]">{t('Established by Christ at his return')}</span>
          <span className="text-right text-[hsl(15_75%_45%)]">{t('Stewarded and extended by the church now')}</span>
        </div>
        <ol className="mt-4 grid gap-1.5 sm:grid-cols-3">
          {sorted.map((x) => (
            <li key={x.id}>
              <button type="button" onClick={() => setSel(x.id)} aria-pressed={x.id === m.id} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${x.id === m.id ? 'text-white' : 'hover:bg-surface-2'}`} style={x.id === m.id ? { background: hue(x.place) } : undefined}>
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white" style={{ background: hue(x.place) }}>
                  {x.place}
                </span>
                <span className="font-semibold leading-snug">{x.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-5" style={{ borderTop: `5px solid ${hue(m.place)}` }}>
          <h3 className="text-2xl font-bold">{m.name}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{m.summary}</Gloss>
          </p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            {ROWS.map(([k, label]) => (
              <div key={k} className="rounded-xl bg-surface-2 p-3">
                <dt className="text-xs font-bold uppercase tracking-widest text-ink-soft">{label()}</dt>
                <dd className="mt-1 text-[0.95rem]">
                  <Gloss>{m[k]}</Gloss>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm">
            <span className="font-bold">{t('Representative scholars:')} </span>
            {m.scholars.join(' · ')}
          </p>
          <Refs refs={m.keyTexts} className="mt-3" />
          <div className="mt-2">
            <Sources ids={m.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** A stewardship text, turned over: read as waiting for the King, then as serving the reigning King. */
function StewardCard({ s }: { s: R['stewardship'][number] }) {
  const [side, setSide] = useState<'establish' | 'steward'>('establish')
  const col = side === 'establish' ? 'hsl(215 70% 42%)' : 'hsl(15 75% 45%)'
  return (
    <motion.li initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="leaf flex flex-col p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(s.ref)}</p>
      <h3 className="mt-0.5 font-bold">{s.title}</h3>
      <p className="mt-1 text-sm text-ink-soft">
        <Gloss>{s.text}</Gloss>
      </p>
      <div className="mt-3 grid grid-cols-2 rounded-xl bg-surface-2 p-1 text-xs font-bold" role="tablist">
        {(['establish', 'steward'] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={side === k} onClick={() => setSide(k)} className="relative rounded-lg px-2 py-1.5">
            {side === k && <motion.span layoutId={`steward-${s.id}`} className="absolute inset-0 rounded-lg" style={{ background: col }} />}
            <span className={`relative ${side === k ? 'text-white' : ''}`}>{k === 'establish' ? t('Awaiting the King') : t('Serving the reigning King')}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={side} initial={{ opacity: 0, rotateX: -50 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0, rotateX: 50 }} transition={{ duration: 0.3 }} className="mt-3 text-[0.95rem] leading-relaxed" style={{ borderLeft: `4px solid ${col}`, paddingLeft: '0.75rem' }}>
          <Gloss>{s[side]}</Gloss>
        </motion.p>
      </AnimatePresence>
    </motion.li>
  )
}

export function Stewardship({ items }: { items: R['stewardship'] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <StewardCard key={s.id} s={s} />
      ))}
    </ul>
  )
}
