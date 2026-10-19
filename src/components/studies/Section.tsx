import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** A page section whose title rises in word by word, with a drawn underline and a fading body. */
export function Section({ id, title, lede, children }: { id: string; title: string; lede?: string; children: ReactNode }) {
  const words = title.split(' ')
  return (
    <section id={id} className="mt-20 scroll-mt-20" aria-labelledby={`${id}-h`}>
      <motion.h2 id={`${id}-h`} className="text-2xl font-bold sm:text-3xl" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ staggerChildren: 0.06 }} aria-label={title}>
        {words.map((w, i) => (
          <motion.span key={i} aria-hidden className="mr-[0.28em] inline-block max-w-full [overflow-wrap:anywhere]" variants={{ hidden: { opacity: 0, y: 18, rotateX: -60 }, show: { opacity: 1, y: 0, rotateX: 0 } }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
            {w}
          </motion.span>
        ))}
      </motion.h2>
      <motion.span aria-hidden className="mt-2 block h-[3px] w-24 origin-left rounded-full bg-gradient-to-r from-[var(--gold-bright)] to-[var(--accent)]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
      {lede && (
        <motion.p className="mt-2 max-w-[70ch] text-ink-soft" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
          {lede}
        </motion.p>
      )}
      <motion.div className="mt-5" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: 0.1 }}>
        {children}
      </motion.div>
    </section>
  )
}

/** Reading-progress bar along the top of the page. */
export { ProgressBar } from './ProgressBar'
