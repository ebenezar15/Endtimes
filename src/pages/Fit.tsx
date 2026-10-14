import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PositionChip } from '../components/Badge'
import { Prose } from '../components/Gloss'
import { Refs } from '../components/Refs'
import { positionsById } from '../lib/content'
import { flowchart } from '../lib/data/timelines'
import { walk } from '../lib/flow'
import { useApp } from '../lib/store'

const FlowMap = lazy(() => import('../components/FlowMap'))

export default function Fit() {
  const flow = flowchart
  const [answers, setAnswers] = useState<number[]>([])
  const [tab, setTab] = useState<'guided' | 'map'>('guided')
  const { set, lens } = useApp()
  if (!flow) return <p className="ui">The decision tree has not been written yet.</p>
  const w = walk(flow, answers)
  const lensFrom = (ids: string[]) => ({
    millennial: ids.find((i) => positionsById.get(i)?.axis === 'millennial') ?? lens.millennial,
    hermeneutic: ids.find((i) => positionsById.get(i)?.axis === 'hermeneutic') ?? lens.hermeneutic,
  })

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Which view fits me?"
        lede="Answer the questions that divide the views. Each fork explains the texts behind it and why thoughtful readers answer it differently. This is a map of the options, not a verdict."
      />
      <div className="ui mb-6 flex gap-1.5" role="tablist" aria-label="Mode">
        {(['guided', 'map'] as const).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} aria-pressed={tab === t} className="btn" onClick={() => setTab(t)}>
            {t === 'guided' ? 'Guided questions' : 'Master flowchart'}
          </button>
        ))}
      </div>

      {tab === 'map' ? (
        <Suspense fallback={<p className="ui text-ink-soft">Drawing the flowchart…</p>}>
          <FlowMap flow={flow} trail={w.trail.map((t) => t.node.id)} />
        </Suspense>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {w.current ? (
                <motion.section key={w.current.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="leaf p-5 md:p-7">
                  <p className="ui text-sm text-ink-soft">Question {w.trail.length + 1}</p>
                  <h2 className="mt-1 text-3xl leading-tight">{w.current.question}</h2>
                  <Prose text={w.current.explanation} className="mt-4" />
                  <Refs refs={w.current.texts} className="mt-4" />
                  <div className="ui mt-6 grid gap-2">
                    {w.current.options.map((o, i) => (
                      <button key={o.label} type="button" className="btn justify-start py-3 text-left text-base" onClick={() => setAnswers([...answers, i])}>
                        <span aria-hidden className="text-gold">❧</span> {o.label}
                      </button>
                    ))}
                  </div>
                </motion.section>
              ) : w.result ? (
                <motion.section key={w.result.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="leaf border-gold p-5 md:p-7">
                  <p className="ui text-sm text-ink-soft">Your answers point toward</p>
                  <h2 className="mt-1 text-3xl">{w.result.title}</h2>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {w.result.positions.map((p) => (
                      <li key={p}>
                        <Link to={`/positions/${p}`} className="no-underline">
                          <PositionChip id={p} short={false} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Prose text={w.result.summary} className="mt-4" />
                  <div className="ui mt-6 flex flex-wrap gap-2">
                    <Link to={`/compare?p=${w.result.positions.filter((p) => positionsById.get(p)?.axis !== 'framework').slice(0, 4).join(',')}`} className="btn no-underline">
                      Compare these views
                    </Link>
                    <button type="button" className="btn" onClick={() => set({ lens: lensFrom(w.result!.positions), lensOn: true })}>
                      Use as my view lens
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setAnswers([])}>
                      Start again
                    </button>
                  </div>
                </motion.section>
              ) : null}
            </AnimatePresence>
          </div>

          <aside>
            <h2 className="text-xl">Your path</h2>
            {w.trail.length === 0 ? (
              <p className="ui mt-2 text-sm text-ink-soft">Your answers will appear here. You can step back to any earlier question.</p>
            ) : (
              <ol className="ui mt-2 space-y-2 text-sm">
                {w.trail.map((t, i) => (
                  <li key={t.node.id}>
                    <button type="button" className="text-left text-ink hover:text-accent" onClick={() => setAnswers(answers.slice(0, i))} title="Go back to this question">
                      <span className="block text-ink-soft">{t.node.question}</span>
                      <span className="font-medium">{t.node.options[t.choice].label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {answers.length > 0 && (
              <button type="button" className="btn ui mt-4 text-sm" onClick={() => setAnswers(answers.slice(0, -1))}>
                Back one step
              </button>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
