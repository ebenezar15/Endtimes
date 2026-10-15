import { motion } from 'framer-motion'

/**
 * "The revelation (apokalypsis, unveiling) of Jesus Christ": a veil tears from top to bottom
 * (Matthew 27:51) and draws back to show the cross in radiant light among seven lampstands (Revelation 1:12–13).
 */
export function UnveilHero() {
  const lamps = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2
    return { x: 300 + Math.cos(a) * 118, y: 190 + Math.sin(a) * 118 }
  })
  return (
    <svg viewBox="0 0 600 420" className="h-auto w-full" role="img" aria-label="A veil tears from top to bottom and draws back to reveal the cross in light among seven lampstands">
      <defs>
        <radialGradient id="unveil-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--gold-bright)" stopOpacity="0.85" />
          <stop offset="45%" stopColor="var(--gold-bright)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--gold-bright)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="veil-fold" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--rubric)" />
          <stop offset="18%" stopColor="color-mix(in srgb, var(--rubric) 70%, black)" />
          <stop offset="36%" stopColor="var(--rubric)" />
          <stop offset="54%" stopColor="color-mix(in srgb, var(--rubric) 70%, black)" />
          <stop offset="72%" stopColor="var(--rubric)" />
          <stop offset="90%" stopColor="color-mix(in srgb, var(--rubric) 70%, black)" />
          <stop offset="100%" stopColor="var(--rubric)" />
        </linearGradient>
      </defs>

      {/* light behind the veil */}
      <motion.circle cx={300} cy={190} r={170} fill="url(#unveil-glow)" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: [0.9, 1.05, 0.95], opacity: 1 }} transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', delay: 1.2 }} style={{ transformOrigin: '300px 190px' }} />

      {/* seven lampstands, slowly circling */}
      <motion.g style={{ transformOrigin: '300px 190px' }} animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
        {lamps.map((l, i) => (
          <g key={i}>
            <line x1={l.x} x2={l.x} y1={l.y - 4} y2={l.y + 14} stroke="var(--gold)" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={l.x - 7} x2={l.x + 7} y1={l.y + 14} y2={l.y + 14} stroke="var(--gold)" strokeWidth={2.5} strokeLinecap="round" />
            <motion.path
              d={`M${l.x},${l.y - 16} C${l.x + 6},${l.y - 9} ${l.x + 4},${l.y - 3} ${l.x},${l.y - 3} C${l.x - 4},${l.y - 3} ${l.x - 6},${l.y - 9} ${l.x},${l.y - 16}Z`}
              fill="var(--gold-bright)"
              animate={{ opacity: [0.65, 1, 0.75], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6 + i * 0.13, repeat: Infinity, repeatType: 'mirror' }}
              style={{ transformOrigin: `${l.x}px ${l.y - 8}px` }}
            />
          </g>
        ))}
      </motion.g>

      {/* the cross */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.8 }} style={{ transformOrigin: '300px 190px' }}>
        <rect x={292} y={128} width={16} height={124} rx={3} fill="var(--surface)" stroke="var(--gold-bright)" strokeWidth={2} />
        <rect x={262} y={158} width={76} height={16} rx={3} fill="var(--surface)" stroke="var(--gold-bright)" strokeWidth={2} />
      </motion.g>
      <motion.text x={300} y={358} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize={26} fontWeight={600} fill="var(--ink)" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
        ἀποκάλυψις Ἰησοῦ Χριστοῦ
      </motion.text>
      <motion.text x={300} y={384} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ink-soft)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
        “The revelation of Jesus Christ” (Revelation 1:1)
      </motion.text>

      {/* the veil: torn from top to bottom, then drawn back */}
      <motion.g initial={{ x: 0 }} animate={{ x: -320 }} transition={{ delay: 0.7, duration: 1.4, ease: [0.7, 0, 0.2, 1] }}>
        <path d="M0,0 H300 L296,60 L304,120 L294,190 L303,260 L296,320 L300,420 H0Z" fill="url(#veil-fold)" />
      </motion.g>
      <motion.g initial={{ x: 0 }} animate={{ x: 320 }} transition={{ delay: 0.7, duration: 1.4, ease: [0.7, 0, 0.2, 1] }}>
        <path d="M300,0 H600 V420 H300 L296,320 L303,260 L294,190 L304,120 L296,60Z" fill="url(#veil-fold)" />
      </motion.g>
      <motion.line x1={300} x2={300} y1={0} y2={420} stroke="var(--gold-bright)" strokeWidth={3} initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1, opacity: 0 }} transition={{ pathLength: { duration: 0.6 }, opacity: { delay: 0.8, duration: 0.3 } }} />
    </svg>
  )
}
