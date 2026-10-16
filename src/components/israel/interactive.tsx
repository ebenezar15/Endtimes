import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { IsraelStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon, type IconName } from '../Icon'
import { Refs } from '../Refs'
import { Sources } from '../Sources'

type S = IsraelStudy
type Camp = 'fulfilment' | 'future'
export const CAMP_COLOR: Record<Camp, string> = { fulfilment: 'var(--accent)', future: 'var(--rubric)' }
export const campLabel = (c: Camp) => (c === 'fulfilment' ? t('Fulfilment in Christ') : t('A future for national Israel'))

/** Tabs whose bodies swap with a sliding highlight. */
function Tabs<K extends string>({ tabs, value, onChange, id }: { tabs: { key: K; label: string; color?: string }[]; value: K; onChange: (k: K) => void; id: string }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {tabs.map((tb) => (
        <button key={tb.key} type="button" role="tab" aria-selected={value === tb.key} onClick={() => onChange(tb.key)} className="relative rounded-lg px-3 py-1.5 text-sm font-semibold">
          {value === tb.key && <motion.span layoutId={id} className="absolute inset-0 rounded-lg" style={{ background: tb.color ?? 'var(--accent)' }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
          <span className={`relative ${value === tb.key ? 'text-[var(--surface)]' : ''}`}>{tb.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ---------- The camps: a spectrum you can walk along, and a two-view comparison ---------- */

const CAMP_ROWS = [
  { key: 'israel', label: () => t('Who is Israel?') },
  { key: 'land', label: () => t('The land') },
  { key: 'kingdom', label: () => t('The kingdom') },
  { key: 'modernState', label: () => t('The modern state') },
  { key: 'romans11', label: () => t('Romans 11') },
] as const

export function CampSpectrum({ camps }: { camps: S['camps'] }) {
  const [a, setA] = useState(camps[0]?.id)
  const [b, setB] = useState<string | undefined>(undefined)
  const ca = camps.find((c) => c.id === a) ?? camps[0]
  const cb = camps.find((c) => c.id === b)
  const idx = camps.indexOf(ca)
  return (
    <div>
      <div className="relative">
        <div className="mx-2 h-3 rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--gold), var(--rubric))' }} aria-hidden />
        <motion.span aria-hidden className="absolute -top-1.5 size-6 rounded-full border-4 border-[var(--surface)] bg-[var(--ink)] shadow" animate={{ left: `calc(${(idx / Math.max(1, camps.length - 1)) * 100}% * 0.96)` }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} />
        <div className="mt-2 flex justify-between text-xs font-bold uppercase tracking-widest">
          <span className="text-accent">{t('Fulfilled in Christ')}</span>
          <span className="text-rubric">{t('Future national Israel')}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {camps.map((c) => {
          const on = c.id === ca.id
          const two = c.id === b
          return (
            <button key={c.id} type="button" onClick={() => (setA(c.id), c.id === b && setB(undefined))} aria-pressed={on} className={`rounded-xl p-3 text-left text-sm ring-1 transition ${on ? 'text-[var(--surface)] ring-transparent' : 'ring-rule hover:bg-surface-2'}`} style={on ? { background: CAMP_COLOR[c.family] } : two ? { boxShadow: `inset 0 0 0 2px ${CAMP_COLOR[c.family]}` } : undefined}>
              <span className="block font-bold leading-snug">{c.name}</span>
              <span className="mt-0.5 block text-xs opacity-80">{campLabel(c.family)}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-ink-soft">{t('Compare with:')}</span>
          <select className="rounded-lg bg-surface-2 px-2 py-1.5 ring-1 ring-rule" value={b ?? ''} onChange={(e) => setB(e.target.value || undefined)}>
            <option value="">{t('(none)')}</option>
            {camps
              .filter((c) => c.id !== ca.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </label>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={ca.id + (cb?.id ?? '')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
          {!cb ? (
            <div className="leaf p-5" style={{ borderTop: `5px solid ${CAMP_COLOR[ca.family]}` }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: CAMP_COLOR[ca.family] }}>
                {campLabel(ca.family)}
              </p>
              <h3 className="text-2xl font-bold">{ca.name}</h3>
              <p className="mt-2 leading-relaxed">
                <Gloss>{ca.summary}</Gloss>
              </p>
              <dl className="mt-4 grid gap-3 md:grid-cols-2">
                {CAMP_ROWS.map((r) => (
                  <div key={r.key} className="rounded-xl bg-surface-2 p-3">
                    <dt className="text-xs font-bold uppercase tracking-widest text-ink-soft">{r.label()}</dt>
                    <dd className="mt-1 text-[0.95rem]">
                      <Gloss>{ca[r.key]}</Gloss>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm">
                <span className="font-bold">{t('Representative scholars:')} </span>
                {ca.scholars.join(' · ')}
              </p>
              <Refs refs={ca.keyTexts} className="mt-3" />
              <div className="mt-2">
                <Sources ids={ca.sources} />
              </div>
            </div>
          ) : (
            <div className="leaf overflow-hidden">
              <div className="grid grid-cols-2">
                {[ca, cb].map((c) => (
                  <div key={c.id} className="p-3 text-[var(--surface)]" style={{ background: CAMP_COLOR[c.family] }}>
                    <p className="font-bold leading-snug">{c.name}</p>
                  </div>
                ))}
              </div>
              {CAMP_ROWS.map((r) => (
                <div key={r.key} className="border-t border-rule">
                  <p className="bg-surface-2 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink-soft">{r.label()}</p>
                  <div className="grid grid-cols-2 divide-x divide-[var(--rule)]">
                    {[ca, cb].map((c) => (
                      <p key={c.id} className="p-3 text-sm leading-relaxed">
                        <Gloss>{c[r.key]}</Gloss>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Promise tracker ---------------------------------------------------------- */

export const CATEGORY: Record<S['promises'][number]['category'], { label: () => string; icon: IconName }> = {
  land: { label: () => t('Land'), icon: 'compass' },
  seed: { label: () => t('Seed'), icon: 'star' },
  nation: { label: () => t('Nation'), icon: 'layers' },
  throne: { label: () => t('Throne'), icon: 'crown' },
  temple: { label: () => t('Temple'), icon: 'lamp' },
  return: { label: () => t('Return'), icon: 'arrow' },
  'new-covenant': { label: () => t('New covenant'), icon: 'scroll' },
  nations: { label: () => t('Nations'), icon: 'sparkles' },
  zion: { label: () => t('Zion'), icon: 'omega' },
  people: { label: () => t('People'), icon: 'book' },
}
const STAGE: Record<S['promises'][number]['path'][number]['phase'], { label: () => string; color: string }> = {
  promise: { label: () => t('Promise'), color: '#ca8a04' },
  type: { label: () => t('Shadow'), color: '#7c3aed' },
  christ: { label: () => t('Christ'), color: '#be123c' },
  church: { label: () => t('Church'), color: '#0f766e' },
  consummation: { label: () => t('New creation'), color: '#1d4ed8' },
}
const PROMISE_TABS = [
  { key: 'history', label: () => t('History & context'), color: '#b45309' },
  { key: 'toUs', label: () => t('What it means for us'), color: '#0f766e' },
  { key: 'futurist', label: () => t('The future-Israel reading'), color: 'var(--rubric)' },
  { key: 'reply', label: () => t('Fulfilment reply'), color: 'var(--accent)' },
  { key: 'rejoinder', label: () => t('Their answer'), color: 'var(--rubric)' },
] as const

/** One promise's journey: stations light up in turn, joined by a growing line. */
function Journey({ p }: { p: S['promises'][number] }) {
  return (
    <div className="relative">
      <div className="absolute bottom-3 left-5 top-3 w-1 rounded-full bg-surface-2" aria-hidden />
      <motion.div key={p.id} className="absolute bottom-3 left-5 top-3 w-1 origin-top rounded-full bg-gradient-to-b from-[#ca8a04] via-[#be123c] to-[#1d4ed8]" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3 * p.path.length, ease: 'linear' }} aria-hidden />
      <ol className="relative grid gap-3">
        {p.path.map((s, i) => (
          <motion.li key={p.id + i} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 * i }} className="relative flex gap-3">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 * i, type: 'spring', stiffness: 300 }} className="relative z-[1] inline-flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-white shadow ring-4 ring-[var(--surface)]" style={{ background: STAGE[s.phase].color }}>
              {i + 1}
            </motion.span>
            <div className="min-w-0 flex-1 rounded-xl bg-surface-2 p-3">
              <p className="flex flex-wrap items-baseline gap-x-2 text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: STAGE[s.phase].color }}>
                {STAGE[s.phase].label()} <span className="text-sm normal-case tracking-normal text-[var(--ink)]">{refLabel(s.ref)}</span>
              </p>
              <p className="mt-1 text-[0.95rem] leading-relaxed">
                <Gloss>{s.text}</Gloss>
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

export function PromiseTracker({ promises }: { promises: S['promises'] }) {
  const cats = useMemo(() => [...new Set(promises.map((p) => p.category))], [promises])
  const [cat, setCat] = useState<'all' | (typeof cats)[number]>('all')
  const list = promises.filter((p) => cat === 'all' || p.category === cat)
  const [id, setId] = useState(promises[0]?.id)
  const p = list.find((x) => x.id === id) ?? list[0]
  const [tab, setTab] = useState<(typeof PROMISE_TABS)[number]['key']>('history')
  if (!p) return null
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setCat('all')} className={`chip cursor-pointer ${cat === 'all' ? 'border-accent text-accent' : ''}`}>
          {t('All {n}', { n: promises.length })}
        </button>
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} className={`chip cursor-pointer gap-1 ${cat === c ? 'border-accent text-accent' : ''}`}>
            <Icon name={CATEGORY[c].icon} size={13} /> {CATEGORY[c].label()} · {promises.filter((x) => x.category === c).length}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <ul className="scroll-x flex gap-1.5 lg:max-h-[46rem] lg:flex-col lg:overflow-y-auto">
          {list.map((x) => (
            <li key={x.id} className="shrink-0">
              <button type="button" onClick={() => (setId(x.id), setTab('history'))} aria-current={x.id === p.id} className={`flex w-56 items-start gap-2 rounded-xl px-3 py-2 text-left text-sm lg:w-full ${x.id === p.id ? 'bg-accent text-[var(--accent-ink)]' : 'hover:bg-surface-2'}`}>
                <Icon name={CATEGORY[x.category].icon} size={15} className="mt-0.5 shrink-0" />
                <span className="min-w-0">
                  <span className="block font-semibold leading-snug">{x.title}</span>
                  <span className="block text-xs opacity-80">{refLabel(x.ref)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <AnimatePresence mode="wait">
          <motion.article key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf min-w-0 p-5">
            <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
              <Icon name={CATEGORY[p.category].icon} size={14} /> {CATEGORY[p.category].label()} · {refLabel(p.ref)}
            </p>
            <h3 className="mt-1 text-2xl font-bold">{p.title}</h3>
            <blockquote className="mt-2 border-l-4 border-[var(--gold)] pl-3 font-serif text-lg italic">
              <Gloss>{p.promise}</Gloss>
            </blockquote>
            <h4 className="mt-5 text-sm font-bold uppercase tracking-widest text-ink-soft">{t('From promise to fulfilment')}</h4>
            <div className="mt-3">
              <Journey p={p} />
            </div>
            <div className="mt-6">
              <Tabs id="promise-tab" tabs={PROMISE_TABS.map((x) => ({ key: x.key, label: x.label(), color: x.color }))} value={tab} onChange={setTab} />
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3 rounded-xl bg-surface-2 p-4 leading-relaxed" style={{ borderLeft: `4px solid ${PROMISE_TABS.find((x) => x.key === tab)!.color}` }}>
                  <Gloss>{p[tab]}</Gloss>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3">
              <Sources ids={p.sources} />
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Infographic: for each kind of promise, how its steps are spread from first giving to new creation. */
export function PromiseBoard({ promises }: { promises: S['promises'] }) {
  const cats = [...new Set(promises.map((p) => p.category))]
  const stages = Object.keys(STAGE) as (keyof typeof STAGE)[]
  const rows = cats.map((c) => {
    const ps = promises.filter((p) => p.category === c)
    const steps = ps.flatMap((p) => p.path)
    return { c, n: ps.length, total: steps.length, by: stages.map((st) => steps.filter((x) => x.phase === st).length) }
  })
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div>
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={r.c} className="flex items-center gap-2 text-sm">
              <span className="flex w-32 shrink-0 items-center gap-1.5 font-semibold">
                <Icon name={CATEGORY[r.c].icon} size={14} className="shrink-0" /> {CATEGORY[r.c].label()} <span className="font-normal text-ink-soft">· {r.n}</span>
              </span>
              <span className="flex h-5 flex-1 overflow-hidden rounded-full bg-surface-2">
                {r.by.map((v, k) => (
                  <motion.span key={k} title={`${STAGE[stages[k]].label()}: ${v}`} className="h-full" style={{ background: STAGE[stages[k]].color }} initial={{ width: 0 }} whileInView={{ width: `${(v / r.total) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 + k * 0.12 }} />
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-soft">
          {stages.map((st) => (
            <span key={st} className="flex items-center gap-1">
              <span className="size-3 rounded-full" style={{ background: STAGE[st].color }} /> {STAGE[st].label()}
            </span>
          ))}
        </p>
        <p className="mt-1 text-xs text-ink-soft">{t('Each bar shows where the steps of that kind of promise fall, from first giving to the new creation.')}</p>
      </div>
      <div className="leaf flex flex-col justify-center p-5 text-center">
        <p className="font-serif text-5xl font-bold text-accent">{promises.length}</p>
        <p className="mt-1 font-semibold">{t('Old Testament promises traced in this study')}</p>
        <p className="mt-3 font-serif text-lg italic">{t('“For all the promises of God in him are Yes, and in him Amen.”')}</p>
        <p className="text-sm text-ink-soft">{refLabel('2 Corinthians 1:20')}</p>
      </div>
    </div>
  )
}

/* ---------- The modern state ------------------------------------------------------------ */

const KIND: Record<S['modern']['timeline'][number]['kind'], { label: () => string; color: string }> = {
  religious: { label: () => t('Religious'), color: '#7c3aed' },
  theological: { label: () => t('Christian prophecy writing'), color: '#b45309' },
  political: { label: () => t('Political'), color: '#1d4ed8' },
  diplomatic: { label: () => t('Diplomatic'), color: '#0f766e' },
  war: { label: () => t('War'), color: '#be123c' },
}

export function ModernTimeline({ items }: { items: S['modern']['timeline'] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [kinds, setKinds] = useState(new Set(Object.keys(KIND)))
  const shown = sorted.filter((x) => kinds.has(x.kind))
  const [i, setI] = useState(0)
  const cur = shown[Math.min(i, shown.length - 1)]
  const toggle = (k: string) => {
    const s = new Set(kinds)
    if (s.has(k)) s.size > 1 && s.delete(k)
    else s.add(k)
    setKinds(s)
    setI(0)
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(KIND).map(([k, v]) => (
          <button key={k} type="button" aria-pressed={kinds.has(k)} onClick={() => toggle(k)} className="chip cursor-pointer gap-1.5" style={kinds.has(k) ? { borderColor: v.color, color: v.color } : { opacity: 0.5 }}>
            <span className="size-2.5 rounded-full" style={{ background: v.color }} /> {v.label()}
          </button>
        ))}
      </div>
      <div className="scroll-x mt-4 pb-2">
        <ol className="flex min-w-max items-end gap-1 border-b-2 border-rule px-1">
          {shown.map((x, k) => (
            <li key={x.year + x.label}>
              <button type="button" onClick={() => setI(k)} aria-current={k === i} className="group flex w-14 flex-col items-center gap-1 pb-1" title={x.label}>
                <motion.span className="w-2 rounded-t-full" style={{ background: KIND[x.kind].color }} animate={{ height: k === i ? 44 : 22 }} />
                <span className={`text-[0.7rem] tabular-nums ${k === i ? 'font-bold' : 'text-ink-soft'}`}>{x.year}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      {cur && (
        <AnimatePresence mode="wait">
          <motion.div key={cur.year + cur.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-3 p-5" style={{ borderLeft: `5px solid ${KIND[cur.kind].color}` }}>
            <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: KIND[cur.kind].color }}>
              <span className="font-serif text-3xl normal-case tracking-normal">{cur.year}</span> {KIND[cur.kind].label()}
            </p>
            <h3 className="mt-1 text-xl font-bold">{cur.label}</h3>
            <p className="mt-2 leading-relaxed">
              <Gloss>{cur.text}</Gloss>
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
                ← {t('Earlier')}
              </button>
              <button type="button" className="btn btn-primary" disabled={i >= shown.length - 1} onClick={() => setI(i + 1)}>
                {t('Later')} →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

const CLAIM_TABS = [
  { key: 'argument', label: () => t('The claim'), color: 'var(--rubric)' },
  { key: 'criticism', label: () => t('Criticism'), color: 'var(--accent)' },
  { key: 'response', label: () => t('Response'), color: 'var(--rubric)' },
  { key: 'verdict', label: () => t('Where it stands'), color: '#b45309' },
] as const

export function ClaimsDebate({ items }: { items: S['modern']['claims'] }) {
  const [id, setId] = useState(items[0]?.id)
  const [tab, setTab] = useState<(typeof CLAIM_TABS)[number]['key']>('argument')
  const m = items.find((x) => x.id === id) ?? items[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <ul className="scroll-x flex gap-1.5 lg:flex-col">
        {items.map((x) => (
          <li key={x.id} className="shrink-0">
            <button type="button" onClick={() => (setId(x.id), setTab('argument'))} aria-current={x.id === m.id} className={`w-52 rounded-xl px-3 py-2 text-left text-sm lg:w-full ${x.id === m.id ? 'bg-accent text-[var(--accent-ink)]' : 'hover:bg-surface-2'}`}>
              <span className="block font-semibold leading-snug">{refLabel(x.ref)}</span>
              <span className="line-clamp-2 block text-xs opacity-80">{x.claim}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf min-w-0 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(m.ref)}</p>
          <h3 className="text-xl font-bold">
            <Gloss>{m.claim}</Gloss>
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            <span className="font-bold">{t('Proponents:')} </span>
            {m.proponents}
          </p>
          <div className="mt-4">
            <Tabs id="claim-tab" tabs={CLAIM_TABS.map((x) => ({ key: x.key, label: x.label(), color: x.color }))} value={tab} onChange={setTab} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3 rounded-xl bg-surface-2 p-4 leading-relaxed" style={{ borderLeft: `4px solid ${CLAIM_TABS.find((x) => x.key === tab)!.color}` }}>
              <Gloss>{m[tab]}</Gloss>
            </motion.div>
          </AnimatePresence>
          <div className="mt-2">
            <Sources ids={m.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Kingdom: a tug of war you load with the arguments you find persuasive ------------- */

function Rope({ present, future }: { present: number; future: number }) {
  const d = Math.max(-1, Math.min(1, (future - present) / Math.max(4, present + future)))
  const msg = present === future ? t('Evenly pulled') : present > future ? t('Pulling toward a present, reigning kingdom') : t('Pulling toward a future earthly kingdom')
  return (
    <div className="leaf p-4">
      <svg viewBox="0 0 400 90" className="h-auto w-full" aria-label={`${msg}: ${present} – ${future}`} role="img">
        <line x1={200} y1={10} x2={200} y2={80} stroke="var(--rule)" strokeWidth={2} strokeDasharray="4 4" />
        <motion.g animate={{ x: d * 90 }} transition={{ type: 'spring', stiffness: 80, damping: 10 }}>
          <path d="M20 45 Q110 38 200 45 T380 45" stroke="#a16207" strokeWidth={6} fill="none" strokeLinecap="round" />
          <circle cx={200} cy={45} r={8} fill="var(--gold-bright)" stroke="#a16207" strokeWidth={2} />
          <g fill="var(--accent)">
            <circle cx={40} cy={30} r={9} />
            <rect x={32} y={40} width={16} height={22} rx={6} />
          </g>
          <g fill="var(--rubric)">
            <circle cx={360} cy={30} r={9} />
            <rect x={352} y={40} width={16} height={22} rx={6} />
          </g>
        </motion.g>
        <text x={20} y={86} fontSize={11} fill="var(--accent)" fontWeight={700}>
          {t('Present')} · {present}
        </text>
        <text x={380} y={86} fontSize={11} fill="var(--rubric)" fontWeight={700} textAnchor="end">
          {t('Future')} · {future}
        </text>
      </svg>
      <p className="text-center font-semibold">{msg}</p>
    </div>
  )
}

function ArgCard({ a, on, toggle }: { a: S['kingdom']['arguments'][number]; on: boolean; toggle: () => void }) {
  const [step, setStep] = useState(0)
  const col = a.side === 'present' ? 'var(--accent)' : 'var(--rubric)'
  const parts = [
    { label: t('Argument'), text: a.claim, color: col },
    { label: t('Counter'), text: a.counter, color: a.side === 'present' ? 'var(--rubric)' : 'var(--accent)' },
    { label: t('Answer'), text: a.rebuttal, color: col },
  ]
  return (
    <motion.li layout initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-20px' }} className="leaf p-4" style={{ borderTop: `4px solid ${col}` }}>
      <div className="flex items-start gap-3">
        <h3 className="min-w-0 flex-1 font-bold leading-snug">{a.title}</h3>
        <button type="button" role="switch" aria-checked={on} onClick={toggle} title={on ? t('Counted as persuasive: tap to remove') : t('Tap if you find this persuasive')} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? '' : 'bg-surface-2 ring-1 ring-rule'}`} style={on ? { background: col } : undefined}>
          <motion.span className="absolute top-1 size-5 rounded-full bg-[var(--surface)] shadow" animate={{ left: on ? 26 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </button>
      </div>
      <div className="mt-2 flex gap-1">
        {parts.map((p, k) => (
          <button key={k} type="button" onClick={() => setStep(k)} className={`flex-1 rounded-md px-1 py-1 text-xs font-bold ${k === step ? 'text-[var(--surface)]' : 'bg-surface-2'}`} style={k === step ? { background: p.color } : undefined}>
            {k + 1}. {p.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="mt-2 text-[0.95rem] leading-relaxed">
          <Gloss>{parts[step].text}</Gloss>
        </motion.p>
      </AnimatePresence>
      {step < 2 && (
        <button type="button" className="mt-2 text-sm font-semibold text-accent" onClick={() => setStep(step + 1)}>
          {step === 0 ? t('See the counter') : t('See the answer')} →
        </button>
      )}
      <p className="mt-2 text-xs text-ink-soft">{refLabel(a.refs.join('; '))}</p>
    </motion.li>
  )
}

export function KingdomArena({ args }: { args: S['kingdom']['arguments'] }) {
  const [on, setOn] = useState<Set<string>>(new Set())
  const flip = (id: string) => {
    const s = new Set(on)
    s.has(id) ? s.delete(id) : s.add(id)
    setOn(s)
  }
  const count = (side: 'present' | 'future') => args.filter((a) => a.side === side && on.has(a.id)).length
  return (
    <div>
      <div className="z-10 mx-auto max-w-xl lg:sticky lg:top-16">
        <Rope present={count('present')} future={count('future')} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {(['present', 'future'] as const).map((side) => (
          <div key={side}>
            <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: side === 'present' ? 'var(--accent)' : 'var(--rubric)' }}>
              <Icon name={side === 'present' ? 'crown' : 'hourglass'} /> {side === 'present' ? t('An already reigning kingdom') : t('A future earthly kingdom')}
            </h3>
            <ul className="mt-3 space-y-3">
              {args
                .filter((a) => a.side === side)
                .map((a) => (
                  <ArgCard key={a.id} a={a} on={on.has(a.id)} toggle={() => flip(a.id)} />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Romans 11 ---------------------------------------------------------------------- */

export function Romans11({ r }: { r: S['romans11'] }) {
  const [id, setId] = useState(r.readings[0]?.id)
  const x = r.readings.find((y) => y.id === id) ?? r.readings[0]
  return (
    <div>
      <p className="max-w-[70ch] leading-relaxed">
        <Gloss>{r.text}</Gloss>
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5" role="radiogroup">
        {r.readings.map((y, k) => (
          <button key={y.id} type="button" role="radio" aria-checked={y.id === x.id} onClick={() => setId(y.id)} className={`chip cursor-pointer ${y.id === x.id ? 'border-accent bg-accent text-[var(--accent-ink)]' : ''}`}>
            {k + 1}. {y.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={x.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="leaf p-4 md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('“All Israel will be saved” means…')}</p>
            <h3 className="mt-1 text-xl font-bold">{x.label}</h3>
            <p className="mt-2 leading-relaxed">
              <Gloss>{x.reading}</Gloss>
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              <span className="font-bold">{t('Held by:')} </span>
              {x.holders}
            </p>
          </div>
          <div className="leaf p-4 md:col-span-1" style={{ borderTop: '4px solid #15803d' }}>
            <p className="flex items-center gap-1 text-sm font-bold text-[#15803d]">
              <Icon name="check" size={15} /> {t('Strengths')}
            </p>
            <p className="mt-1 text-[0.95rem]">
              <Gloss>{x.strengths}</Gloss>
            </p>
          </div>
          <div className="leaf p-4 md:col-span-2" style={{ borderTop: '4px solid #be123c' }}>
            <p className="flex items-center gap-1 text-sm font-bold text-[#be123c]">
              <Icon name="question" size={15} /> {t('Weaknesses')}
            </p>
            <p className="mt-1 text-[0.95rem]">
              <Gloss>{x.weaknesses}</Gloss>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Hermeneutics: the same question, two ways of reading ------------------------------- */

export function Hermeneutics({ items }: { items: S['hermeneutics'] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null)
  return (
    <ul className="space-y-2">
      {items.map((h, i) => {
        const on = open === h.id
        return (
          <li key={h.id} className="leaf overflow-hidden">
            <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : h.id)} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 font-bold text-accent ring-1 ring-rule">{i + 1}</span>
              <span className="min-w-0 flex-1 font-bold">{h.title}</span>
              <motion.span animate={{ rotate: on ? 90 : 0 }}>
                <Icon name="arrow" size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="grid gap-3 px-4 pb-4 md:grid-cols-2">
                    <div className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: '4px solid var(--accent)' }}>
                      <p className="text-xs font-bold uppercase tracking-widest text-accent">{campLabel('fulfilment')}</p>
                      <p className="mt-1 text-[0.95rem] leading-relaxed">
                        <Gloss>{h.fulfilment}</Gloss>
                      </p>
                    </div>
                    <div className="rounded-xl bg-surface-2 p-3" style={{ borderLeft: '4px solid var(--rubric)' }}>
                      <p className="text-xs font-bold uppercase tracking-widest text-rubric">{campLabel('future')}</p>
                      <p className="mt-1 text-[0.95rem] leading-relaxed">
                        <Gloss>{h.future}</Gloss>
                      </p>
                    </div>
                    {h.refs.length > 0 && <Refs refs={h.refs} className="md:col-span-2" />}
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

/* ---------- Exchanges: argument → counter → answer, revealed round by round --------------------- */

export function Exchanges({ items }: { items: S['exchanges'] }) {
  const [by, setBy] = useState<'all' | Camp>('all')
  const list = items.filter((x) => by === 'all' || x.by === by)
  const [i, setI] = useState(0)
  const [round, setRound] = useState(1)
  const x = list[Math.min(i, list.length - 1)]
  if (!x) return null
  const other: Camp = x.by === 'fulfilment' ? 'future' : 'fulfilment'
  const rounds = [
    { who: x.by, label: t('Argument'), text: x.argument },
    { who: other, label: t('Counter-argument'), text: x.counter },
    { who: x.by, label: t('Answer'), text: x.answer },
  ]
  const go = (k: number) => (setI((k + list.length) % list.length), setRound(1))
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {(['all', 'fulfilment', 'future'] as const).map((k) => (
          <button key={k} type="button" onClick={() => (setBy(k), setI(0), setRound(1))} className={`chip cursor-pointer ${by === k ? 'border-accent text-accent' : ''}`}>
            {k === 'all' ? t('Both sides') : t('Arguments from: {camp}', { camp: campLabel(k) })}
          </button>
        ))}
        <span className="ml-auto text-sm text-ink-soft">{t('{a} of {b}', { a: Math.min(i, list.length - 1) + 1, b: list.length })}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={x.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: CAMP_COLOR[x.by] }}>
            {campLabel(x.by)}
          </p>
          <h3 className="text-xl font-bold">{x.title}</h3>
          <ol className="mt-4 space-y-3">
            {rounds.slice(0, round).map((r, k) => (
              <motion.li key={k} initial={{ opacity: 0, x: r.who === 'fulfilment' ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} className={`max-w-[92%] rounded-2xl p-4 ${r.who === 'fulfilment' ? 'mr-auto rounded-tl-sm' : 'ml-auto rounded-tr-sm'}`} style={{ background: 'var(--surface-2)', borderLeft: r.who === 'fulfilment' ? '4px solid var(--accent)' : undefined, borderRight: r.who === 'future' ? '4px solid var(--rubric)' : undefined }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: CAMP_COLOR[r.who] }}>
                  {k + 1}. {r.label} · {campLabel(r.who)}
                </p>
                <p className="mt-1 leading-relaxed">
                  <Gloss>{r.text}</Gloss>
                </p>
              </motion.li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            {round < 3 && (
              <button type="button" className="btn btn-primary" onClick={() => setRound(round + 1)}>
                {round === 1 ? t('Hear the counter-argument') : t('Hear the answer')}
              </button>
            )}
            <button type="button" className="btn" onClick={() => go(i - 1)}>
              ← {t('Previous')}
            </button>
            <button type="button" className="btn" onClick={() => go(i + 1)}>
              {t('Next')} →
            </button>
          </div>
          {x.refs.length > 0 && <Refs refs={x.refs} className="mt-4" />}
          <div className="mt-2">
            <Sources ids={x.sources} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- Strawmen: knock the caricature down and see what is really held -------------------- */

function StrawCard({ s }: { s: S['strawmen'][number] }) {
  const [down, setDown] = useState(false)
  return (
    <motion.li layout className="leaf relative overflow-hidden p-4" style={{ borderTop: `4px solid ${CAMP_COLOR[s.against]}` }}>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: CAMP_COLOR[s.against] }}>
        {t('A caricature of: {camp}', { camp: campLabel(s.against) })}
      </p>
      <div className="relative mt-2">
        <motion.p animate={{ opacity: down ? 0.45 : 1 }} className={`font-serif text-lg italic ${down ? 'line-through decoration-[var(--rubric)] decoration-2' : ''}`}>
          “{s.strawman}”
        </motion.p>
        <AnimatePresence>
          {down && (
            <motion.span initial={{ scale: 2, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 0.9, rotate: -10 }} exit={{ opacity: 0 }} className="pointer-events-none absolute right-0 top-0 rounded border-2 border-[var(--rubric)] px-2 text-xs font-black uppercase tracking-wider text-rubric">
              {t('Strawman')}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        {down && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="mt-3 text-sm font-bold text-ink-soft">{t('Why it is unfair')}</p>
            <p className="text-[0.95rem]">
              <Gloss>{s.whyFalse}</Gloss>
            </p>
            <p className="mt-3 text-sm font-bold" style={{ color: CAMP_COLOR[s.against] }}>
              {t('What they actually hold')}
            </p>
            <p className="text-[0.95rem]">
              <Gloss>{s.accurate}</Gloss>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" className="btn mt-3 text-sm" onClick={() => setDown(!down)} aria-expanded={down}>
        {down ? t('Show the caricature again') : t('Knock it down')}
      </button>
    </motion.li>
  )
}

export function Strawmen({ items }: { items: S['strawmen'] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {(['fulfilment', 'future'] as const).map((c) => (
        <div key={c}>
          <h3 className="font-bold" style={{ color: CAMP_COLOR[c] }}>
            {t('Unfair to: {camp}', { camp: campLabel(c) })}
          </h3>
          <ul className="mt-3 space-y-3">
            {items
              .filter((s) => s.against === c)
              .map((s) => (
                <StrawCard key={s.id} s={s} />
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/* ---------- Decision path ---------------------------------------------------------------- */

export function DecisionFlow({ flow, camps }: { flow: S['flow']; camps: S['camps'] }) {
  const [trail, setTrail] = useState<{ node: string; pick?: string }[]>([{ node: flow.start }])
  const cur = trail[trail.length - 1].node
  const node = flow.nodes.find((n) => n.id === cur)
  const result = flow.results.find((r) => r.id === cur)
  const camp = result && camps.find((c) => c.id === result.camp)
  const choose = (label: string, next: string) => setTrail([...trail.slice(0, -1), { node: cur, pick: label }, { node: next }])
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <AnimatePresence mode="wait">
        <motion.div key={cur} initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="leaf p-5">
          {node && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Question {n}', { n: trail.length })}</p>
              <h3 className="mt-1 text-2xl font-bold leading-snug">{node.q}</h3>
              <p className="mt-2 text-ink-soft">
                <Gloss>{node.help}</Gloss>
              </p>
              <div className="mt-4 grid gap-2">
                {node.options.map((o) => (
                  <motion.button key={o.label} type="button" whileHover={{ x: 4 }} onClick={() => choose(o.label, o.next)} className="flex items-center gap-2 rounded-xl bg-surface-2 p-3 text-left font-semibold ring-1 ring-rule hover:ring-[var(--accent)]">
                    <Icon name="arrow" size={15} className="shrink-0 text-accent" /> {o.label}
                  </motion.button>
                ))}
              </div>
            </>
          )}
          {result && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: camp ? CAMP_COLOR[camp.family] : undefined }}>
                {t('Where your answers point')}
              </p>
              <h3 className="mt-1 text-2xl font-bold">{result.title}</h3>
              {camp && <p className="mt-1 font-semibold">{camp.name}</p>}
              <p className="mt-2 leading-relaxed">
                <Gloss>{result.text}</Gloss>
              </p>
              <p className="mt-3 text-sm text-ink-soft">{t('This is a map, not a verdict: test each answer against Scripture.')}</p>
            </>
          )}
          {trail.length > 1 && (
            <div className="mt-4 flex gap-2">
              <button type="button" className="btn" onClick={() => setTrail(trail.slice(0, -2).concat({ node: trail[trail.length - 2].node }))}>
                ← {t('Back')}
              </button>
              <button type="button" className="btn" onClick={() => setTrail([{ node: flow.start }])}>
                {t('Start again')}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <ol className="space-y-2" aria-label={t('Your path')}>
        {trail
          .filter((s) => s.pick)
          .map((s, k) => {
            const q = flow.nodes.find((n) => n.id === s.node)
            return (
              <motion.li key={k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl bg-surface-2 p-3 text-sm">
                <p className="text-ink-soft">{q?.q}</p>
                <p className="mt-0.5 font-semibold">→ {s.pick}</p>
              </motion.li>
            )
          })}
      </ol>
    </div>
  )
}

/* ---------- Quiz -------------------------------------------------------------------------- */

export function Quiz({ items }: { items: S['quiz'] }) {
  const [i, setI] = useState(0)
  const [picks, setPicks] = useState<(number | undefined)[]>([])
  const done = i >= items.length
  const score = picks.filter((p, k) => p === items[k]?.answer).length
  if (done)
    return (
      <div className="leaf p-6 text-center">
        <p className="font-serif text-5xl font-bold text-accent">
          {score}/{items.length}
        </p>
        <p className="mt-2 font-semibold">{t('Well done for working through it.')}</p>
        <button type="button" className="btn btn-primary mt-4" onClick={() => (setI(0), setPicks([]))}>
          {t('Try again')}
        </button>
      </div>
    )
  const q = items[i]
  const pick = picks[i]
  return (
    <div className="leaf p-5">
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div className="h-full bg-accent" animate={{ width: `${(i / items.length) * 100}%` }} />
      </div>
      <p className="mt-3 text-sm text-ink-soft">{t('{a} of {b}', { a: i + 1, b: items.length })}</p>
      <h3 className="mt-1 text-xl font-bold">{q.q}</h3>
      <div className="mt-3 grid gap-2">
        {q.options.map((o, k) => {
          const show = pick !== undefined
          const right = k === q.answer
          return (
            <button key={k} type="button" disabled={show} onClick={() => setPicks(Object.assign([...picks], { [i]: k }))} className={`rounded-xl p-3 text-left ring-1 transition ${show && right ? 'bg-[#15803d] text-white ring-transparent' : show && k === pick ? 'bg-[#be123c] text-white ring-transparent' : 'bg-surface-2 ring-rule hover:ring-[var(--accent)]'}`}>
              {o}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {pick !== undefined && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mt-3 leading-relaxed">
              <span className="font-bold">{pick === q.answer ? t('Correct.') : t('Not quite.')} </span>
              <Gloss>{q.explain}</Gloss>
            </p>
            <button type="button" className="btn btn-primary mt-3" onClick={() => setI(i + 1)}>
              {i === items.length - 1 ? t('See your score') : t('Next question')} →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
