import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SpiritualKey } from '../../content/schema'
import { Gloss } from '../Gloss'
import { t } from '../../lib/i18n'

/** Words that mark the "new creation" side of a pair. */
const NEW = /jerusalem|bride|seal|lamb|life|light|lamp|river|white|name|throne|michael|woman|son|robe|crown|morning|living|heaven|gold|garden|healing|new/i

/** Pairs each image with its opposite (old order → new creation) and shows the exchange as a contrast map. */
export function TwoCities({ keys }: { keys: SpiritualKey[] }) {
  const pairs = useMemo(() => {
    const byId = new Map(keys.map((k) => [k.id, k]))
    const seen = new Set<string>()
    const out: { old: SpiritualKey; neu: SpiritualKey }[] = []
    for (const k of keys) {
      const o = k.opposite ? byId.get(k.opposite) : undefined
      if (!o || seen.has(k.id) || seen.has(o.id)) continue
      seen.add(k.id)
      seen.add(o.id)
      const kNew = NEW.test(k.id + ' ' + k.symbol)
      const oNew = NEW.test(o.id + ' ' + o.symbol)
      const [old, neu] = kNew && !oNew ? [o, k] : oNew && !kNew ? [k, o] : k.chapter > o.chapter ? [o, k] : [k, o]
      out.push({ old, neu })
    }
    return out
  }, [keys])
  const [open, setOpen] = useState<number | null>(0)
  if (!pairs.length) return null
  return (
    <div>
      <div className="mb-3 hidden grid-cols-[1fr_4rem_1fr] text-center text-xs font-bold uppercase tracking-widest md:grid">
        <span className="text-rubric">{t('The old order')}</span>
        <span />
        <span className="text-accent">{t('The new creation')}</span>
      </div>
      <ul className="space-y-3">
        {pairs.map((p, i) => {
          const isOpen = open === i
          return (
            <motion.li key={p.old.id + p.neu.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: (i % 4) * 0.06 }}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="grid w-full grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] items-stretch gap-2 text-left md:grid-cols-[1fr_4rem_1fr]">
                <span className="leaf block p-3" style={{ borderLeft: '4px solid var(--rubric)' }}>
                  <span className="block font-bold">{p.old.symbol}</span>
                  <span className="text-xs text-ink-soft">{t('Revelation {n}', { n: p.old.chapter })}</span>
                </span>
                <span className="flex items-center justify-center" aria-hidden>
                  <svg viewBox="0 0 60 24" className="w-full">
                    <motion.path d="M4,12 H48" stroke="var(--gold-bright)" strokeWidth={2.5} strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
                    <motion.path d="M42,5 L54,12 L42,19" fill="none" stroke="var(--gold-bright)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }} />
                  </svg>
                </span>
                <span className="leaf block p-3" style={{ borderLeft: '4px solid var(--accent)' }}>
                  <span className="block font-bold">{p.neu.symbol}</span>
                  <span className="text-xs text-ink-soft">{t('Revelation {n}', { n: p.neu.chapter })}</span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid gap-3 pt-3 md:grid-cols-2">
                      {[p.old, p.neu].map((k) => (
                        <div key={k.id} className="rounded-xl bg-surface-2 p-3 text-[0.95rem]">
                          <p>
                            <Gloss>{k.spiritual}</Gloss>
                          </p>
                          <p className="mt-2 text-sm text-ink-soft">
                            <Gloss>{k.christ}</Gloss>
                          </p>
                          <Link to={`/revelation/${k.chapter}`} className="mt-2 inline-block text-sm">
                            {t('Revelation {n}', { n: k.chapter })}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
