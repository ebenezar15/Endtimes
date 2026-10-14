import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Rota } from '../components/Rota'
import { RoadHero } from '../components/RoadHero'
import { CountUp, GlowCard } from '../components/ui'
import { Icon, type IconName } from '../components/Icon'
import { Illum } from '../components/Badge'
import { core, core as content, frameworkViews, positionName, positionsById } from '../lib/core'
import { useApp } from '../lib/store'
import { useReducedMotion } from '../lib/theme'

/** The 60-second guided intro (content/tour.json): ~7.5 s per caption, each lighting part of the map. */
const TOUR = content.tour
const STEP_MS = 7500

const FEATURES: { to: string; title: string; text: string; icon: IconName }[] = [
  { to: '/positions', title: 'Positions', text: 'Each view in depth, in its own terms, with critiques and the replies to them.', icon: 'crown' },
  { to: '/compare', title: 'Compare views', text: 'Two to four views side by side across fifteen topics, agreement marked at a glance.', icon: 'layers' },
  { to: '/timelines', title: 'Timelines', text: 'Overlay any two views from the Cross to the new creation and see where they part.', icon: 'timeline' },
  { to: '/fit', title: 'Which view fits me?', text: 'A branching set of questions that explains the texts behind every fork.', icon: 'fork' },
  { to: '/revelation', title: 'Revelation Study', text: 'All 22 chapters: every image traced to its Jewish and Roman setting, then read by each view.', icon: 'seal' },
  { to: '/passages', title: 'Passage Lab', text: 'Thirty-five key texts, read by every position, with support and objections.', icon: 'scroll' },
  { to: '/arena', title: 'Argument Arena', text: 'Claim, objection, rebuttal and counter-rebuttal, as a tree or a live graph.', icon: 'scales' },
  { to: '/library', title: 'Debates & Library', text: 'Multi-view books, public debates and the scholars behind each camp.', icon: 'library' },
  { to: '/study', title: 'Study', text: 'Quizzes, spaced flashcards, notes and progress, saved on your device.', icon: 'cap' },
]

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()
  const { introSeen, set } = useApp()

  useEffect(() => {
    if (step === null || !playing) return
    const t = setTimeout(() => {
      if (step < TOUR.length - 1) setStep(step + 1)
      else {
        setPlaying(false)
        set({ introSeen: true })
      }
    }, STEP_MS)
    return () => clearTimeout(t)
  }, [step, playing, set])

  const startTour = () => {
    setSelected(null)
    setStep(0)
    setPlaying(!reduce)
  }
  const sel = selected ? positionsById.get(selected) : null
  const combos = selected ? content.combinations.filter((c) => c.millennial === selected || c.hermeneutic === selected) : []

  const stats = [
    { n: core.counts.positions, l: 'positions' },
    { n: core.counts.topics, l: 'topics compared' },
    { n: core.counts.passages, l: 'key passages' },
    { n: core.counts.arguments, l: 'debates mapped' },
    { n: core.counts.scholars, l: 'scholars' },
    { n: core.counts.sources, l: 'sources cited' },
  ]

  return (
    <div>
      <RoadHero />
    <div id="after-road" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:px-6 lg:px-10">
      <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="leaf p-4 text-center">
            <CountUp to={s.n} className="block text-3xl font-bold tabular-nums text-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{s.l}</span>
          </motion.div>
        ))}
      </div>

      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="max-w-[34rem]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">The map of the debate</p>
          <h2 className="text-3xl sm:text-4xl">
            Four views of the thousand years. <span className="text-gradient">Six ways to read the Apocalypse.</span>
          </h2>
          <p className="mt-5 text-lg">
            A study companion for the Christian debates about the end: what each view holds, which texts it leans on, how its critics answer, and how
            its defenders reply. Every view is stated as its own scholars would state it.
          </p>
          <div className="ui mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={startTour}>
              {introSeen ? 'Replay the 60-second tour' : 'Take the 60-second tour'}
            </button>
            <Link to="/fit" className="btn no-underline">
              Which view fits me?
            </Link>
          </div>

          <div className="mt-6 lg:min-h-[11rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              {step !== null ? (
                <motion.div key={`s${step}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }} className="leaf p-4">
                  <div className="ui flex items-center justify-between text-sm text-ink-soft">
                    <span>
                      Tour {step + 1} of {TOUR.length}
                    </span>
                    <span className="flex gap-1">
                      <button type="button" className="btn min-h-8 px-2 py-0.5" disabled={step === 0} onClick={() => setStep(step - 1)} aria-label="Previous step">
                        ‹
                      </button>
                      <button type="button" className="btn min-h-8 px-2 py-0.5" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause tour' : 'Play tour'}>
                        {playing ? '❚❚' : '▶'}
                      </button>
                      <button
                        type="button"
                        className="btn min-h-8 px-2 py-0.5"
                        onClick={() => (step < TOUR.length - 1 ? setStep(step + 1) : (setStep(null), set({ introSeen: true })))}
                        aria-label={step < TOUR.length - 1 ? 'Next step' : 'Finish tour'}
                      >
                        {step < TOUR.length - 1 ? '›' : '✓'}
                      </button>
                      <button type="button" className="btn min-h-8 px-2 py-0.5" onClick={() => (setStep(null), setPlaying(false))} aria-label="Close tour">
                        ✕
                      </button>
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl">{TOUR[step].title}</h2>
                  <p className="mt-1">{TOUR[step].text}</p>
                  {playing && (
                    <motion.div key={`bar${step}`} className="mt-3 h-0.5 origin-left bg-gold-bright" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: STEP_MS / 1000, ease: 'linear' }} />
                  )}
                </motion.div>
              ) : sel ? (
                <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf p-4">
                  <div className="flex items-start gap-3">
                    <Illum id={sel.id} size={44} />
                    <div>
                      <h2 className="text-2xl">{sel.name}</h2>
                      <p className="italic text-ink-soft">{sel.tagline}</p>
                    </div>
                  </div>
                  <p className="mt-2">{sel.summary.split(/(?<=\.)\s/).slice(0, 2).join(' ')}</p>
                  {combos.length > 0 && (
                    <p className="ui mt-2 text-sm text-ink-soft">
                      Commonly paired with:{' '}
                      {combos
                        .filter((c) => c.frequency === 'common')
                        .map((c) => positionName(c.millennial === sel.id ? c.hermeneutic : c.millennial, true))
                        .join(', ') || 'no single pairing dominates'}
                    </p>
                  )}
                  <Link to={`/positions/${sel.id}`} className="btn btn-primary ui mt-3 no-underline">
                    Open {sel.shortName}
                  </Link>
                </motion.div>
              ) : (
                <motion.p key="hint" className="ui text-sm text-ink-soft" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Choose a segment of the wheel to see a summary. Inner ring: when is the millennium? Outer ring: how do we read Revelation? Gold threads mark the
                  common pairings.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center">
          <Rota selected={selected} highlight={step !== null ? TOUR[step].focus : []} onSelect={(id) => (setStep(null), setPlaying(false), setSelected(id === selected ? null : id))} />
        </div>
      </section>

      <details className="ui mt-6 max-w-3xl text-sm">
        <summary className="cursor-pointer text-ink-soft">Read the map as a table</summary>
        <table className="mt-2 w-full border-collapse text-left">
          <caption className="sr-only">How often each millennial view pairs with each way of reading Revelation</caption>
          <thead>
            <tr>
              <th className="border-b border-rule py-1 pr-2">Millennial view</th>
              <th className="border-b border-rule py-1 pr-2">Reading of Revelation</th>
              <th className="border-b border-rule py-1">How common</th>
            </tr>
          </thead>
          <tbody>
            {content.combinations.map((c) => (
              <tr key={c.millennial + c.hermeneutic}>
                <td className="border-b border-rule/60 py-1 pr-2">{positionName(c.millennial, true)}</td>
                <td className="border-b border-rule/60 py-1 pr-2">{positionName(c.hermeneutic, true)}</td>
                <td className="border-b border-rule/60 py-1">{c.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <h2 className="mb-6 mt-16 text-3xl">Ways in</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div key={f.to} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (i % 4) * 0.07, type: 'spring', stiffness: 200, damping: 22 }}>
            <GlowCard to={f.to}>
              <motion.span whileHover={{ rotate: -10, scale: 1.1 }} className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-surface-2 text-accent ring-1 ring-rule">
                <Icon name={f.icon} size={22} />
              </motion.span>
              <span className="mb-1 block text-lg font-bold">{f.title}</span>
              <span className="block text-sm leading-relaxed text-ink-soft">{f.text}</span>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-3xl">The frameworks underneath</h2>
        <p className="mt-2 max-w-[65ch] text-ink-soft">
          Beneath both rings sit larger ways of reading the whole Bible. They shape what each side expects of Israel, the church and the kingdom.
        </p>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {frameworkViews.map((f, i) => (
            <motion.li key={f.id} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <GlowCard to={`/positions/${f.id}`}>
                <span className="flex gap-3">
                  <Illum id={f.id} size={40} />
                  <span>
                    <span className="block text-lg font-bold">{f.name}</span>
                    <span className="mt-1 block text-[0.95rem] text-ink-soft">{f.tagline}</span>
                  </span>
                </span>
              </GlowCard>
            </motion.li>
          ))}
        </ul>
      </section>
    </div>

    </div>
  )
}
