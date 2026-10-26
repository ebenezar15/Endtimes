import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { NewCreationStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'
import { Refs } from '../Refs'

type N = NewCreationStudy

/* ---------- Hero: the old heavens roll up like a scroll; a new heaven and earth unfold ---------- */

export function ScrollHero() {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setPhase((p) => (p + 1) % 3), phase === 2 ? 4200 : 2600)
    return () => clearTimeout(id)
  }, [phase])
  const stars = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ x: 20 + ((i * 97) % 360), y: 14 + ((i * 53) % 110), r: 0.8 + (i % 3) * 0.6 })), [])
  const caption = [
    [t('“In the beginning God created the heaven and the earth”'), 'Genesis 1:1'],
    [t('“The heavens shall be rolled together as a scroll”'), 'Isaiah 34:4'],
    [t('“I saw a new heaven and a new earth”'), 'Revelation 21:1'],
  ][phase]
  return (
    <button type="button" onClick={() => setPhase((p) => (p + 1) % 3)} className="block w-full text-left" aria-label={`${caption[0]} (${refLabel(caption[1])})`}>
      <svg viewBox="0 0 400 240" className="h-auto w-full overflow-hidden rounded-2xl">
        <defs>
          <linearGradient id="nc-sky-old" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e1b4b" />
            <stop offset="1" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="nc-sky-new" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="1" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
        <rect width={400} height={240} fill="url(#nc-sky-new)" />
        <motion.g initial={false} animate={{ scaleY: phase === 1 ? 0.04 : phase === 2 ? 0 : 1, opacity: phase === 2 ? 0 : 1 }} transition={{ duration: 1.4, ease: [0.6, 0, 0.3, 1] }} style={{ transformOrigin: '200px 0px' }}>
          <rect width={400} height={170} fill="url(#nc-sky-old)" />
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.85} />
          ))}
          <circle cx={330} cy={46} r={16} fill="#f1f5f9" opacity={0.9} />
        </motion.g>
        <motion.rect initial={false} animate={{ y: phase === 1 ? 2 : -20, opacity: phase === 1 ? 1 : 0 }} transition={{ duration: 1.2 }} x={10} width={380} height={14} rx={7} fill="#d6b77a" stroke="#92400e" />
        <motion.g initial={false} animate={{ opacity: phase === 2 ? 1 : 0, scale: phase === 2 ? 1 : 0.6 }} transition={{ duration: 1.2, delay: phase === 2 ? 0.4 : 0 }} style={{ transformOrigin: '200px 110px' }}>
          <circle cx={200} cy={92} r={34} fill="#fff7d6" opacity={0.9} />
          <path d="M150 150 L150 112 L170 96 L190 112 L190 150 Z M210 150 L210 104 L230 86 L250 104 L250 150 Z" fill="#fef3c7" stroke="#b45309" strokeWidth={1.5} />
          <text x={200} y={96} textAnchor="middle" fontSize={11} fontWeight={800} fill="#92400e">
            {t('New Jerusalem')}
          </text>
        </motion.g>
        <motion.rect initial={false} animate={{ fill: phase === 0 ? '#3f6212' : phase === 1 ? '#57534e' : '#65a30d' }} transition={{ duration: 1 }} y={170} width={400} height={70} />
        <text x={200} y={226} textAnchor="middle" fontSize={11} fill="#fff" opacity={0.85}>
          {refLabel(caption[1])}
        </text>
      </svg>
      <AnimatePresence mode="wait">
        <motion.p key={phase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-center font-serif text-lg italic">
          {caption[0]}
        </motion.p>
      </AnimatePresence>
    </button>
  )
}

/* ---------- The views of "heaven and earth" ---------- */

const VIEW_HUE = ['#15803d', '#be123c', '#0f766e', '#7c3aed', '#b45309', '#1d4ed8', '#0e7490']

export function Views({ views }: { views: N['views'] }) {
  const [sel, setSel] = useState(views[0]?.id)
  const v = views.find((x) => x.id === sel) ?? views[0]
  const i = views.indexOf(v)
  return (
    <div className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <ul className="space-y-1.5">
        {views.map((x, k) => (
          <li key={x.id}>
            <button type="button" onClick={() => setSel(x.id)} aria-pressed={x.id === v.id} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${x.id === v.id ? 'text-white' : 'hover:bg-surface-2'}`} style={x.id === v.id ? { background: VIEW_HUE[k % VIEW_HUE.length] } : undefined}>
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: VIEW_HUE[k % VIEW_HUE.length] }}>
                {k + 1}
              </span>
              <span className="font-semibold leading-snug">{x.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={v.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="leaf min-w-0 p-5" style={{ borderTop: `5px solid ${VIEW_HUE[i % VIEW_HUE.length]}` }}>
          <h3 className="text-2xl font-bold">{v.name}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{v.summary}</Gloss>
          </p>
          <p className="mt-3 rounded-xl bg-surface-2 p-3 font-serif text-lg italic" style={{ borderLeft: `4px solid ${VIEW_HUE[i % VIEW_HUE.length]}` }}>
            <Gloss>{v.keyClaim}</Gloss>
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-surface-2 p-3" style={{ borderTop: '3px solid #15803d' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#15803d]">{t('Strengths')}</p>
              <p className="mt-1 text-[0.95rem]">
                <Gloss>{v.strengths}</Gloss>
              </p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3" style={{ borderTop: '3px solid #be123c' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#be123c]">{t('Weaknesses')}</p>
              <p className="mt-1 text-[0.95rem]">
                <Gloss>{v.weaknesses}</Gloss>
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm">
            <span className="font-bold">{t('Held by:')} </span>
            {v.holders}
          </p>
          <Refs refs={v.texts} className="mt-3" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- The tabernacle as a small cosmos ---------- */

export function Tabernacle({ parts }: { parts: N['tabernacle'] }) {
  const [sel, setSel] = useState<N['tabernacle'][number]['id']>('most-holy')
  const p = parts.find((x) => x.id === sel) ?? parts[0]
  const zone = (id: N['tabernacle'][number]['id']) => ({
    onClick: () => setSel(id),
    role: 'button',
    tabIndex: 0,
    'aria-pressed': sel === id,
    'aria-label': parts.find((x) => x.id === id)?.name,
    onKeyDown: (e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && setSel(id),
    className: 'cursor-pointer outline-none',
  })
  const on = (id: string) => (sel === id ? 1 : 0.45)
  return (
    <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 420 240" className="h-auto w-full" aria-label={t('The tabernacle in three parts')}>
        <g {...zone('court')}>
          <motion.rect x={10} y={20} width={400} height={200} rx={8} fill="#a16207" animate={{ opacity: on('court') }} />
          <text x={60} y={44} fontSize={12} fontWeight={800} fill="#fff">
            {parts.find((x) => x.id === 'court')?.name}
          </text>
          <rect x={300} y={98} width={24} height={44} rx={3} fill="#78350f" />
          <circle cx={340} cy={120} r={11} fill="#cbd5e1" />
        </g>
        <g {...zone('holy')}>
          <motion.rect x={70} y={70} width={160} height={100} fill="#0e7490" animate={{ opacity: on('holy') }} stroke="#fff" strokeWidth={2} />
          <text x={150} y={92} textAnchor="middle" fontSize={11.5} fontWeight={800} fill="#fff">
            {parts.find((x) => x.id === 'holy')?.name}
          </text>
          <path d="M110 152 V116 M96 116 Q96 132 110 132 Q124 132 124 116 M102 116 Q102 127 110 127 Q118 127 118 116 M101 152 H119" stroke="#fde68a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </g>
        <g {...zone('most-holy')}>
          <motion.rect x={30} y={70} width={40} height={100} fill="#4c1d95" animate={{ opacity: on('most-holy') }} stroke="#fff" strokeWidth={2} />
          <motion.circle cx={50} cy={120} r={9} fill="#fde68a" animate={{ scale: sel === 'most-holy' ? [1, 1.4, 1] : 1 }} transition={{ repeat: Infinity, duration: 2 }} style={{ transformOrigin: '50px 120px' }} />
        </g>
        <text x={50} y={190} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
          {t('west')}
        </text>
        <text x={380} y={190} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
          {t('east · entrance')}
        </text>
      </svg>
      <AnimatePresence mode="wait">
        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{p.name}</p>
          <h3 className="mt-1 text-xl font-bold">{p.represents}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{p.text}</Gloss>
          </p>
          {p.refs.length > 0 && <Refs refs={p.refs} className="mt-3" />}
          <p className="mt-3 text-xs text-ink-soft">{t('Tap a part of the tabernacle to read it.')}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Creation echoes: Genesis words reused when God forms, judges or remakes his people ---------- */

export function Echoes({ items }: { items: N['echoes'] }) {
  const [i, setI] = useState(0)
  const e = items[i]
  return (
    <div>
      <div className="scroll-x flex gap-1.5 pb-1">
        {items.map((x, k) => (
          <button key={x.id} type="button" onClick={() => setI(k)} className={`chip shrink-0 cursor-pointer ${k === i ? 'border-accent bg-accent text-[var(--accent-ink)]' : ''}`}>
            {x.theme}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 grid items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
          <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="leaf p-4" style={{ borderTop: '4px solid #b45309' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-[#b45309]">{refLabel(e.genesis)}</p>
            <p className="mt-1 font-serif text-xl italic">“{e.genesisPhrase}”</p>
          </motion.div>
          <div className="flex items-center justify-center" aria-hidden>
            <motion.svg viewBox="0 0 48 48" className="size-12 rotate-90 sm:rotate-0">
              <motion.path d="M6 24 H40 M30 14 L40 24 L30 34" fill="none" stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
            </motion.svg>
          </div>
          <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="leaf p-4" style={{ borderTop: '4px solid var(--accent)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(e.echo)}</p>
            <p className="mt-1 font-serif text-xl italic">“{e.echoPhrase}”</p>
          </motion.div>
          <p className="rounded-xl bg-surface-2 p-3 leading-relaxed sm:col-span-3">
            <Gloss>{e.note}</Gloss>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Atlas: every "heaven and earth" passage, placed through the canon ---------- */

const KIND: Record<N['atlas'][number]['kind'], { label: () => string; color: string }> = {
  creation: { label: () => t('Creation'), color: '#15803d' },
  witness: { label: () => t('Called as witness'), color: '#b45309' },
  praise: { label: () => t('Called to praise'), color: '#0e7490' },
  judgment: { label: () => t('Shaken in judgment'), color: '#be123c' },
  people: { label: () => t('Pictures God’s people'), color: '#7c3aed' },
  passing: { label: () => t('Passing away'), color: '#57534e' },
  new: { label: () => t('New heavens and earth'), color: '#1d4ed8' },
}
const CANON = ['Genesis', 'Exodus', 'Deuteronomy', 'Job', 'Psalms', 'Ecclesiastes', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Hosea', 'Joel', 'Haggai', 'Matthew', 'Luke', 'Acts', 'Romans', 'Hebrews', '2 Peter', 'Revelation']

export function Atlas({ items }: { items: N['atlas'] }) {
  const [kind, setKind] = useState<'all' | N['atlas'][number]['kind']>('all')
  const [sel, setSel] = useState(items[0]?.id)
  const [lens, setLens] = useState<'covenantal' | 'physical'>('covenantal')
  const book = (r: string) => r.replace(/\s+\d+.*$/, '')
  const books = useMemo(() => {
    const seen = [...new Set(items.map((x) => book(x.ref)))]
    return seen.sort((a, b) => (CANON.indexOf(a) + 1 || 99) - (CANON.indexOf(b) + 1 || 99))
  }, [items])
  const x = items.find((y) => y.id === sel) ?? items[0]
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setKind('all')} className={`chip cursor-pointer ${kind === 'all' ? 'border-accent text-accent' : ''}`}>
          {t('All {n}', { n: items.length })}
        </button>
        {Object.entries(KIND).map(([k, v]) => (
          <button key={k} type="button" onClick={() => setKind(k as typeof kind)} className="chip cursor-pointer gap-1.5" style={kind === k ? { borderColor: v.color, color: v.color } : undefined}>
            <span className="size-2.5 rounded-full" style={{ background: v.color }} /> {v.label()}
          </button>
        ))}
      </div>
      <div className="leaf mt-4 overflow-hidden p-3">
        <div className="scroll-x">
          <div className="flex min-w-max gap-1 sm:min-w-0">
            {books.map((bk) => (
              <div key={bk} className="flex w-14 flex-col items-center gap-1 sm:w-auto sm:min-w-0 sm:flex-1">
                <div className="flex min-h-24 flex-col-reverse items-center gap-1">
                  {items
                    .filter((y) => book(y.ref) === bk)
                    .map((y) => {
                      const dim = kind !== 'all' && y.kind !== kind
                      return (
                        <motion.button key={y.id} type="button" onClick={() => setSel(y.id)} title={refLabel(y.ref)} aria-label={refLabel(y.ref)} whileHover={{ scale: 1.25 }} animate={{ opacity: dim ? 0.2 : 1, scale: y.id === x.id ? 1.3 : 1 }} className="size-5 rounded-full border-2 border-[var(--surface)] shadow" style={{ background: KIND[y.kind].color }} />
                      )
                    })}
                </div>
                <span className="text-center text-[0.65rem] leading-tight text-ink-soft">{refLabel(bk + ' 1').replace(/\s*1$/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs text-ink-soft">{t('Each dot is a passage, placed by book from Genesis to Revelation. Tap one.')}</p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={x.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-5" style={{ borderTop: `5px solid ${KIND[x.kind].color}` }}>
          <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: KIND[x.kind].color }}>
            {refLabel(x.ref)} · {KIND[x.kind].label()}
          </p>
          <p className="mt-1 font-serif text-xl italic">“{x.phrase}”</p>
          <div className="mt-3 grid grid-cols-2 rounded-xl bg-surface-2 p-1 text-xs font-bold sm:max-w-sm" role="tablist">
            {(['covenantal', 'physical'] as const).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={lens === k} onClick={() => setLens(k)} className="relative rounded-lg px-2 py-1.5">
                {lens === k && <motion.span layoutId="atlas-lens" className="absolute inset-0 rounded-lg bg-accent" />}
                <span className={`relative ${lens === k ? 'text-[var(--accent-ink)]' : ''}`}>{k === 'covenantal' ? t('Covenantal reading') : t('Physical reading')}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={lens} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 leading-relaxed">
              <Gloss>{x[lens]}</Gloss>
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Covenant worlds: from Eden to the new Jerusalem, read through two lenses ---------- */

export function Worlds({ items }: { items: N['worlds'] }) {
  const [i, setI] = useState(0)
  const [lens, setLens] = useState<'covenantal' | 'traditional'>('covenantal')
  const w = items[i]
  return (
    <div>
      <div className="scroll-x pb-2">
        <ol className="flex min-w-max items-center gap-0 px-1">
          {items.map((x, k) => (
            <li key={x.id} className="flex items-center">
              <button type="button" onClick={() => setI(k)} aria-current={k === i} className="flex w-24 flex-col items-center gap-1 text-center">
                <motion.span className="inline-flex items-center justify-center rounded-full font-bold text-white shadow" animate={{ width: k === i ? 40 : 30, height: k === i ? 40 : 30, background: k <= i ? 'var(--accent)' : 'var(--ink-soft)' }}>
                  {k + 1}
                </motion.span>
                <span className={`text-[0.7rem] leading-tight ${k === i ? 'font-bold' : 'text-ink-soft'}`}>{x.label}</span>
              </button>
              {k < items.length - 1 && <span className="mb-6 h-0.5 w-4 bg-[var(--rule)]" aria-hidden />}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-2 grid grid-cols-2 rounded-xl bg-surface-2 p-1 text-xs font-bold sm:max-w-sm" role="tablist">
        {(['covenantal', 'traditional'] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={lens === k} onClick={() => setLens(k)} className="relative rounded-lg px-2 py-1.5">
            {lens === k && <motion.span layoutId="worlds-lens" className="absolute inset-0 rounded-lg bg-accent" />}
            <span className={`relative ${lens === k ? 'text-[var(--accent-ink)]' : ''}`}>{k === 'covenantal' ? t('Covenantal lens') : t('Traditional lens')}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={w.id + lens} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-3 p-5" style={{ borderLeft: '5px solid var(--accent)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            {w.era} · {refLabel(w.ref)}
          </p>
          <h3 className="mt-1 text-xl font-bold">{w.label}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{w[lens]}</Gloss>
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
              ← {t('Previous')}
            </button>
            <button type="button" className="btn btn-primary" disabled={i === items.length - 1} onClick={() => setI(i + 1)}>
              {t('Next')} →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Word studies ---------- */

export function Words({ items }: { items: N['words'] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((w, i) => (
        <motion.li key={w.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.07 }} className="leaf p-4">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-serif text-2xl font-bold">{w.script}</span>
            <span className="font-serif italic text-ink-soft">{w.term}</span>
          </p>
          <p className="mt-1 text-sm font-bold text-accent">{w.meaning}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed">
            <Gloss>{w.note}</Gloss>
          </p>
          {w.refs.length > 0 && <p className="mt-2 text-xs text-ink-soft">{refLabel(w.refs.join('; '))}</p>}
        </motion.li>
      ))}
    </ul>
  )
}

/* ---------- Isaiah 65–66 beside Revelation 21–22 ---------- */

export function Bridge({ items }: { items: N['parallels'] }) {
  const [sel, setSel] = useState<number | null>(null)
  return (
    <div className="leaf overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] gap-2 border-b border-rule bg-surface-2 p-3 text-center text-xs font-bold uppercase tracking-widest">
        <span className="text-[#b45309]">{refLabel('Isaiah 65')}</span>
        <span className="text-ink-soft">{t('Theme')}</span>
        <span className="text-accent">{refLabel('Revelation 21')}</span>
      </div>
      <ul>
        {items.map((p, k) => (
          <li key={k} className="border-b border-rule last:border-0">
            <button type="button" onClick={() => setSel(sel === k ? null : k)} aria-expanded={sel === k} className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] items-center gap-2 p-3 text-center text-sm hover:bg-surface-2">
              <span className="font-semibold text-[#b45309]">{refLabel(p.isaiah)}</span>
              <span className="relative font-bold">
                <motion.span className="absolute left-0 right-0 top-1/2 -z-0 h-0.5 origin-center bg-gradient-to-r from-[#b45309] to-[var(--accent)] opacity-30" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: k * 0.06 }} />
                <span className="relative bg-[var(--surface)] px-1">{p.theme}</span>
              </span>
              <span className="font-semibold text-accent">{refLabel(p.revelation)}</span>
            </button>
            <AnimatePresence initial={false}>
              {sel === k && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-3 text-[0.95rem] leading-relaxed">
                  <Gloss>{p.note}</Gloss>
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
      <p className="flex items-center gap-1 p-3 text-xs text-ink-soft">
        <Icon name="eye" size={13} /> {t('Tap a row to read how the two passages connect.')}
      </p>
    </div>
  )
}
