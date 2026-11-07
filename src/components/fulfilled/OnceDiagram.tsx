import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'

/**
 * Two animated panels. First, how real double fulfilments work: a shadow before the cross and the greater
 * fulfilment after it, never two after the cross. Second, Matthew 24:21 on a time line: one peak in AD 70,
 * "never was" behind it and "nor ever shall be" ahead; a proposed second peak rises and is struck out.
 */
export function OnceDiagram() {
  const [panel, setPanel] = useState<'pattern' | 'peak'>('pattern')
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="flex flex-wrap gap-1.5" role="tablist">
        {(
          [
            ['pattern', t('How real double fulfilments work')],
            ['peak', t('Why verse 21 allows only one')],
          ] as const
        ).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={panel === k} onClick={() => setPanel(k)} className="chip cursor-pointer" style={panel === k ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
            {l}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {panel === 'pattern' ? (
          <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            <svg viewBox="0 0 520 230" className="h-auto w-full" role="img" aria-label={t('A shadow before the cross, the greater fulfilment after it')}>
              <line x1={20} x2={500} y1={150} y2={150} stroke="var(--rule)" strokeWidth={3} />
              <line x1={300} x2={300} y1={30} y2={175} stroke="var(--gold)" strokeWidth={3} />
              <path d="M290 30 h20 M300 22 v16" stroke="var(--gold)" strokeWidth={4} />
              <text x={300} y={195} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--gold)">
                {t('The cross')}
              </text>
              <text x={150} y={218} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
                {t('Old Testament: shadows')}
              </text>
              <text x={410} y={218} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
                {t('New covenant: the substance')}
              </text>
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <rect x={95} y={95} width={110} height={44} rx={10} fill="color-mix(in srgb, var(--ink-soft) 25%, transparent)" stroke="var(--ink-soft)" strokeDasharray="4 3" />
                <text x={150} y={114} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
                  {t('Solomon')}
                </text>
                <text x={150} y={130} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
                  {t('builds the temple')}
                </text>
              </motion.g>
              <motion.path d="M205 110 C260 60 315 60 335 95" fill="none" stroke="var(--accent)" strokeWidth={3} markerEnd="url(#od-a)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.9 }} />
              <defs>
                <marker id="od-a" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill="var(--accent)" />
                </marker>
              </defs>
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }} style={{ transformOrigin: '410px 117px' }}>
                <rect x={330} y={90} width={170} height={54} rx={12} fill="var(--accent)" />
                <text x={415} y={112} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--accent-ink)">
                  {t('Christ, the greater Son')}
                </text>
                <text x={415} y={130} textAnchor="middle" fontSize={10} fill="var(--accent-ink)">
                  {t('builds his church')}
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
                <rect x={330} y={40} width={150} height={30} rx={8} fill="color-mix(in srgb, var(--rubric) 18%, transparent)" stroke="var(--rubric)" strokeDasharray="4 3" />
                <text x={405} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--rubric)">
                  {t('Two after the cross? None')}
                </text>
              </motion.g>
            </svg>
            <p className="mt-2 text-[0.95rem]">{t('Real double fulfilments follow one pattern: a shadow in the Old Testament and the greater fulfilment after the cross, in Christ and his church. Scripture gives no case of both fulfilments coming after the cross.')}</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">{['2 Samuel 7:12-13', 'Matthew 16:18', 'Hebrews 10:1'].map(refLabel).join(' · ')}</p>
          </motion.div>
        ) : (
          <motion.div key="k" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            <svg viewBox="0 0 520 240" className="h-auto w-full" role="img" aria-label={t('One tribulation such as never was, nor ever shall be')}>
              <line x1={20} x2={500} y1={190} y2={190} stroke="var(--rule)" strokeWidth={3} />
              <motion.path d="M30 188 Q120 180 180 175 Q215 60 240 40 Q265 60 300 175 Q360 182 490 188" fill="color-mix(in srgb, var(--rubric) 22%, transparent)" stroke="var(--rubric)" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
              <motion.text x={240} y={30} textAnchor="middle" fontSize={13} fontWeight={800} fill="var(--rubric)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                {t('AD 70: the great tribulation')}
              </motion.text>
              <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }}>
                <path d="M170 120 H50" stroke="var(--ink-soft)" strokeWidth={2} markerEnd="url(#od-b)" />
                <text x={110} y={110} textAnchor="middle" fontSize={11} fill="var(--ink)">
                  {t('“not since the beginning”')}
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}>
                <path d="M310 120 H470" stroke="var(--ink-soft)" strokeWidth={2} markerEnd="url(#od-b)" />
                <text x={390} y={110} textAnchor="middle" fontSize={11} fill="var(--ink)">
                  {t('“nor ever shall be”')}
                </text>
              </motion.g>
              <defs>
                <marker id="od-b" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill="var(--ink-soft)" />
                </marker>
              </defs>
              <motion.path d="M380 188 Q410 120 425 78 Q440 120 470 188" fill="none" stroke="var(--violet, var(--accent))" strokeWidth={3} strokeDasharray="6 5" initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: [0, 1, 1, 0.35], pathLength: 1 }} transition={{ delay: 2.1, duration: 1.4 }} />
              <motion.text x={425} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--ink-soft)" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0.5] }} transition={{ delay: 2.4, duration: 1.2 }}>
                {t('a second, future one?')}
              </motion.text>
              <motion.path d="M395 95 L455 175 M455 95 L395 175" stroke="var(--rubric)" strokeWidth={5} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.6, duration: 0.5 }} />
              <text x={240} y={215} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">
                {t('Equal to it, or greater: either way it would break “nor ever shall be”.')}
              </text>
            </svg>
            <p className="mt-2 text-[0.95rem]">{t('Jesus said the tribulation would be such as has not been since the beginning of the world, nor ever will be. If nothing before it matches it and nothing after it will, it cannot happen twice; and he placed all these things in one generation.')}</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">{['Matthew 24:21', 'Matthew 24:34'].map(refLabel).join(' · ')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
