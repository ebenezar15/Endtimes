import { motion } from 'framer-motion'
import { useState } from 'react'
import type { RevStructure } from '../../content/schema'
import { Gloss } from '../Gloss'
import { t } from '../../lib/i18n'

const base = (l: string) => l.replace(/[′']/g, '')
const TINTS = ['var(--accent)', 'var(--gold-bright)', 'var(--rubric)', 'var(--agree)']

/** Concentric structures in the prophets, each drawn as a "V" that steps in to its centre and back out. */
export function PropheticChiasms({ items }: { items: RevStructure['prophetic'] }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((c, ci) => {
        const order: string[] = []
        c.segments.forEach((s) => !order.includes(base(s.label)) && order.push(base(s.label)))
        const isOpen = open === c.id
        return (
          <motion.li key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (ci % 2) * 0.1 }} className="leaf glow-card flex flex-col p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{c.book}</p>
            <h3 className="text-xl font-bold">{c.passage}</h3>
            <ol className="mt-3 space-y-1">
              {c.segments.map((s, i) => {
                const d = order.indexOf(base(s.label))
                const isC = s.label === c.centre
                return (
                  <motion.li key={s.label + i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.09 }} style={{ marginLeft: `${d * 9}%` }} className={`flex items-baseline gap-2 rounded-lg px-2 py-1 text-sm ${isC ? 'bg-surface-2 ring-1 ring-[var(--gold-bright)]' : ''}`}>
                    <span className="w-6 shrink-0 font-bold" style={{ color: TINTS[d % TINTS.length] }}>
                      {s.label}
                    </span>
                    <span className="min-w-0">
                      <span className="font-semibold">{s.title}</span> <span className="text-xs text-ink-soft">{s.range}</span>
                    </span>
                  </motion.li>
                )
              })}
            </ol>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.id)} className="mt-3 self-start text-sm font-semibold text-accent">
              {isOpen ? t('Hide') : t('Why it matters for Revelation')}
            </button>
            {isOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden text-[0.95rem]">
                <p className="mt-2">
                  <Gloss>{c.summary}</Gloss>
                </p>
                <p className="mt-2 rounded-xl bg-surface-2 p-3">
                  <Gloss>{c.link}</Gloss>
                </p>
              </motion.div>
            )}
          </motion.li>
        )
      })}
    </ul>
  )
}
