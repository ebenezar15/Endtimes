import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { positionsById } from '../../lib/core'
import { t } from '../../lib/i18n'
import { usePositionColors } from '../../lib/theme'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type Reading = { position: string; reading: string }

/**
 * How each view reads a passage: pick one view to read, or switch to "side by side" and pick two.
 * The chosen view's colour runs down the card.
 */
export function ViewReadings({ readings, initial }: { readings: Reading[]; initial?: string }) {
  const color = usePositionColors()
  const [a, setA] = useState(readings.find((r) => r.position === initial)?.position ?? readings[0]?.position)
  const [b, setB] = useState(readings.find((r) => r.position !== a)?.position)
  const [pair, setPair] = useState(false)
  if (!readings.length) return null
  const card = (id: string | undefined, slot: 'a' | 'b') => {
    const r = readings.find((x) => x.position === id)
    if (!r) return null
    const c = color(r.position)
    return (
      <AnimatePresence mode="wait">
        <motion.div key={slot + r.position} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="rounded-xl bg-surface-2 p-4" style={{ borderLeft: `5px solid ${c.base}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: c.text }}>
            {positionsById.get(r.position)?.name ?? r.position}
          </p>
          <p className="mt-1 leading-relaxed">
            <Gloss>{r.reading}</Gloss>
          </p>
        </motion.div>
      </AnimatePresence>
    )
  }
  const chips = (sel: string | undefined, set: (id: string) => void, other?: string) => (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {readings.map((r) => {
        const on = r.position === sel
        const c = color(r.position)
        return (
          <button key={r.position} type="button" role="radio" aria-checked={on} disabled={r.position === other} onClick={() => set(r.position)} className="chip cursor-pointer disabled:opacity-40" style={on ? { background: c.base, color: c.ink, borderColor: c.base } : { borderColor: c.base }}>
            {positionsById.get(r.position)?.shortName ?? r.position}
          </button>
        )
      })}
    </div>
  )
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {chips(a, setA, pair ? b : undefined)}
        {readings.length > 1 && (
          <button type="button" className={`btn ml-auto text-xs ${pair ? 'btn-primary' : ''}`} onClick={() => setPair((v) => !v)} aria-pressed={pair}>
            <Icon name="layers" size={13} /> {t('Side by side')}
          </button>
        )}
      </div>
      {pair ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div>{card(a, 'a')}</div>
          <div>
            <div className="mb-2">{chips(b, setB, a)}</div>
            {card(b, 'b')}
          </div>
        </div>
      ) : (
        card(a, 'a')
      )}
    </div>
  )
}
