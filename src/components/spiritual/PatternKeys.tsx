import { refLabel } from '../../lib/refLabel'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { SpiritualStudy } from '../../content/schema'
import { Gloss } from '../Gloss'
import { t } from '../../lib/i18n'

/** A key that turns in its lock when a new pattern is chosen. */
function KeyGlyph({ turn }: { turn: number }) {
  return (
    <motion.svg viewBox="0 0 64 64" className="size-14 shrink-0" aria-hidden animate={{ rotate: turn * 90 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
      <circle cx="20" cy="32" r="12" fill="none" stroke="var(--gold-bright)" strokeWidth="4" />
      <circle cx="20" cy="32" r="4" fill="var(--gold-bright)" />
      <path d="M32 32h26M48 32v9M56 32v6" fill="none" stroke="var(--gold-bright)" strokeWidth="4" strokeLinecap="round" />
    </motion.svg>
  )
}

/**
 * Old Testament patterns used as keys to the book. Pick a key; its correspondences
 * (Old Testament pattern → Revelation) draw out as a flow.
 */
export function PatternKeys({ patterns }: { patterns: SpiritualStudy['patterns'] }) {
  const [i, setI] = useState(0)
  if (!patterns.length) return null
  const p = patterns[i]
  return (
    <div className="leaf p-5">
      <div className="scroll-x -mx-1 flex gap-1.5 px-1 pb-2" role="tablist" aria-label={t('Old Testament patterns')}>
        {patterns.map((x, j) => (
          <button key={x.id} type="button" role="tab" aria-selected={j === i} onClick={() => setI(j)} className={`chip shrink-0 cursor-pointer ${j === i ? 'border-accent' : ''}`} style={j === i ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
            {x.pattern}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="mt-4">
          <div className="flex items-start gap-4">
            <KeyGlyph turn={i} />
            <div>
              <h3 className="text-xl font-bold">{p.pattern}</h3>
              <p className="mt-1 leading-relaxed">
                <Gloss>{p.text}</Gloss>
              </p>
            </div>
          </div>
          {p.links.length > 0 && (
            <ul className="mt-5 grid gap-2">
              {p.links.map((l, k) => (
                <motion.li key={l.from + k} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.08 }} className="grid grid-cols-[1fr_2rem_1fr] items-center gap-2 text-[0.95rem]">
                  <span className="rounded-xl bg-surface-2 px-3 py-2">{l.from}</span>
                  <svg viewBox="0 0 32 16" className="w-full" aria-hidden>
                    <motion.path d="M2,8 H24 M18,3 L26,8 L18,13" fill="none" stroke="var(--gold-bright)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + k * 0.08, duration: 0.5 }} />
                  </svg>
                  <span className="rounded-xl px-3 py-2 font-semibold ring-1 ring-accent">{l.to}</span>
                </motion.li>
              ))}
            </ul>
          )}
          {p.texts.length > 0 && <p className="mt-3 text-sm text-ink-soft">{refLabel(p.texts.join('; '))}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Rotating short lines that sum up the view. Tap to move on. */
export function LinesTicker({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (lines.length < 2) return
    const t = setTimeout(() => setI((n) => (n + 1) % lines.length), 5200)
    return () => clearTimeout(t)
  }, [i, lines.length])
  if (!lines.length) return null
  return (
    <button type="button" onClick={() => setI((n) => (n + 1) % lines.length)} className="mt-5 block min-h-[4.5rem] w-full text-left" aria-label={t('Show the next line')}>
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="block border-l-4 border-gold-bright pl-4 font-serif text-xl italic leading-snug">
          {lines[i]}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
