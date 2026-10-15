import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../lib/i18n'

/** The three sevens of Revelation, laid out either in sequence (telescoping) or in parallel (recapitulation). */
const SERIES = [
  {
    id: 'seals', name: t('Seals'), ch: [6, 6, 6, 6, 6, 6, 8],
    items: [t('White horse: conquest'), t('Red horse: war'), t('Black horse: famine'), t('Pale horse: death'), t('Souls under the altar'), t('Cosmic upheaval'), t('Silence in heaven')],
    interlude: { label: t('Interlude: the sealed 144,000 and the great multitude'), ch: 7 },
  },
  {
    id: 'trumpets', name: t('Trumpets'), ch: [8, 8, 8, 8, 9, 9, 11],
    items: [t('Hail and fire on the land'), t('Burning mountain in the sea'), t('Wormwood falls on the rivers'), t('Sun, moon and stars darkened'), t('Locusts from the abyss'), t('Cavalry from the Euphrates'), t('The kingdom of the world becomes Christ’s')],
    interlude: { label: t('Interlude: the little scroll and the two witnesses'), ch: 10 },
  },
  {
    id: 'bowls', name: t('Bowls'), ch: [16, 16, 16, 16, 16, 16, 16],
    items: [t('Sores on the beast’s worshippers'), t('The sea becomes blood'), t('Rivers become blood'), t('The sun scorches'), t('Darkness on the beast’s throne'), t('Euphrates dried up: Armageddon'), t('“It is done”: the great earthquake')],
    interlude: { label: t('Interlude: three frog-like spirits gather the kings'), ch: 16 },
  },
] as const

const W = 900
const ROW = 92

export function SevensDiagram() {
  const [mode, setMode] = useState<'sequence' | 'recap'>('recap')
  const [hover, setHover] = useState<{ s: number; i: number } | null>(null)
  const pos = (s: number, i: number) => {
    if (mode === 'recap') return { x: 70 + i * ((W - 170) / 6), y: 50 + s * ROW }
    const k = s * 7 + i - s // the 7th of one series opens the next, so they share a slot
    return { x: 40 + k * ((W - 120) / 18), y: 70 + s * 80 }
  }
  const H = 50 + 3 * ROW
  const tip = hover ? SERIES[hover.s] : null
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={t('Structure')}>
        <button type="button" role="radio" aria-checked={mode === 'recap'} className="btn text-sm" aria-pressed={mode === 'recap'} onClick={() => setMode('recap')}>
          {t('In parallel (recapitulation)')}
        </button>
        <button type="button" role="radio" aria-checked={mode === 'sequence'} className="btn text-sm" aria-pressed={mode === 'sequence'} onClick={() => setMode('sequence')}>
          {t('In sequence (telescoping)')}
        </button>
      </div>
      <p className="mt-3 max-w-[70ch] text-sm text-ink-soft">
        {mode === 'recap'
          ? t('Recapitulation, or progressive parallelism, reads the seals, trumpets and bowls as three views of the same period, each ending at the final judgment and each more intense than the last. Its roots are in Victorinus, Tyconius and Augustine. It is common among amillennial and idealist readers (Hendriksen, Beale), and many preterists and historic premillennialists hold a partial version.')
          : t('The sequential (telescoping) reading takes the seventh seal as opening the trumpets and the seventh trumpet as opening the bowls, so the judgments follow one another in time. It is common among futurists (Walvoord, Thomas) and classic historicists (Elliott). Many sequential readers allow some overlap.')}
      </p>
      <div className="scroll-x mt-4" role="region" aria-label={t('The three sevens diagram')} tabIndex={0}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[40rem]" role="img" aria-label={mode === 'recap' ? t('The seals, trumpets and bowls shown in parallel. Lists follow the diagram.') : t('The seals, trumpets and bowls shown in sequence. Lists follow the diagram.')}>
          {mode === 'recap' && <line x1={W - 70} x2={W - 70} y1={20} y2={H - 10} stroke="var(--rubric)" strokeDasharray="4 4" />}
          {mode === 'recap' && (
            <text x={W - 70} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--rubric)">
              {t('The end')}
            </text>
          )}
          {SERIES.map((ser, s) =>
            ser.items.map((_, i) => {
              const p = pos(s, i)
              const next = i < 6 ? pos(s, i + 1) : null
              return (
                <g key={ser.id + i}>
                  {next && <motion.line initial={false} animate={{ x1: p.x, y1: p.y, x2: next.x, y2: next.y }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} stroke="var(--rule)" strokeWidth={2} />}
                </g>
              )
            }),
          )}
          {SERIES.map((ser, s) => {
            const label = mode === 'recap' ? pos(s, 0) : pos(s, 0)
            return (
              <motion.text key={ser.id + 'l'} initial={false} animate={{ x: mode === 'recap' ? 8 : label.x - 6, y: mode === 'recap' ? label.y + 4 : label.y - 18 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} fontSize={12} fontWeight={700} fill="var(--ink-soft)">
                {ser.name}
              </motion.text>
            )
          })}
          {SERIES.map((ser, s) =>
            ser.items.map((item, i) => {
              const p = pos(s, i)
              const colour = ['var(--accent)', 'var(--gold-bright)', 'var(--rubric)'][s]
              const on = hover?.s === s && hover.i === i
              return (
                <Link key={ser.id + item} to={`/revelation/${ser.ch[i]}`} aria-label={t('{name} {n}: {item} (chapter {ch})', { name: ser.name, n: i + 1, item, ch: ser.ch[i] })}>
                  <motion.g initial={false} animate={{ x: p.x, y: p.y }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: (s * 7 + i) * 0.012 }} onMouseEnter={() => setHover({ s, i })} onMouseLeave={() => setHover(null)} onFocus={() => setHover({ s, i })} onBlur={() => setHover(null)}>
                    <circle r={on ? 17 : 14} fill={colour} stroke="var(--surface)" strokeWidth={3} style={{ transition: 'r .2s' }} />
                    <text y={4.5} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--surface)">
                      {i + 1}
                    </text>
                  </motion.g>
                </Link>
              )
            }),
          )}
        </svg>
      </div>
      <p className="mt-2 min-h-[1.5rem] text-sm font-semibold" aria-live="polite">
        {tip && hover ? t('{name} {n}: {item} (Revelation {ch})', { name: tip.name, n: hover.i + 1, item: tip.items[hover.i], ch: tip.ch[hover.i] }) : t('Hover over or focus a circle to name it. Select it to open that chapter.')}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {SERIES.map((ser) => (
          <div key={ser.id} className="text-sm">
            <p className="font-bold">{ser.name}</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-ink-soft">
              {ser.items.map((it, i) => (
                <li key={it}>
                  <Link to={`/revelation/${ser.ch[i]}`}>{it}</Link>
                </li>
              ))}
            </ol>
            <p className="mt-1 text-xs text-ink-soft">
              <Link to={`/revelation/${ser.interlude.ch}`}>{ser.interlude.label}</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
