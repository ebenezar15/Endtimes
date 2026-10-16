import { refLabel } from '../lib/refLabel'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SignsStudy } from '../content/schema'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Sources } from '../components/Sources'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { signs } from '../lib/data/studies'

type Hist = SignsStudy['history'][number]
const KIND: Record<Hist['kind'], () => string> = {
  'date-setting': () => t('Date set'),
  identification: () => t('Identification'),
  movement: () => t('Movement'),
  sign: () => t('Sign read'),
}

/** Old predictions, one after another, each stamped as it expires. */
function StampWall({ items }: { items: Hist[] }) {
  const pick = useMemo(() => items.filter((h) => h.kind === 'date-setting').slice(-9), [items])
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= pick.length) return
    const id = setTimeout(() => setN(n + 1), 650)
    return () => clearTimeout(id)
  }, [n, pick.length])
  return (
    <button type="button" onClick={() => setN(0)} className="grid w-full grid-cols-3 gap-2" aria-label={t('Replay')}>
      {pick.map((h, i) => (
        <motion.div key={h.id} initial={{ opacity: 0, y: 14, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: (i % 3) - 1 }} transition={{ delay: i * 0.08 }} className="relative overflow-hidden rounded-lg bg-surface p-2 text-left shadow ring-1 ring-rule">
          <p className="font-serif text-2xl font-bold leading-none">{h.yearLabel}</p>
          <p className="mt-1 line-clamp-2 text-[0.65rem] leading-tight text-ink-soft">{h.who}</p>
          <AnimatePresence>
            {i < n && (
              <motion.span initial={{ scale: 2.2, opacity: 0, rotate: -24 }} animate={{ scale: 1, opacity: 0.92, rotate: -14 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }} className="absolute inset-x-1 top-1/3 rounded border-2 border-[var(--rubric)] px-1 text-center text-[0.6rem] font-black uppercase tracking-wider text-rubric">
                {t('Did not happen')}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </button>
  )
}

/** A card that turns over: the claim on the front, what happened on the back. */
function FlipCard({ h }: { h: Hist }) {
  const [flip, setFlip] = useState(false)
  return (
    <button type="button" onClick={() => setFlip((f) => !f)} aria-pressed={flip} className="relative block w-full text-left [perspective:1000px]">
      <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }} className="relative grid [transform-style:preserve-3d]">
        <div className="leaf col-start-1 row-start-1 p-4 [backface-visibility:hidden]">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
            <span>{h.yearLabel}</span>
            <span className="chip py-0 text-[0.65rem] normal-case tracking-normal">{KIND[h.kind]()}</span>
          </p>
          <p className="mt-1 font-bold">{h.who}</p>
          <p className="mt-1 text-[0.95rem]">
            <Gloss>{h.claim}</Gloss>
          </p>
          <p className="mt-2 text-xs text-ink-soft">
            <span className="font-bold">{t('Basis:')} </span>
            {h.basis}
          </p>
          <p className="mt-2 text-xs font-bold text-accent">{t('Turn over: what happened →')}</p>
        </div>
        <div className="leaf col-start-1 row-start-1 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ borderTop: '4px solid var(--rubric)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('What happened')}</p>
          <p className="mt-1 text-[0.95rem]">
            <Gloss>{h.outcome}</Gloss>
          </p>
          <p className="mt-2 rounded-lg bg-surface-2 p-2 text-sm">
            <span className="font-bold">{t('Lesson:')} </span>
            <Gloss>{h.lesson}</Gloss>
          </p>
        </div>
      </motion.div>
    </button>
  )
}

/** The recurring cycle, drawn as a wheel with a pointer that walks round it. */
function Cycle({ steps }: { steps: SignsStudy['cycle'] }) {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const id = setTimeout(() => setI((i + 1) % steps.length), 2600)
    return () => clearTimeout(id)
  }, [auto, i, steps.length])
  const R = 120
  const pts = steps.map((_, k) => {
    const a = (k / steps.length) * Math.PI * 2 - Math.PI / 2
    return { x: 160 + Math.cos(a) * R, y: 160 + Math.sin(a) * R, a }
  })
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <svg viewBox="0 0 320 320" className="mx-auto h-auto w-full max-w-sm" role="group" aria-label={t('The cycle of end-time predictions')}>
        <circle cx={160} cy={160} r={R} fill="none" stroke="var(--rule)" strokeWidth={3} strokeDasharray="6 8" />
        <motion.circle cx={160} cy={160} r={R} fill="none" stroke="var(--rubric)" strokeWidth={3} strokeLinecap="round" animate={{ pathLength: (i + 1) / steps.length }} transition={{ type: 'spring', stiffness: 60, damping: 16 }} style={{ rotate: -90, transformOrigin: '160px 160px' }} />
        <motion.line x1={160} y1={160} stroke="var(--gold-bright)" strokeWidth={3} strokeLinecap="round" animate={{ x2: 160 + Math.cos(pts[i].a) * (R - 26), y2: 160 + Math.sin(pts[i].a) * (R - 26) }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} />
        <circle cx={160} cy={160} r={8} fill="var(--gold-bright)" />
        {pts.map((p, k) => (
          <g key={k} className="cursor-pointer" onClick={() => (setI(k), setAuto(false))}>
            <motion.circle cx={p.x} cy={p.y} animate={{ r: k === i ? 24 : 18 }} fill={k === i ? 'var(--rubric)' : 'var(--surface)'} stroke="var(--rubric)" strokeWidth={2.5} />
            <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill={k === i ? 'var(--surface)' : 'var(--rubric)'} pointerEvents="none">
              {k + 1}
            </text>
          </g>
        ))}
      </svg>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="leaf p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('Step {n} of {total}', { n: i + 1, total: steps.length })}</p>
          <h3 className="text-xl font-bold">{steps[i].title}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{steps[i].text}</Gloss>
          </p>
          <button type="button" className="btn mt-3 text-sm" onClick={() => setAuto((a) => !a)}>
            <Icon name={auto ? 'pause' : 'play'} size={13} /> {auto ? t('Pause') : t('Play')}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const TABS = [
  { key: 'claim', label: () => t('The claim'), color: 'var(--accent)' },
  { key: 'argument', label: () => t('The argument'), color: 'var(--accent)' },
  { key: 'criticism', label: () => t('The criticism'), color: 'var(--rubric)' },
  { key: 'response', label: () => t('The response'), color: 'var(--gold)' },
  { key: 'verdict', label: () => t('Where it stands'), color: 'var(--agree)' },
] as const

/** Modern claims as a debate: claim, best argument, criticism, response and an even-handed verdict. */
function Debates({ items }: { items: SignsStudy['modern'] }) {
  const [id, setId] = useState(items[0]?.id)
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('claim')
  const m = items.find((x) => x.id === id) ?? items[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <ul className="scroll-x flex gap-1.5 lg:flex-col">
        {items.map((x) => (
          <li key={x.id} className="shrink-0">
            <button type="button" onClick={() => (setId(x.id), setTab('claim'))} aria-current={x.id === m.id} className={`w-52 rounded-xl px-3 py-2 text-left text-sm lg:w-full ${x.id === m.id ? 'bg-accent text-[var(--accent-ink)]' : 'hover:bg-surface-2'}`}>
              <span className="block font-semibold leading-snug">{x.title}</span>
              <span className="block text-xs opacity-80">{x.period}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{m.period}</p>
          <h3 className="text-2xl font-bold">{m.title}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            <span className="font-bold">{t('Proponents:')} </span>
            {m.proponents}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5" role="tablist">
            {TABS.map((tb) => (
              <button key={tb.key} type="button" role="tab" aria-selected={tab === tb.key} onClick={() => setTab(tb.key)} className="relative rounded-lg px-3 py-1.5 text-sm font-semibold">
                {tab === tb.key && <motion.span layoutId="debate-tab" className="absolute inset-0 rounded-lg" style={{ background: tb.color }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className={`relative ${tab === tb.key ? 'text-[var(--surface)]' : ''}`}>{tb.label()}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3 rounded-xl bg-surface-2 p-4 leading-relaxed" style={{ borderLeft: `4px solid ${TABS.find((x) => x.key === tab)!.color}` }}>
              <Gloss>{m[tab]}</Gloss>
            </motion.div>
          </AnimatePresence>
          {m.refs.length > 0 && <p className="mt-3 text-sm text-ink-soft">{refLabel(m.refs.join('; '))}</p>}
          <div className="mt-2">
            <Sources ids={m.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Signs() {
  const [kind, setKind] = useState<'all' | Hist['kind']>('all')
  if (!signs) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const s = signs
  const hist = [...s.history].sort((a, b) => a.year - b.year).filter((h) => kind === 'all' || h.kind === kind)
  const dated = s.history.filter((h) => h.kind === 'date-setting').length
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Prophecy and the newspaper')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Signs of the times')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="chip">{t('{n} claims across church history', { n: s.history.length })}</span>
            <span className="chip">{t('{n} specific dates set', { n: dated })}</span>
            <span className="chip">{t('{n} modern claims weighed', { n: s.modern.length })}</span>
          </div>
        </div>
        <div className="leaf p-4">
          <StampWall items={s.history} />
          <p className="mt-2 text-center text-xs text-ink-soft">{t('Dates set for the end, stamped as they passed · tap to replay')}</p>
        </div>
      </section>

      <Section id="history" title={t('“The end is near”: two thousand years of predictions')} lede={t('Every generation has had its signs. Turn each card over to see what happened and what it teaches.')}>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(['all', 'date-setting', 'identification', 'movement', 'sign'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={`chip cursor-pointer ${kind === k ? 'border-accent text-accent' : ''}`}>
              {k === 'all' ? t('Everything') : KIND[k]()}
            </button>
          ))}
        </div>
        <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hist.map((h, i) => (
            <motion.li key={h.id} layout initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: (i % 3) * 0.06 }}>
              <FlipCard h={h} />
            </motion.li>
          ))}
        </ol>
      </Section>

      <Section id="cycle" title={t('Why it keeps happening')} lede={t('The same cycle recurs in almost every century. Follow it round.')}>
        <Cycle steps={s.cycle} />
      </Section>

      <Section id="modern" title={t('Modern events read as fulfilment')} lede={t('The claims made by dispensational and other premillennial writers, the strongest case for each, the criticism, their response, and where the debate stands.')}>
        <Debates items={s.modern} />
      </Section>

      <Section id="steelman" title={t('The best case for watching the signs')} lede={t('In fairness, here is the case as its proponents would make it.')}>
        <div className="leaf glow-card p-5" style={{ borderLeft: '5px solid var(--accent)' }}>
          <Prose text={s.steelman} />
        </div>
      </Section>

      <Section id="principles" title={t('Guard-rails for reading prophecy')} lede={t('Principles drawn from Scripture that every view can affirm.')}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.principles.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="leaf glow-card p-5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface-2 font-bold text-accent ring-1 ring-rule">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-[0.95rem] text-ink-soft">
                <Gloss>{p.text}</Gloss>
              </p>
              {p.refs.length > 0 && <p className="mt-2 text-xs text-ink-soft">{refLabel(p.refs.join('; '))}</p>}
            </motion.li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/olivet" className="btn btn-primary no-underline">
            <Icon name="compass" /> {t('Matthew 24 and AD 70')}
          </Link>
          <Link to="/dating" className="btn no-underline">
            <Icon name="scales" /> {t('When was Revelation written?')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
