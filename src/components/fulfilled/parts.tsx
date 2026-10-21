import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { FulfilledStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'
import { Refs } from '../Refs'

type F = FulfilledStudy
type Verse = F['verses'][number]

const CHAPTER_HUE = ['#b45309', '#0f766e', '#be123c', '#1d4ed8', '#7c3aed', '#c2410c', '#15803d', '#ca8a04', '#0e7490']

/* ---------- Hero: forty years on a dial, from the prophecy to the fall of the temple ---------- */

export function GenerationClock() {
  const [run, setRun] = useState(0)
  const [year, setYear] = useState(30)
  useEffect(() => {
    setYear(30)
    const id = setInterval(() => setYear((y) => (y >= 70 ? 70 : y + 1)), 70)
    return () => clearInterval(id)
  }, [run])
  const a = (y: number) => Math.PI * (1 - (y - 30) / 40)
  const R = 120
  const pt = (y: number, r = R) => [160 + Math.cos(a(y)) * r, 170 - Math.sin(a(y)) * r]
  const [nx, ny] = pt(year, R - 18)
  const done = year >= 70
  return (
    <button type="button" onClick={() => setRun(run + 1)} className="block w-full" aria-label={t('Replay: forty years from the prophecy to AD 70')}>
      <svg viewBox="0 0 320 210" className="h-auto w-full">
        <path d={`M${pt(30)[0]},${pt(30)[1]} A${R},${R} 0 0 1 ${pt(70)[0]},${pt(70)[1]}`} fill="none" stroke="var(--rule)" strokeWidth={14} strokeLinecap="round" />
        <motion.path d={`M${pt(30)[0]},${pt(30)[1]} A${R},${R} 0 0 1 ${pt(year)[0]},${pt(year)[1]}`} fill="none" stroke={done ? 'var(--rubric)' : 'var(--gold)'} strokeWidth={14} strokeLinecap="round" />
        {[30, 40, 50, 60, 70].map((y) => {
          const [x, yy] = pt(y, R + 22)
          return (
            <text key={y} x={x} y={yy + 4} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
              AD {y}
            </text>
          )
        })}
        <line x1={160} y1={170} x2={nx} y2={ny} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
        <circle cx={160} cy={170} r={9} fill="var(--ink)" />
        <text x={160} y={128} textAnchor="middle" fontSize={30} fontWeight={800} fill={done ? 'var(--rubric)' : 'var(--ink)'} className="font-serif">
          AD {year}
        </text>
        <text x={160} y={198} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
          {t('“This generation shall not pass”')} · {refLabel('Matthew 24:34')}
        </text>
        <AnimatePresence>
          {done && (
            <motion.g key={run} initial={{ scale: 2.4, opacity: 0, rotate: -25 }} animate={{ scale: 1, opacity: 0.95, rotate: -12 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} style={{ transformOrigin: '160px 78px' }}>
              <rect x={92} y={62} width={136} height={32} rx={6} fill="none" stroke="var(--rubric)" strokeWidth={3} />
              <text x={160} y={84} textAnchor="middle" fontSize={15} fontWeight={900} fill="var(--rubric)" letterSpacing={2}>
                {t('FULFILLED')}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </button>
  )
}

/* ---------- The five questions ---------- */

const KEY_ICON = { who: 'eye', what: 'scroll', where: 'compass', when: 'hourglass', why: 'question' } as const

export function FiveKeys({ keys }: { keys: F['keys'] }) {
  const order = ['who', 'what', 'where', 'when', 'why'] as const
  const sorted = order.map((k) => keys.find((x) => x.id === k)).filter(Boolean) as F['keys']
  const [open, setOpen] = useState<string>(sorted[0]?.id)
  const k = sorted.find((x) => x.id === open) ?? sorted[0]
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {sorted.map((x, i) => {
          const on = x.id === k.id
          return (
            <motion.button key={x.id} type="button" onClick={() => setOpen(x.id)} aria-pressed={on} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }} className={`flex flex-col items-center gap-1 rounded-2xl p-2 py-3 text-center ring-1 sm:p-3 ${on ? 'bg-accent text-[var(--accent-ink)] ring-transparent' : 'ring-rule hover:bg-surface-2'}`}>
              <motion.span animate={{ rotate: on ? 360 : 0 }} transition={{ duration: 0.6 }} className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--gold)] text-white sm:size-11">
                <Icon name={KEY_ICON[x.id]} size={18} />
              </motion.span>
              <span className="text-xs font-bold sm:text-sm">{x.question.split(/[?:]/)[0]}</span>
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={k.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-5" style={{ borderTop: '5px solid var(--gold)' }}>
          <h3 className="text-xl font-bold">{k.question}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{k.answer}</Gloss>
          </p>
          {k.refs.length > 0 && <Refs refs={k.refs} className="mt-3" />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- The historians ---------- */

export function Historians({ items }: { items: F['historians'] }) {
  const [flip, setFlip] = useState<string | null>(null)
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((h, i) => {
        const on = flip === h.id
        return (
          <motion.li key={h.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <button type="button" onClick={() => setFlip(on ? null : h.id)} aria-pressed={on} className="leaf block h-full w-full p-4 text-left">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] font-serif text-xl font-bold text-white">{h.name.charAt(0)}</span>
                <span className="min-w-0">
                  <span className="block font-bold leading-snug">{h.name}</span>
                  <span className="block text-xs text-ink-soft">{h.life}</span>
                </span>
              </div>
              <p className="mt-2 text-sm italic text-ink-soft">{h.works}</p>
              <AnimatePresence mode="wait">
                <motion.p key={on ? 'c' : 'r'} initial={{ opacity: 0, rotateX: -40 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0 }} className="mt-2 text-[0.95rem] leading-relaxed">
                  {on ? (
                    <>
                      <span className="font-bold text-rubric">{t('A word of caution:')} </span>
                      <Gloss>{h.caution}</Gloss>
                    </>
                  ) : (
                    <Gloss>{h.role}</Gloss>
                  )}
                </motion.p>
              </AnimatePresence>
              <span className="mt-2 block text-xs font-semibold text-accent">{on ? t('Back to their role') : t('Tap: how far to trust them')}</span>
            </button>
          </motion.li>
        )
      })}
    </ul>
  )
}

/* ---------- Verse explorer: every verse, its meaning, its history ---------- */

const VTABS = [
  ['meaning', () => t('What it means')],
  ['fulfilment', () => t('How it was fulfilled')],
  ['evidence', () => t('The evidence')],
  ['other', () => t('Other readings')],
] as const

const SEEN_KEY = 'last-things-fulfilled-seen'

export function VerseExplorer({ verses, chapters, sel, setSel }: { verses: Verse[]; chapters: F['chapters']; sel: string; setSel: (id: string) => void }) {
  const [tab, setTab] = useState<(typeof VTABS)[number][0]>('meaning')
  const [seen, setSeen] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]'))
    } catch {
      return new Set()
    }
  })
  const i = Math.max(0, verses.findIndex((v) => v.id === sel))
  const v = verses[i]
  const chIdx = chapters.findIndex((c) => c.id === v.chapter)
  const hue = CHAPTER_HUE[chIdx % CHAPTER_HUE.length]
  useEffect(() => {
    if (seen.has(v.id)) return
    const s = new Set(seen).add(v.id)
    setSeen(s)
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify([...s]))
    } catch {
      /* private mode */
    }
  }, [v.id, seen])
  useEffect(() => setTab('meaning'), [v.id])
  const go = (d: number) => setSel(verses[(i + d + verses.length) % verses.length].id)
  const label = (x: Verse) => x.ref.replace(/^Matthew\s+/, '')
  const usedChapters = chapters.filter((c) => verses.some((x) => x.chapter === c.id))
  return (
    <div>
      <div className="leaf p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">{t('{a} of {b} explored', { a: verses.filter((x) => seen.has(x.id)).length, b: verses.length })}</p>
          <div className="h-2 min-w-32 flex-1 overflow-hidden rounded-full bg-surface-2 sm:max-w-xs">
            <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${(verses.filter((x) => seen.has(x.id)).length / verses.length) * 100}%` }} />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {usedChapters.map((c) => {
            const h = CHAPTER_HUE[chapters.indexOf(c) % CHAPTER_HUE.length]
            return (
              <div key={c.id} className="flex flex-wrap items-center gap-1">
                <span className="mr-1 w-full text-xs font-bold uppercase tracking-widest sm:w-40" style={{ color: h }}>
                  {c.title}
                </span>
                {verses
                  .filter((x) => x.chapter === c.id)
                  .map((x) => {
                    const on = x.id === v.id
                    return (
                      <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={on} title={x.title} className="relative inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-xs font-bold tabular-nums transition" style={on ? { background: h, color: '#fff' } : { boxShadow: `inset 0 0 0 1.5px ${h}`, color: seen.has(x.id) ? undefined : h, background: seen.has(x.id) ? 'var(--surface-2)' : undefined }}>
                        {label(x).replace(/^24:/, '').replace(/^25:/, '25:')}
                      </button>
                    )
                  })}
              </div>
            )
          })}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.article key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="leaf relative mt-4 overflow-hidden p-5 sm:p-6" style={{ borderTop: `6px solid ${hue}` }}>
          {v.year !== null && (
            <motion.span initial={{ scale: 2.2, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 0.9, rotate: -10 }} transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 15 }} className="pointer-events-none absolute right-4 top-4 rounded-md border-2 border-[var(--rubric)] px-2 py-0.5 text-center text-[0.7rem] font-black uppercase leading-tight tracking-wider text-rubric">
              {t('Fulfilled')}
              <br />
              AD {v.year}
            </motion.span>
          )}
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: hue }}>
            {refLabel(v.ref)} · {chapters[chIdx]?.title}
          </p>
          <h3 className="mt-1 pr-24 text-2xl font-bold leading-snug">{v.title}</h3>
          <blockquote className="mt-2 border-l-4 pl-3 font-serif text-lg italic" style={{ borderColor: hue }}>
            “{v.phrase}”
          </blockquote>
          <div className="mt-4 flex flex-wrap gap-1.5" role="tablist">
            {VTABS.map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="relative rounded-lg px-3 py-1.5 text-sm font-semibold">
                {tab === k && <motion.span layoutId="verse-tab" className="absolute inset-0 rounded-lg" style={{ background: hue }} />}
                <span className={`relative ${tab === k ? 'text-white' : ''}`}>{l()}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3">
              {tab === 'meaning' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    <Gloss>{v.meaning}</Gloss>
                  </p>
                  {v.word && (
                    <div className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: `4px solid ${hue}` }}>
                      <p className="text-sm">
                        <span className="font-serif text-lg font-bold italic">{v.word.term}</span> <span className="text-ink-soft">· {v.word.gloss}</span>
                      </p>
                      <p className="mt-1 text-[0.95rem]">
                        <Gloss>{v.word.note}</Gloss>
                      </p>
                    </div>
                  )}
                </div>
              )}
              {tab === 'fulfilment' && (
                <p className="leading-relaxed">
                  <Gloss>{v.fulfilment}</Gloss>
                </p>
              )}
              {tab === 'evidence' &&
                (v.evidence.length ? (
                  <ul className="space-y-2">
                    {v.evidence.map((e, k) => (
                      <motion.li key={k} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.08 }} className="rounded-xl bg-surface-2 p-3">
                        <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: hue }}>
                          <Icon name="book" size={14} /> {e.source}
                        </p>
                        <p className="mt-1 text-[0.95rem]">
                          <Gloss>{e.text}</Gloss>
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ink-soft">{t('This verse rests on the wording of Scripture rather than an outside record.')}</p>
                ))}
              {tab === 'other' && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: '4px solid var(--ink-soft)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">{t('How other views read it')}</p>
                    <p className="mt-1 text-[0.95rem]">
                      <Gloss>{v.other}</Gloss>
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: `4px solid ${hue}` }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: hue }}>
                      {t('The fulfilled reading answers')}
                    </p>
                    <p className="mt-1 text-[0.95rem]">
                      <Gloss>{v.answer}</Gloss>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {v.refs.length > 0 && <Refs refs={v.refs} className="mt-4" />}
          <div className="mt-4 flex justify-between gap-2">
            <button type="button" className="btn" onClick={() => go(-1)}>
              ← {label(verses[(i - 1 + verses.length) % verses.length])}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => go(1)}>
              {label(verses[(i + 1) % verses.length])} →
            </button>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Symbol decoder: flip each image to see what it meant ---------- */

export function SymbolDecoder({ items }: { items: F['symbols'] }) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggle = (id: string) => {
    const s = new Set(open)
    s.has(id) ? s.delete(id) : s.add(id)
    setOpen(s)
  }
  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button type="button" className="btn text-sm" onClick={() => setOpen(new Set(items.map((x) => x.id)))}>
          {t('Decode all')}
        </button>
        <button type="button" className="btn text-sm" onClick={() => setOpen(new Set())}>
          {t('Hide all')}
        </button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => {
          const on = open.has(s.id)
          return (
            <li key={s.id} className="[perspective:1000px]">
              <button type="button" onClick={() => toggle(s.id)} aria-pressed={on} className="relative block w-full text-left">
                <motion.div animate={{ rotateY: on ? 180 : 0 }} transition={{ duration: 0.55 }} className="relative grid [transform-style:preserve-3d]">
                  <div className="leaf col-start-1 row-start-1 flex min-h-40 flex-col justify-between p-4 [backface-visibility:hidden]" style={{ borderTop: `4px solid ${CHAPTER_HUE[i % CHAPTER_HUE.length]}` }}>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">{refLabel(s.ref)}</p>
                      <p className="mt-1 font-serif text-xl font-bold leading-snug">{s.image}</p>
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent">
                      <Icon name="sparkles" size={13} /> {t('Tap to decode')}
                    </p>
                  </div>
                  <div className="leaf col-start-1 row-start-1 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ borderTop: `4px solid ${CHAPTER_HUE[i % CHAPTER_HUE.length]}` }}>
                    <p className="text-sm font-bold">{s.image}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed">
                      <Gloss>{s.meaning}</Gloss>
                    </p>
                    {s.refs.length > 0 && <p className="mt-2 text-xs text-ink-soft">{refLabel(s.refs.join('; '))}</p>}
                  </div>
                </motion.div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------- Timeline AD 30–73, linked to the verses ---------- */

export function FulfilmentTimeline({ items, onVerse }: { items: F['timeline']; onVerse: (ref: string) => void }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [i, setI] = useState(0)
  const e = sorted[i]
  const min = sorted[0]?.year ?? 30
  const max = sorted[sorted.length - 1]?.year ?? 73
  const x = (y: number) => ((y - min) / Math.max(1, max - min)) * 100
  return (
    <div className="leaf p-4 sm:p-5">
      <div className="relative mx-3 mb-10 mt-6 h-2 rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--rubric)]">
        {sorted.map((s, k) => (
          <button key={k} type="button" onClick={() => setI(k)} aria-label={`AD ${s.year}: ${s.label}`} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x(s.year)}%` }}>
            <motion.span className="block rounded-full border-2 border-[var(--surface)]" animate={{ width: k === i ? 20 : 12, height: k === i ? 20 : 12, background: k === i ? 'var(--rubric)' : 'var(--ink-soft)' }} />
          </button>
        ))}
        {[min, Math.round((min + max) / 2), max].map((y) => (
          <span key={y} className="absolute top-5 -translate-x-1/2 text-xs text-ink-soft" style={{ left: `${x(y)}%` }}>
            AD {y}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <p className="font-serif text-3xl font-bold text-rubric">AD {e.year}</p>
          <h3 className="text-xl font-bold">{e.label}</h3>
          <p className="mt-1 max-w-[70ch] leading-relaxed">
            <Gloss>{e.text}</Gloss>
          </p>
          {e.verse && (
            <button type="button" className="btn mt-3 text-sm" onClick={() => onVerse(e.verse!)}>
              <Icon name="scroll" size={14} /> {t('Open {ref}', { ref: refLabel(e.verse) })}
            </button>
          )}
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

/* ---------- Time texts: the clock on the wall ---------- */

export function TimeTexts({ items }: { items: F['timeTexts'] }) {
  const [sel, setSel] = useState<number | null>(null)
  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {items.map((x, k) => (
          <motion.li key={k} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (k % 10) * 0.04 }}>
            <button type="button" onClick={() => setSel(sel === k ? null : k)} aria-pressed={sel === k} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${sel === k ? 'bg-accent text-[var(--accent-ink)] ring-transparent' : 'ring-rule hover:bg-surface-2'}`}>
              <Icon name="hourglass" size={13} /> “{x.phrase}”
            </button>
          </motion.li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        {sel !== null && (
          <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-4" style={{ borderLeft: '5px solid var(--accent)' }}>
            <p className="text-sm font-bold text-accent">{refLabel(items[sel].ref)}</p>
            <p className="mt-1 font-serif text-lg italic">“{items[sel].phrase}”</p>
            <p className="mt-2 leading-relaxed">
              <Gloss>{items[sel].note}</Gloss>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- One fulfilment, not two ---------- */

export function DoubleFulfilment({ d }: { d: F['doubleFulfilment'] }) {
  const [other, setOther] = useState(false)
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="leaf p-4">
        <svg viewBox="0 0 320 180" className="h-auto w-full" aria-hidden>
          <circle cx={40} cy={90} r={22} fill="var(--gold)" />
          <text x={40} y={95} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">
            AD 30
          </text>
          <motion.path d="M64 86 Q160 20 250 70" fill="none" stroke="var(--rubric)" strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
          <circle cx={272} cy={78} r={22} fill="var(--rubric)" />
          <text x={272} y={83} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">
            AD 70
          </text>
          <motion.path d="M64 96 Q170 170 290 150" fill="none" stroke="var(--ink-soft)" strokeWidth={3} strokeDasharray="6 6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.6 }} />
          <motion.g initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.8, type: 'spring' }} style={{ transformOrigin: '290px 150px' }}>
            <circle cx={290} cy={150} r={18} fill="var(--surface-2)" stroke="var(--ink-soft)" strokeDasharray="4 3" />
            <text x={290} y={155} textAnchor="middle" fontSize={14} fill="var(--ink-soft)">
              ?
            </text>
          </motion.g>
          <motion.path d="M276 136 L304 164 M304 136 L276 164" stroke="var(--rubric)" strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 2.2, duration: 0.4 }} />
        </svg>
        <p className="text-center text-sm text-ink-soft">{t('One prophecy, one fulfilment: no second, future copy')}</p>
      </div>
      <div>
        <p className="leading-relaxed">
          <Gloss>{d.text}</Gloss>
        </p>
        <ol className="mt-3 space-y-2">
          {d.points.map((p, k) => (
            <motion.li key={k} initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.07 }} className="rounded-xl bg-surface-2 p-3">
              <p className="font-bold">
                {k + 1}. {p.title}
              </p>
              <p className="mt-0.5 text-[0.95rem]">
                <Gloss>{p.text}</Gloss>
              </p>
              {p.refs.length > 0 && <p className="mt-1 text-xs text-ink-soft">{refLabel(p.refs.join('; '))}</p>}
            </motion.li>
          ))}
        </ol>
        <button type="button" className="btn mt-3" onClick={() => setOther(!other)} aria-expanded={other}>
          <Icon name="scales" size={14} /> {other ? t('Hide the other side') : t('Hear the other side')}
        </button>
        <AnimatePresence>
          {other && (
            <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden rounded-xl bg-surface-2 p-3 text-[0.95rem]" style={{ borderLeft: '4px solid var(--ink-soft)' }}>
              <Gloss>{d.otherSide}</Gloss>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Eight clues for an early Revelation ---------- */

export function RevelationClues({ items }: { items: F['revelationDate'] }) {
  const [side, setSide] = useState<Record<string, boolean>>({})
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((c, i) => {
        const cnt = side[c.id]
        return (
          <motion.li key={c.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.07 }} className="leaf flex flex-col p-4" style={{ borderTop: `4px solid ${cnt ? 'var(--ink-soft)' : 'var(--rubric)'}` }}>
            <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('Clue {n}', { n: i + 1 })}</p>
            <h3 className="mt-0.5 font-bold leading-snug">{c.title}</h3>
            <AnimatePresence mode="wait">
              <motion.p key={cnt ? 'c' : 'a'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 flex-1 text-[0.95rem] leading-relaxed">
                {cnt && <span className="font-bold text-ink-soft">{t('Late-date reply:')} </span>}
                <Gloss>{cnt ? c.counter : c.argument}</Gloss>
              </motion.p>
            </AnimatePresence>
            <button type="button" className="mt-3 self-start text-sm font-semibold text-accent" onClick={() => setSide({ ...side, [c.id]: !cnt })}>
              {cnt ? t('Back to the clue') : t('See the reply')} →
            </button>
          </motion.li>
        )
      })}
    </ul>
  )
}

/* ---------- Objections ---------- */

export function Objections({ items }: { items: F['objections'] }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <ul className="space-y-2">
      {items.map((o) => {
        const on = open === o.id
        return (
          <li key={o.id} className="leaf overflow-hidden">
            <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : o.id)} className="flex w-full items-center gap-3 p-4 text-left">
              <Icon name="question" size={18} className="shrink-0 text-rubric" />
              <span className="min-w-0 flex-1 font-bold">{o.q}</span>
              <motion.span animate={{ rotate: on ? 90 : 0 }}>
                <Icon name="arrow" size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4">
                    <p className="leading-relaxed">
                      <Gloss>{o.a}</Gloss>
                    </p>
                    {o.refs.length > 0 && <Refs refs={o.refs} className="mt-3" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- What now? The five verbs of Genesis 1:28 ---------- */

export function Mandate({ m }: { m: F['mandate'] }) {
  const [i, setI] = useState(0)
  const it = m.items[i]
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 300 300" className="mx-auto h-auto w-full max-w-xs" role="group" aria-label={t('The five verbs of Genesis 1:28')}>
        {m.items.map((_, k) => {
          const r = 40 + k * 24
          const on = k === i
          return (
            <motion.circle key={k} cx={150} cy={150} r={r} fill="none" stroke={on ? 'var(--accent)' : 'var(--gold)'} strokeWidth={on ? 10 : 6} opacity={k <= i ? 1 : 0.3} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: k * 0.2 }} onClick={() => setI(k)} className="cursor-pointer" />
          )
        })}
        <text x={150} y={156} textAnchor="middle" fontSize={16} fontWeight={800} fill="var(--accent)">
          {i + 1}/5
        </text>
      </svg>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {m.items.map((x, k) => (
            <button key={k} type="button" onClick={() => setI(k)} className={`chip cursor-pointer ${k === i ? 'border-accent bg-accent text-[var(--accent-ink)]' : ''}`}>
              {k + 1}. {x.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-3 p-5" style={{ borderLeft: '5px solid var(--accent)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(it.ref)}</p>
            <h3 className="mt-0.5 text-xl font-bold">{it.label}</h3>
            <p className="mt-2 leading-relaxed">
              <Gloss>{it.text}</Gloss>
            </p>
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-[0.95rem] text-ink-soft">
          <Gloss>{m.text}</Gloss>
        </p>
      </div>
    </div>
  )
}
