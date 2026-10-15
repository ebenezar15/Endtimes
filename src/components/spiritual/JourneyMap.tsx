import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SpiritualStudy } from '../../content/schema'
import { Gloss } from '../Gloss'

const STEP = 170

/** A winding road through the book; a light travels along it as you scroll, lighting each stage. */
export function JourneyMap({ journey }: { journey: SpiritualStudy['journey'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const [dot, setDot] = useState({ x: 50, y: 20, t: 0 })
  const H = journey.length * STEP + 40
  // Winding path: alternates between x=20 and x=80 (percent of a 100-wide viewBox).
  const d = journey.reduce((acc, _, i) => {
    const y = 20 + i * STEP
    const x = i % 2 ? 78 : 22
    if (i === 0) return `M50,0 Q${x},${y / 2} ${x},${y}`
    const py = 20 + (i - 1) * STEP
    return `${acc} C${i % 2 ? 22 : 78},${py + STEP * 0.55} ${x},${y - STEP * 0.55} ${x},${y}`
  }, '')
  const update = (v: number) => {
    const el = path.current
    if (!el) return
    const len = el.getTotalLength()
    const pt = el.getPointAtLength(Math.max(0, Math.min(1, v)) * len)
    setDot({ x: pt.x, y: pt.y, t: v })
  }
  useMotionValueEvent(p, 'change', update)
  useEffect(() => update(0), [])

  return (
    <div ref={ref} className="relative" style={{ height: H }}>
      <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path ref={path} d={d} fill="none" stroke="var(--rule)" strokeWidth={6} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        <motion.path d={d} fill="none" stroke="var(--gold-bright)" strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ pathLength: p }} />
      </svg>
      {/* the travelling light */}
      <div aria-hidden className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${dot.x}%`, top: dot.y }}>
        <span className="block size-5 rounded-full bg-gold-bright shadow-[0_0_24px_6px_rgb(var(--glow)/0.55)]" />
      </div>
      <ol className="relative">
        {journey.map((s, i) => {
          const y = 20 + i * STEP
          const lit = dot.t * (journey.length - 1) >= i - 0.15
          const left = i % 2 === 0
          return (
            <li key={s.id} className="absolute w-[min(26rem,62%)]" style={{ top: y - 26, ...(left ? { left: '30%' } : { right: '30%' }) }}>
              <motion.div initial={false} animate={{ opacity: lit ? 1 : 0.45, scale: lit ? 1 : 0.97 }} transition={{ duration: 0.4 }} className={`leaf p-3 sm:p-4 ${lit ? 'border-gold' : ''}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">Chapters {s.chapters}</p>
                <p className="font-bold leading-snug">{s.stage}</p>
                <p className="mt-1 line-clamp-4 text-sm text-ink-soft">
                  <Gloss>{s.text}</Gloss>
                </p>
                <Link to={`/revelation/${parseInt(s.chapters, 10) || 1}`} className="mt-1 inline-block text-sm">
                  Read chapter {parseInt(s.chapters, 10) || 1}
                </Link>
              </motion.div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
