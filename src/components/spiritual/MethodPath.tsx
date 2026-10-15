import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { SpiritualStudy } from '../../content/schema'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

/**
 * The way of seeing: a stepped path from reading outward signs to Christ revealed within.
 * Steps light one after another when the path scrolls into view; any step can be opened.
 */
export function MethodPath({ steps }: { steps: SpiritualStudy['method'] }) {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lit, setLit] = useState(-1)
  const [open, setOpen] = useState(0)
  useEffect(() => {
    if (!inView || lit >= steps.length - 1) return
    const t = setTimeout(() => setLit((n) => n + 1), lit < 0 ? 200 : 650)
    return () => clearTimeout(t)
  }, [inView, lit, steps.length])
  if (!steps.length) return null
  const cur = steps[open]
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <ol ref={ref} className="relative pl-10">
        {/* the rising line */}
        <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-0.5 bg-rule" />
        <motion.span aria-hidden className="absolute left-[15px] top-3 w-0.5 origin-top bg-gold-bright" style={{ bottom: 12 }} initial={{ scaleY: 0 }} animate={{ scaleY: Math.max(0, lit) / Math.max(1, steps.length - 1) }} transition={{ duration: 0.6 }} />
        {steps.map((s, i) => {
          const on = i <= lit
          const sel = i === open
          return (
            <li key={s.id} className="relative mb-2 last:mb-0">
              <motion.span
                aria-hidden
                className="absolute -left-10 top-2 flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold"
                animate={{ scale: sel ? 1.15 : 1, backgroundColor: on ? 'var(--gold-bright)' : 'var(--surface)', borderColor: on ? 'var(--gold-bright)' : 'var(--rule)', color: on ? 'var(--ink)' : 'var(--ink-soft)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {i === steps.length - 1 ? <Icon name="crown" size={14} /> : i + 1}
              </motion.span>
              <button type="button" aria-expanded={sel} onClick={() => setOpen(i)} className={`w-full rounded-xl px-3 py-2.5 text-left font-bold transition-colors ${sel ? 'bg-surface-2 text-accent ring-1 ring-accent' : 'hover:bg-surface-2'}`} style={{ opacity: on ? 1 : 0.5 }}>
                {s.step}
              </button>
            </li>
          )
        })}
      </ol>
      <motion.div key={cur.id} initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.35 }} className="leaf glow-card self-start p-5 lg:sticky lg:top-24">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Step {open + 1} of {steps.length}
        </p>
        <h3 className="mt-1 text-xl font-bold">{cur.step}</h3>
        <p className="mt-2 leading-relaxed">
          <Gloss>{cur.text}</Gloss>
        </p>
        {cur.texts.length > 0 && <p className="mt-3 text-sm text-ink-soft">{cur.texts.join('; ')}</p>}
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn text-sm" disabled={open === 0} onClick={() => setOpen((n) => Math.max(0, n - 1))}>
            Back
          </button>
          <button type="button" className="btn btn-primary text-sm" disabled={open === steps.length - 1} onClick={() => setOpen((n) => Math.min(steps.length - 1, n + 1))}>
            Next <Icon name="arrow" size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
