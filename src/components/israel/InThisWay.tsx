import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { useReducedMotion } from '../../lib/theme'

/** The steps of Romans 9-11, each adding a layer to the olive tree. */
const STEPS = () => [
  { title: t('One root'), text: t('The tree grows from the promise to Abraham and the patriarchs. There is only ever one tree.'), refs: ['Romans 11:16-18'] },
  { title: t('Not all Israel is Israel'), text: t('Paul first defines his terms: the children of the promise are counted as offspring, not simply the children of the flesh.'), refs: ['Romans 9:6-8'] },
  { title: t('Branches broken off'), text: t('Natural branches were broken off through unbelief. The nation as a whole stumbled over Christ.'), refs: ['Romans 11:20', 'Romans 9:32-33'] },
  { title: t('A remnant remains'), text: t('Like the 7,000 in Elijah’s day, a remnant chosen by grace stays on the tree: the believing Jews of Paul’s own time.'), refs: ['Romans 11:2-5'] },
  { title: t('Gentiles grafted in'), text: t('Wild olive shoots are grafted into the same tree and share its root. Branches broken off can be grafted back in by faith.'), refs: ['Romans 11:17-24'] },
  { title: t('“And in this way”'), text: t('Paul writes houtōs, “in this way”, not “after this”. By the remnant and the grafted-in Gentiles together, all Israel is saved: one tree, the Israel of God.'), refs: ['Romans 11:26', 'Galatians 6:16'] },
]

const NATURAL = [
  { d: 'M250 150 C220 130 190 120 150 112', remnant: false },
  { d: 'M250 125 C230 100 205 85 175 70', remnant: true },
  { d: 'M250 100 C245 75 240 55 236 32', remnant: false },
  { d: 'M250 150 C280 132 310 124 350 118', remnant: false },
  { d: 'M250 112 C275 92 300 80 330 68', remnant: true },
]
/** The last point of a branch path, where its leaves sit. */
const tip = (d: string) => d.trim().split(/\s+/).slice(-2).map(Number) as [number, number]
const WILD = ['M250 138 C285 150 320 155 360 150', 'M250 118 C215 108 185 98 140 92', 'M250 92 C262 68 275 48 290 30']

/**
 * Romans 11 as an animated olive tree: one root, branches broken off, a remnant that stays,
 * Gentiles grafted in, and "in this way" all Israel saved. Step through or press play.
 */
export function InThisWay() {
  const steps = STEPS()
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!play) return
    if (i >= steps.length - 1) return setPlay(false)
    const id = setTimeout(() => setI((n) => n + 1), reduce ? 1200 : 2600)
    return () => clearTimeout(id)
  }, [play, i, steps.length, reduce])
  const s = steps[i]
  return (
    <div className="leaf p-4 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 500 270" className="h-auto w-full" role="img" aria-label={s.title}>
          <ellipse cx={250} cy={246} rx={170} ry={10} fill="color-mix(in srgb, var(--gold) 14%, transparent)" />
          <path d="M250 245 C246 210 254 180 250 90" stroke="var(--gold)" strokeWidth={14} strokeLinecap="round" fill="none" />
          <path d="M250 240 C232 246 214 249 194 251 M250 240 C268 246 286 249 306 251" stroke="var(--gold)" strokeWidth={5} fill="none" />
          <text x={250} y={268} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--gold)">
            {t('Root: the promise to Abraham')}
          </text>
          {NATURAL.map((b, k) => {
            const broken = i >= 2 && !b.remnant
            return (
              <motion.g key={k} initial={false} animate={{ opacity: broken ? 0.18 : 1, y: broken ? 14 : 0 }} transition={{ duration: 0.8, delay: k * 0.08 }}>
                <motion.path d={b.d} fill="none" strokeWidth={6} strokeLinecap="round" initial={false} animate={{ stroke: i >= 3 && b.remnant ? 'var(--accent)' : 'var(--ink-soft)' }} strokeDasharray={broken ? '5 6' : undefined} />
                <motion.ellipse cx={tip(b.d)[0]} cy={tip(b.d)[1]} rx={13} ry={7} initial={false} animate={{ fill: i >= 3 && b.remnant ? 'var(--accent)' : 'var(--ink-soft)' }} opacity={0.75} />
              </motion.g>
            )
          })}
          {i >= 1 && i < 3 && (
            <motion.text x={250} y={20} textAnchor="middle" fontSize={11} fill="var(--ink-soft)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {t('Children of the flesh, or children of the promise?')}
            </motion.text>
          )}
          {WILD.map((d, k) => (
            <g key={k}>
              <motion.path d={d} fill="none" stroke="var(--rubric)" strokeWidth={6} strokeLinecap="round" initial={false} animate={{ pathLength: i >= 4 ? 1 : 0, opacity: i >= 4 ? 1 : 0 }} transition={{ duration: 0.9, delay: k * 0.2 }} />
              <motion.ellipse cx={tip(d)[0]} cy={tip(d)[1]} rx={13} ry={7} fill="var(--rubric)" initial={false} animate={{ opacity: i >= 4 ? 0.75 : 0, scale: i >= 4 ? 1 : 0 }} transition={{ delay: 0.8 + k * 0.2 }} />
            </g>
          ))}
          {i >= 4 && (
            <motion.path d="M250 150 C220 130 190 120 150 112" fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="3 5" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.4] }} transition={{ delay: 1, duration: 1.6 }} />
          )}
          <g fontSize={11} fontWeight={700}>
            {i >= 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <circle cx={22} cy={196} r={6} fill="var(--accent)" />
                <text x={34} y={200} fill="var(--ink)">
                  {t('Believing remnant')}
                </text>
              </motion.g>
            )}
            {i >= 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <circle cx={22} cy={214} r={6} fill="var(--rubric)" />
                <text x={34} y={218} fill="var(--ink)">
                  {t('Grafted-in Gentiles')}
                </text>
              </motion.g>
            )}
            {i >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={16} x2={28} y1={178} y2={178} stroke="var(--ink-soft)" strokeWidth={4} strokeDasharray="3 3" opacity={0.5} />
                <text x={34} y={182} fill="var(--ink-soft)">
                  {t('Broken off by unbelief')}
                </text>
              </motion.g>
            )}
          </g>
          {i >= 5 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} style={{ transformOrigin: '250px 70px' }}>
              <ellipse cx={250} cy={92} rx={150} ry={86} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="7 5" />
              <rect x={330} y={14} width={160} height={28} rx={14} fill="var(--accent)" />
              <text x={410} y={33} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--accent-ink)">
                {t('All Israel')}
              </text>
            </motion.g>
          )}
        </svg>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Step {n} of {m}', { n: i + 1, m: steps.length })}</p>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-[0.98rem]">{s.text}</p>
              <p className="mt-1 text-xs font-semibold text-ink-soft">{s.refs.map(refLabel).join(' · ')}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn" disabled={i === 0} onClick={() => (setPlay(false), setI(i - 1))}>
              ← {t('Back')}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => (i >= steps.length - 1 ? (setI(0), setPlay(true)) : setPlay(!play))}>
              {play ? t('Pause') : i >= steps.length - 1 ? t('Replay') : t('Play')}
            </button>
            <button type="button" className="btn" disabled={i >= steps.length - 1} onClick={() => (setPlay(false), setI(i + 1))}>
              {t('Next')} →
            </button>
          </div>
          <div className="mt-3 flex gap-1" aria-hidden>
            {steps.map((_, k) => (
              <span key={k} className="h-1.5 flex-1 rounded-full" style={{ background: k <= i ? 'var(--accent)' : 'var(--rule)' }} />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-xl border border-rule p-3 text-sm text-ink-soft" style={{ borderLeft: '4px solid var(--gold)' }}>
        {t('Other readings: many expect a large future turning of Jewish people to Christ, grafted into this same tree. Every view in this study rejects hostility to Jewish people.')}
      </p>
    </div>
  )
}
