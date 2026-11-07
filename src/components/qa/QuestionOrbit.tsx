import { motion } from 'framer-motion'
import { t } from '../../lib/i18n'
import { useReducedMotion } from '../../lib/theme'
import { groupHue } from './QAExplorer'

/** Topics orbiting a central question mark, each sized by how many questions it holds. */
export function QuestionOrbit({ groups, counts, total }: { groups: { id: string; title: string }[]; counts: Record<string, number>; total: number }) {
  const reduce = useReducedMotion()
  const rings = [groups.slice(0, 10), groups.slice(10, 22), groups.slice(22)]
  const max = Math.max(1, ...Object.values(counts))
  return (
    <svg viewBox="0 0 360 360" className="h-auto w-full" role="img" aria-label={t('{n} questions in {m} topics', { n: total, m: groups.length })}>
      {[70, 115, 160].map((r) => (
        <circle key={r} cx={180} cy={180} r={r} fill="none" stroke="var(--rule)" strokeDasharray="2 6" />
      ))}
      {rings.map((ring, ri) => (
        <motion.g key={ri} animate={reduce ? {} : { rotate: ri % 2 ? -360 : 360 }} transition={{ repeat: Infinity, duration: 90 + ri * 40, ease: 'linear' }} style={{ transformOrigin: '180px 180px' }}>
          {ring.map((g, i) => {
            const a = (i / ring.length) * Math.PI * 2
            const r = [70, 115, 160][ri]
            const n = counts[g.id] ?? 0
            const idx = groups.indexOf(g)
            return (
              <motion.circle key={g.id} cx={180 + Math.cos(a) * r} cy={180 + Math.sin(a) * r} fill={groupHue(idx)} initial={{ r: 0 }} animate={{ r: 4 + (n / max) * 9 }} transition={{ delay: 0.2 + idx * 0.03, type: 'spring' }}>
                <title>{`${g.title}: ${n}`}</title>
              </motion.circle>
            )
          })}
        </motion.g>
      ))}
      <circle cx={180} cy={180} r={44} fill="var(--accent)" className="obs-halo" opacity={0.4} />
      <circle cx={180} cy={180} r={40} fill="var(--accent)" />
      <text x={180} y={196} textAnchor="middle" fontSize={46} fontWeight={800} fill="var(--accent-ink)">
        ?
      </text>
      <text x={180} y={350} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink-soft)">
        {t('{n} questions in {m} topics', { n: total, m: groups.length })}
      </text>
    </svg>
  )
}
