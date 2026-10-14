import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function PageHeader({ title, lede, children }: { title: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8 max-w-[70ch]">
      <motion.h1 className="text-4xl font-bold md:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {title}
      </motion.h1>
      {lede && (
        <motion.p className="mt-3 text-lg text-ink-soft" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {lede}
        </motion.p>
      )}
      {children}
      <motion.hr className="rubric-rule mt-6 max-w-xs origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.2 }} aria-hidden />
    </header>
  )
}
