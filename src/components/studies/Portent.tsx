import { motion } from 'framer-motion'
import type { JosephusStory } from '../../content/schema'

type Icon = JosephusStory['portents'][number]['icon']

/** A small animated picture for each omen Josephus reports before the fall (Jewish War 6.5.3). */
export function PortentIcon({ icon }: { icon: Icon }) {
  const gold = 'var(--gold-bright)'
  const ink = 'var(--ink)'
  return (
    <svg viewBox="0 0 120 90" className="h-24 w-full" aria-hidden>
      {icon === 'star' && (
        <>
          <motion.path d="M60,10 L66,40 L60,80 L54,40 Z" fill={gold} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
          <rect x={44} y={36} width={32} height={5} rx={2} fill={gold} />
        </>
      )}
      {icon === 'comet' && (
        <motion.g animate={{ x: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <circle cx={78} cy={30} r={8} fill={gold} />
          <path d="M72,34 Q40,50 8,70 Q44,44 74,26 Z" fill={gold} opacity={0.55} />
        </motion.g>
      )}
      {icon === 'light' && (
        <>
          <rect x={44} y={50} width={32} height={22} fill="var(--surface-2)" stroke={ink} strokeWidth={1.5} />
          <motion.circle cx={60} cy={44} r={20} fill={gold} animate={{ r: [16, 34, 16], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2.4, repeat: Infinity }} />
        </>
      )}
      {icon === 'gate' && (
        <>
          <rect x={28} y={14} width={64} height={66} fill="none" stroke={ink} strokeWidth={2} />
          <motion.rect x={30} y={16} width={30} height={62} fill="var(--gold)" animate={{ scaleX: [1, 0.2, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: '30px 47px' }} />
          <motion.rect x={60} y={16} width={30} height={62} fill="var(--gold)" animate={{ scaleX: [1, 0.2, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: '90px 47px' }} />
        </>
      )}
      {icon === 'chariots' && (
        <motion.g animate={{ x: [-30, 30] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
          <ellipse cx={60} cy={30} rx={44} ry={14} fill="var(--surface-2)" />
          {[30, 60, 90].map((x) => (
            <g key={x}>
              <circle cx={x} cy={44} r={7} fill="none" stroke={ink} strokeWidth={2} />
              <path d={`M${x - 10},38 L${x + 8},38 L${x + 4},30 Z`} fill="var(--rubric)" />
            </g>
          ))}
        </motion.g>
      )}
      {icon === 'voice' && (
        <>
          <rect x={48} y={30} width={24} height={44} fill="var(--surface-2)" stroke={ink} strokeWidth={1.5} />
          {[1, 2, 3].map((i) => (
            <motion.circle key={i} cx={60} cy={40} r={10} fill="none" stroke={gold} strokeWidth={2} animate={{ r: [8, 44], opacity: [0.9, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7 }} />
          ))}
        </>
      )}
      {icon === 'heifer' && (
        <>
          <path d="M30,50 q10,-14 40,-10 q14,2 20,-6 l4,8 q-6,6 -8,12 l0,16 h-6 v-12 h-34 v12 h-6 v-16 z" fill="var(--surface-2)" stroke={ink} strokeWidth={1.5} />
          <motion.circle cx={44} cy={70} r={7} fill={gold} animate={{ scale: [0.6, 1.1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
        </>
      )}
      {icon === 'woe' && (
        <>
          <circle cx={46} cy={30} r={9} fill="none" stroke={ink} strokeWidth={2} />
          <path d="M46,39 L46,66 M46,48 L32,40 M46,48 L58,36 M46,66 L36,82 M46,66 L56,82" stroke={ink} strokeWidth={2} fill="none" strokeLinecap="round" />
          {[1, 2, 3].map((i) => (
            <motion.path key={i} d={`M${62 + i * 9},22 q8,10 0,20`} fill="none" stroke="var(--rubric)" strokeWidth={2.5} strokeLinecap="round" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }} />
          ))}
        </>
      )}
    </svg>
  )
}
