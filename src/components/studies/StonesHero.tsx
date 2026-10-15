import { motion } from 'framer-motion'
import { useState } from 'react'
import { t } from '../../lib/i18n'

/**
 * Matthew 24:2: "Not one stone here will be left on another." The temple stands, then its stones
 * fall one by one; tap to rebuild and watch again.
 */
export function StonesHero() {
  const [run, setRun] = useState(0)
  const rows = 5
  const cols = 9
  const stones = Array.from({ length: rows * cols }, (_, i) => ({ r: Math.floor(i / cols), c: i % cols }))
  return (
    <button type="button" onClick={() => setRun((r) => r + 1)} className="block w-full" aria-label={t('Replay: the temple stones fall (Matthew 24:2)')}>
      <svg key={run} viewBox="0 0 420 270" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--gold-bright) 35%, var(--surface))" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--gold) 45%, var(--surface-2))" />
          </linearGradient>
        </defs>
        {/* ground */}
        <rect x={0} y={232} width={420} height={38} fill="color-mix(in srgb, var(--rubric) 12%, var(--surface-2))" />
        {/* portico roof */}
        <motion.path d="M70,62 L210,22 L350,62 Z" fill="url(#stone)" stroke="var(--gold)" strokeWidth={1.5} initial={{ y: 0, rotate: 0, opacity: 1 }} animate={{ y: [0, 0, 190], rotate: [0, 0, -8], opacity: [1, 1, 0] }} transition={{ duration: 3.4, times: [0, 0.75, 1], ease: 'easeIn' }} style={{ transformOrigin: '210px 62px' }} />
        {stones.map(({ r, c }, i) => {
          const x = 75 + c * 30
          const y = 66 + r * 33
          const delay = 0.6 + (rows - r) * 0.28 + ((c * 7) % 5) * 0.06
          const dx = (c - 4) * 9 + ((i * 13) % 11) - 5
          return (
            <motion.rect
              key={i}
              x={x}
              y={y}
              width={28}
              height={31}
              rx={2}
              fill="url(#stone)"
              stroke="color-mix(in srgb, var(--gold) 60%, var(--ink))"
              strokeWidth={0.8}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: dx, y: 232 - y - 14 + ((i * 7) % 9), rotate: ((i * 37) % 60) - 30, opacity: 0.9 }}
              transition={{ delay, duration: 0.7, ease: [0.5, 0, 0.75, 0] }}
              style={{ transformOrigin: `${x + 14}px ${y + 15}px` }}
            />
          )
        })}
        <motion.text x={210} y={258} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={16} fontStyle="italic" fill="var(--ink)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
          {t('“Not one stone will be left on another”')}
        </motion.text>
      </svg>
      <span className="block text-center text-xs text-ink-soft">{t('Matthew 24:2 · Jerusalem, AD 70 · tap to replay')}</span>
    </button>
  )
}
