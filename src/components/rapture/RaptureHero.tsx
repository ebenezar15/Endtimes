import { motion } from 'framer-motion'
import { t } from '../../lib/i18n'

/**
 * Daniel's seventieth week as a seven-year bar, with each view's rapture point dropping onto it in turn,
 * then Christ's return at the end and the amillennial/postmillennial "one coming" arc over the whole.
 */
export function RaptureHero() {
  const views = [
    { x: 0, label: t('Pre'), c: 'hsl(205 70% 50%)' },
    { x: 3.5, label: t('Mid'), c: 'hsl(265 50% 60%)' },
    { x: 5.25, label: t('Pre-wrath'), c: 'hsl(35 85% 50%)' },
    { x: 7, label: t('Post'), c: 'hsl(150 55% 42%)' },
  ]
  const X = (y: number) => 30 + (y / 7) * 300
  return (
    <svg viewBox="0 0 360 170" className="h-auto w-full" role="img" aria-label={t('Where each view places the rapture on a seven-year tribulation')}>
      {Array.from({ length: 7 }, (_, i) => (
        <motion.rect key={i} x={X(i) + 2} y={100} width={300 / 7 - 4} height={22} rx={4} fill={i < 3.5 ? 'color-mix(in srgb, var(--rubric) 35%, transparent)' : 'color-mix(in srgb, var(--rubric) 65%, transparent)'} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 + i * 0.06 }} style={{ transformOrigin: `${X(i)}px 122px` }} />
      ))}
      <text x={X(3.5)} y={140} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
        {t('Seven years (Daniel 9:27)')}
      </text>
      {views.map((v, i) => (
        <motion.g key={v.label} initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 + i * 0.35, type: 'spring', stiffness: 140, damping: 12 }}>
          <line x1={X(v.x)} x2={X(v.x)} y1={58} y2={98} stroke={v.c} strokeWidth={2.5} strokeDasharray="3 3" />
          <circle cx={X(v.x)} cy={52} r={9} fill={v.c} />
          <path d={`M${X(v.x)} 46 v8 M${X(v.x) - 4} 50 l4 -4 l4 4`} stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <text x={X(v.x)} y={i % 2 ? 26 : 36} textAnchor="middle" fontSize={11} fontWeight={700} fill={v.c}>
            {v.label}
          </text>
        </motion.g>
      ))}
      <motion.path d={`M${X(0)} 160 Q${X(3.5)} 145 ${X(7)} 160`} fill="none" stroke="var(--gold)" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.4, duration: 1.2 }} />
      <motion.text x={X(3.5)} y={168} textAnchor="middle" fontSize={9.5} fill="var(--gold)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 }}>
        {t('Amil and postmil: no seven-year week ahead, one return')}
      </motion.text>
    </svg>
  )
}
