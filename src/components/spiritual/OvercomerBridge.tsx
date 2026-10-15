import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { SpiritualStudy } from '../../content/schema'
import { Gloss } from '../Gloss'
import { t } from '../../lib/i18n'

/**
 * "To the one who overcomes": each promise in the letters (chapters 2–3) arcs across the book
 * to the place where it is fulfilled (chapters 20–22).
 */
export function OvercomerBridge({ items }: { items: SpiritualStudy['overcomer'] }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!items.length) return null
  return (
    <div>
      <div className="mb-3 hidden grid-cols-[1fr_5rem_1fr] text-center text-xs font-bold uppercase tracking-widest md:grid">
        <span className="text-rubric">{t('Promised to the churches (2–3)')}</span>
        <span />
        <span className="text-accent">{t('Fulfilled in the new creation')}</span>
      </div>
      <ol className="space-y-3">
        {items.map((o, i) => {
          const isOpen = open === i
          return (
            <motion.li key={o.church} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: (i % 4) * 0.07 }}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="grid w-full grid-cols-[1fr_2.5rem_1fr] items-stretch gap-2 text-left md:grid-cols-[1fr_5rem_1fr]">
                <span className="leaf block p-3" style={{ borderLeft: '4px solid var(--rubric)' }}>
                  <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft">{o.church}</span>
                  <span className="mt-0.5 block font-bold leading-snug">{o.promise}</span>
                  <span className="text-xs text-ink-soft">{o.ref}</span>
                </span>
                <span className="relative flex items-center justify-center" aria-hidden>
                  <svg viewBox="0 0 80 60" className="h-full w-full" preserveAspectRatio="none">
                    <motion.path d="M2,48 C24,-6 56,-6 78,48" fill="none" stroke="var(--gold-bright)" strokeWidth={2.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.15 + (i % 4) * 0.07 }} />
                  </svg>
                  <motion.span className="absolute size-2.5 rounded-full bg-gold-bright shadow-[0_0_12px_3px_rgb(var(--glow)/0.6)]" animate={{ offsetDistance: ['0%', '100%'] }} style={{ offsetPath: 'path("M2,48 C24,-6 56,-6 78,48")', left: 0, top: 0 }} transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.2 + i * 0.3, ease: 'easeInOut' }} />
                </span>
                <span className="leaf block p-3" style={{ borderLeft: '4px solid var(--accent)' }}>
                  <span className="block font-bold leading-snug">{o.fulfilled}</span>
                  <span className="text-xs text-ink-soft">{o.fulfilledRef}</span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="mt-2 rounded-xl bg-surface-2 p-3 text-[0.95rem]">
                      <Gloss>{o.meaning}</Gloss>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
