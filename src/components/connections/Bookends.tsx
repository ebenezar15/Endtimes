import { motion } from 'framer-motion'
import type { RevStructure } from '../../content/schema'
import { Gloss } from '../Gloss'

/** Chapter 1 and chapter 22 facing each other like the two covers of a book, with each echo joined across the spine. */
export function Bookends({ pairs }: { pairs: RevStructure['bookends'] }) {
  return (
    <div className="relative">
      <div className="mb-2 grid grid-cols-[1fr_2.5rem_1fr] text-center text-xs font-bold uppercase tracking-widest">
        <span className="text-rubric">The opening</span>
        <span />
        <span className="text-accent">The close</span>
      </div>
      <span aria-hidden className="absolute bottom-0 left-1/2 top-6 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--gold-bright)] to-transparent" />
      <ol className="space-y-3">
        {pairs.map((p, i) => (
          <li key={p.a + p.b} className="grid grid-cols-[1fr_2.5rem_1fr] items-stretch">
            <motion.div initial={{ opacity: 0, rotateY: 50, x: -20 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: (i % 4) * 0.06, duration: 0.5 }} className="leaf p-3 text-sm" style={{ transformOrigin: 'right center', borderRight: '3px solid var(--rubric)' }}>
              <p className="text-xs font-bold text-ink-soft">{p.a}</p>
              <p>{p.aText}</p>
            </motion.div>
            <div className="relative flex items-center justify-center" aria-hidden>
              <motion.span className="size-3 rounded-full bg-gold-bright shadow-[0_0_14px_4px_rgb(var(--glow)/0.55)]" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + (i % 4) * 0.06, type: 'spring' }} />
            </div>
            <motion.div initial={{ opacity: 0, rotateY: -50, x: 20 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: (i % 4) * 0.06, duration: 0.5 }} className="leaf p-3 text-sm" style={{ transformOrigin: 'left center', borderLeft: '3px solid var(--accent)' }}>
              <p className="text-xs font-bold text-ink-soft">{p.b}</p>
              <p>{p.bText}</p>
            </motion.div>
            <p className="col-span-3 mt-1 px-2 text-center text-xs text-ink-soft">
              <Gloss>{p.note}</Gloss>
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
