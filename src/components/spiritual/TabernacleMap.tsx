import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gloss } from '../Gloss'

/**
 * The tabernacle as a map of the journey inward: outer court → holy place → most holy place.
 * Each piece of furniture reappears in Revelation; selecting one lights its echo in the book.
 */
const ITEMS = [
  { id: 'altar', name: 'Bronze altar', court: 'Outer court', x: 120, y: 150, rev: 'Souls under the altar; the first resurrection', refs: 'Revelation 6:9; 20:4', ch: 6, text: 'Where the sacrifice was made. This view reads it as the cross, where the old life is laid down. The souls under the altar and the souls "beheaded" in chapter 20 are those who have lost their old head at the cross and now live and reign with Christ.' },
  { id: 'laver', name: 'Bronze laver', court: 'Outer court', x: 215, y: 150, rev: 'The sea of glass before the throne', refs: 'Revelation 4:6; 15:2', ch: 15, text: 'The basin where priests washed. In Revelation it has become a sea of glass, still and clear, and the overcomers stand on it. On this reading the washing by the word is complete, and the believer stands in it rather than striving for it.' },
  { id: 'lampstand', name: 'Lampstand', court: 'Holy place', x: 315, y: 112, rev: 'Christ among the seven golden lampstands', refs: 'Revelation 1:12-13, 20', ch: 1, text: 'The only light in the holy place. The lampstands are the churches, and Christ walks among them as priest, trimming the lamps. The light of the sanctuary is Christ shining through his people.' },
  { id: 'table', name: 'Table of bread', court: 'Holy place', x: 315, y: 188, rev: 'The hidden manna', refs: 'Revelation 2:17', ch: 2, text: 'Bread kept before God’s face. The overcomer is promised hidden manna: Christ the bread from heaven, fed on inwardly, not earned.' },
  { id: 'incense', name: 'Altar of incense', court: 'Holy place', x: 385, y: 150, rev: 'Golden censer and the prayers of the saints', refs: 'Revelation 8:3-4', ch: 8, text: 'Incense rose before the veil. In chapter 8 the prayers of the saints rise with incense, and fire from the altar is thrown to the earth: prayer that is answered with the trumpets’ wake-up calls.' },
  { id: 'ark', name: 'Ark of the covenant', court: 'Most holy place', x: 470, y: 150, rev: 'The ark seen in the opened temple', refs: 'Revelation 11:19; 21:22', ch: 11, text: 'Behind the veil, the mercy seat. At the seventh trumpet the temple opens and the ark is seen; by chapter 21 there is no temple, because God and the Lamb are its temple. The veil is gone and the whole city is the most holy place.' },
] as const

export function TabernacleMap() {
  const [sel, setSel] = useState<string>('altar')
  const cur = ITEMS.find((i) => i.id === sel) ?? ITEMS[0]
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="leaf p-3">
        <svg viewBox="0 0 560 300" className="h-auto w-full" role="group" aria-label="Floor plan of the tabernacle">
          {/* courts */}
          <rect x={20} y={40} width={520} height={220} rx={10} fill="var(--surface-2)" stroke="var(--rule)" strokeWidth={2} />
          <rect x={270} y={75} width={250} height={150} rx={6} fill="color-mix(in srgb, var(--accent) 8%, var(--surface))" stroke="var(--rule)" strokeWidth={2} />
          <motion.rect x={425} y={75} width={95} height={150} rx={6} fill="url(#glory)" stroke="var(--gold-bright)" strokeWidth={2} animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 4, repeat: Infinity }} />
          <defs>
            <radialGradient id="glory">
              <stop offset="0%" stopColor="var(--gold-bright)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--gold-bright)" stopOpacity="0.08" />
            </radialGradient>
          </defs>
          {/* the veil, torn */}
          <path d="M425,75 L425,138 M425,162 L425,225" stroke="var(--rubric)" strokeWidth={5} />
          <text x={140} y={62} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink-soft)">OUTER COURT</text>
          <text x={347} y={95} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink-soft)">HOLY PLACE</text>
          <text x={472} y={95} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--ink-soft)">MOST HOLY</text>
          {/* gate */}
          <path d="M20,125 V175" stroke="var(--accent)" strokeWidth={6} strokeLinecap="round" />
          <text x={36} y={278} fontSize={12} fill="var(--ink-soft)">gate (east)</text>
          {/* the way in */}
          <motion.path d="M24,150 H500" stroke="var(--gold-bright)" strokeWidth={2} strokeDasharray="6 8" fill="none" animate={{ strokeDashoffset: [0, -28] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
          {ITEMS.map((it, i) => {
            const on = it.id === sel
            return (
              <g key={it.id} role="button" tabIndex={0} aria-pressed={on} aria-label={it.name} className="cursor-pointer" onClick={() => setSel(it.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(it.id))}>
                <motion.circle cx={it.x} cy={it.y} r={on ? 22 : 17} fill={on ? 'var(--accent)' : 'var(--surface)'} stroke="var(--gold-bright)" strokeWidth={on ? 3 : 2} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 220, damping: 14 }} style={{ transformOrigin: `${it.x}px ${it.y}px` }} />
                {on && <motion.circle cx={it.x} cy={it.y} r={22} fill="none" stroke="var(--gold-bright)" strokeWidth={2} initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 1.4, repeat: Infinity }} style={{ transformOrigin: `${it.x}px ${it.y}px` }} />}
                <text x={it.x} y={it.y + 5} textAnchor="middle" fontSize={13} fontWeight={800} fill={on ? 'var(--accent-ink)' : 'var(--ink)'} pointerEvents="none">
                  {i + 1}
                </text>
              </g>
            )
          })}
        </svg>
        <ol className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {ITEMS.map((it, i) => (
            <li key={it.id}>
              <button type="button" onClick={() => setSel(it.id)} className={`chip cursor-pointer ${it.id === sel ? 'border-accent text-accent' : ''}`}>
                {i + 1}. {it.name}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={cur.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="leaf glow-card self-start p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{cur.court}</p>
          <h3 className="text-xl font-bold">{cur.name}</h3>
          <p className="mt-3 rounded-xl bg-surface-2 p-3 text-sm">
            <span className="font-bold">In Revelation: </span>
            {cur.rev} <span className="text-ink-soft">({cur.refs})</span>
          </p>
          <p className="mt-3 leading-relaxed">
            <Gloss>{cur.text}</Gloss>
          </p>
          <Link to={`/revelation/${cur.ch}`} className="mt-3 inline-block text-sm">
            Open Revelation {cur.ch}
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
