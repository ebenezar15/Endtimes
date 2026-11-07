import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'

type Mark = 'yes' | 'no' | 'part'

/** The five details of Matthew 16:27-28, each tested against a candidate event. */
const TESTS = () => [
  t('Within the hearers’ lifetime'),
  t('Only some still alive; others had died'),
  t('In his Father’s glory'),
  t('With his angels'),
  t('Repays each for what they have done'),
]

const CANDIDATES = () =>
  [
    { id: 'transfig', name: t('The transfiguration'), when: t('Six days later'), year: 30, marks: ['yes', 'no', 'part', 'no', 'no'] as Mark[], note: t('All were still alive, no angels came and no one was judged. Jesus called it a vision. Many read it as a preview of the coming, not the coming itself.'), refs: ['Matthew 17:1-9'] },
    { id: 'pentecost', name: t('Pentecost'), when: t('About fifty days later'), year: 30.4, marks: ['yes', 'no', 'no', 'no', 'no'] as Mark[], note: t('Nearly all were alive. It was the gift of the Spirit, not a coming to repay each person.'), refs: ['Acts 2:1-4'] },
    { id: 'ad70', name: t('The fall of Jerusalem'), when: t('About forty years later'), year: 70, marks: ['yes', 'yes', 'yes', 'yes', 'yes'] as Mark[], note: t('James and Peter had died, but John and others lived. Jesus described this judgement in the prophets’ language of glory, clouds and angels gathering.'), refs: ['Matthew 24:30-34', 'Matthew 26:64'] },
    { id: 'final', name: t('The final return'), when: t('Still future'), year: 100, marks: ['no', 'no', 'yes', 'yes', 'yes'] as Mark[], note: t('It fits the glory and the judgement, but everyone standing there has died. Christians rightly hope for it, but this saying set a limit of one lifetime.'), refs: ['Acts 1:11'] },
  ] as const

/** Some of those standing with Jesus, and roughly when each died. */
const LIVES = () => [
  { name: t('James, son of Zebedee'), end: 44 },
  { name: t('James the Just'), end: 62 },
  { name: t('Peter'), end: 65 },
  { name: t('John'), end: 98 },
]

const ICON: Record<Mark, { c: string; s: string }> = {
  yes: { c: 'var(--accent)', s: '✓' },
  part: { c: 'var(--gold)', s: '~' },
  no: { c: 'var(--rubric)', s: '✕' },
}

const X = (y: number) => 24 + ((Math.min(y, 100) - 30) / 70) * 452

/**
 * "Some standing here" put to the test: pick an event, watch the five details of Matthew 16:27-28 tick or fail,
 * and see on a life-line which of the hearers were still alive when it happened.
 */
export function SomeStanding() {
  const tests = TESTS()
  const cands = CANDIDATES()
  const lives = LIVES()
  const [sel, setSel] = useState<string>('transfig')
  const c = cands.find((x) => x.id === sel) ?? cands[0]
  const score = c.marks.filter((m) => m === 'yes').length
  const alive = lives.filter((l) => l.end >= c.year).length
  return (
    <div className="leaf p-4 sm:p-6">
      <p className="text-sm font-semibold text-ink-soft">{t('Which event fits every detail? Pick one.')}</p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="tablist">
        {cands.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={sel === x.id} onClick={() => setSel(x.id)} className="chip cursor-pointer" style={sel === x.id ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AnimatePresence mode="wait">
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold">{c.name}</h3>
              <span className="text-xs font-semibold text-ink-soft">{c.when}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {tests.map((test, i) => {
                const m = ICON[c.marks[i]]
                return (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }} className="flex items-center gap-2.5 rounded-lg border border-rule px-3 py-2">
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.12, type: 'spring' }} className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-black" style={{ background: m.c, color: 'var(--bg)' }} aria-hidden>
                      {m.s}
                    </motion.span>
                    <span className="text-[0.95rem]">{test}</span>
                  </motion.li>
                )
              })}
            </ul>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--rule)]" aria-label={t('{n} of {m} details fit', { n: score, m: tests.length })}>
              <motion.div className="h-full rounded-full" style={{ background: score === tests.length ? 'var(--accent)' : 'var(--gold)' }} initial={{ width: 0 }} animate={{ width: `${(score / tests.length) * 100}%` }} transition={{ delay: 0.8, duration: 0.6 }} />
            </div>
            <p className="mt-1 text-sm font-bold">{t('{n} of {m} details fit', { n: score, m: tests.length })}</p>
            <p className="mt-2 text-[0.95rem] text-ink-soft">{c.note}</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">{c.refs.map(refLabel).join(' · ')}</p>
          </motion.div>
        </AnimatePresence>

        <div>
          <p className="text-sm font-semibold">{t('Who was still standing?')}</p>
          <svg viewBox="0 0 500 200" className="mt-1 h-auto w-full" role="img" aria-label={t('{n} of these hearers still alive', { n: alive })}>
            {[30, 44, 62, 70, 98].map((y) => (
              <g key={y}>
                <line x1={X(y)} x2={X(y)} y1={14} y2={170} stroke="var(--rule)" strokeDasharray="2 4" />
                <text x={X(y)} y={186} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
                  {t('AD {n}', { n: y })}
                </text>
              </g>
            ))}
            {lives.map((l, i) => {
              const y = 40 + i * 34
              const on = l.end >= c.year
              return (
                <g key={l.name}>
                  <text x={X(30)} y={y - 9} fontSize={11} fontWeight={700} fill={on ? 'var(--ink)' : 'var(--ink-soft)'}>
                    {l.name}
                  </text>
                  <motion.line x1={X(30)} y1={y} y2={y} stroke={on ? 'var(--accent)' : 'var(--ink-soft)'} strokeWidth={8} strokeLinecap="round" initial={{ x2: X(30) }} animate={{ x2: X(l.end) }} transition={{ delay: 0.2 + i * 0.15, duration: 0.8 }} opacity={on ? 1 : 0.45} />
                </g>
              )
            })}
            <motion.g initial={false} animate={{ x: X(c.year) - X(30) }} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
              <line x1={X(30)} x2={X(30)} y1={8} y2={172} stroke="var(--gold)" strokeWidth={3} />
              <circle cx={X(30)} cy={8} r={5} fill="var(--gold)" />
            </motion.g>
          </svg>
          <p className="text-sm">
            <b>{t('{n} of these hearers still alive', { n: alive })}</b> · {t('The saying needs some alive and some not.')}
          </p>
          <div className="mt-4 rounded-xl border border-rule p-3 text-sm" style={{ borderLeft: '4px solid var(--gold)' }}>
            <p className="font-bold">{t('Answering a friend: feel, felt, found')}</p>
            <p className="mt-1 text-ink-soft">{t('“I know how you feel. I once felt the same way. Here is what I found when I checked the five details.” Gentleness wins more than a debate.')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
