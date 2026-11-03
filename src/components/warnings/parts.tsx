import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { WarningsStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type W = WarningsStudy

const LANE = {
  prophet: { c: 'hsl(30 60% 38%)', l: () => t('The prophets') },
  jesus: { c: 'hsl(205 65% 38%)', l: () => t('Jesus') },
  history: { c: 'hsl(0 65% 42%)', l: () => t('History') },
} as const

/** One warning followed link by link from the prophets to Jesus to AD 70; reveal the chain a step at a time. */
export function CaseChain({ items }: { items: W['chain'] }) {
  const [shown, setShown] = useState(3)
  return (
    <div>
      <ul className="flex flex-wrap gap-3 text-xs">
        {(Object.keys(LANE) as (keyof typeof LANE)[]).map((k) => (
          <li key={k} className="flex items-center gap-1.5 font-semibold">
            <span className="inline-block size-3 rounded-full" style={{ background: LANE[k].c }} /> {LANE[k].l()}
          </li>
        ))}
      </ul>
      <ol className="relative mt-4">
        {items.slice(0, shown).map((x, i) => {
          const col = x.kind === 'prophet' ? 0 : x.kind === 'jesus' ? 1 : 2
          return (
            <motion.li key={x.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-4 sm:gap-x-3">
              <div className="leaf p-3 sm:[grid-column:var(--col)]" style={{ borderLeft: `5px solid ${LANE[x.kind].c}`, ['--col' as string]: `${col + 1} / span 2` }}>
                <p className="flex flex-wrap items-baseline gap-2 text-xs font-bold" style={{ color: LANE[x.kind].c }}>
                  <span className="inline-flex size-5 items-center justify-center rounded-full text-white" style={{ background: LANE[x.kind].c }}>
                    {i + 1}
                  </span>
                  {LANE[x.kind].l()} · {refLabel(x.ref)}
                </p>
                <p className="mt-1 font-bold leading-snug">{x.title}</p>
                <p className="mt-0.5 text-[0.92rem] text-ink-soft">
                  <Gloss>{x.text}</Gloss>
                </p>
              </div>
              {i < shown - 1 && <motion.span aria-hidden initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="mx-auto my-1 block h-5 w-0.5 origin-top bg-[var(--gold)] sm:col-span-4" />}
            </motion.li>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        {shown < items.length ? (
          <>
            <button type="button" className="btn btn-primary" onClick={() => setShown(shown + 1)}>
              {t('Next link')} ↓
            </button>
            <button type="button" className="btn" onClick={() => setShown(items.length)}>
              {t('Show the whole chain')}
            </button>
          </>
        ) : (
          <button type="button" className="btn" onClick={() => setShown(3)}>
            {t('Start again')}
          </button>
        )}
        <span className="self-center text-sm text-ink-soft">{t('{n} of {m} links', { n: shown, m: items.length })}</span>
      </div>
    </div>
  )
}

/** Old Testament warnings joined to the New Testament words that echo them. */
export function EchoMap({ items }: { items: W['echoes'] }) {
  const [sel, setSel] = useState(items[0].id)
  const e = items.find((x) => x.id === sel) ?? items[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <ol className="space-y-1.5">
        {items.map((x, i) => {
          const on = x.id === sel
          return (
            <motion.li key={x.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: (i % 7) * 0.04 }}>
              <button type="button" onClick={() => setSel(x.id)} aria-pressed={on} className={`grid w-full grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-center gap-1 rounded-xl p-1.5 text-left text-sm ring-1 ${on ? 'bg-surface-2 ring-[var(--gold)]' : 'ring-transparent hover:bg-surface-2'}`}>
                <span className="rounded-lg px-2 py-1 font-semibold" style={{ background: 'hsl(35 70% 92%)', color: 'hsl(30 60% 25%)' }}>
                  {refLabel(x.ot)}
                </span>
                <svg viewBox="0 0 40 12" aria-hidden>
                  <motion.path d="M2 6 H34" stroke="var(--gold)" strokeWidth={2} fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + (i % 7) * 0.04 }} />
                  <path d="M31 2 L38 6 L31 10" stroke="var(--gold)" strokeWidth={2} fill="none" />
                </svg>
                <span className="rounded-lg px-2 py-1 font-semibold" style={{ background: 'hsl(205 60% 92%)', color: 'hsl(205 65% 25%)' }}>
                  {refLabel(x.nt)}
                </span>
              </button>
            </motion.li>
          )
        })}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf h-fit p-5 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(30 60% 38%)' }}>
            {refLabel(e.ot)}
          </p>
          <p className="mt-1 font-serif text-xl font-bold">“{e.otText}”</p>
          <p className="my-2 text-center text-2xl text-[var(--gold)]">↓</p>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(205 65% 38%)' }}>
            {refLabel(e.nt)}
          </p>
          <p className="mt-1 font-serif text-xl font-bold">“{e.ntText}”</p>
          <p className="mt-3 rounded-xl bg-surface-2 p-3 text-[0.95rem]">
            <Icon name="sparkles" size={14} className="mr-1 inline text-accent" />
            <Gloss>{e.link}</Gloss>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Hotspot positions on the Jerusalem sketch, by Hinnom item. */
const SPOT: Record<string, [number, number]> = { h1: [70, 200], h2: [120, 250], h3: [160, 262], h4: [210, 268], h5: [190, 150], h6: [95, 230], h7: [250, 262], h8: [140, 240] }

/** A sketch of Jerusalem with the Valley of Hinnom and the Kidron, and numbered points through the valley's history. */
export function HinnomMap({ items }: { items: W['hinnom'] }) {
  const [sel, setSel] = useState(items[0].id)
  const h = items.find((x) => x.id === sel) ?? items[0]
  const idx = items.indexOf(h)
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="leaf p-3">
        <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label={t('Jerusalem and the Valley of Hinnom')}>
          <rect x={0} y={0} width={400} height={300} fill="hsl(40 35% 90%)" rx={12} />
          <path d="M40 40 C40 180 70 250 140 260 S300 270 330 240" stroke="hsl(20 50% 45%)" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.35} />
          <path d="M330 30 C320 120 330 200 330 240" stroke="hsl(205 40% 55%)" strokeWidth={18} fill="none" strokeLinecap="round" opacity={0.35} />
          <path d="M110 70 L290 60 L300 210 L230 235 L120 215 Z" fill="hsl(40 30% 80%)" stroke="hsl(30 30% 40%)" strokeWidth={3} />
          <rect x={220} y={80} width={60} height={50} fill="hsl(45 60% 70%)" stroke="hsl(30 30% 40%)" strokeWidth={2} rx={3} />
          <text x={250} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill="hsl(30 40% 25%)">
            {t('Temple')}
          </text>
          <text x={185} y={175} textAnchor="middle" fontSize={13} fontWeight={700} fill="hsl(30 40% 25%)">
            {t('Jerusalem')}
          </text>
          <text x={70} y={120} fontSize={12} fontWeight={700} fill="hsl(20 60% 35%)" transform="rotate(-75 70 120)">
            {t('Valley of Hinnom')}
          </text>
          <text x={352} y={120} fontSize={12} fontWeight={700} fill="hsl(205 50% 35%)" transform="rotate(90 352 120)">
            {t('Kidron Valley')}
          </text>
          <text x={370} y={40} textAnchor="end" fontSize={10} fill="var(--ink-soft)">
            {t('Mount of Olives')} →
          </text>
          {items.map((x, i) => {
            const [cx, cy] = SPOT[x.id] ?? [60 + i * 30, 280]
            return (
              <g key={x.id} role="button" tabIndex={0} aria-label={x.label} onClick={() => setSel(x.id)} onKeyDown={(e) => e.key === 'Enter' && setSel(x.id)} className="cursor-pointer">
                <motion.circle cx={cx} cy={cy} r={x.id === sel ? 13 : 10} fill={x.id === sel ? 'var(--rubric)' : 'var(--surface)'} stroke="var(--rubric)" strokeWidth={2} animate={x.id === sel ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1.6 }} style={{ transformOrigin: `${cx}px ${cy}px` }} />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill={x.id === sel ? '#fff' : 'var(--rubric)'}>
                  {i + 1}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="mt-1 text-center text-xs text-ink-soft">{t('A simple sketch, not to scale.')}</p>
      </div>
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={h.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="leaf p-5" style={{ borderLeft: '5px solid var(--rubric)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-rubric">
              {idx + 1} · {h.when} · {refLabel(h.ref)}
            </p>
            <h3 className="mt-1 text-xl font-bold">{h.label}</h3>
            <p className="mt-2 leading-relaxed">
              <Gloss>{h.text}</Gloss>
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn" disabled={idx === 0} onClick={() => setSel(items[idx - 1].id)}>
            ← {t('Earlier')}
          </button>
          <button type="button" className="btn btn-primary" disabled={idx === items.length - 1} onClick={() => setSel(items[idx + 1].id)}>
            {t('Later')} →
          </button>
        </div>
      </div>
    </div>
  )
}

const REACH = {
  ad70: { c: 'hsl(0 65% 42%)', l: () => t('First about AD 70') },
  both: { c: 'hsl(40 80% 38%)', l: () => t('AD 70 and a lasting principle') },
  final: { c: 'hsl(215 70% 45%)', l: () => t('The final judgement') },
} as const

/** Warnings often read about the afterlife: each card turns from the popular reading to its setting and clues. */
export function MisreadCards({ items }: { items: W['misread'] }) {
  const [f, setF] = useState<'all' | keyof typeof REACH>('all')
  const [setting, setSetting] = useState<Set<string>>(new Set())
  const counts = (Object.keys(REACH) as (keyof typeof REACH)[]).map((k) => [k, items.filter((x) => x.status === k).length] as const)
  const flip = (id: string) => setSetting((s) => (s.has(id) ? (s.delete(id), new Set(s)) : new Set(s).add(id)))
  return (
    <div>
      <div className="flex h-5 overflow-hidden rounded-full">
        {counts.map(([k, n]) => (
          <motion.span key={k} style={{ background: REACH[k].c }} initial={{ width: 0 }} whileInView={{ width: `${(n / items.length) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" className="chip cursor-pointer" aria-pressed={f === 'all'} onClick={() => setF('all')} style={f === 'all' ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          {t('All')} {items.length}
        </button>
        {counts.map(([k, n]) => (
          <button key={k} type="button" className="chip cursor-pointer" aria-pressed={f === k} onClick={() => setF(k)} style={f === k ? { background: REACH[k].c, color: '#fff', borderColor: REACH[k].c } : undefined}>
            <span className="inline-block size-2.5 rounded-full" style={{ background: REACH[k].c }} /> {REACH[k].l()} {n}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {items
          .filter((x) => f === 'all' || x.status === f)
          .map((x) => {
            const on = setting.has(x.id)
            return (
              <motion.li key={x.id} layout className="leaf overflow-hidden" style={{ borderTop: `5px solid ${REACH[x.status].c}` }}>
                <div className="p-4">
                  <p className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                    <span style={{ color: REACH[x.status].c }}>{refLabel(x.ref)}</span>
                    <span className="rounded-full px-2 py-0.5 text-white" style={{ background: REACH[x.status].c }}>
                      {REACH[x.status].l()}
                    </span>
                  </p>
                  <p className="mt-1 font-serif text-lg font-bold leading-snug">“{x.phrase}”</p>
                  <div className="mt-3 flex rounded-full bg-surface-2 p-1 text-xs font-bold" role="tablist">
                    <button type="button" role="tab" aria-selected={!on} onClick={() => on && flip(x.id)} className={`flex-1 rounded-full py-1 ${!on ? 'bg-[var(--surface)] shadow' : 'text-ink-soft'}`}>
                      {t('Usual reading')}
                    </button>
                    <button type="button" role="tab" aria-selected={on} onClick={() => !on && flip(x.id)} className={`flex-1 rounded-full py-1 ${on ? 'bg-[var(--surface)] shadow' : 'text-ink-soft'}`}>
                      {t('In its setting')}
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={on ? 's' : 'p'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-[0.95rem]">
                      {on ? (
                        <>
                          <p>
                            <Gloss>{x.setting}</Gloss>
                          </p>
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {x.clues.map((c) => (
                              <li key={c} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">
                                🔎 {c}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-sm italic text-ink-soft">{x.note}</p>
                        </>
                      ) : (
                        <p className="text-ink-soft">{x.popular}</p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.li>
            )
          })}
      </ul>
    </div>
  )
}

/** The prophets' "days of the LORD" on the nations, placed on one line of years ending in AD 70. */
export function DaysLine({ items }: { items: W['days'] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [i, setI] = useState(sorted.length - 1)
  const d = sorted[i]
  const x = (y: number) => ((y + 760) / 840) * 100
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="relative mx-3 mb-10 mt-6 h-2 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(30 60% 75%), hsl(0 65% 55%))' }}>
        {sorted.map((s, k) => (
          <button key={s.id} type="button" onClick={() => setI(k)} aria-label={`${s.target}`} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x(s.year)}%` }}>
            <motion.span className="block rounded-full border-2 border-[var(--surface)]" animate={{ width: k === i ? 20 : 12, height: k === i ? 20 : 12, background: k === i ? 'var(--rubric)' : 'hsl(30 50% 40%)' }} />
          </button>
        ))}
        <span className="absolute left-0 top-5 text-xs text-ink-soft">{t('{n} BC', { n: 750 })}</span>
        <span className="absolute right-0 top-5 text-xs text-ink-soft">{t('AD {y}', { y: 70 })}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <p className="text-xs font-bold uppercase tracking-widest text-rubric">
            {refLabel(d.ref)} · {d.year < 0 ? t('{n} BC', { n: -d.year }) : t('AD {y}', { y: d.year })}
          </p>
          <h3 className="mt-1 text-xl font-bold">
            {t('The day of the LORD on')} {d.target}
          </h3>
          <p className="mt-1 text-ink-soft">
            <Gloss>{d.imagery}</Gloss>
          </p>
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

/** The video series, one card per teaching, with its points numbered. */
export function TeachingCards({ items }: { items: W['teaching'] }) {
  const [open, setOpen] = useState<string>(items[0].id)
  return (
    <ol className="space-y-2">
      {items.map((x, i) => {
        const on = open === x.id
        return (
          <li key={x.id} className="leaf overflow-hidden">
            <button type="button" onClick={() => setOpen(on ? '' : x.id)} aria-expanded={on} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-[var(--accent-ink)]">
                <Icon name="play" size={16} />
              </span>
              <span className="min-w-0 flex-1 font-bold leading-snug">{x.title}</span>
              <motion.span animate={{ rotate: on ? 90 : 0 }}>
                <Icon name="arrow" size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <ol className="space-y-2 px-4 pb-3">
                    {x.points.map((p, k) => (
                      <motion.li key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.05 }} className="flex gap-3">
                        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-accent">{k + 1}</span>
                        <span className="text-[0.95rem]">
                          <Gloss>{p}</Gloss>
                        </span>
                      </motion.li>
                    ))}
                  </ol>
                  {x.refs.length > 0 && <p className="px-4 pb-4 text-xs text-ink-soft">{x.refs.map(refLabel).join(' · ')}</p>}
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">{i + 1}</span>
          </li>
        )
      })}
    </ol>
  )
}
