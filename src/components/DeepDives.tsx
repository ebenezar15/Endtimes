import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { DeepDive } from '../content/schema'
import { deepDives } from '../lib/data/deepDives'
import { t } from '../lib/i18n'
import { refLabel } from '../lib/refLabel'
import { Gloss } from './Gloss'
import { Icon } from './Icon'
import { Section } from './studies/Section'

const yr = (y: number) => (y < 0 ? t('{n} BC', { n: -y }) : t('AD {y}', { y }))

/** A coin with seven stars, drawn small. */
function Coin({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <circle cx={20} cy={20} r={18} fill={on ? 'var(--gold)' : 'color-mix(in srgb, var(--gold) 45%, var(--surface-2))'} stroke="color-mix(in srgb, var(--gold) 70%, #000)" strokeWidth={1.5} />
      <circle cx={20} cy={20} r={14} fill="none" stroke="rgba(0,0,0,.25)" strokeDasharray="1 2" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2
        return <circle key={i} cx={20 + Math.cos(a) * 9} cy={20 + Math.sin(a) * 9} r={1.6} fill="#fff" />
      })}
    </svg>
  )
}

/** Dated evidence on a line; the key item pulses. */
function EvidenceLine({ items }: { items: DeepDive['evidence'] }) {
  const [sel, setSel] = useState(Math.max(0, items.findIndex((e) => e.key)))
  const min = Math.min(...items.map((e) => e.year))
  const max = Math.max(...items.map((e) => e.year))
  const x = (y: number) => 6 + ((y - min) / Math.max(1, max - min)) * 88
  const e = items[sel]
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <div className="scroll-x">
        <div className="relative h-24 min-w-[560px]">
          <div className="absolute inset-x-0 top-12 h-0.5 bg-[var(--rule)]" />
          {items.map((it, k) => (
            <button key={k} type="button" onClick={() => setSel(k)} aria-label={`${yr(it.year)}: ${it.label}`} className="absolute top-2 flex -translate-x-1/2 flex-col items-center" style={{ left: `${x(it.year)}%` }}>
              <motion.span animate={it.key ? { scale: [1, 1.15, 1] } : { scale: k === sel ? 1.15 : 1 }} transition={it.key ? { repeat: Infinity, duration: 1.8 } : {}} className={`rounded-full ${k === sel ? 'ring-2 ring-[var(--accent)]' : ''}`}>
                <Coin on={it.key || k === sel} />
              </motion.span>
              <span className={`mt-1 whitespace-nowrap text-[0.65rem] font-bold ${it.key ? 'text-rubric' : 'text-ink-soft'}`}>{yr(it.year)}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-[0.95rem]">
          <span className="font-bold">{e.label}: </span>
          {e.detail}
        </motion.p>
      </AnimatePresence>
      <p className="mt-2 text-xs text-ink-soft">{t('The same seven-star design, from the Republic to the third century: it cannot point to a single decade.')}</p>
    </div>
  )
}

/** One argument, revealed step by step along a growing line, then the other side and the conclusion. */
function Dive({ d, startOpen }: { d: DeepDive; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen)
  const [shown, setShown] = useState(3)
  return (
    <div className="leaf overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-start gap-3 p-5 text-left">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-[var(--accent-ink)]">
          <Icon name="layers" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs uppercase tracking-[0.14em] text-gold">{t('Deep dive')}</span>
          <span className="block text-xl font-bold leading-snug">{d.title}</span>
          <span className="mt-1 block text-[0.95rem] text-ink-soft">{d.question}</span>
        </span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="mt-2 shrink-0">
          <Icon name="arrow" size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-5 px-5 pb-5">
              {d.evidence.length > 0 && <EvidenceLine items={d.evidence} />}
              <ol className="relative ml-4 border-l-2 border-[var(--rule)] pl-6">
                <motion.span aria-hidden className="absolute -left-[2px] top-0 w-0.5 bg-[var(--accent)]" animate={{ height: `${(Math.min(shown, d.steps.length) / d.steps.length) * 100}%` }} transition={{ duration: 0.6 }} />
                {d.steps.slice(0, shown).map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative mb-4">
                    <span className="absolute -left-[2.35rem] top-0 inline-flex size-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-[var(--accent-ink)]">{i + 1}</span>
                    <p className="font-bold leading-snug">{s.title}</p>
                    <p className="mt-0.5 text-[0.95rem]">
                      <Gloss>{s.text}</Gloss>
                    </p>
                    {s.refs.length > 0 && <p className="mt-1 text-xs font-semibold text-ink-soft">{s.refs.map(refLabel).join(' · ')}</p>}
                  </motion.li>
                ))}
              </ol>
              {shown < d.steps.length ? (
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-primary" onClick={() => setShown(shown + 1)}>
                    {t('Next step')} ↓
                  </button>
                  <button type="button" className="btn" onClick={() => setShown(d.steps.length)}>
                    {t('Show every step')}
                  </button>
                  <span className="self-center text-sm text-ink-soft">{t('{n} of {m} steps', { n: shown, m: d.steps.length })}</span>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-surface-2 p-4" style={{ borderLeft: '4px solid hsl(265 45% 50%)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider text-[hsl(265_45%_55%)]">{t('The other side')}</p>
                    <p className="mt-1 text-[0.95rem]">{d.opponent}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))', borderLeft: '4px solid var(--accent)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider text-accent">{t('Conclusion')}</p>
                    <p className="mt-1 text-[0.95rem]">
                      <Gloss>{d.conclusion}</Gloss>
                    </p>
                  </motion.div>
                  <p className="flex gap-2 text-sm text-ink-soft md:col-span-2">
                    <Icon name="scales" size={15} className="mt-0.5 shrink-0 text-gold" /> {d.caution}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Every deep dive tagged for this study, in a section of its own. */
export function DeepDives({ topic }: { topic: string }) {
  const list = deepDives.filter((d) => d.topics.includes(topic))
  if (!list.length) return null
  return (
    <Section id="deep-dives" title={t('Deep dives')} lede={t('One argument at a time, traced step by step through Scripture and history, with the other side and the conclusion.')}>
      <div className="space-y-3">
        {list.map((d, i) => (
          <Dive key={d.id} d={d} startOpen={i === 0} />
        ))}
      </div>
    </Section>
  )
}
