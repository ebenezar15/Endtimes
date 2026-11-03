import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { WeeksStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type W = WeeksStudy

/** A year as text: negative years are BC. */
export const yearLabel = (y: number) => (y < 0 ? t('{n} BC', { n: -y }) : t('AD {y}', { y }))

const C7 = 'hsl(40 80% 45%)'
const C62 = 'hsl(205 65% 40%)'
const C70 = 'hsl(0 65% 45%)'

/**
 * The seventy weeks as seventy squares: 7, then 62, then 1. Each view is drawn its own way:
 * continuous, with a gap before the last week, or with the last week stretched over the church age.
 */
export function WeeksGrid({ models }: { models: W['models'] }) {
  const [m, setM] = useState<W['models'][number]['id']>('messianic')
  const model = models.find((x) => x.id === m) ?? models[0]
  const sq = (i: number) => (i < 7 ? C7 : i < 69 ? C62 : C70)
  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="tablist">
        {models.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={m === x.id} onClick={() => setM(x.id)} className="chip cursor-pointer" style={m === x.id ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="leaf mt-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-[3px]">
          {Array.from({ length: 69 }, (_, i) => (
            <motion.span key={`${m}-${i}`} className="inline-block size-[clamp(0.6rem,2.4vw,1.1rem)] rounded-[3px]" style={{ background: sq(i) }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.008 }} title={t('Week {n}', { n: i + 1 })} />
          ))}
          {m === 'gap' && (
            <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} transition={{ delay: 0.7 }} className="mx-1 inline-flex items-center gap-1 rounded-full border-2 border-dashed border-[var(--rubric)] px-2 py-0.5 text-xs font-bold text-rubric">
              ⟵ {t('gap of ~2,000 years')} ⟶
            </motion.span>
          )}
          <motion.span
            key={`${m}-70`}
            className="inline-flex h-[clamp(0.6rem,2.4vw,1.1rem)] overflow-hidden rounded-[3px]"
            style={{ width: m === 'symbolic' ? '30%' : 'clamp(0.6rem,2.4vw,1.1rem)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="h-full flex-1" style={{ background: C70 }} />
            <span className="h-full w-px bg-white" />
            <span className="h-full flex-1" style={{ background: 'hsl(0 65% 60%)' }} />
          </motion.span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-3 text-xs">
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ background: C7 }} /> {t('7 weeks: the city rebuilt')}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ background: C62 }} /> {t('62 weeks: waiting for the Anointed One')}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ background: C70 }} /> {t('The 70th week, split in the middle')}
          </li>
        </ul>
        <AnimatePresence mode="wait">
          <motion.dl key={m} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                [t('Starts'), model.from, C7],
                [t('After 69 weeks'), model.sixtyNine, C62],
                [t('The 70th week'), model.seventieth, C70],
                [t('The “he” of 9:27'), model.prince, 'var(--accent)'],
              ] as const
            ).map(([k, v, c]) => (
              <div key={k} className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: `4px solid ${c}` }}>
                <dt className="text-xs font-bold uppercase tracking-wider" style={{ color: c }}>
                  {k}
                </dt>
                <dd className="mt-0.5 text-[0.95rem]">{v}</dd>
              </div>
            ))}
            <div className="rounded-xl p-3 sm:col-span-2" style={{ background: 'color-mix(in srgb, hsl(160 60% 32%) 10%, var(--surface))' }}>
              <dt className="text-xs font-bold uppercase tracking-wider text-[hsl(160_60%_30%)]">{t('Strongest point')}</dt>
              <dd className="mt-0.5 text-[0.95rem]">{model.strength}</dd>
              <dt className="mt-2 text-xs font-bold uppercase tracking-wider text-rubric">{t('Main difficulty')}</dt>
              <dd className="mt-0.5 text-[0.95rem]">{model.weakness}</dd>
            </div>
          </motion.dl>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Add years to a year, skipping the non-existent year 0. */
const addYears = (start: number, years: number) => {
  const end = start + years
  return start < 0 && end >= 0 ? end + 1 : end
}

/** Pick a starting decree and a year length; watch 483 and 490 years run out to their end. */
export function DecreeCalc({ decrees, timeline }: { decrees: W['decrees']; timeline: W['timeline'] }) {
  const [d, setD] = useState(decrees.find((x) => x.id === 'ezra')?.id ?? decrees[0].id)
  const [len, setLen] = useState<365 | 360>(365)
  const dec = decrees.find((x) => x.id === d) ?? decrees[0]
  const factor = len === 360 ? 360 / 365.2422 : 1
  const e69 = Math.round(addYears(dec.year, 483 * factor))
  const e70 = Math.round(addYears(dec.year, 490 * factor))
  const near = useMemo(() => [...timeline].filter((x) => x.year > 0).sort((a, b) => Math.abs(a.year - e69) - Math.abs(b.year - e69))[0], [timeline, e69])
  const x = (y: number) => ((y + 600) / 700) * 100
  return (
    <div className="leaf p-4 sm:p-6">
      <p className="text-sm font-bold">{t('1. Choose the starting decree')}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {decrees.map((x) => (
          <button key={x.id} type="button" onClick={() => setD(x.id)} aria-pressed={d === x.id} className={`rounded-xl p-3 text-left text-sm ring-1 ${d === x.id ? 'bg-accent text-[var(--accent-ink)] ring-transparent' : 'ring-rule hover:bg-surface-2'}`}>
            <span className="block font-serif text-lg font-bold">{yearLabel(x.year)}</span>
            <span className="block font-semibold">{x.who}</span>
            <span className="block text-xs opacity-80">{refLabel(x.ref)}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[0.92rem] text-ink-soft">{dec.note}</p>
      <p className="mt-4 text-sm font-bold">{t('2. Choose the length of a year')}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {([365, 360] as const).map((l) => (
          <button key={l} type="button" className={`btn ${len === l ? 'btn-primary' : ''}`} onClick={() => setLen(l)}>
            {l === 365 ? t('Solar years (365¼ days)') : t('“Prophetic” years (360 days)')}
          </button>
        ))}
      </div>
      <div className="relative mx-2 mb-14 mt-12 h-2 rounded-full bg-[var(--rule)]">
        <motion.span className="absolute top-0 h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${C7}, ${C62}, ${C70})` }} animate={{ left: `${x(dec.year)}%`, width: `${x(e70) - x(dec.year)}%` }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
        {[
          [dec.year, yearLabel(dec.year), C7],
          [e69, `${t('69 weeks')}: ${yearLabel(e69)}`, C62],
        ].map(([y, l, c], k) => (
          <motion.span key={k} className={`absolute whitespace-nowrap text-xs font-bold ${x(y as number) > 60 ? '-translate-x-full' : x(y as number) < 25 ? '' : '-translate-x-1/2'} ${k ? 'top-4' : '-top-7'}`} style={{ color: c as string }} animate={{ left: `${x(y as number)}%` }}>
            ▼ {l}
          </motion.span>
        ))}
        
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">{t('483 years (69 weeks) end')}</p>
          <p className="font-serif text-2xl font-bold" style={{ color: C62 }}>
            {yearLabel(e69)}
          </p>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">{t('490 years (70 weeks) end')}</p>
          <p className="font-serif text-2xl font-bold" style={{ color: C70 }}>
            {yearLabel(e70)}
          </p>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">{t('Nearest event')}</p>
          <p className="font-semibold leading-snug">{e69 > 0 && near ? `${yearLabel(near.year)}: ${near.label}` : t('Before Christ: no messianic event')}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-soft">{t('There is no year 0: 1 BC is followed by AD 1. Dates of Jesus’ baptism and death carry a margin of a year or two.')}</p>
    </div>
  )
}

/** The six goals of Daniel 9:24, each ticked off with the verse that says it was done. */
export function GoalsChecklist({ goals }: { goals: W['goals'] }) {
  const [done, setDone] = useState<Set<string>>(new Set())
  const all = () => goals.forEach((g, i) => setTimeout(() => setDone((s) => new Set(s).add(g.id)), i * 250))
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" onClick={all}>
          <Icon name="check" size={15} /> {t('Check all six')}
        </button>
        <span className="text-sm text-ink-soft">{t('{n} of 6 shown as fulfilled', { n: done.size })}</span>
      </div>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g, i) => {
          const on = done.has(g.id)
          return (
            <li key={g.id}>
              <button type="button" onClick={() => setDone((s) => (s.has(g.id) ? (s.delete(g.id), new Set(s)) : new Set(s).add(g.id)))} aria-pressed={on} className="leaf flex h-full w-full gap-3 p-4 text-left">
                <motion.span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2" animate={{ background: on ? 'hsl(160 60% 32%)' : 'transparent', borderColor: on ? 'hsl(160 60% 32%)' : 'var(--rule)', color: on ? '#fff' : 'var(--ink-soft)' }}>
                  {on ? <Icon name="check" size={16} /> : i + 1}
                </motion.span>
                <span className="min-w-0">
                  <span className="block font-bold leading-snug">{g.goal}</span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden">
                        <span className="mt-1 block text-[0.92rem]">
                          <Gloss>{g.kept}</Gloss>
                        </span>
                        <span className="mt-1 block text-xs font-bold text-[hsl(160_60%_30%)]">{refLabel(g.keptRef)}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Daniel 9:24-27 phrase by phrase, with the fulfilled reading and, on demand, the futurist one beside it. */
export function PhraseWalk({ items }: { items: W['phrases'] }) {
  const [i, setI] = useState(0)
  const [both, setBoth] = useState(false)
  const p = items[i]
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="flex gap-1" aria-hidden>
        {items.map((_, k) => (
          <button key={k} type="button" tabIndex={-1} onClick={() => setI(k)} className="h-2 flex-1 rounded-full" style={{ background: k <= i ? 'var(--accent)' : 'var(--rule)' }} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={p.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(p.ref)}</p>
          <h3 className="mt-1 font-serif text-2xl font-bold leading-snug">“{p.phrase}”</h3>
          <div className={`mt-4 grid gap-3 ${both ? 'sm:grid-cols-2' : ''}`}>
            <div className="rounded-xl p-3" style={{ background: 'color-mix(in srgb, hsl(160 60% 32%) 10%, var(--surface))', borderLeft: '4px solid hsl(160 60% 32%)' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-[hsl(160_60%_30%)]">{t('Fulfilled reading')}</p>
              <p className="mt-1">
                <Gloss>{p.fulfilled}</Gloss>
              </p>
            </div>
            {both && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-3" style={{ background: 'color-mix(in srgb, hsl(265 45% 45%) 10%, var(--surface))', borderLeft: '4px solid hsl(265 45% 45%)' }}>
                <p className="text-xs font-bold uppercase tracking-wider text-[hsl(265_45%_45%)]">{t('Futurist reading')}</p>
                <p className="mt-1">
                  <Gloss>{p.futurist}</Gloss>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          ← {t('Back')}
        </button>
        <button type="button" className="btn btn-primary" disabled={i === items.length - 1} onClick={() => setI(i + 1)}>
          {t('Next phrase')} →
        </button>
        <button type="button" className="chip cursor-pointer" aria-pressed={both} onClick={() => setBoth(!both)}>
          <Icon name="scales" size={14} /> {both ? t('Hide the futurist reading') : t('Compare the futurist reading')}
        </button>
      </div>
    </div>
  )
}

const ERA = {
  exile: { c: 'hsl(30 60% 40%)', l: () => t('Exile') },
  persia: { c: 'hsl(40 80% 42%)', l: () => t('Persia') },
  greece: { c: 'hsl(205 65% 40%)', l: () => t('Greece and Rome') },
  christ: { c: 'hsl(160 60% 32%)', l: () => t('Christ') },
  church: { c: 'hsl(265 45% 45%)', l: () => t('The apostles') },
  war: { c: 'hsl(0 65% 45%)', l: () => t('The Jewish war') },
} as const

/** Map a year onto a compressed track: the centuries before Christ are squeezed so AD 27-73 has room. */
const track = (y: number) => (y < -63 ? ((y + 610) / 547) * 38 : y < 27 ? 38 + ((y + 63) / 90) * 10 : 48 + ((y - 27) / 46) * 50)

/** From Daniel's exile to Masada on one track; tap any event. */
export function MasterTimeline({ items }: { items: W['timeline'] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [i, setI] = useState(sorted.findIndex((x) => x.id === 't27'))
  const e = sorted[i]
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="relative mx-4 mt-2 h-16">
        <div className="absolute inset-x-0 top-6 flex h-3 overflow-hidden rounded-full">
          <span style={{ width: '38%', background: 'hsl(35 40% 80%)' }} />
          <span style={{ width: '10%', background: 'hsl(205 30% 80%)' }} />
          <span style={{ width: '52%', background: 'hsl(0 40% 85%)' }} />
        </div>
        {sorted.map((x, k) => (
          <button key={x.id} type="button" onClick={() => setI(k)} aria-label={`${yearLabel(x.year)}: ${x.label}`} className="absolute top-[1.65rem] -translate-x-1/2 -translate-y-1/2" style={{ left: `${track(x.year)}%` }}>
            <motion.span className="block rounded-full border-2 border-[var(--surface)]" animate={{ width: k === i ? 20 : 11, height: k === i ? 20 : 11 }} style={{ background: ERA[x.era].c }} />
          </button>
        ))}
        {[-600, -300, 27, 70].map((y) => (
          <span key={y} className={`absolute top-11 whitespace-nowrap text-[0.65rem] text-ink-soft ${y === 70 ? '-translate-x-full' : y === -600 ? '' : '-translate-x-1/2'}`} style={{ left: `${track(y)}%` }}>
            {yearLabel(y)}
          </span>
        ))}
      </div>
      <ul className="flex flex-wrap gap-2 text-xs">
        {(Object.keys(ERA) as (keyof typeof ERA)[]).map((k) => (
          <li key={k} className="flex items-center gap-1">
            <span className="inline-block size-2.5 rounded-full" style={{ background: ERA[k].c }} /> {ERA[k].l()}
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl bg-surface-2 p-4" style={{ borderLeft: `5px solid ${ERA[e.era].c}` }}>
          <p className="font-serif text-2xl font-bold" style={{ color: ERA[e.era].c }}>
            {yearLabel(e.year)}
          </p>
          <h3 className="text-lg font-bold">{e.label}</h3>
          <p className="mt-1">
            <Gloss>{e.text}</Gloss>
          </p>
          {e.refs.length > 0 && <p className="mt-2 text-xs font-semibold text-ink-soft">{e.refs.map(refLabel).join(' · ')}</p>}
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex gap-2">
        <button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          ← {t('Earlier')}
        </button>
        <button type="button" className="btn btn-primary" disabled={i === sorted.length - 1} onClick={() => setI(i + 1)}>
          {t('Later')} →
        </button>
      </div>
    </div>
  )
}

const STATUS = {
  fulfilled: { c: 'hsl(160 60% 32%)', l: () => t('Fulfilled') },
  both: { c: 'hsl(40 80% 40%)', l: () => t('Fulfilled and future') },
  future: { c: 'hsl(215 70% 45%)', l: () => t('Still future') },
} as const

/** Every major end-time passage as a tile, coloured by whether it is fulfilled, future or both. */
export function PassageMap({ items }: { items: W['passages'] }) {
  const [f, setF] = useState<'all' | keyof typeof STATUS>('all')
  const [open, setOpen] = useState<string | null>(null)
  const counts = (Object.keys(STATUS) as (keyof typeof STATUS)[]).map((k) => [k, items.filter((x) => x.status === k).length] as const)
  return (
    <div>
      <div className="flex h-5 overflow-hidden rounded-full">
        {counts.map(([k, n]) => (
          <motion.span key={k} style={{ background: STATUS[k].c }} initial={{ width: 0 }} whileInView={{ width: `${(n / items.length) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" className="chip cursor-pointer" aria-pressed={f === 'all'} onClick={() => setF('all')} style={f === 'all' ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          {t('All')} {items.length}
        </button>
        {counts.map(([k, n]) => (
          <button key={k} type="button" className="chip cursor-pointer" aria-pressed={f === k} onClick={() => setF(k)} style={f === k ? { background: STATUS[k].c, color: '#fff', borderColor: STATUS[k].c } : undefined}>
            <span className="inline-block size-2.5 rounded-full" style={{ background: STATUS[k].c }} /> {STATUS[k].l()} {n}
          </button>
        ))}
      </div>
      <motion.ul layout className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((x) => f === 'all' || x.status === f)
          .map((x) => {
            const on = open === x.id
            return (
              <motion.li key={x.id} layout className="leaf overflow-hidden" style={{ borderTop: `5px solid ${STATUS[x.status].c}` }}>
                <button type="button" onClick={() => setOpen(on ? null : x.id)} aria-expanded={on} className="block w-full p-3 text-left">
                  <p className="flex items-baseline justify-between gap-2 text-xs font-bold">
                    <span style={{ color: STATUS[x.status].c }}>{refLabel(x.ref)}</span>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-white" style={{ background: STATUS[x.status].c }}>
                      {STATUS[x.status].l()}
                    </span>
                  </p>
                  <p className="mt-1 font-bold leading-snug">{x.title}</p>
                  <p className="mt-1 text-xs italic text-ink-soft">“{x.timeText}” · {x.when}</p>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="space-y-2 px-3 pb-3 text-[0.92rem]">
                        <p>
                          <span className="font-bold">{t('Fulfilled reading')}: </span>
                          <Gloss>{x.reading}</Gloss>
                        </p>
                        <p className="rounded-xl bg-surface-2 p-2 text-ink-soft">
                          <span className="font-bold">{t('Futurist reading')}: </span>
                          {x.futurist}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
      </motion.ul>
    </div>
  )
}

const KIND = {
  logical: { c: 'hsl(265 45% 45%)', l: () => t('Logical fallacy') },
  scriptural: { c: 'hsl(0 65% 42%)', l: () => t('Scriptural problem') },
  inconsistency: { c: 'hsl(35 85% 38%)', l: () => t('Inconsistency') },
} as const

/** Problems in other readings, filterable by view and by kind; each opens to the reply. */
export function Fallacies({ items }: { items: W['fallacies'] }) {
  const views = useMemo(() => [...new Set(items.map((x) => x.holder))], [items])
  const [v, setV] = useState('all')
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className="chip cursor-pointer" aria-pressed={v === 'all'} onClick={() => setV('all')} style={v === 'all' ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          {t('All views')} {items.length}
        </button>
        {views.map((x) => (
          <button key={x} type="button" className="chip cursor-pointer" aria-pressed={v === x} onClick={() => setV(x)} style={v === x ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
            {x} {items.filter((y) => y.holder === x).length}
          </button>
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-3 text-xs">
        {(Object.keys(KIND) as (keyof typeof KIND)[]).map((k) => (
          <li key={k} className="flex items-center gap-1">
            <span className="inline-block size-2.5 rounded-full" style={{ background: KIND[k].c }} /> {KIND[k].l()}
          </li>
        ))}
      </ul>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {items
          .filter((x) => v === 'all' || x.holder === v)
          .map((x, i) => {
            const on = open === x.id
            return (
              <motion.li key={x.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }} className="leaf overflow-hidden" style={{ borderLeft: `5px solid ${KIND[x.kind].c}` }}>
                <button type="button" onClick={() => setOpen(on ? null : x.id)} aria-expanded={on} className="block w-full p-4 text-left">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="rounded-full px-2 py-0.5 text-white" style={{ background: KIND[x.kind].c }}>
                      {KIND[x.kind].l()}
                    </span>
                    <span className="text-ink-soft">{x.holder}</span>
                  </p>
                  <p className="mt-1 text-lg font-bold leading-snug">{x.name}</p>
                  <p className="mt-1 text-[0.95rem]">
                    <Gloss>{x.problem}</Gloss>
                  </p>
                  {!on && <p className="mt-2 text-xs font-semibold text-accent">{t('Show the answer')} ↓</p>}
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mx-4 mb-4 rounded-xl p-3" style={{ background: 'color-mix(in srgb, hsl(160 60% 32%) 10%, var(--surface))' }}>
                        <p>
                          <span className="font-bold">{t('The better reading')}: </span>
                          <Gloss>{x.reply}</Gloss>
                        </p>
                        {x.refs.length > 0 && <p className="mt-1 text-xs text-ink-soft">{x.refs.map(refLabel).join(' · ')}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
      </ul>
    </div>
  )
}
