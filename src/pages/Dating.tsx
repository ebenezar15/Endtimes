import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DatingStudy } from '../content/schema'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Sources } from '../components/Sources'
import { ProgressBar, Section } from '../components/studies/Section'
import { ViewReadings } from '../components/studies/ViewReadings'
import { t } from '../lib/i18n'
import { dating } from '../lib/data/studies'
import { useApp } from '../lib/store'

type Ev = DatingStudy['evidence'][number]
const SIDE_COLOR = { early: 'var(--rubric)', late: 'var(--accent)' } as const

/** A balance: the evidence you count as persuasive goes in its pan and the beam tips. */
function Scale({ early, late }: { early: number; late: number }) {
  const diff = late - early
  const tilt = Math.max(-16, Math.min(16, diff * 1.6))
  const lean = diff === 0 ? t('Evenly balanced') : diff > 0 ? t('Leans late (Domitian)') : t('Leans early (before AD 70)')
  return (
    <div>
      <svg viewBox="0 0 400 230" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={`${lean}: ${early} – ${late}`}>
        <path d="M200,52 L200,200 M150,212 L250,212 L200,196 Z" stroke="var(--gold)" strokeWidth={6} fill="var(--gold)" strokeLinejoin="round" />
        <circle cx={200} cy={50} r={9} fill="var(--gold-bright)" />
        <motion.g animate={{ rotate: tilt }} transition={{ type: 'spring', stiffness: 70, damping: 9 }} style={{ transformOrigin: '200px 50px' }}>
          <line x1={50} y1={50} x2={350} y2={50} stroke="var(--gold)" strokeWidth={7} strokeLinecap="round" />
          {(['early', 'late'] as const).map((side) => {
            const x = side === 'early' ? 50 : 350
            const w = side === 'early' ? early : late
            return (
              <motion.g key={side} animate={{ rotate: -tilt }} transition={{ type: 'spring', stiffness: 70, damping: 9 }} style={{ transformOrigin: `${x}px 50px` }}>
                <line x1={x - 40} y1={120} x2={x} y2={50} stroke="var(--ink-soft)" strokeWidth={1.5} />
                <line x1={x + 40} y1={120} x2={x} y2={50} stroke="var(--ink-soft)" strokeWidth={1.5} />
                <path d={`M${x - 48},120 Q${x},150 ${x + 48},120 Z`} fill={SIDE_COLOR[side]} opacity={0.9} />
                {Array.from({ length: Math.min(w, 24) }, (_, k) => (
                  <motion.rect key={k} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} x={x - 36 + (k % 6) * 12} y={108 - Math.floor(k / 6) * 9} width={10} height={8} rx={2} fill="var(--gold-bright)" stroke="var(--gold)" strokeWidth={0.8} />
                ))}
                <text x={x} y={175} textAnchor="middle" fontSize={15} fontWeight={800} fill={SIDE_COLOR[side]}>
                  {side === 'early' ? t('Early') : t('Late')} · {w}
                </text>
              </motion.g>
            )
          })}
        </motion.g>
      </svg>
      <AnimatePresence mode="wait">
        <motion.p key={lean} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center text-lg font-bold">
          {lean}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function EvidenceCard({ e, on, toggle }: { e: Ev; on: boolean; toggle: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.li layout initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-20px' }} className={`leaf p-4 transition-opacity ${on ? '' : 'opacity-60'}`} style={{ borderTop: `4px solid ${SIDE_COLOR[e.side]}` }}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: SIDE_COLOR[e.side] }}>
            {e.side === 'early' ? t('For an early date') : t('For a late date')}
            <span className="chip py-0 text-[0.65rem] normal-case tracking-normal text-ink-soft">{e.kind === 'external' ? t('Early church witness') : t('Inside the book')}</span>
          </p>
          <h3 className="mt-1 font-bold leading-snug">{e.title}</h3>
          <p className="mt-0.5 text-xs text-ink-soft">{e.source}</p>
        </div>
        <button type="button" role="switch" aria-checked={on} onClick={toggle} title={on ? t('Counted as persuasive: tap to remove from the scale') : t('Not counted: tap to put on the scale')} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-accent' : 'bg-surface-2 ring-1 ring-rule'}`}>
          <motion.span className="absolute top-1 size-5 rounded-full bg-[var(--surface)] shadow" animate={{ left: on ? 26 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1" aria-label={t('Weight {n} of 3', { n: e.weight })}>
        {[1, 2, 3].map((k) => (
          <span key={k} className="h-1.5 w-8 rounded-full" style={{ background: k <= e.weight ? SIDE_COLOR[e.side] : 'var(--rule)' }} />
        ))}
        <span className="ml-1 text-xs text-ink-soft">{[t('suggestive'), t('significant'), t('strong')][e.weight - 1]}</span>
      </div>
      <p className="mt-2 text-[0.95rem]">
        <Gloss>{e.claim}</Gloss>
      </p>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="mt-2 text-sm font-semibold text-accent">
        {open ? t('Hide the reply') : t('The other side replies')}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <span className="mt-2 block rounded-xl bg-surface-2 p-3 text-[0.95rem]">
              <Gloss>{e.counter}</Gloss>
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function Dating() {
  const lens = useApp((s) => s.lens.hermeneutic)
  const d = dating
  const [off, setOff] = useState<Set<string>>(new Set())
  const [kind, setKind] = useState<'all' | 'external' | 'internal'>('all')
  const [side, setSide] = useState<'all' | 'early' | 'late'>('all')
  const totals = useMemo(() => {
    const r = { early: 0, late: 0 }
    d?.evidence.forEach((e) => !off.has(e.id) && (r[e.side] += e.weight))
    return r
  }, [d, off])
  if (!d) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const shown = d.evidence.filter((e) => (kind === 'all' || e.kind === kind) && (side === 'all' || e.side === side))
  const toggle = (id: string) => setOff((s) => (s.has(id) ? (s.delete(id), new Set(s)) : new Set(s.add(id))))
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Before or after AD 70?')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('When was Revelation written?')}
          </motion.h1>
          <Prose text={d.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <div className="leaf p-4">
          <Scale early={totals.early} late={totals.late} />
          <p className="mt-2 text-center text-xs text-ink-soft">{t('Every piece of evidence starts on the scale. Switch off what you find unpersuasive and watch it tip.')}</p>
          <div className="mt-2 flex justify-center gap-2">
            <button type="button" className="btn text-xs" onClick={() => setOff(new Set())}>
              {t('Count everything')}
            </button>
            <button type="button" className="btn text-xs" onClick={() => setOff(new Set(d.evidence.filter((e) => e.kind === 'internal').map((e) => e.id)))}>
              {t('Early-church witnesses only')}
            </button>
            <button type="button" className="btn text-xs" onClick={() => setOff(new Set(d.evidence.filter((e) => e.kind === 'external').map((e) => e.id)))}>
              {t('Internal evidence only')}
            </button>
          </div>
        </div>
      </section>

      <Section id="sides" title={t('The two dates')} lede={t('Who holds each date, and the case in brief.')}>
        <div className="grid gap-4 md:grid-cols-2">
          {d.sides.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, x: i ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="leaf glow-card p-5" style={{ borderTop: `5px solid ${SIDE_COLOR[s.id]}` }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SIDE_COLOR[s.id] }}>
                {s.date}
              </p>
              <h3 className="text-2xl font-bold">{s.label}</h3>
              <Prose text={s.summary} className="mt-2" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.scholars.map((x) => (
                  <span key={x} className="chip text-xs">
                    {x}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="evidence" title={t('Weigh the evidence')} lede={t('Each item gives the argument, its source and the strongest reply. Use the switches to decide what counts; the scale at the top follows you.')}>
        <div className="sticky top-16 z-10 mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-bg/85 p-2 backdrop-blur">
          {(['all', 'external', 'internal'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={`chip cursor-pointer ${kind === k ? 'border-accent text-accent' : ''}`}>
              {k === 'all' ? t('All evidence') : k === 'external' ? t('Early church witness') : t('Inside the book')}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-rule" />
          {(['all', 'early', 'late'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setSide(k)} className={`chip cursor-pointer ${side === k ? 'border-accent text-accent' : ''}`}>
              {k === 'all' ? t('Both sides') : k === 'early' ? t('Early') : t('Late')}
            </button>
          ))}
          <span className="ml-auto text-sm font-bold">
            <span style={{ color: SIDE_COLOR.early }}>{totals.early}</span> : <span style={{ color: SIDE_COLOR.late }}>{totals.late}</span>
          </span>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {shown.map((e) => (
            <EvidenceCard key={e.id} e={e} on={!off.has(e.id)} toggle={() => toggle(e.id)} />
          ))}
        </ul>
      </Section>

      <Section id="implications" title={t('What hangs on the date')} lede={t('For some views the date is decisive; for others it hardly matters.')}>
        <div className="leaf p-4">
          <ViewReadings readings={d.implications} initial={lens} />
        </div>
        <div className="leaf glow-card mt-4 p-5" style={{ borderLeft: '5px solid var(--gold-bright)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">{t('Where scholarship stands')}</p>
          <Prose text={d.verdict} className="mt-1" />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/olivet" className="btn btn-primary no-underline">
            <Icon name="compass" /> {t('Matthew 24 and AD 70')}
          </Link>
          <Link to="/josephus" className="btn no-underline">
            <Icon name="scroll" /> {t('Josephus: the fall of Jerusalem')}
          </Link>
          <Sources ids={d.sources} />
        </div>
      </Section>
    </div>
  )
}
