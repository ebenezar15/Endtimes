import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { useReducedMotion } from '../../lib/theme'
import { Icon } from '../Icon'
import { COLLIDE, CRITICS, DEBATE, LANES, ORDER, PILLARS, READY, RELATED, ROMANS_STEPS, STRAINS, THEMES, VIEWS, WITNESSES } from './data'

const Refs = ({ refs }: { refs: string[] }) => <p className="mt-1 text-xs font-semibold text-ink-soft">{refs.map(refLabel).join(' · ')}</p>

function Chips<K extends string>({ items, value, onChange }: { items: [K, string, string?][]; value: K; onChange: (k: K) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {items.map(([k, l, c]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k} onClick={() => onChange(k)} className="chip cursor-pointer" style={value === k ? { background: c ?? 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
          {l}
        </button>
      ))}
    </div>
  )
}

/** The hero picture: a crown descending on a throne, rays spreading over the earth. */
export function ReignHero() {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 300 240" className="h-auto w-full" role="img" aria-label={t('Christ enthroned, his reign spreading over the earth')}>
      <defs>
        <radialGradient id="kn-glow">
          <stop offset="0" stopColor="var(--gold)" stopOpacity={0.55} />
          <stop offset="1" stopColor="var(--gold)" stopOpacity={0} />
        </radialGradient>
      </defs>
      <motion.circle cx={150} cy={86} r={90} fill="url(#kn-glow)" animate={reduce ? undefined : { r: [80, 96, 80] }} transition={{ duration: 5, repeat: Infinity }} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <motion.line key={i} x1={150} y1={86} x2={150 + Math.cos(a) * 120} y2={86 + Math.sin(a) * 120} stroke="var(--gold)" strokeWidth={1.5} strokeOpacity={0.35} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 + i * 0.05, duration: 0.9 }} />
      })}
      <ellipse cx={150} cy={214} rx={120} ry={18} fill="color-mix(in srgb, var(--accent) 22%, transparent)" stroke="var(--accent)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.circle key={i} cx={50 + i * 33} cy={214 + (i % 2) * 4} r={4} fill="var(--accent)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6 + i * 0.12 }} />
      ))}
      <rect x={122} y={104} width={56} height={60} rx={6} fill="color-mix(in srgb, var(--gold) 25%, var(--bg))" stroke="var(--gold)" strokeWidth={2} />
      <rect x={112} y={158} width={76} height={14} rx={4} fill="var(--gold)" opacity={0.7} />
      <motion.path d="M126 70 l10 -26 l14 18 l14 -18 l10 26 Z" fill="var(--gold)" stroke="var(--gold)" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 60 }} />
      <motion.text x={150} y={142} textAnchor="middle" fontSize={13} fontWeight={800} fill="var(--ink)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        {t('Reigning')}
      </motion.text>
    </svg>
  )
}

/** Six pillars rising under one roof; tap one to read it. */
export function Pillars() {
  const ps = PILLARS()
  const [sel, setSel] = useState(0)
  const p = ps[sel]
  return (
    <div className="leaf p-4 sm:p-6">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-center text-lg font-bold text-gold">
        {t('Christ reigns, from the ascension to the handover')}
      </motion.p>
      <svg viewBox="0 0 600 220" className="mt-1 h-auto w-full" role="img" aria-label={t('Six pillars')}>
        <motion.path d="M40 60 L300 10 L560 60 Z" fill="color-mix(in srgb, var(--gold) 30%, transparent)" stroke="var(--gold)" strokeWidth={2} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} />
        <rect x={40} y={60} width={520} height={10} fill="var(--gold)" opacity={0.6} />
        <rect x={30} y={200} width={540} height={14} rx={3} fill="var(--gold)" opacity={0.5} />
        {ps.map((_, i) => {
          const x = 60 + i * 86
          const on = sel === i
          return (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <motion.rect x={x} width={52} rx={4} fill={on ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 25%, transparent)'} stroke="var(--accent)" strokeWidth={on ? 2.5 : 1.5} initial={{ y: 200, height: 0 }} animate={{ y: 70, height: 130 }} transition={{ delay: 0.15 * i, type: 'spring', stiffness: 70, damping: 14 }} />
              <text x={x + 26} y={146} textAnchor="middle" fontSize={22} fontWeight={900} fill={on ? 'var(--accent-ink)' : 'var(--accent)'}>
                {i + 1}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ps.map((x, i) => (
          <button key={i} type="button" onClick={() => setSel(i)} className="chip cursor-pointer" style={sel === i ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
            {i + 1}. {x.n}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl border border-rule p-4" style={{ borderLeft: '5px solid var(--accent)' }}>
          <h3 className="text-lg font-bold">{p.n}</h3>
          <p className="mt-1 text-[0.98rem]">{p.text}</p>
          <Refs refs={p.refs} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** The order of events on one line, played step by step. */
export function OrderLine() {
  const os = ORDER()
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(!reduce)
  useEffect(() => {
    if (!play) return
    const id = setTimeout(() => setI((n) => (n + 1) % os.length), 2600)
    return () => clearTimeout(id)
  }, [play, i, os.length])
  const colors = ['var(--gold)', 'var(--rubric)', 'var(--accent)', 'var(--violet, #9b8cf0)', 'var(--gold)']
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="relative mt-2 grid grid-cols-5 gap-1">
        <div className="absolute left-[10%] right-[10%] top-5 h-1.5 rounded-full bg-[var(--rule)]" />
        <motion.div className="absolute left-[10%] top-5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} initial={false} animate={{ width: `${(i / (os.length - 1)) * 80}%` }} transition={{ duration: 0.8 }} />
        {os.map((o, k) => (
          <button key={k} type="button" onClick={() => (setPlay(false), setI(k))} className="relative flex flex-col items-center gap-1 text-center">
            <motion.span animate={{ scale: k === i ? 1.25 : 1 }} className="z-10 flex size-11 items-center justify-center rounded-full text-sm font-black" style={{ background: k <= i ? colors[k] : 'var(--surface-2, var(--bg-2))', color: k <= i ? 'var(--bg)' : 'var(--ink-soft)', border: `2px solid ${colors[k]}` }}>
              {k + 1}
            </motion.span>
            <span className="text-[0.7rem] font-bold leading-tight sm:text-xs" style={{ color: colors[k] }}>
              {o.when}
            </span>
            <span className="hidden text-xs font-semibold leading-tight sm:block">{o.title}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-5 rounded-xl border border-rule p-4" style={{ borderLeft: `5px solid ${colors[i]}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: colors[i] }}>
            {os[i].when}
          </p>
          <h3 className="text-lg font-bold">{os[i].title}</h3>
          <p className="mt-1">{os[i].text}</p>
          <Refs refs={os[i].refs} />
        </motion.div>
      </AnimatePresence>
      <button type="button" className="btn mt-3 py-1.5 text-sm" onClick={() => setPlay(!play)}>
        {play ? t('Pause') : t('Play')}
      </button>
    </div>
  )
}

/** Three orders side by side, each lane drawn in turn, then the collision table. */
export function ThreeOrders() {
  const v = VIEWS()
  const lanes = LANES()
  const rows = COLLIDE()
  const keys = ['premil', 'amil', 'right'] as const
  const [pick, setPick] = useState<'all' | (typeof keys)[number]>('all')
  return (
    <div className="space-y-4">
      <div className="leaf space-y-5 p-4 sm:p-6">
        {keys.map((k, li) => (
          <div key={k}>
            <p className="mb-1.5 flex items-center gap-2 text-sm font-bold" style={{ color: v[k].color }}>
              <span className="size-3 rounded-full" style={{ background: v[k].color }} /> {v[k].label}
            </p>
            <div className="flex flex-wrap items-stretch gap-1">
              {lanes[k].map((s, i) => {
                const finale = k === 'right' && i === lanes[k].length - 2
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: li * 0.5 + i * 0.12 }} className="flex items-center gap-1">
                    <span className="rounded-lg px-2.5 py-1.5 text-[0.82rem] font-semibold leading-tight" style={{ background: `color-mix(in srgb, ${v[k].color} ${finale ? 40 : 16}%, transparent)`, border: `1px solid ${v[k].color}`, boxShadow: finale ? `0 0 0 3px color-mix(in srgb, ${v[k].color} 30%, transparent)` : undefined }}>
                      {s}
                    </span>
                    {i < lanes[k].length - 1 && (
                      <span className="text-ink-soft" aria-hidden>
                        →
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }} className="rounded-xl p-3 text-sm font-semibold" style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)' }}>
          {t('Why it matters: only the right view keeps the resurrection, the destruction of death and the handover of the kingdom in one moment, as 1 Corinthians 15:23-28 reads on its face.')}
        </motion.p>
      </div>
      <div className="leaf p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto font-bold">{t('Where the views collide')}</p>
          <Chips items={[['all', t('All three')], ...keys.map((k) => [k, v[k].label, v[k].color] as [typeof k, string, string])]} value={pick} onChange={setPick} />
        </div>
        <div className="mt-3 space-y-2">
          {rows.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="grid gap-2 rounded-xl border border-rule p-3 md:grid-cols-[10rem_repeat(3,minmax(0,1fr))]">
              <p className="font-bold">{r.issue}</p>
              {keys
                .filter((k) => pick === 'all' || pick === k)
                .map((k) => (
                  <p key={k} className="rounded-lg px-2.5 py-1.5 text-sm" style={{ borderLeft: `4px solid ${v[k].color}`, background: k === 'right' ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : undefined }}>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-wider md:hidden" style={{ color: v[k].color }}>
                      {v[k].label}
                    </span>
                    {r[k]}
                  </p>
                ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** The key themes, as cards that open. */
export function Themes() {
  const ts = THEMES()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ts.map((x, i) => (
        <motion.button key={i} type="button" onClick={() => setOpen(open === i ? null : i)} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.06 }} className="leaf glow-card p-4 text-left" style={open === i ? { borderColor: 'var(--accent)' } : undefined}>
          <span className="flex items-center gap-2 font-bold">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
              {i + 1}
            </span>
            {x.k}
          </span>
          <AnimatePresence>
            {open === i && (
              <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="block overflow-hidden">
                <span className="mt-2 block text-[0.95rem]">{x.v}</span>
                <span className="mt-1 block text-xs font-semibold text-ink-soft">{x.refs.map(refLabel).join(' · ')}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  )
}

/** Where the other views strain the text. */
export function Strains() {
  const v = VIEWS()
  const s = STRAINS()
  const [k, setK] = useState<'premil' | 'amil'>('premil')
  const [flip, setFlip] = useState<number | null>(null)
  return (
    <div>
      <Chips
        items={[
          ['premil', t('Premillennialism'), v.premil.color],
          ['amil', t('Amillennialism'), v.amil.color],
        ]}
        value={k}
        onChange={(x) => (setK(x), setFlip(null))}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {s[k].map((x, i) => (
          <motion.button key={k + i} type="button" onClick={() => setFlip(flip === i ? null : i)} initial={{ opacity: 0, rotateY: 30 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ delay: i * 0.08 }} className="leaf min-h-[130px] p-4 text-left" style={{ borderTop: `4px solid ${v[k].color}` }}>
            <AnimatePresence mode="wait">
              {flip === i ? (
                <motion.span key="b" initial={{ opacity: 0, rotateX: 60 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0 }} className="block">
                  <span className="block text-xs font-bold uppercase tracking-widest text-accent">{t('Why it presses')}</span>
                  <span className="mt-1 block text-[0.95rem]">{x.v}</span>
                  <span className="mt-1 block text-xs font-semibold text-ink-soft">{x.refs.map(refLabel).join(' · ')}</span>
                </motion.span>
              ) : (
                <motion.span key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, rotateX: -60 }} className="block">
                  <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: v[k].color }}>
                    {t('Tension')}
                  </span>
                  <span className="mt-1 block text-lg font-bold">{x.k}</span>
                  <span className="mt-2 block text-xs text-ink-soft">{t('Tap to see why')}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/** Ask, anticipate the reply, follow up: three bubbles revealed in turn. */
export function DebateQs() {
  const v = VIEWS()
  const d = DEBATE()
  const [k, setK] = useState<'premil' | 'amil' | 'romans'>('premil')
  const [i, setI] = useState(0)
  const [step, setStep] = useState(1)
  const list = d[k]
  const x = list[Math.min(i, list.length - 1)]
  const other = k === 'amil' ? v.amil : v.premil
  const bubbles = [
    { who: t('Ask'), color: 'var(--accent)', text: x.q, left: true },
    { who: t('Likely reply'), color: other.color, text: x.r, left: false },
    { who: t('Follow up'), color: 'var(--accent)', text: x.f, left: true },
  ]
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Chips
          items={[
            ['premil', t('For premillennialists'), v.premil.color],
            ['amil', t('For amillennialists'), v.amil.color],
            ['romans', t('On Romans 11'), 'var(--rubric)'],
          ]}
          value={k}
          onChange={(n) => (setK(n), setI(0), setStep(1))}
        />
        <span className="ml-auto text-sm text-ink-soft">{t('{a} of {b}', { a: i + 1, b: list.length })}</span>
      </div>
      <ol className="mt-4 space-y-3">
        <AnimatePresence initial={false}>
          {bubbles.slice(0, step).map((b, n) => (
            <motion.li key={`${k}${i}${n}`} initial={{ opacity: 0, x: b.left ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} className={`max-w-[92%] rounded-2xl bg-surface-2 p-4 ${b.left ? 'mr-auto rounded-tl-sm' : 'ml-auto rounded-tr-sm'}`} style={b.left ? { borderLeft: `4px solid ${b.color}` } : { borderRight: `4px solid ${b.color}` }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: b.color }}>
                {n === 0 ? `Q${i + 1} · ` : ''}
                {b.who}
              </p>
              <p className="mt-1 leading-relaxed">{b.text}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <Refs refs={x.refs} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn py-1.5 text-sm" disabled={i === 0} onClick={() => (setI(i - 1), setStep(1))}>
          ← {t('Back')}
        </button>
        {step < 3 ? (
          <button type="button" className="btn btn-primary py-1.5 text-sm" onClick={() => setStep(step + 1)}>
            {step === 1 ? t('Show the likely reply') : t('Show the follow-up')}
          </button>
        ) : (
          <button type="button" className="btn btn-primary py-1.5 text-sm" disabled={i >= list.length - 1} onClick={() => (setI(i + 1), setStep(1))}>
            {t('Next question')} →
          </button>
        )}
      </div>
    </div>
  )
}

/** Romans 11: the readings, the five-step argument and the critics' points. */
export function RomansCase() {
  const steps = ROMANS_STEPS()
  const cr = CRITICS()
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="leaf p-4" style={{ borderTop: '4px solid var(--accent)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Church-Israel reading')}</p>
          <p className="mt-1">{t('“All Israel” is the whole elect people of God, Jew and Gentile, gathered through the gospel across the age.')}</p>
          <p className="mt-2 text-xs text-ink-soft">{t('Held by many partial preterists and postmillennialists.')}</p>
        </div>
        <div className="leaf p-4" style={{ borderTop: '4px solid var(--gold)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">{t('Future Jewish turning')}</p>
          <p className="mt-1">{t('A large conversion of ethnic Jews within the gospel age, part of the world’s blessing. No separate land, temple or kingdom.')}</p>
          <p className="mt-2 text-xs text-ink-soft">{t('Held by Puritans such as John Owen and Jonathan Edwards, and by Charles Hodge and John Murray.')}</p>
        </div>
      </div>
      <div className="leaf p-4 sm:p-6">
        <p className="font-bold">{t('The argument in five steps')}</p>
        <ol className="relative mt-3 space-y-3 border-l-2 border-[var(--accent)] pl-5">
          {steps.map((s, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative">
              <span className="absolute -left-[2.05rem] top-0 inline-flex size-7 items-center justify-center rounded-full text-xs font-black" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                {i + 1}
              </span>
              <p className="font-bold">{s.k}</p>
              <p className="text-[0.95rem]">{s.v}</p>
              <Refs refs={s.refs} />
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="leaf p-4 sm:p-6">
        <p className="font-bold">{t('What critics say, and the answer')}</p>
        <div className="mt-3 space-y-2">
          {cr.map((c, i) => (
            <button key={i} type="button" onClick={() => setOpen(open === i ? null : i)} className="block w-full rounded-xl border border-rule p-3 text-left" style={{ borderLeft: '4px solid var(--rubric)' }}>
              <span className="block font-semibold">{c.c}</span>
              <AnimatePresence>
                {open === i && (
                  <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 block overflow-hidden rounded-lg p-2.5 text-[0.95rem]" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}>
                    {c.a}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-xl border border-rule p-3 text-sm text-ink-soft" style={{ borderLeft: '4px solid var(--gold)' }}>
          {t('Handle with care: the lexicons treat houtōs mainly as manner, “in this way”, but that alone does not settle who “all Israel” is. Some scholars accept the manner sense and still expect an end-time salvation of ethnic Israel. The case rests on steps 1, 2, 4 and 5 together, not on one word.')}
        </p>
      </div>
    </div>
  )
}

/** Hard texts every view must answer: the challenge, the best reply, and the caution. */
export function BeReady() {
  const rs = READY()
  const [i, setI] = useState(0)
  const r = rs[i]
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <ul className="space-y-1.5">
        {rs.map((x, k) => (
          <li key={k}>
            <button type="button" onClick={() => setI(k)} className="flex w-full items-center gap-2 rounded-xl border border-rule p-2.5 text-left text-sm font-semibold" style={i === k ? { borderColor: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 10%, transparent)' } : undefined}>
              <Icon name="scales" size={15} /> {x.c}
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf space-y-3 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('The challenge')}</p>
          <h3 className="text-lg font-bold">{r.c}</h3>
          <div className="rounded-xl p-3" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('The best reply')}</p>
            <p className="mt-1">{r.a}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'color-mix(in srgb, var(--gold) 12%, transparent)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">{t('Handle with care')}</p>
            <p className="mt-1">{r.care}</p>
          </div>
          <Refs refs={r.refs} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Witnesses through church history, on a vertical line. */
export function Witnesses() {
  const ws = WITNESSES()
  return (
    <ol className="relative space-y-4 border-l-2 border-[var(--gold)] pl-6">
      {ws.map((w, i) => (
        <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
          <span className="absolute -left-[1.95rem] top-1 size-4 rounded-full" style={{ background: 'var(--gold)', boxShadow: '0 0 0 4px color-mix(in srgb, var(--gold) 25%, transparent)' }} />
          <p className="text-xs font-bold uppercase tracking-widest text-gold">{w.y}</p>
          <p className="font-bold">{w.w}</p>
          <p className="text-[0.95rem] text-ink-soft">{w.v}</p>
        </motion.li>
      ))}
    </ol>
  )
}

/** Links to the studies that connect with this one. */
export function Related() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {RELATED().map((r, i) => (
        <motion.li key={r.to} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
          <Link to={r.to} className="leaf glow-card block h-full p-4 text-ink no-underline transition-transform hover:-translate-y-1">
            <span className="block font-bold">{r.label}</span>
            <span className="mt-1 block text-sm text-ink-soft">{r.why}</span>
          </Link>
        </motion.li>
      ))}
    </ul>
  )
}
