import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { HopeStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type Z = HopeStudy['zion']

/** Words that are often confused, as a row of definition cards. */
export function Terms({ items }: { items: Z['terms'] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((x, i) => (
        <motion.li key={x.term} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }} className="leaf p-4">
          <p className="font-bold text-accent">{x.term}</p>
          <p className="mt-1 text-[0.92rem]">{x.meaning}</p>
        </motion.li>
      ))}
    </ul>
  )
}

const STRAND = { jewish: 'hsl(215 70% 42%)', christian: 'hsl(265 45% 45%)', political: 'hsl(0 65% 42%)' } as const
const strandLabel = (s: keyof typeof STRAND) => (s === 'jewish' ? t('Jewish national movement') : s === 'christian' ? t('Christian restorationism') : t('Politics and war'))

/** The rise of Zionism as three strands braided over four centuries: each event sits in its strand's lane. */
export function RiseBraid({ items }: { items: Z['rise'] }) {
  const [only, setOnly] = useState<'all' | keyof typeof STRAND>('all')
  const lanes = Object.keys(STRAND) as (keyof typeof STRAND)[]
  const list = [...items].sort((a, b) => a.year - b.year).filter((x) => only === 'all' || x.strand === only)
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className="chip cursor-pointer" aria-pressed={only === 'all'} onClick={() => setOnly('all')} style={only === 'all' ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          {t('All three strands')}
        </button>
        {lanes.map((s) => (
          <button key={s} type="button" className="chip cursor-pointer" aria-pressed={only === s} onClick={() => setOnly(s)} style={only === s ? { background: STRAND[s], color: '#fff', borderColor: STRAND[s] } : undefined}>
            <span className="inline-block size-2.5 rounded-full" style={{ background: STRAND[s] }} /> {strandLabel(s)}
          </button>
        ))}
      </div>
      <div className="mt-4 hidden grid-cols-3 gap-3 text-center text-sm font-bold text-white sm:grid">
        {lanes.map((s) => (
          <span key={s} className="rounded-xl p-2" style={{ background: STRAND[s] }}>
            {strandLabel(s)}
          </span>
        ))}
      </div>
      <ol className="relative mt-3 space-y-2 sm:space-y-1">
        <span aria-hidden className="absolute inset-y-0 left-[16.6%] hidden w-0.5 bg-[var(--rule)] sm:block" />
        <span aria-hidden className="absolute inset-y-0 left-1/2 hidden w-0.5 bg-[var(--rule)] sm:block" />
        <span aria-hidden className="absolute inset-y-0 left-[83.3%] hidden w-0.5 bg-[var(--rule)] sm:block" />
        {list.map((x, i) => (
          <motion.li key={x.year + x.who} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.04 }} className="relative grid sm:grid-cols-3 sm:gap-3">
            <div className="leaf p-3" style={{ gridColumnStart: lanes.indexOf(x.strand) + 1, borderLeft: `5px solid ${STRAND[x.strand]}` }}>
              <p className="flex items-baseline gap-2">
                <span className="font-serif text-lg font-bold" style={{ color: STRAND[x.strand] }}>
                  {x.year}
                </span>
                <span className="text-sm font-bold">{x.who}</span>
              </p>
              <p className="mt-0.5 text-[0.9rem] text-ink-soft">{x.event}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

/** Each Christian Zionist claim as a three-step card: the claim, its best case, then the answer. */
export function ZionClaims({ items }: { items: Z['claims'] }) {
  const [i, setI] = useState(0)
  const [step, setStep] = useState(0)
  const c = items[i]
  const pick = (k: number) => (setI(k), setStep(0))
  const steps = [t('The claim'), t('Its best case'), t('The answer')]
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <ol className="scroll-x flex gap-1.5 lg:flex-col lg:overflow-visible">
        {items.map((x, k) => (
          <li key={x.id} className="shrink-0 lg:shrink">
            <button type="button" onClick={() => pick(k)} aria-pressed={k === i} className={`flex w-full items-start gap-2 rounded-xl p-2 text-left text-sm ring-1 ${k === i ? 'bg-accent text-[var(--accent-ink)] ring-transparent' : 'ring-rule hover:bg-surface-2'}`}>
              <span className="tabular-nums opacity-70">{k + 1}</span>
              <span className="max-w-[14rem] leading-snug lg:max-w-none">{x.claim}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="leaf p-4 sm:p-6">
        <div className="flex gap-1.5">
          {steps.map((s, k) => (
            <button key={k} type="button" onClick={() => setStep(k)} className="flex-1 rounded-full py-1 text-xs font-bold" style={{ background: k <= step ? (k === 2 ? 'hsl(160 60% 32%)' : k === 1 ? 'hsl(265 45% 45%)' : 'var(--rubric)') : 'var(--surface-2)', color: k <= step ? '#fff' : 'var(--ink-soft)' }}>
              {s}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={`${i}-${step}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('Claim {n}', { n: i + 1 })}</p>
            <h3 className="mt-1 text-xl font-bold leading-snug">“{c.claim}”</h3>
            <p className="mt-1 text-sm text-ink-soft">{c.texts.map(refLabel).join(' · ')}</p>
            {step >= 1 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl p-3" style={{ background: 'color-mix(in srgb, hsl(265 45% 45%) 10%, var(--surface))', borderLeft: '4px solid hsl(265 45% 45%)' }}>
                <span className="font-bold">{t('Its best case')}: </span>
                <Gloss>{c.case}</Gloss>
              </motion.p>
            )}
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl p-3" style={{ background: 'color-mix(in srgb, hsl(160 60% 32%) 10%, var(--surface))', borderLeft: '4px solid hsl(160 60% 32%)' }}>
                <p>
                  <span className="font-bold">{t('The answer')}: </span>
                  <Gloss>{c.reply}</Gloss>
                </p>
                {c.refs.length > 0 && <p className="mt-2 text-xs text-ink-soft">{c.refs.map(refLabel).join(' · ')}</p>}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex flex-wrap gap-2">
          {step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
              {step === 0 ? t('Show its best case') : t('Show the answer')} →
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={i === items.length - 1} onClick={() => pick(i + 1)}>
              {t('Next claim')} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const LEAF = 'hsl(150 40% 38%)'
const WILD = 'hsl(85 45% 42%)'
const BARK = 'hsl(30 35% 32%)'

/** A simple tree: trunk and a canopy of overlapping circles. */
function Tree({ x, y, s = 1, fill = LEAF, cut = false }: { x: number; y: number; s?: number; fill?: string; cut?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 0 L-6 -60 L6 -60 L8 0 Z" fill={BARK} />
      {cut ? (
        <path d="M-7 -60 L7 -60" stroke="#fff" strokeWidth={2} strokeDasharray="3 2" />
      ) : (
        <>
          <circle cx={0} cy={-90} r={36} fill={fill} />
          <circle cx={-30} cy={-72} r={24} fill={fill} />
          <circle cx={30} cy={-72} r={24} fill={fill} />
        </>
      )}
    </g>
  )
}

const HOT: Record<Z['olive'][number]['id'], [number, number]> = { root: [200, 228], trunk: [200, 165], remain: [150, 80], broken: [292, 196], wild: [255, 70], regraft: [120, 140] }

/** Paul's olive tree, drawn with numbered parts to tap. */
function Olive({ parts, sel, setSel }: { parts: Z['olive']; sel: string; setSel: (id: Z['olive'][number]['id']) => void }) {
  return (
    <svg viewBox="0 0 400 250" className="h-auto w-full" role="img" aria-label={t('The olive tree of Romans 11')}>
      <path d="M150 232 Q200 215 250 232 M200 220 L170 245 M200 220 L232 246" stroke={BARK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M188 222 C186 180 192 150 190 120 L210 120 C208 150 214 180 212 222 Z" fill={BARK} />
      <path d="M198 130 C170 110 150 95 140 80 M202 130 C230 110 250 95 262 72 M196 150 C160 145 130 140 112 136" stroke={BARK} strokeWidth={7} fill="none" strokeLinecap="round" />
      <circle cx={200} cy={78} r={46} fill={LEAF} opacity={0.9} />
      <circle cx={145} cy={82} r={30} fill={LEAF} opacity={0.9} />
      <circle cx={262} cy={70} r={28} fill={WILD} />
      <path d="M248 88 l8 -8 M254 92 l8 -8" stroke="#fff" strokeWidth={2} />
      <circle cx={112} cy={134} r={18} fill={LEAF} opacity={0.75} />
      <motion.path d="M100 150 C90 170 110 180 130 150" stroke="var(--gold)" strokeWidth={2.5} fill="none" strokeDasharray="5 4" markerEnd="url(#oa)" animate={{ strokeDashoffset: [0, -18] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }} />
      <defs>
        <marker id="oa" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--gold)" />
        </marker>
      </defs>
      <motion.g animate={{ rotate: [8, 14, 8] }} transition={{ repeat: Infinity, duration: 3 }} style={{ transformOrigin: '280px 180px' }}>
        <path d="M262 170 L310 200" stroke="hsl(30 15% 55%)" strokeWidth={6} strokeLinecap="round" />
        <circle cx={312} cy={200} r={14} fill="hsl(80 10% 60%)" />
      </motion.g>
      {parts.map((p, i) => (
        <g key={p.id} role="button" tabIndex={0} aria-label={p.label} onClick={() => setSel(p.id)} onKeyDown={(e) => e.key === 'Enter' && setSel(p.id)} className="cursor-pointer">
          <circle cx={HOT[p.id][0]} cy={HOT[p.id][1]} r={sel === p.id ? 13 : 11} fill={sel === p.id ? 'var(--gold-bright)' : 'var(--surface)'} stroke="var(--ink)" strokeWidth={1.5} />
          <text x={HOT[p.id][0]} y={HOT[p.id][1] + 4} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--ink)">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Three pictures of Israel and the church, ending with Paul's olive tree, whose parts can be explored. */
export function TreeModels({ models, olive }: { models: Z['models']; olive: Z['olive'] }) {
  const [m, setM] = useState<Z['models'][number]['id']>('one')
  const [part, setPart] = useState<Z['olive'][number]['id']>('root')
  const model = models.find((x) => x.id === m) ?? models[0]
  const p = olive.find((x) => x.id === part) ?? olive[0]
  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="tablist">
        {models.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={m === x.id} onClick={() => setM(x.id)} className="chip cursor-pointer" style={m === x.id ? { background: x.id === 'one' ? 'hsl(160 60% 32%)' : 'var(--rubric)', color: '#fff', borderColor: 'transparent' } : undefined}>
            {x.id === 'one' ? <Icon name="check" size={14} /> : <Icon name="close" size={14} />} {x.name}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="leaf p-3">
          <AnimatePresence mode="wait">
            <motion.div key={m} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              {m === 'one' ? (
                <Olive parts={olive} sel={part} setSel={setPart} />
              ) : m === 'two' ? (
                <svg viewBox="0 0 400 250" className="h-auto w-full" role="img" aria-label={model.name}>
                  <Tree x={110} y={225} />
                  <Tree x={290} y={225} fill={WILD} />
                  <rect x={194} y={60} width={12} height={170} fill="var(--rubric)" rx={3} />
                  <text x={110} y={245} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink)">
                    {t('Israel')}
                  </text>
                  <text x={290} y={245} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink)">
                    {t('Church')}
                  </text>
                </svg>
              ) : (
                <svg viewBox="0 0 400 250" className="h-auto w-full" role="img" aria-label={model.name}>
                  <Tree x={110} y={225} cut />
                  <Tree x={290} y={225} fill={WILD} />
                  <path d="M150 140 L240 140" stroke="var(--rubric)" strokeWidth={3} markerEnd="url(#ra)" />
                  <defs>
                    <marker id="ra" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                      <path d="M0 0 L10 5 L0 10 Z" fill="var(--rubric)" />
                    </marker>
                  </defs>
                  <text x={110} y={245} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink)">
                    {t('Israel cut down')}
                  </text>
                  <text x={290} y={245} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink)">
                    {t('A new church')}
                  </text>
                </svg>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="space-y-3">
          <div className="leaf p-4" style={{ borderTop: `5px solid ${m === 'one' ? 'hsl(160 60% 32%)' : 'var(--rubric)'}` }}>
            <h3 className="text-lg font-bold">{model.name}</h3>
            <p className="mt-1 text-[0.95rem]">
              <Gloss>{model.summary}</Gloss>
            </p>
            <p className="mt-2 text-[0.92rem] font-semibold">
              {refLabel(model.verse)}: {model.verdict}
            </p>
          </div>
          {m === 'one' && (
            <AnimatePresence mode="wait">
              <motion.div key={p.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="leaf p-4" style={{ borderLeft: '5px solid var(--gold)' }}>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  {olive.indexOf(p) + 1} · {refLabel(p.ref)}
                </p>
                <h4 className="mt-1 font-bold">{p.label}</h4>
                <p className="mt-1 text-[0.95rem]">
                  <Gloss>{p.text}</Gloss>
                </p>
                <p className="mt-2 text-xs text-ink-soft">{t('Tap the numbers on the tree.')}</p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
