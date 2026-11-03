import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { JudgmentsStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type J = JudgmentsStudy
type Set = J['series'][number]['set']

export const SET: Record<Set, { c: string; l: () => string; glyph: string }> = {
  seal: { c: 'hsl(30 60% 38%)', l: () => t('Seals'), glyph: '◉' },
  trumpet: { c: 'hsl(205 65% 38%)', l: () => t('Trumpets'), glyph: '♪' },
  bowl: { c: 'hsl(0 65% 42%)', l: () => t('Bowls'), glyph: '◡' },
}

/** The time words that open and close the book, drawn as brackets around the visions. */
export function Bookends({ items }: { items: J['bookends'] }) {
  const open = items.filter((x) => /Revelation 1:/.test(x.ref))
  const close = items.filter((x) => /Revelation 22:/.test(x.ref))
  const Side = ({ list, label }: { list: J['bookends']; label: string }) => (
    <div className="leaf p-4" style={{ borderTop: '5px solid var(--gold)' }}>
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">{label}</p>
      <ul className="mt-2 space-y-2">
        {list.map((x, i) => (
          <motion.li key={x.ref} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <span className="font-serif text-lg font-bold">“{x.words}”</span>
            <span className="ml-2 text-xs text-ink-soft">{refLabel(x.ref)}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
  return (
    <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <Side list={open} label={t('The book opens')} />
      <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--rule)] px-4 py-3 text-center text-sm font-semibold text-ink-soft md:w-40">
        {t('Chapters 4-21: the visions, seals, trumpets and bowls')}
      </div>
      <Side list={close} label={t('The book closes')} />
    </div>
  )
}

/** All twenty-one judgements on a 3 × 7 board; tap any cell, or show how trumpets and bowls line up. */
export function JudgmentBoard({ items }: { items: J['series'] }) {
  const [sel, setSel] = useState(items[0].id)
  const [par, setPar] = useState(false)
  const j = items.find((x) => x.id === sel) ?? items[0]
  const rows: Set[] = ['seal', 'trumpet', 'bowl']
  const targets = [t('Land'), t('Sea'), t('Rivers'), t('Sun'), t('Darkness'), t('Euphrates'), t('“It is done”')]
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="chip cursor-pointer" aria-pressed={par} onClick={() => setPar(!par)} style={par ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          <Icon name="layers" size={14} /> {par ? t('Hide parallels') : t('Show trumpet and bowl parallels')}
        </button>
      </div>
      <div className="scroll-x mt-3">
        <div className="min-w-[38rem]">
          {par && (
            <div className="grid grid-cols-[5.5rem_repeat(7,minmax(0,1fr))] gap-1.5 pb-1">
              <span />
              {targets.map((x) => (
                <span key={x} className="text-center text-[0.7rem] font-bold text-accent">
                  {x}
                </span>
              ))}
            </div>
          )}
          {rows.map((r) => (
            <div key={r} className="grid grid-cols-[5.5rem_repeat(7,minmax(0,1fr))] gap-1.5 py-0.5">
              <span className="flex items-center gap-1 text-sm font-bold" style={{ color: SET[r].c }}>
                <span aria-hidden>{SET[r].glyph}</span> {SET[r].l()}
              </span>
              {items
                .filter((x) => x.set === r)
                .sort((a, b) => a.n - b.n)
                .map((x) => {
                  const on = x.id === sel
                  const lit = par && r !== 'seal' && x.n === j.n && j.set !== 'seal'
                  return (
                    <motion.button
                      key={x.id}
                      type="button"
                      onClick={() => setSel(x.id)}
                      aria-pressed={on}
                      aria-label={`${SET[r].l()} ${x.n}: ${x.image}`}
                      className="flex h-12 flex-col items-center justify-center rounded-xl text-white sm:h-14"
                      style={{ background: SET[r].c, opacity: par && r === 'seal' ? 0.35 : 1, outline: on ? '3px solid var(--gold-bright)' : lit ? '3px dashed var(--gold-bright)' : 'none', outlineOffset: 2 }}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: par && r === 'seal' ? 0.35 : 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ delay: x.n * 0.04 }}
                    >
                      <span className="font-serif text-xl font-bold">{x.n}</span>
                    </motion.button>
                  )
                })}
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={j.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-4 sm:p-6" style={{ borderTop: `5px solid ${SET[j.set].c}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SET[j.set].c }}>
            {SET[j.set].l()} {j.n} · {refLabel(j.ref)} · {j.when}
          </p>
          <h3 className="mt-1 text-xl font-bold leading-snug">{j.image}</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <p className="rounded-xl p-3" style={{ background: 'color-mix(in srgb, hsl(160 60% 32%) 10%, var(--surface))', borderLeft: '4px solid hsl(160 60% 32%)' }}>
              <span className="block text-xs font-bold uppercase tracking-wider text-[hsl(160_60%_30%)]">{t('Fulfilled reading')}</span>
              <Gloss>{j.fulfilled}</Gloss>
            </p>
            <p className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: '4px solid hsl(265 45% 45%)' }}>
              <span className="block text-xs font-bold uppercase tracking-wider text-[hsl(265_45%_45%)]">{t('Futurist reading')}</span>
              {j.futurist}
            </p>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            {t('Background')}: {refLabel(j.background)}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** A fourth, a third, all: three pies that fill to show the judgements rising. */
export function Escalation() {
  const steps = [
    { f: 0.25, l: t('Fourth seal: a fourth of the land'), r: 'Revelation 6:8', c: SET.seal.c },
    { f: 1 / 3, l: t('Trumpets: a third'), r: 'Revelation 8:7-12', c: SET.trumpet.c },
    { f: 1, l: t('Bowls: everything'), r: 'Revelation 16:3', c: SET.bowl.c },
  ]
  const arc = (f: number) => {
    if (f >= 1) return 'M50 5 A45 45 0 1 1 49.99 5 Z'
    const a = f * 2 * Math.PI - Math.PI / 2
    return `M50 50 L50 5 A45 45 0 ${f > 0.5 ? 1 : 0} 1 ${50 + 45 * Math.cos(a)} ${50 + 45 * Math.sin(a)} Z`
  }
  return (
    <ol className="grid grid-cols-3 gap-3">
      {steps.map((s, i) => (
        <motion.li key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.25 }} className="leaf flex flex-col items-center p-3 text-center">
          <svg viewBox="0 0 100 100" className="w-20 sm:w-28" aria-hidden>
            <circle cx={50} cy={50} r={45} fill="var(--surface-2)" stroke="var(--rule)" />
            <motion.path d={arc(s.f)} fill={s.c} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.25 }} />
          </svg>
          <p className="mt-2 text-sm font-bold leading-snug">{s.l}</p>
          <p className="text-xs text-ink-soft">{refLabel(s.r)}</p>
        </motion.li>
      ))}
    </ol>
  )
}

/** Three ways the series fit together, each drawn as a small diagram. */
export function Structures({ items }: { items: J['structures'] }) {
  const [s, setS] = useState<J['structures'][number]['id']>('telescopic')
  const m = items.find((x) => x.id === s) ?? items[0]
  const row = (y: number, c: string, x0 = 10, w = 20, gap = 4) => Array.from({ length: 7 }, (_, i) => <rect key={`${y}-${i}`} x={x0 + i * (w + gap)} y={y} width={w} height={14} rx={3} fill={c} />)
  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="tablist">
        {items.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={s === x.id} onClick={() => setS(x.id)} className="chip cursor-pointer" style={s === x.id ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="leaf p-3">
          <AnimatePresence mode="wait">
            <motion.svg key={s} viewBox="0 0 520 150" className="h-auto w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="img" aria-label={m.name}>
              {s === 'sequential' && (
                <>
                  {Array.from({ length: 21 }, (_, i) => (
                    <motion.rect key={i} x={6 + i * 24.4} y={60} width={20} height={20} rx={3} fill={i < 7 ? SET.seal.c : i < 14 ? SET.trumpet.c : SET.bowl.c} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }} style={{ transformOrigin: `${16 + i * 24.4}px 70px` }} />
                  ))}
                  <text x={260} y={110} textAnchor="middle" fontSize={13} fill="var(--ink-soft)">
                    {t('One after another, over seven years')}
                  </text>
                </>
              )}
              {s === 'recapitulation' && (
                <>
                  {row(20, SET.seal.c, 60)}
                  {row(65, SET.trumpet.c, 60)}
                  {row(110, SET.bowl.c, 60)}
                  <line x1={240} y1={10} x2={240} y2={140} stroke="var(--gold)" strokeWidth={3} strokeDasharray="5 4" />
                  <text x={250} y={80} fontSize={13} fill="var(--ink)">
                    {t('Each series reaches the end')}
                  </text>
                </>
              )}
              {s === 'telescopic' && (
                <>
                  {row(20, SET.seal.c, 10)}
                  <motion.path d="M164 34 C168 55 152 55 152 65" stroke="var(--gold)" strokeWidth={2.5} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
                  {row(65, SET.trumpet.c, 150)}
                  <motion.path d="M304 79 C308 100 292 100 292 110" stroke="var(--gold)" strokeWidth={2.5} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
                  {row(110, SET.bowl.c, 290)}
                  <text x={10} y={70} fontSize={12} fill="var(--ink-soft)">
                    {t('7th seal → trumpets')}
                  </text>
                  <text x={10} y={120} fontSize={12} fill="var(--ink-soft)">
                    {t('7th trumpet → bowls')}
                  </text>
                </>
              )}
            </motion.svg>
          </AnimatePresence>
        </div>
        <div className="leaf p-4">
          <h3 className="text-lg font-bold">{m.name}</h3>
          <p className="mt-1">{m.summary}</p>
          <p className="mt-2 text-sm text-ink-soft">{m.holders}</p>
          <p className="mt-3 text-[0.92rem]">
            <span className="font-bold text-[hsl(160_60%_30%)]">{t('Strongest point')}: </span>
            {m.strength}
          </p>
          <p className="mt-1 text-[0.92rem]">
            <span className="font-bold text-rubric">{t('Main difficulty')}: </span>
            {m.weakness}
          </p>
        </div>
      </div>
    </div>
  )
}

/** The plagues of Egypt, lined up with the trumpet and bowl that echo them. */
export function ExodusTable({ rows }: { rows: J['exodus'] }) {
  const Cell = ({ n, set }: { n: number | null; set: Set }) =>
    n ? (
      <span className="inline-flex size-8 items-center justify-center rounded-lg font-serif font-bold text-white" style={{ background: SET[set].c }}>
        {n}
      </span>
    ) : (
      <span className="text-ink-soft">—</span>
    )
  return (
    <div className="leaf overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1.4fr)_3.5rem_3.5rem] gap-2 bg-surface-2 p-3 text-xs font-bold sm:grid-cols-[minmax(0,1fr)_5rem_5rem_minmax(0,1.5fr)]">
        <span>{t('Plague of Egypt')}</span>
        <span style={{ color: SET.trumpet.c }}>{t('Trumpet')}</span>
        <span style={{ color: SET.bowl.c }}>{t('Bowl')}</span>
        <span className="hidden sm:block">{t('Echo')}</span>
      </div>
      {rows.map((r, i) => (
        <motion.div key={r.plague} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="grid grid-cols-[minmax(0,1.4fr)_3.5rem_3.5rem] items-center gap-2 border-t border-[var(--rule)] p-3 sm:grid-cols-[minmax(0,1fr)_5rem_5rem_minmax(0,1.5fr)]">
          <span>
            <span className="block font-bold">{r.plague}</span>
            <span className="text-xs text-ink-soft">{refLabel(r.exodusRef)}</span>
          </span>
          <Cell n={r.trumpet} set="trumpet" />
          <Cell n={r.bowl} set="bowl" />
          <span className="col-span-3 text-[0.9rem] text-ink-soft sm:col-span-1">{r.note}</span>
        </motion.div>
      ))}
    </div>
  )
}

/** Symbols and figures: tap to compare the fulfilled and futurist readings. */
export function SymbolDeck({ items }: { items: J['symbols'] }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((x, i) => {
        const on = open === x.id
        return (
          <motion.li key={x.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.05 }} className="leaf overflow-hidden">
            <button type="button" onClick={() => setOpen(on ? null : x.id)} aria-expanded={on} className="flex w-full items-start justify-between gap-2 p-3 text-left">
              <span>
                <span className="block font-bold leading-snug">{x.name}</span>
                <span className="text-xs text-ink-soft">{refLabel(x.ref)}</span>
              </span>
              <motion.span animate={{ rotate: on ? 90 : 0 }} className="mt-1 shrink-0">
                <Icon name="arrow" size={15} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="space-y-2 px-3 pb-3 text-[0.92rem]">
                    <p>
                      <span className="font-bold text-[hsl(160_60%_30%)]">{t('Fulfilled reading')}: </span>
                      <Gloss>{x.fulfilled}</Gloss>
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
    </ul>
  )
}

/** The pauses between the judgements, as a strip of numbered stops. */
export function Interludes({ items }: { items: J['interludes'] }) {
  const [i, setI] = useState(0)
  const x = items[i]
  return (
    <div className="leaf p-4 sm:p-6">
      <ol className="flex flex-wrap gap-2">
        {items.map((y, k) => (
          <li key={y.id}>
            <button type="button" onClick={() => setI(k)} aria-pressed={k === i} className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${k === i ? 'bg-accent text-[var(--accent-ink)] ring-transparent' : 'ring-rule hover:bg-surface-2'}`}>
              {refLabel(y.ref)}
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={x.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-4">
          <h3 className="text-xl font-bold">{x.title}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{x.reading}</Gloss>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
