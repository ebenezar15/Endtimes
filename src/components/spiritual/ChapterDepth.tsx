import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SpiritualStudy } from '../../content/schema'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type Ch = SpiritualStudy['chapters'][number]

/** Chapter medallions; choosing one unrolls that chapter's verse-by-verse notes like a scroll. */
export function ChapterDepth({ chapters }: { chapters: Ch[] }) {
  const [n, setN] = useState(chapters[0]?.chapter)
  const c = chapters.find((x) => x.chapter === n) ?? chapters[0]
  if (!c) return null
  return (
    <div className="grid gap-5 md:grid-cols-[5.5rem_minmax(0,1fr)]">
      <div className="scroll-x flex gap-2 md:flex-col md:overflow-visible" role="tablist" aria-label="Chapter">
        {chapters.map((x) => {
          const on = x.chapter === c.chapter
          return (
            <button key={x.chapter} type="button" role="tab" aria-selected={on} onClick={() => setN(x.chapter)} className="relative flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold md:size-16">
              {on && <motion.span layoutId="depth-ring" className="absolute inset-0 rounded-full bg-accent shadow-[0_0_22px_4px_rgb(var(--glow)/0.45)]" transition={{ type: 'spring', stiffness: 300, damping: 26 }} />}
              <span className={`relative ${on ? 'text-[var(--accent-ink)]' : 'text-accent'}`}>{x.chapter}</span>
              {!on && <span className="absolute inset-0 rounded-full ring-1 ring-rule" />}
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.article key={c.chapter} initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.4 }} animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }} className="leaf p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Revelation {c.chapter}</p>
          <h3 className="text-2xl font-bold">{c.theme}</h3>
          <ol className="mt-4 space-y-4">
            {c.depth.map((d, i) => (
              <motion.li key={d.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.07 }} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                <span className="mt-0.5 flex size-7 items-center justify-center rounded-lg bg-surface-2 text-sm font-bold text-accent ring-1 ring-rule">{i + 1}</span>
                <div>
                  <p className="font-bold">{d.title}</p>
                  <p className="mt-0.5 leading-relaxed text-ink-soft">
                    <Gloss>{d.text}</Gloss>
                  </p>
                  {d.texts.length > 0 && <p className="mt-1 text-xs text-ink-soft">{d.texts.join('; ')}</p>}
                </div>
              </motion.li>
            ))}
          </ol>
          <Link to={`/revelation/${c.chapter}`} className="btn mt-5 text-sm no-underline">
            <Icon name="scroll" size={14} /> Read Revelation {c.chapter} with every view
          </Link>
        </motion.article>
      </AnimatePresence>
    </div>
  )
}
