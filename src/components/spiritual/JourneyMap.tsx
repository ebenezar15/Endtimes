import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SpiritualStudy } from '../../content/schema'
import { Gloss } from '../Gloss'
import { t } from '../../lib/i18n'

/** A winding road through the book; a light travels along it as you scroll, lighting each stage. */
export function JourneyMap({ journey }: { journey: SpiritualStudy['journey'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const path = useRef<SVGPathElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const [dot, setDot] = useState({ x: 50, y: 0, t: 0 })
  // Stage cards sit in normal flow; the road is drawn through their measured centres so nothing overlaps.
  const [layout, setLayout] = useState<{ H: number; ys: number[] }>({ H: 0, ys: [] })

  const measure = useCallback(() => {
    const root = ref.current
    if (!root) return
    const ys = items.current.map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : 0))
    setLayout({ H: root.offsetHeight, ys })
  }, [])
  useLayoutEffect(measure, [measure, journey])
  useEffect(() => {
    const ro = new ResizeObserver(measure)
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [measure])

  const { H, ys } = layout
  const d = ys.reduce((acc, y, i) => {
    const x = i % 2 ? 78 : 22
    if (i === 0) return `M50,0 Q${x},${y / 2} ${x},${y}`
    const py = ys[i - 1]
    const gap = y - py
    return `${acc} C${i % 2 ? 22 : 78},${py + gap * 0.55} ${x},${y - gap * 0.55} ${x},${y}`
  }, '')

  const update = useCallback((v: number) => {
    const el = path.current
    if (!el || !el.getAttribute('d')) return
    const len = el.getTotalLength()
    const pt = el.getPointAtLength(Math.max(0, Math.min(1, v)) * len)
    setDot({ x: pt.x, y: pt.y, t: v })
  }, [])
  useMotionValueEvent(p, 'change', update)
  useEffect(() => update(p.get()), [d, update, p])

  // A stage is lit once the light has passed its centre.
  const litUpTo = dot.y

  return (
    <div ref={ref} className="relative py-6">
      {H > 0 && (
        <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path ref={path} d={d} fill="none" stroke="var(--rule)" strokeWidth={6} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          <motion.path d={d} fill="none" stroke="var(--gold-bright)" strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ pathLength: p }} />
        </svg>
      )}
      {/* the travelling light */}
      {H > 0 && (
        <div aria-hidden className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${dot.x}%`, top: dot.y }}>
          <span className="block size-5 rounded-full bg-gold-bright shadow-[0_0_24px_6px_rgb(var(--glow)/0.55)]" />
        </div>
      )}
      <ol className="relative space-y-10">
        {journey.map((s, i) => {
          const lit = ys.length > 0 && litUpTo >= ys[i] - 30
          const left = i % 2 === 0
          const ch = parseInt(s.chapters, 10) || 1
          return (
            <li
              key={s.id}
              ref={(el) => {
                items.current[i] = el
              }}
              className="relative z-20 w-[min(26rem,66%)]"
              style={left ? { marginLeft: '30%' } : { marginLeft: 'auto', marginRight: '30%' }}
            >
              <motion.div initial={false} animate={{ opacity: lit ? 1 : 0.5, scale: lit ? 1 : 0.97 }} transition={{ duration: 0.4 }} className={`leaf p-3 sm:p-4 ${lit ? 'border-gold' : ''}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Chapters {n}', { n: s.chapters })}</p>
                <p className="font-bold leading-snug">{s.stage}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  <Gloss>{s.text}</Gloss>
                </p>
                <Link to={`/revelation/${ch}`} className="mt-1 inline-block text-sm">
                  {t('Read chapter {n}', { n: ch })}
                </Link>
              </motion.div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
