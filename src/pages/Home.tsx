import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Rota } from '../components/Rota'
import { Illum } from '../components/Badge'
import { core as content, frameworkViews, positionName, positionsById } from '../lib/core'
import { useApp } from '../lib/store'
import { useReducedMotion } from '../lib/theme'

/** The 60-second guided intro (content/tour.json): ~7.5 s per caption, each lighting part of the map. */
const TOUR = content.tour
const STEP_MS = 7500

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

  return (
    <div className="mx-auto max-w-6xl">
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="max-w-[34rem]">
          <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl">
            <span className="block">Four views of the thousand years.</span>
            <span className="block text-ink-soft">Six ways to read the Apocalypse.</span>
          </h1>
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

      <section className="mt-14">
        <h2 className="text-3xl">The frameworks underneath</h2>
        <p className="mt-2 max-w-[65ch] text-ink-soft">
          Beneath both rings sit larger ways of reading the whole Bible. They shape what each side expects of Israel, the church and the kingdom.
        </p>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {frameworkViews.map((f) => (
            <li key={f.id}>
              <Link to={`/positions/${f.id}`} className="leaf flex h-full gap-3 p-4 text-ink no-underline hover:border-accent">
                <Illum id={f.id} size={38} />
                <span>
                  <span className="block text-xl">{f.name}</span>
                  <span className="mt-1 block text-[0.95rem] text-ink-soft">{f.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-x-10 gap-y-6 border-t border-rule pt-8 md:grid-cols-2">
        {[
          ['/compare', 'Compare views', 'Put two to four views side by side across fifteen topics. Agreement is colour-coded, and you can show only the differences.'],
          ['/timelines', 'Watch the timelines diverge', 'Animated timelines from the Cross to the new creation. Overlay two and see exactly where they part ways.'],
          ['/passages', 'Passage Lab', 'The texts the debate turns on, in public-domain translations, read from every position with support and objections.'],
          ['/arena', 'Argument Arena', 'Claim, objection, rebuttal, counter-rebuttal, for the debates that matter, as a tree or as a graph.'],
        ].map(([to, title, text]) => (
          <Link key={to} to={to} className="group block text-ink no-underline">
            <span className="block text-2xl group-hover:text-accent">{title}</span>
            <span className="mt-1 block text-ink-soft">{text}</span>
          </Link>
        ))}
      </section>
    </div>
  )
}
