import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { ClaimsStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type C = ClaimsStudy

/**
 * The darkness at the cross: drag the clock from the third hour to the ninth and watch the sun fail
 * between the sixth and ninth. Beside it, the three Gospels, the prophets, the ancient historians and a hymn.
 */
export function DarknessSpotlight({ d }: { d: C['darkness'] }) {
  const [hour, setHour] = useState(6)
  const dark = hour >= 6 && hour < 9 ? 1 : 0
  const clock = hour + 6
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="leaf overflow-hidden p-0">
        <motion.div className="relative flex aspect-[4/3] items-center justify-center" animate={{ background: dark ? `hsl(230 30% ${12 + (1 - dark) * 50}%)` : 'hsl(200 70% 80%)' }} transition={{ duration: 0.8 }}>
          <svg viewBox="0 0 200 150" className="h-full w-full" aria-hidden>
            <motion.circle cx={100} cy={55} r={26} animate={{ fill: dark === 1 ? 'hsl(40 20% 25%)' : 'hsl(45 95% 60%)', opacity: dark === 1 ? 0.5 : 1 }} transition={{ duration: 0.8 }} />
            <path d="M0 150 L0 118 Q60 100 100 112 T200 108 L200 150 Z" fill={dark === 1 ? 'hsl(30 10% 15%)' : 'hsl(35 30% 55%)'} />
            <g stroke={dark === 1 ? 'hsl(30 10% 45%)' : 'hsl(30 30% 25%)'} strokeWidth={3}>
              <line x1={100} y1={78} x2={100} y2={118} />
              <line x1={90} y1={88} x2={110} y2={88} />
              <line x1={70} y1={86} x2={70} y2={118} />
              <line x1={63} y1={94} x2={77} y2={94} />
              <line x1={130} y1={86} x2={130} y2={118} />
              <line x1={123} y1={94} x2={137} y2={94} />
            </g>
          </svg>
          <span className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-sm font-bold text-white">
            {t('Hour {n}', { n: hour })} · {clock > 12 ? clock - 12 : clock}:00 {clock >= 12 ? 'pm' : 'am'}
          </span>
        </motion.div>
        <div className="p-4">
          <label className="text-sm font-bold" htmlFor="hour">
            {t('Move through the day of the crucifixion')}
          </label>
          <input id="hour" type="range" min={3} max={10} step={1} value={hour} onChange={(e) => setHour(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
          <div className="flex justify-between text-xs text-ink-soft">
            <span>{t('3rd hour: crucified (Mark 15:25)')}</span>
            <span>{t('9th hour: he died')}</span>
          </div>
          <p className="mt-3 rounded-xl bg-surface-2 p-3 text-[0.95rem]">
            <Gloss>{d.point}</Gloss>
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="leaf p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icon name="book" size={16} /> {t('All three Synoptic Gospels record it')}
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-3">
            {d.gospels.map((g, i) => (
              <motion.li key={g.ref} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="rounded-xl bg-surface-2 p-3">
                <p className="flex items-center gap-1 text-xs font-bold text-[hsl(160_60%_30%)]">
                  <Icon name="check" size={13} /> {refLabel(g.ref)}
                </p>
                <p className="mt-1 text-[0.88rem]">{g.note}</p>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="leaf p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icon name="scroll" size={16} /> {t('The prophets behind it')}
          </p>
          <ul className="mt-2 space-y-2">
            {d.prophecies.map((p) => (
              <li key={p.ref} className="text-[0.92rem]">
                <span className="font-bold text-accent">{refLabel(p.ref)}: </span>
                <Gloss>{p.note}</Gloss>
              </li>
            ))}
          </ul>
        </div>
        <div className="leaf p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icon name="timeline" size={16} /> {t('Ancient writers outside the Bible')}
          </p>
          <ul className="mt-2 space-y-2">
            {d.history.map((h) => (
              <li key={h.who} className="text-[0.92rem]">
                <span className="font-bold">{h.who}</span> <span className="text-xs text-ink-soft">({h.when})</span>: {h.note}
              </li>
            ))}
          </ul>
        </div>
        <motion.blockquote initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="leaf p-4 text-center" style={{ borderTop: '5px solid var(--gold)' }}>
          {d.hymn.lines.map((l) => (
            <p key={l} className="font-serif text-lg italic">
              {l}
            </p>
          ))}
          <p className="mt-2 text-xs text-ink-soft">{d.hymn.credit}</p>
        </motion.blockquote>
      </div>
    </div>
  )
}

/** The prophets' sun, moon and stars: each card turns from the sign to what happened in history. */
export function CosmicDecoder({ items }: { items: C['cosmic'] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [open, setOpen] = useState<Set<string>>(new Set())
  const flip = (id: string) => setOpen((s) => (s.has(id) ? (s.delete(id), new Set(s)) : new Set(s).add(id)))
  return (
    <div>
      <button type="button" className="btn" onClick={() => setOpen(open.size === items.length ? new Set() : new Set(items.map((x) => x.id)))}>
        <Icon name="eye" size={15} /> {open.size === items.length ? t('Show the signs') : t('Decode them all')}
      </button>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((x, i) => {
          const on = open.has(x.id)
          return (
            <motion.li key={x.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.06 }}>
              <button type="button" onClick={() => flip(x.id)} aria-pressed={on} className="block h-full w-full text-left">
                <motion.div animate={{ background: on ? 'var(--surface)' : 'hsl(230 35% 18%)', color: on ? 'var(--ink)' : '#f5f0e0' }} className="h-full rounded-2xl p-4 ring-1 ring-[var(--rule)]">
                  <p className="flex items-center justify-between text-xs font-bold">
                    <span>{refLabel(x.ref)}</span>
                    <span>{x.year < 0 ? t('{n} BC', { n: -x.year }) : t('AD {y}', { y: x.year })}</span>
                  </p>
                  <AnimatePresence mode="wait">
                    {on ? (
                      <motion.div key="f" initial={{ opacity: 0, rotateY: -60 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0 }}>
                        <p className="mt-2 font-bold">{x.target}</p>
                        <p className="mt-1 text-[0.9rem]">
                          <Gloss>{x.fulfilled}</Gloss>
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="mt-2 text-2xl" aria-hidden>
                          ☀︎ ☾ ✦
                        </p>
                        <p className="mt-1 font-serif text-lg font-bold leading-snug">“{x.sign}”</p>
                        <p className="mt-2 text-xs opacity-70">{t('Tap to decode')} ↻</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

const CAT: Record<C['claims'][number]['category'], { c: string; l: () => string }> = {
  hermeneutics: { c: 'hsl(265 45% 45%)', l: () => t('Method') },
  timing: { c: 'hsl(35 85% 40%)', l: () => t('Time words') },
  signs: { c: 'hsl(230 40% 35%)', l: () => t('Signs') },
  rapture: { c: 'hsl(190 60% 35%)', l: () => t('Rapture') },
  israel: { c: 'hsl(215 70% 42%)', l: () => t('Israel') },
  millennium: { c: 'hsl(15 75% 45%)', l: () => t('Millennium') },
  hope: { c: 'hsl(160 60% 32%)', l: () => t('Postmillennial hope') },
  history: { c: 'hsl(30 40% 35%)', l: () => t('History') },
}

/**
 * Every objection, sorted on a clickable wheel of categories, with a switch for objections to preterism
 * or to postmillennialism, and a search box. Each card reveals the answer, the key point and the rejoinder.
 */
export function ClaimsArena({ items }: { items: C['claims'] }) {
  const [cat, setCat] = useState<'all' | C['claims'][number]['category']>('all')
  const [kind, setKind] = useState<'all' | 'preterism' | 'postmil'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Set<string>>(new Set())
  const cats = Object.keys(CAT) as C['claims'][number]['category'][]
  const counts = cats.map((k) => [k, items.filter((x) => x.category === k).length] as const).filter(([, n]) => n > 0)
  const total = counts.reduce((a, [, n]) => a + n, 0)
  let acc = 0
  const arcs = counts.map(([k, n]) => {
    const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2
    acc += n
    const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2
    const r = 80
    const ri = 46
    const p = (a: number, rad: number) => `${100 + rad * Math.cos(a)} ${100 + rad * Math.sin(a)}`
    const big = a1 - a0 > Math.PI ? 1 : 0
    return { k, n, d: `M${p(a0, r)} A${r} ${r} 0 ${big} 1 ${p(a1, r)} L${p(a1, ri)} A${ri} ${ri} 0 ${big} 0 ${p(a0, ri)} Z` }
  })
  const s = q.trim().toLowerCase()
  const list = items.filter((x) => (cat === 'all' || x.category === cat) && (kind === 'all' || x.kind === kind) && (!s || (x.claim + ' ' + x.answer + ' ' + x.verse).toLowerCase().includes(s)))
  return (
    <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div>
        <svg viewBox="0 0 200 200" className="mx-auto w-52" role="img" aria-label={t('Objections by category')}>
          {arcs.map((a) => (
            <motion.path key={a.k} d={a.d} fill={CAT[a.k].c} stroke="var(--surface)" strokeWidth={2} className="cursor-pointer" onClick={() => setCat(cat === a.k ? 'all' : a.k)} animate={{ opacity: cat === 'all' || cat === a.k ? 1 : 0.3, scale: cat === a.k ? 1.05 : 1 }} style={{ transformOrigin: '100px 100px' }}>
              <title>{`${CAT[a.k].l()}: ${a.n}`}</title>
            </motion.path>
          ))}
          <text x={100} y={98} textAnchor="middle" fontSize={26} fontWeight={800} fill="var(--ink)">
            {list.length}
          </text>
          <text x={100} y={116} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
            {t('objections')}
          </text>
        </svg>
        <ul className="mt-3 flex flex-wrap gap-1.5 lg:flex-col">
          {counts.map(([k, n]) => (
            <li key={k}>
              <button type="button" onClick={() => setCat(cat === k ? 'all' : k)} aria-pressed={cat === k} className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm hover:bg-surface-2" style={cat === k ? { background: 'var(--surface-2)', fontWeight: 700 } : undefined}>
                <span className="inline-block size-3 shrink-0 rounded-full" style={{ background: CAT[k].c }} /> <span className="flex-1">{CAT[k].l()}</span> <span className="tabular-nums text-ink-soft">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-full bg-surface-2 p-1 text-xs font-bold" role="tablist">
            {(
              [
                ['all', t('All')],
                ['preterism', t('Against preterism')],
                ['postmil', t('Against postmillennialism')],
              ] as const
            ).map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)} className={`rounded-full px-3 py-1 ${kind === k ? 'bg-[var(--surface)] shadow' : 'text-ink-soft'}`}>
                {l}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-surface-2 px-3 py-1 ring-1 ring-rule">
            <Icon name="search" size={14} className="text-ink-soft" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Search the objections…')} aria-label={t('Search the objections…')} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
        </div>
        <ul className="mt-4 space-y-2">
          {list.map((x) => {
            const on = open.has(x.id)
            return (
              <motion.li key={x.id} layout className="leaf overflow-hidden" style={{ borderLeft: `5px solid ${CAT[x.category].c}` }}>
                <button type="button" onClick={() => setOpen((st) => (st.has(x.id) ? (st.delete(x.id), new Set(st)) : new Set(st).add(x.id)))} aria-expanded={on} className="block w-full p-4 text-left">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="rounded-full px-2 py-0.5 text-white" style={{ background: CAT[x.category].c }}>
                      {CAT[x.category].l()}
                    </span>
                    <span className="text-ink-soft">{x.holder}</span>
                    <span className="text-ink-soft">· {refLabel(x.verse)}</span>
                  </p>
                  <p className="mt-1 font-bold leading-snug">{x.claim}</p>
                  {!on && <p className="mt-1 text-xs font-semibold text-accent">{t('Show the answer')} ↓</p>}
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="space-y-2 px-4 pb-4 text-[0.95rem]">
                        <p className="rounded-xl p-3" style={{ background: 'color-mix(in srgb, hsl(160 60% 32%) 10%, var(--surface))' }}>
                          <Gloss>{x.answer}</Gloss>
                        </p>
                        <p className="flex gap-2 font-bold">
                          <Icon name="sparkles" size={15} className="mt-1 shrink-0 text-[var(--gold)]" /> {x.key}
                        </p>
                        <p className="text-sm italic text-ink-soft">
                          {t('Their rejoinder')}: {x.rejoinder}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/** Eight time phrases, each read literally and as usually read; tap a row to compare. */
export function LiteralScorecard({ rows }: { rows: C['literal'] }) {
  const [i, setI] = useState<number | null>(0)
  return (
    <div className="leaf overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] gap-2 bg-surface-2 p-3 text-xs font-bold">
        <span>{t('The words')}</span>
        <span className="text-center text-[hsl(160_60%_30%)]">{t('Plain sense')}</span>
        <span className="text-center text-[hsl(265_45%_45%)]">{t('Stretched')}</span>
      </div>
      {rows.map((r, k) => {
        const on = i === k
        return (
          <div key={r.ref} className="border-t border-[var(--rule)]">
            <button type="button" onClick={() => setI(on ? null : k)} aria-expanded={on} className="grid w-full grid-cols-[minmax(0,1fr)_5rem_5rem] items-center gap-2 p-3 text-left">
              <span>
                <span className="block font-bold leading-snug">“{r.phrase}”</span>
                <span className="text-xs text-ink-soft">{refLabel(r.ref)}</span>
              </span>
              <span className="text-center text-[hsl(160_60%_30%)]">
                <Icon name="check" size={18} />
              </span>
              <span className="text-center text-[hsl(265_45%_45%)]">↔</span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="grid gap-2 px-3 pb-3 sm:grid-cols-2">
                    <p className="rounded-xl p-3 text-[0.92rem]" style={{ background: 'color-mix(in srgb, hsl(160 60% 32%) 10%, var(--surface))' }}>
                      <span className="block text-xs font-bold text-[hsl(160_60%_30%)]">{t('Plain sense')}</span>
                      {r.literal}
                    </p>
                    <p className="rounded-xl bg-surface-2 p-3 text-[0.92rem]">
                      <span className="block text-xs font-bold text-[hsl(265_45%_45%)]">{t('Usual futurist reading')}</span>
                      {r.usual}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
