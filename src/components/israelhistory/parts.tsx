import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactElement } from 'react'
import type { IsraelHistory } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { useReducedMotion } from '../../lib/theme'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type H = IsraelHistory
type Ev = H['events'][number]

export const ERA: Record<Ev['era'], { c: string; l: () => string }> = {
  promise: { c: 'hsl(40 75% 48%)', l: () => t('Patriarchs') },
  egypt: { c: 'hsl(25 70% 45%)', l: () => t('Egypt') },
  sinai: { c: 'hsl(5 65% 50%)', l: () => t('Sinai and wilderness') },
  judges: { c: 'hsl(330 40% 50%)', l: () => t('Judges') },
  united: { c: 'hsl(265 45% 55%)', l: () => t('United kingdom') },
  divided: { c: 'hsl(230 45% 55%)', l: () => t('Divided kingdom') },
  exile: { c: 'hsl(205 55% 45%)', l: () => t('Exile') },
  return: { c: 'hsl(175 50% 40%)', l: () => t('Return') },
  christ: { c: 'hsl(150 55% 40%)', l: () => t('Christ') },
  end: { c: 'hsl(0 0% 45%)', l: () => t('AD 70') },
}

/** Small drawn scenes, one per kind of event. Simple shapes in the event's colour, gently animated. */
export function Vignette({ icon, c, size = 120 }: { icon: Ev['icon']; c: string; size?: number }) {
  const s = { stroke: c, strokeWidth: 3, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const soft = `color-mix(in srgb, ${c} 22%, transparent)`
  const body: Record<Ev['icon'], ReactElement> = {
    tent: (
      <>
        <path d="M20 90 L60 35 L100 90 Z" {...s} fill={soft} />
        <path d="M60 35 L60 90 M50 90 L60 70 L70 90" {...s} />
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle key={i} cx={20 + i * 20} cy={18 + (i % 2) * 8} r={2.5} fill={c} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }} />
        ))}
      </>
    ),
    ladder: (
      <>
        <path d="M45 100 L60 15 M75 100 L60 15" {...s} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${48 + i * 2.4} ${85 - i * 15} H${72 - i * 2.4}`} {...s} />
        ))}
        <motion.circle cx={60} cy={15} r={8} fill={soft} stroke={c} strokeWidth={2} animate={{ r: [8, 12, 8] }} transition={{ repeat: Infinity, duration: 2.4 }} />
      </>
    ),
    tribes: (
      <>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <motion.path key={i} d={`M${60 + Math.cos(a) * 36 - 7} ${60 + Math.sin(a) * 36 + 6} l7 -12 l7 12 z`} {...s} fill={soft} strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 }} style={{ transformOrigin: `${60 + Math.cos(a) * 36}px ${60 + Math.sin(a) * 36}px` }} />
        })}
        <rect x={52} y={52} width={16} height={16} rx={2} fill={c} />
      </>
    ),
    tablets: (
      <>
        <path d="M30 95 V35 a12 12 0 0 1 24 0 V95 Z M66 95 V35 a12 12 0 0 1 24 0 V95 Z" {...s} fill={soft} />
        {[50, 62, 74, 86].map((y) => (
          <path key={y} d={`M36 ${y} H48 M72 ${y} H84`} {...s} strokeWidth={2} />
        ))}
        <motion.path d="M20 22 L30 30 M100 22 L90 30 M60 8 V18" {...s} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.6 }} />
      </>
    ),
    wilderness: (
      <>
        <path d="M5 95 Q35 75 60 95 T115 92" {...s} fill={soft} />
        <motion.path d="M78 70 C70 55 86 50 78 35 C70 20 86 15 80 5" {...s} animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        <circle cx={30} cy={30} r={10} {...s} />
      </>
    ),
    judge: (
      <>
        <path d="M60 15 V100 M45 100 H75" {...s} />
        <motion.g animate={{ rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3 }} style={{ transformOrigin: '60px 25px' }}>
          <path d="M25 25 H95 M25 25 L15 55 H35 Z M95 25 L85 55 H105 Z" {...s} fill={soft} />
        </motion.g>
      </>
    ),
    crown: (
      <>
        <motion.path d="M20 85 L28 40 L45 65 L60 30 L75 65 L92 40 L100 85 Z" {...s} fill={soft} animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.6 }} />
        <path d="M20 95 H100" {...s} />
        <circle cx={60} cy={26} r={4} fill={c} />
      </>
    ),
    split: (
      <>
        <motion.path d="M15 85 L22 45 L36 65 L50 35 L56 85 Z" {...s} fill={soft} animate={{ x: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        <motion.path d="M64 85 L70 35 L84 65 L98 45 L105 85 Z" {...s} fill={soft} animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        <path d="M60 25 L56 50 L64 62 L58 95" {...s} strokeDasharray="4 4" />
      </>
    ),
    chains: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <motion.ellipse key={i} cx={30 + i * 20} cy={60} rx={13} ry={8} {...s} transform={`rotate(${i % 2 ? 90 : 0} ${30 + i * 20} 60)`} animate={{ y: [0, i % 2 ? 2 : -2, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }} />
        ))}
        <path d="M10 100 H110" {...s} strokeDasharray="3 6" />
      </>
    ),
    temple: (
      <>
        <path d="M15 45 L60 15 L105 45 Z" {...s} fill={soft} />
        {[28, 46, 64, 82].map((x) => (
          <path key={x} d={`M${x} 50 V92`} {...s} />
        ))}
        <path d="M15 95 H105" {...s} />
        <motion.path d="M60 0 V10" {...s} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.8 }} />
      </>
    ),
    star: (
      <>
        <motion.path d="M60 10 L68 45 L103 50 L68 58 L60 95 L52 58 L17 50 L52 45 Z" {...s} fill={soft} animate={{ rotate: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ transformOrigin: '60px 52px' }} />
        <circle cx={60} cy={52} r={6} fill={c} />
      </>
    ),
    cross: (
      <>
        <path d="M60 10 V105 M35 35 H85" {...s} strokeWidth={5} />
        <motion.circle cx={60} cy={35} r={30} fill="none" stroke={c} strokeWidth={1.5} animate={{ r: [24, 40], opacity: [0.7, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} />
        <path d="M10 105 Q60 90 110 105" {...s} />
      </>
    ),
    fall: (
      <>
        <path d="M15 95 H105" {...s} />
        {[
          [25, 70, -8],
          [50, 78, 6],
          [75, 66, -12],
          [62, 52, 18],
          [38, 50, 10],
        ].map(([x, y, r], i) => (
          <motion.rect key={i} x={x} y={y} width={22} height={14} rx={2} fill={soft} stroke={c} strokeWidth={2} initial={{ y: -40, opacity: 0 }} animate={{ y, opacity: 1, rotate: r }} transition={{ delay: i * 0.12, type: 'spring' }} />
        ))}
        <motion.path d="M85 40 C80 25 95 22 88 8 M95 45 C92 32 104 30 100 18" {...s} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }} />
      </>
    ),
    return: (
      <>
        <path d="M10 95 C40 90 50 60 70 55 S100 40 108 25" {...s} strokeDasharray="5 6" className="obs-flow" />
        <path d="M90 25 L108 25 L104 42" {...s} />
        <path d="M80 75 h25 v20 h-25 z M80 75 l12 -10 l13 10" {...s} fill={soft} />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 120 110" width={size} height={size * 0.92} aria-hidden>
      {body[icon]}
    </svg>
  )
}

/** Compressed scale: the patriarchs and early history are squeezed so the kings, exile and Christ have room. */
const X = (y: number) => (y < -1000 ? ((y + 2150) / 1150) * 30 : y < -400 ? 30 + ((y + 1000) / 600) * 38 : 68 + ((y + 400) / 470) * 30)

/**
 * The history of Israel on one line, like a wall chart: era-coloured axis, events above, covenant bands below.
 * Press play and a marker walks the story event by event.
 */
export function IsraelTimeline({ events, bands }: { events: H['events']; bands: H['bands'] }) {
  const sorted = useMemo(() => [...events].sort((a, b) => a.year - b.year), [events])
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!play) return
    const id = setTimeout(() => (i < sorted.length - 1 ? setI(i + 1) : setPlay(false)), reduce ? 4000 : 3200)
    return () => clearTimeout(id)
  }, [play, i, sorted.length, reduce])
  const e = sorted[i]
  const eras = (Object.keys(ERA) as Ev['era'][]).map((k) => {
    const list = sorted.filter((x) => x.era === k)
    return { k, from: Math.min(...list.map((x) => x.year)), to: Math.max(...list.map((x) => x.year)) }
  })
  const BAND = { promise: 'hsl(40 75% 48%)', covenant: 'hsl(5 65% 50%)', overlap: 'hsl(0 0% 50%)', seed: 'hsl(150 55% 40%)' } as const
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={() => (i === sorted.length - 1 && !play ? (setI(0), setPlay(true)) : setPlay(!play))}>
          <Icon name={play ? 'pause' : 'play'} size={15} /> {play ? t('Pause') : t('Play the story')}
        </button>
        <button type="button" className="btn" disabled={i === 0} onClick={() => (setPlay(false), setI(i - 1))}>
          ←
        </button>
        <button type="button" className="btn" disabled={i === sorted.length - 1} onClick={() => (setPlay(false), setI(i + 1))}>
          →
        </button>
        <span className="text-sm tabular-nums text-ink-soft">
          {i + 1} / {sorted.length}
        </span>
      </div>
      <div className="scroll-x mt-4">
        <div className="relative min-w-[880px] pb-2">
          <div className="relative h-28">
            {eras.map((r, k) => (
              <span key={r.k} className={`absolute whitespace-nowrap text-[0.68rem] font-bold ${X(r.from) > 90 ? '-translate-x-full' : ''}`} style={{ left: `${X(r.from) > 90 ? 100 : X(r.from)}%`, top: (k % 4) * 16, color: ERA[r.k].c }}>
                {ERA[r.k].l()}
              </span>
            ))}
            <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`absolute bottom-0 flex flex-col ${X(e.year) < 15 ? 'items-start' : X(e.year) > 85 ? '-translate-x-full items-end' : '-translate-x-1/2 items-center'}`} style={{ left: `${X(e.year)}%` }}>
              <span className="w-max max-w-[11rem] rounded-md px-2 py-0.5 text-center text-[0.72rem] font-bold leading-tight text-white" style={{ background: ERA[e.era].c }}>
                {e.title}
              </span>
              <span className="h-3 w-px" style={{ background: ERA[e.era].c }} />
            </motion.div>
          </div>
          <div className="relative h-4">
            {eras.map((r) => (
              <span key={r.k} className="absolute top-1 h-2 rounded-full" style={{ left: `${X(r.from)}%`, width: `${Math.max(1.2, X(r.to) - X(r.from))}%`, background: ERA[r.k].c }} title={ERA[r.k].l()} />
            ))}
            <div className="absolute inset-x-0 top-[0.55rem] -z-0 h-px bg-[var(--rule)]" />
            {sorted.map((x, k) => (
              <button key={x.id} type="button" onClick={() => (setPlay(false), setI(k))} aria-label={`${x.label}: ${x.title}`} title={`${x.label}: ${x.title}`} className="absolute top-0 z-[5] block size-4 -translate-x-1/2 rounded-full border-2 border-[var(--surface)]" style={{ left: `${X(x.year)}%`, background: ERA[x.era].c }} />
            ))}
            <motion.span className="absolute -top-1 z-10 block size-6 -translate-x-1/2 rounded-full border-4 border-[var(--surface)] shadow-lg" animate={{ left: `${X(e.year)}%`, background: ERA[e.era].c }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
          </div>
          <div className="relative mt-1 h-5 text-[0.65rem] text-ink-soft">
            {[-2000, -1500, -1000, -700, -400, -200, 1, 70].map((y) => (
              <span key={y} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${X(y)}%` }}>
                {y < 0 ? t('{n} BC', { n: -y }) : t('AD {y}', { y })}
              </span>
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {bands.map((b) => (
              <div key={b.id} className="relative h-7">
                <motion.div className="absolute flex h-full items-center overflow-hidden rounded-md px-2 text-[0.68rem] font-bold text-white" style={{ left: `${X(b.to) - Math.max(X(b.to) - X(b.from), 7)}%`, width: `${Math.max(X(b.to) - X(b.from), 7)}%`, background: BAND[b.kind] }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} title={b.note}>
                  <span className="truncate">{X(b.to) - X(b.from) < 7 ? t('40 years') : b.label}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-5 grid items-center gap-4 rounded-2xl bg-surface-2 p-4 sm:grid-cols-[auto_minmax(0,1fr)]" style={{ borderLeft: `5px solid ${ERA[e.era].c}` }}>
          <div className="mx-auto">
            <Vignette icon={e.icon} c={ERA[e.era].c} size={130} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ERA[e.era].c }}>
              {ERA[e.era].l()} · {e.label}
            </p>
            <h3 className="mt-1 text-2xl font-bold">{e.title}</h3>
            <p className="mt-2 leading-relaxed">
              <Gloss>{e.text}</Gloss>
            </p>
            <p className="mt-2 text-xs font-semibold text-ink-soft">{e.refs.map(refLabel).join(' · ')}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** The three big spans of the story, explained. */
export function Bands({ bands }: { bands: H['bands'] }) {
  const BAND = { promise: 'hsl(40 75% 48%)', covenant: 'hsl(5 65% 50%)', overlap: 'hsl(0 0% 50%)', seed: 'hsl(150 55% 40%)' } as const
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {bands.map((b, i) => (
        <motion.li key={b.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="leaf p-4" style={{ borderTop: `5px solid ${BAND[b.kind]}` }}>
          <p className="text-xs font-bold" style={{ color: BAND[b.kind] }}>
            {b.from < 0 ? t('{n} BC', { n: -b.from }) : t('AD {y}', { y: b.from })} → {b.to < 0 ? t('{n} BC', { n: -b.to }) : t('AD {y}', { y: b.to })}
          </p>
          <p className="mt-1 font-bold leading-snug">{b.label}</p>
          <p className="mt-1 text-[0.95rem] text-ink-soft">
            <Gloss>{b.note}</Gloss>
          </p>
          {b.refs.length > 0 && <p className="mt-2 text-xs font-semibold">{b.refs.map(refLabel).join(' · ')}</p>}
        </motion.li>
      ))}
    </ol>
  )
}

/** The hourglass: from all nations to one man, one nation, one tribe, one house, one Seed, then out to every nation. */
export function Hourglass({ steps }: { steps: H['seed'] }) {
  const widths = [96, 14, 40, 62, 30, 22, 14, 6, 34, 96]
  const [sel, setSel] = useState(steps.findIndex((s) => s.id === 'christ'))
  const s = steps[sel]
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="leaf p-4">
        <ol className="space-y-1">
          {steps.map((x, i) => {
            const w = widths[i] ?? 50
            const narrowing = i <= 7
            const c = i === 7 ? 'var(--gold)' : narrowing ? 'hsl(5 60% 50%)' : 'hsl(150 55% 40%)'
            return (
              <li key={x.id}>
                <button type="button" onClick={() => setSel(i)} aria-pressed={i === sel} className="flex w-full flex-col items-center">
                  <motion.span className="flex h-7 items-center justify-center overflow-hidden rounded-full text-[0.7rem] font-bold text-white" style={{ background: c, outline: i === sel ? '3px solid var(--gold-bright)' : 'none', outlineOffset: 2 }} initial={{ width: '4%' }} whileInView={{ width: `${Math.max(w, 8)}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08 }}>
                    <span className="truncate px-2">{x.count}</span>
                  </motion.span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="leaf h-fit p-5" style={{ borderLeft: `5px solid ${sel === 7 ? 'var(--gold)' : sel < 7 ? 'hsl(5 60% 50%)' : 'hsl(150 55% 40%)'}` }}>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">
            {t('Step {n} of {m}', { n: sel + 1, m: steps.length })} · {refLabel(s.ref)}
          </p>
          <h3 className="mt-1 text-2xl font-bold">{s.label}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{s.text}</Gloss>
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn" disabled={sel === 0} onClick={() => setSel(sel - 1)}>
              ←
            </button>
            <button type="button" className="btn btn-primary" disabled={sel === steps.length - 1} onClick={() => setSel(sel + 1)}>
              →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** The covenants in order, each linked by an arrow to where it was kept. */
export function CovenantChain({ items }: { items: H['covenants'] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {items.map((c, i) => (
        <motion.li key={c.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative flex flex-col">
          <div className="leaf flex-1 p-4">
            <p className="text-xs font-bold text-gold">{refLabel(c.ref)}</p>
            <p className="mt-1 font-bold leading-snug">{c.name}</p>
            <p className="mt-1 text-sm text-ink-soft">{c.with}</p>
            <p className="mt-2 text-xs">
              <span className="font-bold">{t('Sign')}: </span>
              {c.sign}
            </p>
          </div>
          <motion.span aria-hidden className="mx-auto my-1 block h-6 w-0.5 bg-[var(--accent)]" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} style={{ originY: 0 }} />
          <div className="rounded-xl p-3 text-sm" style={{ background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))' }}>
            <p className="text-xs font-bold text-accent">{refLabel(c.keptRef)}</p>
            <p className="mt-0.5">
              <Gloss>{c.kept}</Gloss>
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}
