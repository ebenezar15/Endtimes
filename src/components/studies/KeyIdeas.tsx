import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { useReducedMotion } from '../../lib/theme'
import { Icon } from '../Icon'

export type KeyIdea = { title: string; text: string; ref?: string }

/**
 * "The study in one minute": the main ideas as stations on a line that plays itself.
 * A ring times each idea; tap any station to stop and read it.
 */
export function KeyIdeas({ items }: { items: KeyIdea[] }) {
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(true)
  const reduce = useReducedMotion()
  const MS = 6000
  useEffect(() => {
    if (!play || reduce) return
    const id = setTimeout(() => setI((i + 1) % items.length), MS)
    return () => clearTimeout(id)
  }, [i, play, reduce, items.length])
  const k = items[i]
  return (
    <section className="mt-8" aria-label={t('The study in one minute')}>
      <div className="leaf overflow-hidden p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-gold">
            <Icon name="sparkles" size={14} /> {t('The study in one minute')}
          </p>
          <button type="button" className="chip cursor-pointer" onClick={() => setPlay(!play)} aria-pressed={play}>
            <Icon name={play ? 'pause' : 'play'} size={12} /> {play ? t('Pause') : t('Play')}
          </button>
        </div>
        <ol className="relative mt-4 flex justify-between">
          <span aria-hidden className="absolute inset-x-4 top-4 h-0.5 bg-[var(--rule)]" />
          <motion.span aria-hidden className="absolute left-4 top-4 h-0.5 origin-left" style={{ background: 'linear-gradient(90deg, var(--accent), var(--gold))', right: '1rem' }} animate={{ scaleX: items.length > 1 ? i / (items.length - 1) : 1 }} transition={{ duration: 0.6 }} />
          {items.map((x, n) => (
            <li key={n} className="relative z-10">
              <button type="button" onClick={() => (setPlay(false), setI(n))} aria-label={x.title} aria-current={n === i} className="relative inline-flex size-9 items-center justify-center rounded-full border-2 text-sm font-bold transition" style={{ borderColor: n <= i ? 'var(--accent)' : 'var(--rule)', background: n === i ? 'var(--accent)' : n < i ? 'color-mix(in srgb, var(--accent) 25%, var(--surface))' : 'var(--surface)', color: n === i ? 'var(--accent-ink)' : 'var(--ink)' }}>
                {n + 1}
                {n === i && play && !reduce && (
                  <svg viewBox="0 0 40 40" className="absolute -inset-1.5 size-12 -rotate-90" aria-hidden>
                    <motion.circle key={i} cx={20} cy={20} r={18} fill="none" stroke="var(--gold)" strokeWidth={2.5} strokeDasharray={113} initial={{ strokeDashoffset: 113 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: MS / 1000, ease: 'linear' }} />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="mt-5 min-h-[7.5rem]">
            <h3 className="text-xl font-bold leading-snug sm:text-2xl">{k.title}</h3>
            <p className="mt-2 max-w-[75ch] text-[1.02rem] leading-relaxed">{k.text}</p>
            {k.ref && <p className="mt-2 text-xs font-semibold text-accent">{refLabel(k.ref)}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
