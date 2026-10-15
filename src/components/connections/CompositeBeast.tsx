import { motion } from 'framer-motion'
import { useState } from 'react'
import { Icon } from '../Icon'

const BEASTS = [
  { id: 'lion', name: 'Lion with eagle’s wings', dan: 'Daniel 7:4', rev: 'mouth like a lion' },
  { id: 'bear', name: 'Bear', dan: 'Daniel 7:5', rev: 'feet like a bear' },
  { id: 'leopard', name: 'Leopard with four heads', dan: 'Daniel 7:6', rev: 'like a leopard' },
  { id: 'fourth', name: 'Fourth beast, ten horns', dan: 'Daniel 7:7', rev: 'ten horns' },
]

/**
 * Daniel's four beasts rise one after another; in Revelation 13 they merge into one.
 * John lists them in reverse (leopard, bear, lion), looking back from the far end of Daniel's sequence.
 */
export function CompositeBeast() {
  const [merged, setMerged] = useState(false)
  const pos = (i: number) => (merged ? { x: 260, y: 120 } : { x: 70 + i * 127, y: 110 })
  const heads = 1 + 1 + 4 + 1 // lion, bear, leopard's four, fourth beast
  return (
    <div className="leaf p-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-ink-soft">
          Daniel sees four beasts in a row. John sees one beast with the features of all four, and the total heads come to seven ({heads}).
        </p>
        <button type="button" className="btn btn-primary ml-auto text-sm" onClick={() => setMerged((m) => !m)}>
          <Icon name={merged ? 'shuffle' : 'motion'} size={14} /> {merged ? 'Separate (Daniel 7)' : 'Merge (Revelation 13)'}
        </button>
      </div>
      <svg viewBox="0 0 520 240" className="mt-3 h-auto w-full" role="img" aria-label={merged ? 'The four beasts merged into the one beast of Revelation 13' : 'The four beasts of Daniel 7'}>
        <motion.circle cx={260} cy={120} r={merged ? 92 : 0} fill="color-mix(in srgb, var(--rubric) 18%, transparent)" stroke="var(--rubric)" strokeWidth={2} animate={{ r: merged ? 92 : 0 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }} />
        {BEASTS.map((b, i) => {
          const p = pos(i)
          return (
            <motion.g key={b.id} animate={{ x: p.x, y: p.y, scale: merged ? 0.62 : 1 }} transition={{ type: 'spring', stiffness: 110, damping: 15, delay: merged ? (3 - i) * 0.08 : i * 0.08 }}>
              <motion.circle r={46} fill="var(--surface)" stroke="var(--rubric)" strokeWidth={2.5} animate={{ x: merged ? Math.cos((i / 4) * Math.PI * 2) * 70 : 0, y: merged ? Math.sin((i / 4) * Math.PI * 2) * 70 : 0 }} />
              <motion.text textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)" animate={{ x: merged ? Math.cos((i / 4) * Math.PI * 2) * 70 : 0, y: (merged ? Math.sin((i / 4) * Math.PI * 2) * 70 : 0) + 4 }}>
                {b.name.split(' ')[0] === 'Fourth' ? 'Ten horns' : b.name.split(' ')[0]}
              </motion.text>
              {!merged && (
                <text y={66} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
                  {b.dan}
                </text>
              )}
            </motion.g>
          )
        })}
        {merged && (
          <motion.text x={260} y={232} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--rubric)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            The beast from the sea, Revelation 13:1–2
          </motion.text>
        )}
      </svg>
      <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
        {BEASTS.map((b) => (
          <li key={b.id}>
            <span className="font-semibold">{b.name}</span> <span className="text-ink-soft">({b.dan}) → “{b.rev}”</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
