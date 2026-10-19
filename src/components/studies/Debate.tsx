import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { t } from '../../lib/i18n'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'
import { Refs } from '../Refs'
import { Sources } from '../Sources'

export type Side = { label: string; color: string }

type Round = { id: string; by: string; title: string; argument: string; counter: string; answer: string; refs?: string[]; sources?: string[] }

/**
 * Argument → counter-argument → answer, revealed one round at a time, as a conversation.
 * `sides` names and colours each side; the counter comes from `counterSide` (or "the other views").
 */
export function Rounds({ items, sides, counterLabel }: { items: Round[]; sides: Record<string, Side>; counterLabel?: (by: string) => Side }) {
  const keys = Object.keys(sides).filter((k) => items.some((x) => x.by === k))
  const [by, setBy] = useState<string>('all')
  const list = items.filter((x) => by === 'all' || x.by === by)
  const [i, setI] = useState(0)
  const [round, setRound] = useState(1)
  const x = list[Math.min(i, list.length - 1)]
  if (!x) return null
  const mine = sides[x.by]
  const other = counterLabel?.(x.by) ?? { label: t('Other views'), color: 'var(--ink-soft)' }
  const rounds = [
    { who: mine, left: true, label: t('Argument'), text: x.argument },
    { who: other, left: false, label: t('Counter-argument'), text: x.counter },
    { who: mine, left: true, label: t('Answer'), text: x.answer },
  ]
  const go = (k: number) => (setI((k + list.length) % list.length), setRound(1))
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => (setBy('all'), setI(0), setRound(1))} className={`chip cursor-pointer ${by === 'all' ? 'border-accent text-accent' : ''}`}>
          {t('All views')}
        </button>
        {keys.map((k) => (
          <button key={k} type="button" onClick={() => (setBy(k), setI(0), setRound(1))} className="chip cursor-pointer gap-1.5" style={by === k ? { borderColor: sides[k].color, color: sides[k].color } : undefined}>
            <span className="size-2.5 rounded-full" style={{ background: sides[k].color }} /> {sides[k].label}
          </button>
        ))}
        <span className="ml-auto text-sm text-ink-soft">{t('{a} of {b}', { a: Math.min(i, list.length - 1) + 1, b: list.length })}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={x.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: mine.color }}>
            {mine.label}
          </p>
          <h3 className="text-xl font-bold">{x.title}</h3>
          <ol className="mt-4 space-y-3">
            {rounds.slice(0, round).map((r, k) => (
              <motion.li key={k} initial={{ opacity: 0, x: r.left ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} className={`max-w-[92%] rounded-2xl bg-surface-2 p-4 ${r.left ? 'mr-auto rounded-tl-sm' : 'ml-auto rounded-tr-sm'}`} style={r.left ? { borderLeft: `4px solid ${r.who.color}` } : { borderRight: `4px solid ${r.who.color}` }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: r.who.color }}>
                  {k + 1}. {r.label} · {r.who.label}
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
          {x.refs && x.refs.length > 0 && <Refs refs={x.refs} className="mt-4" />}
          {x.sources && (
            <div className="mt-2">
              <Sources ids={x.sources} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Caricatures: knock each down to see what is really held. */
export function StrawList({ items }: { items: { id: string; against: string; strawman: string; whyFalse: string; accurate: string }[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {items.map((s) => (
        <StrawCard key={s.id} s={s} />
      ))}
    </ul>
  )
}

function StrawCard({ s }: { s: { against: string; strawman: string; whyFalse: string; accurate: string } }) {
  const [down, setDown] = useState(false)
  return (
    <motion.li layout initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="leaf relative overflow-hidden p-4" style={{ borderTop: '4px solid var(--rubric)' }}>
      <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('A caricature of: {camp}', { camp: s.against })}</p>
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
            <p className="mt-3 text-sm font-bold text-accent">{t('What they actually hold')}</p>
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

type FlowData = { start: string; nodes: { id: string; q: string; help: string; options: { label: string; next: string }[] }[]; results: { id: string; title: string; text: string }[] }

/** A decision path: answer in order, see where the answers lead, and retrace your steps. */
export function Flow({ flow }: { flow: FlowData }) {
  const [trail, setTrail] = useState<{ node: string; pick?: string }[]>([{ node: flow.start }])
  const cur = trail[trail.length - 1].node
  const node = flow.nodes.find((n) => n.id === cur)
  const result = flow.results.find((r) => r.id === cur)
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
              <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Where your answers point')}</p>
              <h3 className="mt-1 text-2xl font-bold">{result.title}</h3>
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
          .map((s, k) => (
            <motion.li key={k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl bg-surface-2 p-3 text-sm">
              <p className="text-ink-soft">{flow.nodes.find((n) => n.id === s.node)?.q}</p>
              <p className="mt-0.5 font-semibold">→ {s.pick}</p>
            </motion.li>
          ))}
      </ol>
    </div>
  )
}
