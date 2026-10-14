import { useMemo } from 'react'
import { core as content, hermeneuticViews, millennialViews } from '../lib/core'
import { usePositionColors } from '../lib/theme'
import { useApp } from '../lib/store'

const C = 300
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const
}
function arc(r1: number, r2: number, a0: number, a1: number) {
  const [x0, y0] = polar(r2, a0)
  const [x1, y1] = polar(r2, a1)
  const [x2, y2] = polar(r1, a1)
  const [x3, y3] = polar(r1, a0)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${x0},${y0} A${r2},${r2} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r1},${r1} 0 ${large} 0 ${x3},${y3}Z`
}
/** Path for text along an arc; flips on the lower half so labels stay upright. */
function textArc(r: number, a0: number, a1: number) {
  const mid = (a0 + a1) / 2
  const lower = mid > 90 && mid < 270
  const [s, e] = lower ? [a1, a0] : [a0, a1]
  const [x0, y0] = polar(r, s)
  const [x1, y1] = polar(r, e)
  return `M${x0},${y0} A${r},${r} 0 0 ${lower ? 0 : 1} ${x1},${y1}`
}

const RING = { m: [70, 146], h: [214, 286] } as const
const GAP = [RING.m[1], RING.h[0]] as const

export type RotaProps = {
  selected: string | null
  highlight: string[]
  onSelect: (id: string) => void
}

export function Rota({ selected, highlight, onSelect }: RotaProps) {
  const color = usePositionColors()
  const { lensOn, lens } = useApp()
  const mine = lensOn ? [lens.millennial, lens.hermeneutic] : []
  const segs = useMemo(() => {
    const m = millennialViews.map((p, i, all) => ({ p, ring: 'm' as const, a0: (i * 360) / all.length + 1.5, a1: ((i + 1) * 360) / all.length - 1.5 }))
    const off = 15
    const h = hermeneuticViews.map((p, i, all) => ({ p, ring: 'h' as const, a0: off + (i * 360) / all.length + 1.2, a1: off + ((i + 1) * 360) / all.length - 1.2 }))
    return [...m, ...h]
  }, [])
  const mid = (id: string) => {
    const s = segs.find((x) => x.p.id === id)
    return s ? { a: (s.a0 + s.a1) / 2 } : null
  }
  const focus = selected ? [selected] : highlight
  const links = content.combinations.filter((c) => c.frequency !== 'incompatible')
  const lit = (c: (typeof links)[number]) => focus.length === 0 || focus.includes(c.millennial) || focus.includes(c.hermeneutic)
  const visible = links.filter((c) => (focus.length ? lit(c) : c.frequency === 'common'))

  return (
    <svg viewBox="0 0 600 600" className="h-auto w-full max-w-[38rem] select-none" role="group" aria-label="Map of eschatological positions: inner ring, the four millennial views; outer ring, the six ways of reading Revelation. Threads show which pairings are common.">
      <defs>
        {segs.map((s) => {
          const r = s.ring === 'm' ? (RING.m[0] + RING.m[1]) / 2 - 5 : (RING.h[0] + RING.h[1]) / 2 - 5
          return <path key={s.p.id} id={`ta-${s.p.id}`} d={textArc(r, s.a0, s.a1)} fill="none" />
        })}
        <radialGradient id="rota-core" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--surface)" />
          <stop offset="100%" stopColor="var(--surface-2)" />
        </radialGradient>
      </defs>

      {/* outer border, ticks like a manuscript rota */}
      <circle cx={C} cy={C} r={296} fill="none" stroke="var(--gold-bright)" strokeWidth={2} />
      <circle cx={C} cy={C} r={290} fill="none" stroke="var(--rule)" strokeWidth={1} />
      <g className="rota-spin" aria-hidden>
      {Array.from({ length: 72 }, (_, i) => {
        const [x0, y0] = polar(290, i * 5)
        const [x1, y1] = polar(i % 6 === 0 ? 282 : 286, i * 5)
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--gold)" strokeWidth={i % 6 === 0 ? 1.5 : 0.75} />
      })}
      </g>

      {/* ring segments */}
      {segs.map((s, i) => {
        const [r1, r2] = RING[s.ring]
        const col = color(s.p.id)
        const dim = focus.length > 0 && !focus.includes(s.p.id) && !(selected && links.some((c) => lit(c) && (c.millennial === s.p.id || c.hermeneutic === s.p.id)))
        const isMine = mine.includes(s.p.id)
        return (
          <g
            key={s.p.id}
            role="button"
            tabIndex={0}
            aria-label={`${s.p.shortName}: ${s.p.name}${isMine ? ', my view' : ''}`}
            aria-pressed={selected === s.p.id}
            onClick={() => onSelect(s.p.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(s.p.id))}
            className="rota-seg cursor-pointer outline-none [&:focus-visible>path:first-child]:stroke-[var(--accent)] [&:focus-visible>path:first-child]:[stroke-width:4]"
            style={{ opacity: dim ? 0.35 : 1, animationDelay: `${0.05 * i}s` }}
          >
            <path d={arc(r1, r2, s.a0, s.a1)} fill={col.base} stroke={selected === s.p.id ? 'var(--ink)' : 'var(--gold-bright)'} strokeWidth={selected === s.p.id ? 3 : 1.2} />
            <text fontSize={s.ring === 'm' ? 15 : 13.5} fontWeight={500} fill={col.ink} letterSpacing="0.02em">
              <textPath href={`#ta-${s.p.id}`} startOffset="50%" textAnchor="middle">
                {s.p.shortName}
              </textPath>
            </text>
            {isMine && (() => {
              const [x, y] = polar(r2 - 9, (s.a0 + s.a1) / 2 + (s.a1 - s.a0) * 0.36)
              return <text x={x} y={y + 4} textAnchor="middle" fontSize={13} fill={col.ink} aria-hidden>✦</text>
            })()}
          </g>
        )
      })}

      {/* threads: cords running in the band between the rings, like the concentric bands of a rota */}
      <g fill="none" aria-hidden pointerEvents="none">
        {visible.map((c, lane) => {
          const a = mid(c.millennial)
          const b = mid(c.hermeneutic)
          if (!a || !b) return null
          const r = GAP[0] + 6 + (lane * (GAP[1] - GAP[0] - 12)) / Math.max(visible.length - 1, 1)
          let d = b.a - a.a
          if (d > 180) d -= 360
          if (d < -180) d += 360
          const [x0, y0] = polar(RING.m[1], a.a)
          const [xa, ya] = polar(r, a.a)
          const [xb, yb] = polar(r, a.a + d)
          const [x1, y1] = polar(RING.h[0], b.a)
          const path = `M${x0},${y0} L${xa},${ya} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${xb},${yb} L${x1},${y1}`
          const w = c.frequency === 'common' ? 2.6 : c.frequency === 'occasional' ? 1.8 : 1.3
          return (
            <g key={c.millennial + c.hermeneutic}>
              <path
                className={c.frequency === 'common' ? 'rota-thread' : 'rota-thread rota-thread-dashed'}
                pathLength={1}
                style={{ animationDelay: `${0.3 + lane * 0.05}s`, ['--dash' as string]: c.frequency === 'rare' ? '0.006 0.016' : '0.022 0.012' }}
                d={path}
                stroke={c.frequency === 'common' ? 'var(--gold-bright)' : 'var(--ink-soft)'}
                strokeWidth={w}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={x0} cy={y0} r={3} fill="var(--gold-bright)" />
              <circle cx={x1} cy={y1} r={3} fill="var(--gold-bright)" />
            </g>
          )
        })}
      </g>

      {/* core */}
      <circle cx={C} cy={C} r={64} fill="url(#rota-core)" stroke="var(--gold-bright)" strokeWidth={2} />
      <circle cx={C} cy={C} r={58} fill="none" stroke="var(--rule)" strokeDasharray="1 5" strokeLinecap="round" />
      <text x={C} y={C - 6} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize={21} fill="var(--rubric)">
        χίλια ἔτη
      </text>
      <text x={C} y={C + 13} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic" fontSize={11.5} fill="var(--ink-soft)">
        “a thousand years”
      </text>
      <text x={C} y={C + 29} textAnchor="middle" fontSize={9.5} fill="var(--ink-soft)">
        Revelation 20:1–10
      </text>
    </svg>
  )
}
