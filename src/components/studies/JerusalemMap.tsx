import { AnimatePresence, motion } from 'framer-motion'
import type { JosephusStory } from '../../content/schema'
import { t } from '../../lib/i18n'

type MapState = JosephusStory['scenes'][number]['map']
type Area = MapState['focus'][number]

/** Stylised Jerusalem in AD 70, north at the top. Shapes are schematic, after the usual reconstructions. */
const AREAS: Record<Exclude<Area, 'siege-wall' | 'first-wall' | 'second-wall' | 'third-wall'>, { d: string; label: () => string; lx: number; ly: number }> = {
  bezetha: { d: 'M170,70 L360,58 L372,150 L250,168 L176,160 Z', label: () => t('Bezetha (New City)'), lx: 268, ly: 112 },
  'upper-city': { d: 'M150,232 L300,214 L306,352 L170,370 Z', label: () => t('Upper City'), lx: 226, ly: 300 },
  'lower-city': { d: 'M306,300 L372,300 L362,420 L322,440 L306,352 Z', label: () => t('Lower City'), lx: 338, ly: 372 },
  temple: { d: 'M330,168 L440,160 L446,298 L334,300 Z', label: () => t('Temple'), lx: 388, ly: 236 },
  antonia: { d: 'M318,150 L360,147 L362,178 L320,181 Z', label: () => t('Antonia'), lx: 340, ly: 140 },
  'herods-palace': { d: 'M150,236 L188,232 L190,276 L152,280 Z', label: () => t('Herod’s palace'), lx: 170, ly: 228 },
  'mount-of-olives': { d: 'M500,130 C560,150 590,250 560,360 C540,380 505,360 500,330 Z', label: () => t('Mount of Olives'), lx: 535, ly: 250 },
  'mount-scopus': { d: 'M400,10 C470,0 560,20 570,60 C530,80 440,70 400,50 Z', label: () => t('Mount Scopus'), lx: 485, ly: 40 },
  siloam: { d: 'M318,440 m-12,0 a12,9 0 1,0 24,0 a12,9 0 1,0 -24,0', label: () => t('Pool of Siloam'), lx: 318, ly: 468 },
}
const WALLS: Record<'first-wall' | 'second-wall' | 'third-wall', { d: string; label: () => string }> = {
  'first-wall': { d: 'M150,232 L300,214 L330,168 L440,160 L446,298 L372,300 L362,420 L322,446 L170,372 Z', label: () => t('First wall') },
  'second-wall': { d: 'M206,224 L250,170 L320,160', label: () => t('Second wall') },
  'third-wall': { d: 'M150,232 L140,120 L170,62 L362,50 L380,150 L440,160', label: () => t('Third wall') },
}
const SIEGE = 'M300,30 C470,20 590,90 580,250 C575,420 440,500 300,494 C150,490 70,420 70,260 C70,110 150,36 300,30 Z'

function Flames({ area }: { area: keyof typeof AREAS }) {
  const a = AREAS[area]
  return (
    <g pointerEvents="none">
      {Array.from({ length: 9 }, (_, i) => {
        const x = a.lx + ((i * 37) % 60) - 30
        const y = a.ly + ((i * 23) % 40) - 20
        return (
          <motion.path
            key={i}
            d={`M${x},${y} c6,-10 2,-18 0,-26 c-2,8 -10,14 -8,22 c-6,-4 -6,-10 -4,-14 c-8,8 -6,18 12,18 z`}
            fill={i % 2 ? 'var(--rubric)' : 'var(--gold-bright)'}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0.5, 1, 0.6], scale: [0.8, 1.25, 0.9], y: [0, -4, 0] }}
            transition={{ duration: 0.9 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.12 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        )
      })}
    </g>
  )
}

function Camp({ area }: { area: keyof typeof AREAS }) {
  const a = AREAS[area]
  const pts = [-34, 0, 34]
  return (
    <motion.g initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
      {pts.map((dx, i) => (
        <g key={i} transform={`translate(${a.lx + dx},${a.ly + 22})`}>
          <path d="M-10,8 L0,-8 L10,8 Z" fill="color-mix(in srgb, var(--rubric) 70%, var(--surface))" stroke="var(--rubric)" strokeWidth={1.2} />
        </g>
      ))}
      {/* eagle standard */}
      <line x1={a.lx} y1={a.ly - 2} x2={a.lx} y2={a.ly - 30} stroke="var(--gold)" strokeWidth={2} />
      <motion.path d={`M${a.lx - 9},${a.ly - 30} q9,-10 18,0 q-9,-4 -18,0`} fill="var(--gold-bright)" animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ transformOrigin: `${a.lx}px ${a.ly - 30}px` }} />
    </motion.g>
  )
}

export function JerusalemMap({ state, caption }: { state: MapState; caption?: string }) {
  const isFocus = (a: Area) => state.focus.includes(a)
  return (
    <div className="leaf overflow-hidden p-2">
      <svg viewBox="0 0 600 500" className="block h-auto w-full" role="img" aria-label={caption ?? t('Map of Jerusalem in AD 70')}>
        <defs>
          <radialGradient id="jm-ground" cx="45%" cy="50%" r="70%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--gold-bright) 14%, var(--surface))" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--gold) 10%, var(--bg-2))" />
          </radialGradient>
          <filter id="jm-glow">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <rect width={600} height={500} fill="url(#jm-ground)" />
        {/* valleys */}
        <path d="M470,20 C480,150 470,300 430,470" fill="none" stroke="color-mix(in srgb, var(--accent) 35%, transparent)" strokeWidth={10} strokeLinecap="round" />
        <text x={482} y={420} fontSize={11} fill="var(--accent)" fontStyle="italic" transform="rotate(-80 482 420)">
          {t('Kidron Valley')}
        </text>
        <path d="M120,200 C110,320 180,440 330,470" fill="none" stroke="color-mix(in srgb, var(--accent) 25%, transparent)" strokeWidth={8} strokeLinecap="round" />
        <text x={96} y={360} fontSize={11} fill="var(--accent)" fontStyle="italic">
          {t('Hinnom Valley')}
        </text>
        {/* areas */}
        {(Object.keys(AREAS) as (keyof typeof AREAS)[]).map((k) => {
          const a = AREAS[k]
          const f = isFocus(k)
          const burning = state.fire.includes(k)
          const hill = k === 'mount-of-olives' || k === 'mount-scopus'
          return (
            <g key={k}>
              {f && <motion.path d={a.d} fill="var(--gold-bright)" filter="url(#jm-glow)" initial={{ opacity: 0 }} animate={{ opacity: [0.35, 0.7, 0.35] }} transition={{ duration: 2, repeat: Infinity }} />}
              <motion.path d={a.d} animate={{ fill: burning ? 'color-mix(in srgb, var(--rubric) 45%, var(--surface))' : hill ? 'color-mix(in srgb, var(--agree) 18%, var(--surface))' : k === 'temple' ? 'color-mix(in srgb, var(--gold-bright) 40%, var(--surface))' : 'var(--surface)' }} stroke={f ? 'var(--gold)' : 'var(--rule)'} strokeWidth={f ? 2.5 : 1.2} transition={{ duration: 0.8 }} />
              <text x={a.lx} y={a.ly + 4} textAnchor="middle" fontSize={k === 'antonia' || k === 'herods-palace' || k === 'siloam' ? 10 : 12.5} fontWeight={700} fill="var(--ink)" stroke="var(--surface)" strokeWidth={3} paintOrder="stroke">
                {a.label()}
              </text>
            </g>
          )
        })}
        {/* the temple building */}
        <AnimatePresence>
          {!state.fire.includes('temple') ? (
            <motion.g key="sanctuary" exit={{ opacity: 0, y: 10 }} transition={{ duration: 1 }}>
              <rect x={378} y={196} width={24} height={30} fill="color-mix(in srgb, var(--gold-bright) 60%, var(--surface))" stroke="var(--gold)" />
            </motion.g>
          ) : (
            <motion.g key="ruin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={370 + i * 8} y={222 - (i % 2) * 4} width={7} height={6} fill="var(--ink-soft)" />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
        {/* walls */}
        {(Object.keys(WALLS) as (keyof typeof WALLS)[]).map((k) => {
          const broken = state.breached.includes(k)
          return (
            <motion.path key={k} d={WALLS[k].d} fill="none" animate={{ stroke: broken ? 'var(--rubric)' : 'color-mix(in srgb, var(--gold) 80%, var(--ink))', strokeDasharray: broken ? '6 10' : '0 0', opacity: broken ? 0.75 : 1 }} strokeWidth={isFocus(k) ? 6 : 4} strokeLinejoin="round" strokeLinecap="round" transition={{ duration: 0.8 }}>
              <title>{WALLS[k].label()}</title>
            </motion.path>
          )
        })}
        {/* the Roman siege wall (circumvallation) */}
        <AnimatePresence>
          {state.siegeWall && (
            <motion.path key="siege" d={SIEGE} fill="none" stroke="var(--rubric)" strokeWidth={4} strokeDasharray="2 7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2.5, ease: 'easeInOut' }} />
          )}
        </AnimatePresence>
        {state.siegeWall && (
          <text x={92} y={150} fontSize={11.5} fontWeight={800} fill="var(--rubric)" stroke="var(--surface)" strokeWidth={3} paintOrder="stroke">
            {t('Roman siege wall')}
          </text>
        )}
        {/* Roman camps */}
        <AnimatePresence>
          {state.romans.filter((r): r is keyof typeof AREAS => r in AREAS).map((r) => (
            <Camp key={r} area={r} />
          ))}
        </AnimatePresence>
        {state.fire.filter((f): f is keyof typeof AREAS => f in AREAS).map((f) => (
          <Flames key={f} area={f} />
        ))}
        <g transform="translate(560,470)">
          <path d="M0,-16 L5,0 L0,-4 L-5,0 Z" fill="var(--ink)" />
          <text y={12} textAnchor="middle" fontSize={11} fontWeight={800} fill="var(--ink)">
            {t('N')}
          </text>
        </g>
      </svg>
      {caption && <p className="px-2 pb-1 pt-2 text-center text-sm font-semibold text-ink-soft">{caption}</p>}
    </div>
  )
}
