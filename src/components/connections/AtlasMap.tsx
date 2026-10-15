import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Atlas, CanonThread } from '../../content/schema'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'
import { ATLAS_BOX, ATLAS_H, ATLAS_K, ATLAS_W, LAND } from './atlasLand'

const COS = Math.cos((34 * Math.PI) / 180)
const proj = (lat: number, lon: number) => [(lon - ATLAS_BOX.lon0) * ATLAS_K * COS, (ATLAS_BOX.lat1 - lat) * ATLAS_K] as const
const line = (pts: [number, number][]) => pts.map(([la, lo], i) => `${i ? 'L' : 'M'}${proj(la, lo).map((n) => n.toFixed(1)).join(',')}`).join(' ')

/** Main rivers, drawn by hand from a few points along each course. */
const RIVERS = [
  { name: 'Euphrates', pts: [[39.6, 39.5], [38.7, 38.7], [36.83, 38.01], [36.0, 38.2], [34.55, 40.89], [33.63, 42.82], [32.54, 44.42], [31.3, 45.3], [30.96, 46.1], [31.0, 47.43], [30.0, 48.4]] as [number, number][] },
  { name: 'Tigris', pts: [[38.3, 39.6], [37.91, 40.24], [37.2, 42.3], [36.36, 43.15], [35.46, 43.26], [34.2, 43.87], [33.3, 44.4], [32.5, 45.8], [31.6, 46.9], [31.0, 47.43]] as [number, number][] },
  { name: 'Nile', pts: [[22.0, 31.4], [24.09, 32.9], [25.7, 32.64], [27.18, 31.18], [28.6, 30.8], [29.85, 31.25], [30.2, 31.2], [31.42, 31.81]] as [number, number][] },
  { name: 'Nile (west branch)', pts: [[30.2, 31.2], [30.8, 30.8], [31.4, 30.4]] as [number, number][] },
  { name: 'Jordan', pts: [[33.2, 35.6], [32.8, 35.6], [32.2, 35.57], [31.78, 35.55]] as [number, number][] },
]
const SEAS = [
  { name: 'The Great Sea', lat: 34.2, lon: 20 },
  { name: 'Aegean', lat: 38.8, lon: 25.0 },
  { name: 'Red Sea', lat: 25.2, lon: 36.3 },
  { name: 'Persian Gulf', lat: 27.6, lon: 51.0 },
  { name: 'Black Sea', lat: 43.2, lon: 34.5 },
]
const FULL = `0 0 ${ATLAS_W} ${ATLAS_H}`
/** Places too close together to label at whole-map zoom; they share one label until zoomed. */
const CLUSTER = new Set(['ephesus', 'smyrna', 'pergamum', 'thyatira', 'sardis', 'philadelphia', 'laodicea', 'hierapolis', 'colossae'])
const ZOOMS: Record<string, { label: string; box: string }> = {
  all: { label: 'Whole map', box: FULL },
  asia: { label: 'Seven churches', box: (() => { const [x0, y0] = proj(40.2, 25.6); const [x1, y1] = proj(37.0, 29.8); return `${x0} ${y0} ${x1 - x0} ${y1 - y0}` })() },
  levant: { label: 'Holy Land', box: (() => { const [x0, y0] = proj(33.8, 33.6); const [x1, y1] = proj(30.6, 36.8); return `${x0} ${y0} ${x1 - x0} ${y1 - y0}` })() },
  mesopotamia: { label: 'Mesopotamia', box: (() => { const [x0, y0] = proj(38.0, 37.0); const [x1, y1] = proj(29.5, 49.5); return `${x0} ${y0} ${x1 - x0} ${y1 - y0}` })() },
}

/**
 * An atlas of the places behind Revelation, in the manner of a historical atlas: scrub through
 * the eras, watch the places of each age light up and its journeys draw themselves, zoom in, and
 * open any place to see its story, its use in Revelation and its setting.
 */
export function AtlasMap({ atlas, threads }: { atlas: Atlas; threads: CanonThread[] }) {
  const [era, setEra] = useState(atlas.eras.at(-1)!.id)
  const [playing, setPlaying] = useState(false)
  const [sel, setSel] = useState<string | null>('patmos')
  const [zoom, setZoom] = useState<keyof typeof ZOOMS>('all')
  const [journey, setJourney] = useState<string | null>(null)
  const [tab, setTab] = useState<'story' | 'revelation' | 'context'>('revelation')
  const byId = useMemo(() => new Map(atlas.places.map((p) => [p.id, p])), [atlas])
  const threadTitle = useMemo(() => new Map(threads.map((t) => [t.id, t.title])), [threads])
  const eraIdx = atlas.eras.findIndex((e) => e.id === era)
  const journeys = atlas.journeys.filter((j) => j.era === era)
  const shown = journey ? atlas.journeys.filter((j) => j.id === journey) : journeys

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => {
      const next = atlas.eras[(eraIdx + 1) % atlas.eras.length].id
      setEra(next)
      setJourney(null)
      if (eraIdx + 1 >= atlas.eras.length) setPlaying(false)
    }, 4200)
    return () => clearTimeout(t)
  }, [playing, eraIdx, atlas.eras])
  // Scale marks and labels with the zoom so they stay readable.
  const scale = zoom === 'all' ? 1 : zoom === 'mesopotamia' ? 0.6 : 0.3
  const p = sel ? byId.get(sel) : undefined
  const cur = atlas.eras[eraIdx]

  return (
    <div>
      {/* era timeline */}
      <div className="leaf p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary text-sm" onClick={() => (eraIdx === atlas.eras.length - 1 && !playing && setEra(atlas.eras[0].id), setPlaying((v) => !v))}>
            <Icon name={playing ? 'pause' : 'play'} size={14} /> {playing ? 'Pause' : 'Play through history'}
          </button>
          <div className="ml-auto flex flex-wrap gap-1.5">
            {Object.entries(ZOOMS).map(([k, z]) => (
              <button key={k} type="button" onClick={() => setZoom(k as keyof typeof ZOOMS)} className={`chip cursor-pointer ${zoom === k ? 'border-accent text-accent' : ''}`}>
                {z.label}
              </button>
            ))}
          </div>
        </div>
        <ol className="relative mt-4 grid grid-cols-6 gap-1" aria-label="Eras">
          <span aria-hidden className="absolute left-0 right-0 top-[11px] h-0.5 bg-rule" />
          <motion.span aria-hidden className="absolute left-0 top-[11px] h-0.5 origin-left bg-gold-bright" animate={{ width: `${((eraIdx + 0.5) / atlas.eras.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          {atlas.eras.map((e, i) => {
            const on = e.id === era
            return (
              <li key={e.id} className="relative text-center">
                <button type="button" aria-pressed={on} onClick={() => (setEra(e.id), setJourney(null), setPlaying(false))} className="group w-full">
                  <motion.span className="mx-auto block size-6 rounded-full border-2" animate={{ scale: on ? 1.25 : 1, backgroundColor: i <= eraIdx ? 'var(--gold-bright)' : 'var(--surface)', borderColor: on ? 'var(--accent)' : i <= eraIdx ? 'var(--gold-bright)' : 'var(--rule)' }} />
                  <span className={`mt-1 block text-[0.7rem] font-bold leading-tight sm:text-xs ${on ? 'text-accent' : 'text-ink-soft group-hover:text-ink'}`}>{e.label}</span>
                  <span className="hidden text-[0.65rem] text-ink-soft sm:block">{e.years}</span>
                </button>
              </li>
            )
          })}
        </ol>
        <AnimatePresence mode="wait">
          <motion.p key={cur.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-ink-soft">
            <span className="font-bold text-ink">{cur.label}, {cur.years}.</span> {cur.summary}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="leaf overflow-hidden p-0">
          <motion.svg viewBox={FULL} animate={{ viewBox: ZOOMS[zoom].box }} transition={{ duration: 1.1, ease: [0.6, 0, 0.2, 1] }} className="block h-auto w-full touch-manipulation" role="group" aria-label={`Map of the biblical world, ${cur.label}`}>
            <defs>
              <radialGradient id="atlas-sea" cx="45%" cy="40%" r="75%">
                <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 22%, var(--bg))" />
                <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 10%, var(--bg-2))" />
              </radialGradient>
              <pattern id="atlas-grid" width={ATLAS_K * COS * 4} height={ATLAS_K * 4} patternUnits="userSpaceOnUse">
                <path d={`M ${ATLAS_K * COS * 4} 0 L 0 0 0 ${ATLAS_K * 4}`} fill="none" stroke="var(--rule)" strokeWidth={0.6} strokeOpacity={0.5} />
              </pattern>
              <filter id="atlas-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgb(var(--shadow))" floodOpacity="0.25" />
              </filter>
            </defs>
            <rect width={ATLAS_W} height={ATLAS_H} fill="url(#atlas-sea)" />
            <rect width={ATLAS_W} height={ATLAS_H} fill="url(#atlas-grid)" />
            <path d={LAND} fill="color-mix(in srgb, var(--gold-bright) 12%, var(--surface))" stroke="color-mix(in srgb, var(--gold) 55%, var(--rule))" strokeWidth={1.1 * scale} filter="url(#atlas-shadow)" />
            {RIVERS.map((r) => (
              <path key={r.name} d={line(r.pts)} fill="none" stroke="color-mix(in srgb, var(--accent) 60%, var(--surface))" strokeWidth={2.2 * scale} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
                <title>{r.name}</title>
              </path>
            ))}
            {SEAS.map((s) => {
              const [x, y] = proj(s.lat, s.lon)
              return (
                <text key={s.name} x={x} y={y} textAnchor="middle" fontSize={15 * scale} fontStyle="italic" fontFamily="var(--font-serif)" fill="var(--accent)" opacity={0.75} letterSpacing={2 * scale}>
                  {s.name}
                </text>
              )
            })}

            {/* journeys */}
            {shown.map((j) => {
              const pts = j.stops.map((id) => byId.get(id)).filter(Boolean).map((pl) => proj(pl!.lat, pl!.lon))
              const d = pts.reduce((acc, [x, y], i) => {
                if (!i) return `M${x},${y}`
                const [px, py] = pts[i - 1]
                const mx = (px + x) / 2
                const my = (py + y) / 2 - Math.hypot(x - px, y - py) * 0.18
                return `${acc} Q${mx},${my} ${x},${y}`
              }, '')
              return (
                <g key={j.id + era}>
                  <motion.path d={d} fill="none" stroke="var(--rubric)" strokeWidth={3 * scale} strokeDasharray={`${8 * scale} ${6 * scale}`} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }} transition={{ duration: 2.2, ease: 'easeInOut' }} />
                  <motion.circle r={6 * scale} fill="var(--rubric)" style={{ offsetPath: `path("${d}")` }} initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: ['0%', '100%'] }} transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }} />
                </g>
              )
            })}

            {zoom === 'all' && atlas.places.some((pl) => CLUSTER.has(pl.id) && pl.eras.includes(era)) && (
              <g className="cursor-pointer" onClick={() => setZoom('asia')}>
                <text x={proj(39.6, 28.2)[0]} y={proj(39.6, 28.2)[1]} fontSize={13} fontWeight={800} fill="var(--accent)" stroke="var(--surface)" strokeWidth={3.5} paintOrder="stroke">
                  Seven churches ⊕
                </text>
              </g>
            )}
            {/* places */}
            {atlas.places.map((pl) => {
              const [x, y] = proj(pl.lat, pl.lon)
              const active = pl.eras.includes(era)
              const isSel = pl.id === sel
              const r = (active ? 6.5 : 3.5) * scale
              return (
                <g key={pl.id} role="button" tabIndex={0} aria-label={pl.name} aria-pressed={isSel} className="cursor-pointer" onClick={() => setSel(pl.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(pl.id))}>
                  {active && <motion.circle cx={x} cy={y} fill="none" stroke="var(--gold-bright)" strokeWidth={2 * scale} initial={{ r, opacity: 0.9 }} animate={{ r: r * 3.2, opacity: 0 }} transition={{ duration: 2.2, repeat: Infinity, delay: (x % 7) * 0.2 }} />}
                  <motion.circle cx={x} cy={y} animate={{ r: isSel ? r * 1.6 : r, opacity: active ? 1 : 0.4 }} fill={isSel ? 'var(--rubric)' : active ? 'var(--gold-bright)' : 'var(--ink-soft)'} stroke="var(--surface)" strokeWidth={1.6 * scale} />
                  {(isSel || (active && !(zoom === 'all' && CLUSTER.has(pl.id)))) && (
                    <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={x + 9 * scale} y={y + 4 * scale} fontSize={13 * scale} fontWeight={700} fill="var(--ink)" stroke="var(--surface)" strokeWidth={3.5 * scale} paintOrder="stroke" strokeLinejoin="round">
                      {pl.name}
                    </motion.text>
                  )}
                  <circle cx={x} cy={y} r={14 * scale} fill="transparent" />
                </g>
              )
            })}
          </motion.svg>
          {journeys.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-rule p-3 text-sm">
              <span className="mr-1 text-xs font-bold uppercase tracking-widest text-rubric">Journeys</span>
              {journeys.map((j) => (
                <button key={j.id} type="button" onClick={() => setJourney(journey === j.id ? null : j.id)} className={`chip cursor-pointer ${journey === j.id ? 'border-rubric text-rubric' : ''}`}>
                  {j.title}
                </button>
              ))}
            </div>
          )}
          <AnimatePresence>
            {journey && (
              <motion.p key={journey} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden px-3 pb-3 text-sm">
                <Gloss>{atlas.journeys.find((j) => j.id === journey)!.note}</Gloss> <span className="text-ink-soft">{atlas.journeys.find((j) => j.id === journey)!.refs.join('; ')}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {p && (
            <motion.div key={p.id} initial={{ opacity: 0, x: 20, rotateY: -12 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }} className="leaf glow-card self-start p-5 lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                {p.kind} · {p.eras.map((e) => atlas.eras.find((x) => x.id === e)?.label).join(', ')}
              </p>
              <h3 className="text-2xl font-bold">{p.name}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5" role="tablist">
                {([['revelation', 'In Revelation'], ['story', 'In the story'], ['context', 'Setting']] as const).map(([k, l]) => (
                  <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`btn text-xs ${tab === k ? 'btn-primary' : ''}`}>
                    {l}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 leading-relaxed">
                  <Gloss>{p[tab]}</Gloss>
                </motion.p>
              </AnimatePresence>
              <p className="mt-3 text-sm text-ink-soft">{p.refs.join('; ')}</p>
              {p.threads.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.threads.map((t) => (
                    <Link key={t} to={`/revelation/connections?thread=${t}`} className="chip text-xs no-underline hover:border-accent">
                      <Icon name="motion" size={12} /> {threadTitle.get(t) ?? t}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
