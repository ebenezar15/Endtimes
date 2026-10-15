import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Revelation 5: a scroll "written within and on the back, sealed with seven seals".
 * The seals break one by one, the scroll unrolls, and light spills out. Click to replay.
 */
export function SealedScroll() {
  const [run, setRun] = useState(0)
  const [broken, setBroken] = useState(0)
  useEffect(() => {
    setBroken(0)
    let n = 0
    const t = setInterval(() => {
      n += 1
      setBroken(n)
      if (n >= 7) clearInterval(t)
    }, 420)
    return () => clearInterval(t)
  }, [run])
  const open = broken >= 7
  return (
    <button type="button" onClick={() => setRun((r) => r + 1)} className="block w-full" aria-label="Replay: the seven seals break and the scroll opens">
      <svg viewBox="0 0 420 260" className="h-auto w-full" role="img" aria-hidden>
        <defs>
          <linearGradient id="parch" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--gold-bright) 30%, var(--surface))" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--gold) 25%, var(--surface))" />
          </linearGradient>
          <radialGradient id="scroll-light">
            <stop offset="0%" stopColor="var(--gold-bright)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--gold-bright)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.ellipse cx={210} cy={130} rx={180} ry={110} fill="url(#scroll-light)" animate={{ opacity: open ? 0.85 : 0.15, scale: open ? 1 : 0.6 }} transition={{ duration: 1.2 }} style={{ transformOrigin: '210px 130px' }} />
        {/* the sheet unrolls from the centre */}
        <motion.rect x={60} y={70} height={120} rx={4} fill="url(#parch)" stroke="var(--gold)" strokeWidth={1.5} animate={{ width: open ? 300 : 40, x: open ? 60 : 190 }} transition={{ duration: 1, ease: [0.6, 0, 0.2, 1] }} />
        {open &&
          Array.from({ length: 7 }, (_, i) => (
            <motion.line key={i} x1={84} x2={336 - (i % 3) * 30} y1={92 + i * 14} y2={92 + i * 14} stroke="var(--ink-soft)" strokeWidth={2} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.55 }} transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }} />
          ))}
        {/* rollers */}
        <motion.g animate={{ x: open ? -130 : 0 }} transition={{ duration: 1, ease: [0.6, 0, 0.2, 1] }}>
          <rect x={176} y={60} width={22} height={140} rx={11} fill="color-mix(in srgb, var(--gold) 70%, var(--ink))" />
        </motion.g>
        <motion.g animate={{ x: open ? 130 : 0 }} transition={{ duration: 1, ease: [0.6, 0, 0.2, 1] }}>
          <rect x={222} y={60} width={22} height={140} rx={11} fill="color-mix(in srgb, var(--gold) 70%, var(--ink))" />
        </motion.g>
        {/* seven seals along the closed edge */}
        {Array.from({ length: 7 }, (_, i) => {
          const y = 76 + i * 18
          const gone = i < broken
          return (
            <g key={i + '-' + run}>
              <motion.circle cx={210} cy={y} r={8} fill="var(--rubric)" stroke="color-mix(in srgb, var(--rubric) 60%, black)" strokeWidth={1.5} animate={gone ? { scale: [1, 1.5, 0], opacity: [1, 1, 0], x: i % 2 ? 26 : -26, rotate: i % 2 ? 90 : -90 } : { scale: 1, opacity: 1, x: 0 }} transition={{ duration: 0.45 }} style={{ transformOrigin: `210px ${y}px` }} />
              {gone && <motion.circle cx={210} cy={y} r={6} fill="none" stroke="var(--gold-bright)" strokeWidth={2} initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.6 }} style={{ transformOrigin: `210px ${y}px` }} />}
            </g>
          )
        })}
        <motion.text x={210} y={232} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={18} fontStyle="italic" fill="var(--ink)" animate={{ opacity: open ? 1 : 0.5 }}>
          {open ? '“Worthy is the Lamb who was slain”' : `Seal ${Math.min(7, broken + 1)} of 7`}
        </motion.text>
        <text x={210} y={252} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
          Revelation 5:1–12 · tap to replay
        </text>
      </svg>
    </button>
  )
}
