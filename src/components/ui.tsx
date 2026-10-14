import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** Card whose highlight follows the pointer. */
export function GlowCard({ to, children, accent, className = '' }: { to: string; children: ReactNode; accent?: string; className?: string }) {
  return (
    <Link
      to={to}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={`leaf glow-card block h-full p-5 text-ink no-underline transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-accent ${className}`}
      style={accent ? { borderTop: `3px solid ${accent}` } : undefined}
    >
      {children}
    </Link>
  )
}

/** Counts up from zero the first time it scrolls into view. */
export function CountUp({ to, className = '' }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  )
}
