import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { HopeStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type H = HopeStudy

export const VIEW_COLOR = { chiliast: 'hsl(15 75% 45%)', 'non-chiliast': 'hsl(195 70% 32%)', silent: 'hsl(40 10% 55%)' } as const
const viewLabel = (v: keyof typeof VIEW_COLOR) => (v === 'chiliast' ? t('Expected an earthly thousand years') : v === 'non-chiliast' ? t('Rejected an earthly thousand years') : t('Says nothing about it'))

/**
 * The early writers on a time line, in three lanes by view, with lines from teacher to pupil.
 * Below: the selected writer, and a count by century.
 */
export function FathersMap({ items }: { items: H['fathers'] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [sel, setSel] = useState(sorted.findIndex((f) => f.id === 'papias'))
  const W = 720
  const x = (y: number) => 30 + ((y - 50) / 400) * (W - 60)
  const lane = { chiliast: 50, silent: 110, 'non-chiliast': 170 } as const
  const pos = new Map(sorted.map((f) => [f.id, { x: x(f.year), y: lane[f.view] }]))
  const f = sorted[sel]
  const centuries = [1, 2, 3, 4].map((c) => ({ c, list: sorted.filter((p) => p.year > (c - 1) * 100 + 49 && p.year <= c * 100 + 49) }))
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="leaf p-3 sm:p-4">
        <svg viewBox={`0 0 ${W} 215`} className="h-auto w-full" role="img" aria-label={t('Early writers on the thousand years, AD 50 to 450')}>
          {(Object.keys(lane) as (keyof typeof lane)[]).map((k) => (
            <g key={k}>
              <line x1={20} x2={W - 20} y1={lane[k]} y2={lane[k]} stroke={VIEW_COLOR[k]} strokeOpacity={0.35} strokeWidth={10} strokeLinecap="round" />
            </g>
          ))}
          {[100, 200, 300, 400].map((y) => (
            <g key={y}>
              <line x1={x(y)} x2={x(y)} y1={25} y2={190} stroke="var(--rule)" strokeDasharray="3 4" />
              <text x={x(y)} y={208} textAnchor="middle" fontSize={12} fill="var(--ink-soft)">
                {t('AD {y}', { y })}
              </text>
            </g>
          ))}
          {sorted.map((p) =>
            p.teacher && pos.get(p.teacher) ? (
              <motion.path
                key={`l-${p.id}`}
                d={`M${pos.get(p.teacher)!.x} ${pos.get(p.teacher)!.y} C${pos.get(p.teacher)!.x + 30} ${pos.get(p.teacher)!.y} ${pos.get(p.id)!.x - 30} ${pos.get(p.id)!.y} ${pos.get(p.id)!.x} ${pos.get(p.id)!.y}`}
                fill="none"
                stroke="var(--gold)"
                strokeWidth={2}
                strokeDasharray="4 3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              />
            ) : null,
          )}
          {sorted.map((p, k) => (
            <g key={p.id} role="button" tabIndex={0} aria-label={`${p.name}, ${p.year}`} onClick={() => setSel(k)} onKeyDown={(e) => e.key === 'Enter' && setSel(k)} className="cursor-pointer">
              <motion.circle cx={pos.get(p.id)!.x} cy={pos.get(p.id)!.y} fill={VIEW_COLOR[p.view]} stroke="var(--surface)" strokeWidth={2} initial={{ r: 0 }} whileInView={{ r: k === sel ? 11 : 7 }} animate={{ r: k === sel ? 11 : 7 }} viewport={{ once: true }} />
            </g>
          ))}
        </svg>
        <ul className="mt-2 flex flex-wrap gap-3 text-xs">
          {(Object.keys(VIEW_COLOR) as (keyof typeof VIEW_COLOR)[]).map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-full" style={{ background: VIEW_COLOR[k] }} />
              {viewLabel(k)}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t-2 border-dashed border-[var(--gold)]" />
            {t('Learned from')}
          </li>
        </ul>
      </div>
      <div className="leaf p-4 sm:p-5" style={{ borderTop: `5px solid ${VIEW_COLOR[f.view]}` }}>
        <AnimatePresence mode="wait">
          <motion.div key={f.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: VIEW_COLOR[f.view] }}>
              {viewLabel(f.view)}
            </p>
            <h3 className="mt-1 text-xl font-bold">{f.name}</h3>
            <p className="text-sm text-ink-soft">
              {t('c. AD {n}', { n: f.year })} · {f.place}
            </p>
            {f.teacher && (
              <p className="mt-1 text-sm">
                <span className="font-semibold">{t('Learned from')}:</span> {items.find((p) => p.id === f.teacher)?.name}
              </p>
            )}
            <p className="mt-3 leading-relaxed">
              <Gloss>{f.says}</Gloss>
            </p>
            <p className="mt-2 text-xs italic text-ink-soft">{f.work}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn" disabled={sel === 0} onClick={() => setSel(sel - 1)}>
            ← {t('Earlier')}
          </button>
          <button type="button" className="btn btn-primary" disabled={sel === sorted.length - 1} onClick={() => setSel(sel + 1)}>
            {t('Later')} →
          </button>
        </div>
      </div>
      <div className="leaf p-4 lg:col-span-2">
        <p className="text-sm font-bold">{t('Writers by century and view')}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {centuries.map(({ c, list }) => (
            <div key={c}>
              <p className="text-xs font-semibold text-ink-soft">{t('Century {n}', { n: c })}</p>
              <div className="mt-1 flex h-4 overflow-hidden rounded-full bg-surface-2">
                {(['chiliast', 'silent', 'non-chiliast'] as const).map((v) => {
                  const n = list.filter((p) => p.view === v).length
                  return n ? <motion.span key={v} title={`${viewLabel(v)}: ${n}`} style={{ background: VIEW_COLOR[v] }} initial={{ width: 0 }} whileInView={{ width: `${(n / list.length) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} /> : null
                })}
              </div>
              <p className="mt-1 text-xs">
                {(['chiliast', 'silent', 'non-chiliast'] as const).map((v) => (
                  <span key={v} className="mr-2 tabular-nums" style={{ color: VIEW_COLOR[v] }}>
                    ● {list.filter((p) => p.view === v).length}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Early chiliasm and modern dispensationalism, row by row. */
export function Compare({ rows }: { rows: H['compare'] }) {
  return (
    <div className="leaf overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] text-sm font-bold sm:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]">
        <span className="hidden bg-surface-2 p-3 sm:block" />
        <span className="p-3 text-white" style={{ background: VIEW_COLOR.chiliast }}>
          {t('Early chiliasts (AD 100-400)')}
        </span>
        <span className="bg-[hsl(265_45%_40%)] p-3 text-white">{t('Modern dispensationalism (1830-)')}</span>
      </div>
      {rows.map((r, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-t border-[var(--rule)] text-[0.92rem] sm:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]">
          <span className="col-span-2 bg-surface-2 px-3 py-2 font-bold sm:col-span-1 sm:py-3">{r.topic}</span>
          <span className="min-w-0 p-3 [overflow-wrap:anywhere]">
            <Gloss>{r.early}</Gloss>
          </span>
          <span className="min-w-0 border-l border-[var(--rule)] p-3 [overflow-wrap:anywhere]">
            <Gloss>{r.modern}</Gloss>
          </span>
        </motion.div>
      ))}
    </div>
  )
}

const TIME_COLOR = { now: 'hsl(160 60% 32%)', later: 'hsl(215 70% 45%)', both: 'hsl(40 80% 40%)' } as const
const timeLabel = (k: keyof typeof TIME_COLOR) => (k === 'now' ? t('Kingdom now') : k === 'later' ? t('Kingdom to come') : t('Now and to come'))

/** The kingdom in the words of Jesus and the apostles: a filterable wall of sayings with a tally bar. */
export function ApostlesWall({ items }: { items: H['apostles'] }) {
  const [f, setF] = useState<'all' | keyof typeof TIME_COLOR>('all')
  const counts = (Object.keys(TIME_COLOR) as (keyof typeof TIME_COLOR)[]).map((k) => [k, items.filter((x) => x.time === k).length] as const)
  return (
    <div>
      <div className="flex h-5 overflow-hidden rounded-full">
        {counts.map(([k, n]) => (
          <motion.span key={k} style={{ background: TIME_COLOR[k] }} initial={{ width: 0 }} whileInView={{ width: `${(n / items.length) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" className="chip cursor-pointer" aria-pressed={f === 'all'} onClick={() => setF('all')} style={f === 'all' ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          {t('All')} {items.length}
        </button>
        {counts.map(([k, n]) => (
          <button key={k} type="button" className="chip cursor-pointer" aria-pressed={f === k} onClick={() => setF(k)} style={f === k ? { background: TIME_COLOR[k], color: '#fff', borderColor: TIME_COLOR[k] } : undefined}>
            <span className="inline-block size-2.5 rounded-full" style={{ background: TIME_COLOR[k] }} /> {timeLabel(k)} {n}
          </button>
        ))}
      </div>
      <motion.ul layout className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {items
            .filter((x) => f === 'all' || x.time === f)
            .map((x) => (
              <motion.li key={x.ref} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="leaf p-3" style={{ borderLeft: `5px solid ${TIME_COLOR[x.time]}` }}>
                <p className="flex items-baseline justify-between gap-2 text-xs font-bold">
                  <span style={{ color: TIME_COLOR[x.time] }}>{refLabel(x.ref)}</span>
                  <span className="text-ink-soft">{x.who}</span>
                </p>
                <p className="mt-1 text-[0.95rem] leading-snug">{x.said}</p>
              </motion.li>
            ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}

/** Each promise to Israel joined by a drawn line to the place where it was kept. */
export function PromiseMap({ items }: { items: H['promises'] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null)
  const [other, setOther] = useState(false)
  return (
    <ol className="space-y-2">
      {items.map((p, i) => {
        const on = open === p.id
        return (
          <motion.li key={p.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.04 }} className="leaf overflow-hidden">
            <button type="button" onClick={() => setOpen(on ? null : p.id)} aria-expanded={on} className="grid w-full grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] items-center gap-1 p-3 text-left sm:gap-2">
              <span className="rounded-xl bg-[hsl(35_70%_92%)] p-2 text-[hsl(30_60%_25%)] dark:bg-[hsl(35_30%_20%)] dark:text-[hsl(40_70%_80%)]">
                <span className="block text-[0.7rem] font-bold uppercase tracking-wider opacity-80">{refLabel(p.ref)}</span>
                <span className="block text-sm font-bold leading-snug">{p.theme}</span>
              </span>
              <svg viewBox="0 0 48 20" className="w-full" aria-hidden>
                <motion.path d="M2 10 H40" stroke="var(--gold)" strokeWidth={2.5} fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 + (i % 6) * 0.05 }} />
                <path d="M38 4 L46 10 L38 16" stroke="var(--gold)" strokeWidth={2.5} fill="none" strokeLinejoin="round" />
              </svg>
              <span className="rounded-xl bg-[hsl(160_45%_90%)] p-2 text-[hsl(160_60%_20%)] dark:bg-[hsl(160_30%_18%)] dark:text-[hsl(160_50%_80%)]">
                <span className="block text-[0.7rem] font-bold uppercase tracking-wider opacity-80">{t('Kept')}</span>
                <span className="block text-sm font-bold leading-snug">{refLabel(p.keptRef)}</span>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="grid gap-3 px-3 pb-3 sm:grid-cols-2">
                    <p className="text-[0.95rem]">
                      <span className="font-bold">{t('Promised')}: </span>
                      <Gloss>{p.promise}</Gloss>
                    </p>
                    <p className="text-[0.95rem]">
                      <span className="font-bold">{t('Kept')}: </span>
                      <Gloss>{p.kept}</Gloss>
                    </p>
                    <div className="sm:col-span-2">
                      <button type="button" className="chip cursor-pointer" aria-expanded={other} onClick={() => setOther(!other)}>
                        <Icon name="scales" size={14} /> {other ? t('Hide the other reading') : t('How dispensationalists read it')}
                      </button>
                      {other && (
                        <p className="mt-2 rounded-xl bg-surface-2 p-3 text-[0.92rem]" style={{ borderLeft: '4px solid var(--ink-soft)' }}>
                          <Gloss>{p.other}</Gloss>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </ol>
  )
}

const KIND_COLOR = { theology: 'hsl(265 45% 45%)', politics: 'hsl(0 65% 42%)', popular: 'hsl(35 85% 40%)' } as const
const kindLabel = (k: keyof typeof KIND_COLOR) => (k === 'theology' ? t('Theology') : k === 'politics' ? t('Politics') : t('Popular books and media'))

/** From Puritan hopes to modern lobbies: a vertical time line, filterable by kind. */
export function TwistTimeline({ items }: { items: H['twist'] }) {
  const [k, setK] = useState<'all' | keyof typeof KIND_COLOR>('all')
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className="chip cursor-pointer" aria-pressed={k === 'all'} onClick={() => setK('all')} style={k === 'all' ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          {t('All')}
        </button>
        {(Object.keys(KIND_COLOR) as (keyof typeof KIND_COLOR)[]).map((x) => (
          <button key={x} type="button" className="chip cursor-pointer" aria-pressed={k === x} onClick={() => setK(x)} style={k === x ? { background: KIND_COLOR[x], color: '#fff', borderColor: KIND_COLOR[x] } : undefined}>
            <span className="inline-block size-2.5 rounded-full" style={{ background: KIND_COLOR[x] }} /> {kindLabel(x)}
          </button>
        ))}
      </div>
      <ol className="relative mt-5 ml-3 border-l-2 border-[var(--rule)] pl-6">
        {items
          .filter((x) => k === 'all' || x.kind === k)
          .map((x, i) => (
            <motion.li key={x.year + x.who} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: (i % 5) * 0.05 }} className="relative mb-5">
              <span className="absolute -left-[2.05rem] top-1 size-4 rounded-full border-2 border-[var(--surface)]" style={{ background: KIND_COLOR[x.kind] }} />
              <p className="font-serif text-xl font-bold" style={{ color: KIND_COLOR[x.kind] }}>
                {x.year}
              </p>
              <p className="font-bold">{x.who}</p>
              <p className="text-[0.95rem] text-ink-soft">
                <Gloss>{x.event}</Gloss>
              </p>
            </motion.li>
          ))}
      </ol>
    </div>
  )
}

/** Five questions to test the claim that 1948 is prophecy: answer each and see where it leads. */
export function Test1948({ items }: { items: H['test1948'] }) {
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState<Record<number, 'yes' | 'no'>>({})
  const q = items[step]
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="flex gap-1.5" aria-hidden>
        {items.map((_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < step || ans[i] ? 'var(--accent)' : 'var(--rule)' }} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            {t('Question {n} of {m}', { n: step + 1, m: items.length })} · {refLabel(q.ref)}
          </p>
          <h3 className="mt-1 text-xl font-bold">{q.q}</h3>
          <div className="mt-3 flex gap-2">
            {(['yes', 'no'] as const).map((a) => (
              <button key={a} type="button" className={`btn ${ans[step] === a ? 'btn-primary' : ''}`} onClick={() => setAns({ ...ans, [step]: a })}>
                {a === 'yes' ? t('Yes') : t('No')}
              </button>
            ))}
          </div>
          {ans[step] && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl bg-surface-2 p-3">
              <Gloss>{q[ans[step]]}</Gloss>
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex gap-2">
        <button type="button" className="btn" disabled={step === 0} onClick={() => setStep(step - 1)}>
          ← {t('Back')}
        </button>
        <button type="button" className="btn btn-primary" disabled={step === items.length - 1} onClick={() => setStep(step + 1)}>
          {t('Next')} →
        </button>
      </div>
    </div>
  )
}

/** "Every sign is being fulfilled": each claim on a card that turns over to the answer. */
export function ClaimCards({ items }: { items: H['claims'] }) {
  const [flip, setFlip] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setFlip((s) => (s.has(id) ? (s.delete(id), new Set(s)) : new Set(s.add(id))))
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c, i) => {
        const on = flip.has(c.id)
        return (
          <motion.li key={c.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }} className="[perspective:1200px]">
            <button type="button" onClick={() => toggle(c.id)} aria-pressed={on} className="block w-full text-left">
              <motion.div animate={{ rotateY: on ? 180 : 0 }} transition={{ duration: 0.5 }} className="relative grid [transform-style:preserve-3d]">
                <div className={`leaf col-start-1 row-start-1 flex flex-col p-4 [backface-visibility:hidden] ${on ? 'max-h-0 overflow-hidden !border-0 !p-0 !shadow-none' : ''}`} style={{ borderTop: '5px solid var(--rubric)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('The claim')}</p>
                  <p className="mt-1 text-lg font-bold leading-snug">“{c.claim}”</p>
                  <p className="mt-2 text-sm text-ink-soft">{refLabel(c.verse)}</p>
                  <p className="mt-auto pt-3 text-xs font-semibold text-accent">{t('Tap to see the answer')} ↻</p>
                </div>
                <div className={`leaf col-start-1 row-start-1 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] ${on ? '' : 'max-h-0 overflow-hidden !border-0 !p-0 !shadow-none'}`} style={{ borderTop: '5px solid var(--accent)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('The answer')}</p>
                  <p className="mt-1 text-[0.95rem]">
                    <Gloss>{c.reply}</Gloss>
                  </p>
                  <p className="mt-2 flex gap-1.5 text-[0.88rem] font-semibold">
                    <Icon name="timeline" size={15} className="mt-0.5 shrink-0 text-accent" />
                    <span>{c.data}</span>
                  </p>
                  <p className="mt-2 text-[0.85rem] italic text-ink-soft">
                    {t('Other view')}: {c.other}
                  </p>
                </div>
              </motion.div>
            </button>
          </motion.li>
        )
      })}
    </ul>
  )
}

/** Small line charts of long-run measures; each draws itself and marks whether the change is for the better. */
export function Trends({ items }: { items: H['trends'] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => {
        const xs = s.points.map((p) => p.year)
        const ys = s.points.map((p) => p.value)
        const [x0, x1] = [Math.min(...xs), Math.max(...xs)]
        const y1 = Math.max(...ys) * 1.1
        const X = (v: number) => 14 + ((v - x0) / Math.max(1, x1 - x0)) * 272
        const Y = (v: number) => 120 - (v / y1) * 100
        const d = s.points.map((p, k) => `${k ? 'L' : 'M'}${X(p.year).toFixed(1)} ${Y(p.value).toFixed(1)}`).join(' ')
        const first = s.points[0]
        const last = s.points[s.points.length - 1]
        const good = s.better === 'down' ? last.value < first.value : last.value > first.value
        const colour = good ? 'hsl(160 60% 32%)' : 'var(--rubric)'
        return (
          <motion.li key={s.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="leaf p-4">
            <p className="font-bold leading-snug">{s.label}</p>
            <p className="text-xs text-ink-soft">{s.unit}</p>
            <svg viewBox="0 0 300 140" className="mt-2 h-auto w-full" role="img" aria-label={`${s.label}: ${first.year} ${first.value}, ${last.year} ${last.value}`}>
              <line x1={14} x2={286} y1={120} y2={120} stroke="var(--rule)" />
              <motion.path d={`${d} L${X(last.year)} 120 L${X(first.year)} 120 Z`} fill={colour} fillOpacity={0.1} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} />
              <motion.path d={d} fill="none" stroke={colour} strokeWidth={3} strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
              {s.points.map((p) => (
                <g key={p.year}>
                  <circle cx={X(p.year)} cy={Y(p.value)} r={3.5} fill={colour} />
                  <text x={X(p.year)} y={136} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
                    {p.year}
                  </text>
                </g>
              ))}
              <text x={X(first.year) + 4} y={Math.max(12, Y(first.value) - 7)} fontSize={12} fontWeight={700} fill="var(--ink)">
                {first.value.toLocaleString()}
              </text>
              <text x={X(last.year) - 4} y={Math.max(12, Y(last.value) - 7)} textAnchor="end" fontSize={12} fontWeight={700} fill={colour}>
                {last.value.toLocaleString()}
              </text>
            </svg>
            <p className="mt-1 text-xs text-ink-soft">{s.note}</p>
            <p className="mt-1 text-[0.7rem] text-ink-soft">
              {t('Source')}: {s.source}
            </p>
          </motion.li>
        )
      })}
    </ul>
  )
}

/** Pictures of the kingdom growing, as circles that swell from seed to mountain. */
export function GrowthLadder({ items }: { items: H['growth'] }) {
  const [sel, setSel] = useState(0)
  const g = items[sel]
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="leaf flex items-end justify-between gap-1 p-4" style={{ minHeight: 220 }}>
        {items.map((x, i) => {
          const size = 18 + i * 12
          return (
            <button key={x.id} type="button" onClick={() => setSel(i)} aria-pressed={i === sel} aria-label={x.image} className="flex flex-col items-center gap-1">
              <motion.span
                className="block rounded-full"
                style={{ width: `min(${size}px, ${(i + 2) * 1.5}vw)`, height: `min(${size}px, ${(i + 2) * 1.5}vw)`, background: i === sel ? 'var(--gold-bright)' : 'hsl(160 45% 38%)' }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 160, damping: 14 }}
              />
              <span className="text-[0.65rem] tabular-nums text-ink-soft">{i + 1}</span>
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf p-5" style={{ borderLeft: '5px solid var(--gold)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(g.ref)}</p>
          <h3 className="mt-1 text-xl font-bold">{g.image}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{g.point}</Gloss>
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn" disabled={sel === 0} onClick={() => setSel(sel - 1)}>
              ←
            </button>
            <button type="button" className="btn btn-primary" disabled={sel === items.length - 1} onClick={() => setSel(sel + 1)}>
              →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
