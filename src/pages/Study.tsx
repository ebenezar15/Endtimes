import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { content, passagesById, positionsById, argumentsById } from '../lib/content'
import { useApp } from '../lib/store'
import type { FlashDeck, QuizSet } from '../content/schema'

const TABS = [
  { id: 'quiz', label: 'Quizzes' },
  { id: 'cards', label: 'Flashcards' },
  { id: 'progress', label: 'Progress' },
  { id: 'notes', label: 'Notes & saved' },
] as const
type Tab = (typeof TABS)[number]['id']

export default function Study() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'quiz'
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Study" lede="Test yourself, review with spaced flashcards, and keep your notes in one place. Everything is stored on this device only." />
      <div className="ui flex flex-wrap gap-1.5" role="tablist" aria-label="Study tools">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} aria-pressed={tab === t.id} className="btn" onClick={() => setParams({ tab: t.id })}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {tab === 'quiz' && <Quizzes />}
        {tab === 'cards' && <Cards />}
        {tab === 'progress' && <Progress />}
        {tab === 'notes' && <Notes />}
      </div>
    </div>
  )
}

const setTitle = (s: { set: string; title: string }) => (s.set === 'general' ? s.title : positionsById.get(s.set)?.name ?? s.title)

function SetPicker<T extends { set: string; title: string }>({ sets, onPick, extra }: { sets: T[]; onPick: (s: T) => void; extra: (s: T) => string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((s) => (
        <li key={s.set}>
          <button type="button" onClick={() => onPick(s)} className="leaf block h-full w-full p-4 text-left hover:border-accent">
            <span className="block text-xl">{setTitle(s)}</span>
            <span className="ui mt-1 block text-sm text-ink-soft">{extra(s)}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function Quizzes() {
  const [set, setSet] = useState<QuizSet | null>(null)
  const best = useApp((s) => s.quizBest)
  if (!set)
    return <SetPicker sets={content.quizzes} onPick={setSet} extra={(s) => `${s.questions.length} questions${best[s.set] != null ? `, best ${best[s.set]}%` : ''}`} />
  return <QuizRun key={set.set} set={set} onExit={() => setSet(null)} />
}

function QuizRun({ set, onExit }: { set: QuizSet; onExit: () => void }) {
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const record = useApp((s) => s.recordQuiz)
  const done = i >= set.questions.length
  const q = set.questions[i]
  if (done) {
    const pct = Math.round((score / set.questions.length) * 100)
    return (
      <div className="leaf max-w-2xl p-6">
        <h2 className="text-3xl">
          {score} of {set.questions.length}
        </h2>
        <p className="mt-1 text-ink-soft">{pct >= 80 ? 'A strong grasp of this view.' : pct >= 50 ? 'A good start. The explanations point to the pages worth revisiting.' : 'Worth another pass through the position page first.'}</p>
        <div className="ui mt-5 flex gap-2">
          <button type="button" className="btn btn-primary" onClick={() => (setI(0), setScore(0), setChoice(null))}>
            Try again
          </button>
          <button type="button" className="btn" onClick={onExit}>
            Choose another quiz
          </button>
          {set.set !== 'general' && (
            <Link to={`/positions/${set.set}`} className="btn no-underline">
              Read the position
            </Link>
          )}
        </div>
      </div>
    )
  }
  const answered = choice !== null
  return (
    <div className="max-w-2xl">
      <div className="ui flex items-center justify-between text-sm text-ink-soft">
        <button type="button" className="underline underline-offset-2" onClick={onExit}>
          All quizzes
        </button>
        <span>
          {setTitle(set)}: question {i + 1} of {set.questions.length}
        </span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-surface-2" aria-hidden>
        <div className="h-1 rounded-full bg-gold-bright transition-all" style={{ width: `${(i / set.questions.length) * 100}%` }} />
      </div>
      <h2 className="mt-5 text-2xl leading-snug">{q.q}</h2>
      <ul className="ui mt-4 grid gap-2">
        {q.options.map((o, k) => {
          const correct = k === q.answer
          const state = !answered ? '' : correct ? 'border-[color:var(--agree)] bg-[color:var(--agree)]/10' : k === choice ? 'border-rubric bg-rubric/10' : 'opacity-60'
          return (
            <li key={k}>
              <button
                type="button"
                disabled={answered}
                className={`btn w-full justify-start py-3 text-left text-base ${state}`}
                onClick={() => {
                  setChoice(k)
                  if (correct) setScore(score + 1)
                }}
              >
                {answered && correct && <span aria-label="correct">✓</span>}
                {answered && k === choice && !correct && <span aria-label="your answer, incorrect">✗</span>}
                {o}
              </button>
            </li>
          )
        })}
      </ul>
      {answered && (
        <div aria-live="polite" className="leaf mt-4 p-4">
          <p className="ui font-medium">{choice === q.answer ? 'Correct.' : 'Not quite.'}</p>
          <p className="mt-1">{q.explanation}</p>
          <button
            type="button"
            className="btn btn-primary ui mt-3"
            onClick={() => {
              const last = i + 1 >= set.questions.length
              if (last) record(set.set, Math.round(((score) / set.questions.length) * 100))
              setI(i + 1)
              setChoice(null)
            }}
          >
            {i + 1 < set.questions.length ? 'Next question' : 'See my score'}
          </button>
        </div>
      )}
    </div>
  )
}

function Cards() {
  const [deck, setDeck] = useState<FlashDeck | null>(null)
  const box = useApp((s) => s.cardBox)
  if (!deck)
    return (
      <SetPicker
        sets={content.flashcards}
        onPick={setDeck}
        extra={(d) => `${d.cards.length} cards, ${d.cards.filter((c) => (box[`${d.set}/${c.id}`] ?? 0) >= 3).length} learned`}
      />
    )
  return <CardRun key={deck.set} deck={deck} onExit={() => setDeck(null)} />
}

function CardRun({ deck, onExit }: { deck: FlashDeck; onExit: () => void }) {
  const box = useApp((s) => s.cardBox)
  const setBox = useApp((s) => s.setCardBox)
  // Leitner order: lowest box first, fixed for this session.
  const order = useMemo(() => [...deck.cards].sort((a, b) => (box[`${deck.set}/${a.id}`] ?? 0) - (box[`${deck.set}/${b.id}`] ?? 0)), [deck]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = order[i % order.length]
  const key = `${deck.set}/${card.id}`
  const grade = (knew: boolean) => {
    setBox(key, knew ? Math.min(4, (box[key] ?? 0) + 1) : 0)
    setFlipped(false)
    setI(i + 1)
  }
  return (
    <div className="max-w-2xl">
      <div className="ui flex items-center justify-between text-sm text-ink-soft">
        <button type="button" className="underline underline-offset-2" onClick={onExit}>
          All decks
        </button>
        <span>
          {setTitle(deck)}: card {(i % order.length) + 1} of {order.length}, box {box[key] ?? 0} of 4
        </span>
      </div>
      <div className="mt-4 [perspective:1200px]">
        <AnimatePresence mode="wait">
          <motion.button
            key={`${card.id}-${flipped}`}
            type="button"
            onClick={() => setFlipped(!flipped)}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={`leaf flex min-h-[15rem] w-full flex-col items-center justify-center p-8 text-center ${flipped ? 'border-gold' : ''}`}
            aria-label={flipped ? 'Answer. Select to show the question.' : 'Question. Select to show the answer.'}
          >
            <span className="ui text-sm text-ink-soft">{flipped ? 'Answer' : 'Question'}</span>
            <span className={`mt-2 ${flipped ? 'text-lg' : 'text-2xl'}`}>{flipped ? card.back : card.front}</span>
          </motion.button>
        </AnimatePresence>
      </div>
      <div className="ui mt-4 flex gap-2">
        {flipped ? (
          <>
            <button type="button" className="btn" onClick={() => grade(false)}>
              Again
            </button>
            <button type="button" className="btn btn-primary" onClick={() => grade(true)}>
              I knew it
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setFlipped(true)}>
            Show answer
          </button>
        )}
      </div>
    </div>
  )
}

function Bar({ label, n, of, to }: { label: string; n: number; of: number; to?: string }) {
  const pct = of ? Math.round((n / of) * 100) : 0
  return (
    <div>
      <div className="ui flex justify-between text-sm">
        {to ? <Link to={to}>{label}</Link> : <span>{label}</span>}
        <span className="text-ink-soft">
          {n} of {of}
        </span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-surface-2" role="progressbar" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-2 rounded-full bg-gold-bright" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Progress() {
  const { visited, quizBest, cardBox, resetStudy } = useApp()
  const cardsTotal = content.flashcards.reduce((n, d) => n + d.cards.length, 0)
  const learned = Object.values(cardBox).filter((b) => b >= 3).length
  return (
    <div className="max-w-2xl space-y-5">
      <Bar label="Positions read" n={visited.filter((v) => v.startsWith('position/')).length} of={content.positions.length} to="/positions" />
      <Bar label="Passages studied" n={visited.filter((v) => v.startsWith('passage/')).length} of={content.passages.length} to="/passages" />
      <Bar label="Debates explored" n={visited.filter((v) => v.startsWith('argument/')).length} of={content.arguments.length} to="/arena" />
      <Bar label="Quizzes taken" n={Object.keys(quizBest).length} of={content.quizzes.length} />
      <Bar label="Flashcards learned" n={learned} of={cardsTotal} />
      {Object.keys(quizBest).length > 0 && (
        <table className="ui mt-4 w-full text-left text-sm">
          <caption className="text-left font-serif text-lg">Best quiz scores</caption>
          <tbody>
            {Object.entries(quizBest).map(([k, v]) => (
              <tr key={k} className="border-b border-rule">
                <td className="py-1.5">{k === 'general' ? 'General' : positionsById.get(k)?.name}</td>
                <td className="py-1.5 text-right">{v}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        type="button"
        className="btn ui text-sm"
        onClick={() => window.confirm('Clear all progress, notes and saved items on this device?') && resetStudy()}
      >
        Clear progress and notes
      </button>
    </div>
  )
}

function labelFor(key: string): { label: string; to: string } {
  const [kind, id] = key.split('/')
  if (kind === 'position') return { label: positionsById.get(id)?.name ?? id, to: `/positions/${id}` }
  if (kind === 'passage') return { label: passagesById.get(id)?.ref ?? id, to: `/passages/${id}` }
  if (kind === 'argument') return { label: argumentsById.get(id)?.title ?? id, to: `/arena/${id}` }
  return { label: key, to: '/' }
}

function Notes() {
  const { notes, pins, bookmarks } = useApp()
  const entries = Object.entries(notes).sort(([a], [b]) => Number(pins.includes(b)) - Number(pins.includes(a)))
  const exportMd = () => {
    const md = entries.map(([k, v]) => `## ${labelFor(k).label}${pins.includes(k) ? ' (pinned)' : ''}\n\n${v}\n`).join('\n')
    const url = URL.createObjectURL(new Blob([`# My notes from Last Things\n\n${md}`], { type: 'text/markdown' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'last-things-notes.md'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl">Notes</h2>
          {entries.length > 0 && (
            <button type="button" className="ui text-sm underline underline-offset-2" onClick={exportMd}>
              Download as Markdown
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="ui mt-2 text-sm text-ink-soft">No notes yet. Use “Add a note” at the foot of any position, passage or debate.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {entries.map(([k, v]) => {
              const l = labelFor(k)
              return (
                <li key={k} className="leaf p-4">
                  <Link to={l.to} className="ui text-sm">
                    {pins.includes(k) && <span className="text-gold">✦ pinned, </span>}
                    {l.label}
                  </Link>
                  <p className="mt-1 whitespace-pre-wrap">{v}</p>
                </li>
              )
            })}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-2xl">Saved</h2>
        {bookmarks.length === 0 ? (
          <p className="ui mt-2 text-sm text-ink-soft">Nothing saved yet. Use “Save” on any position, passage or debate.</p>
        ) : (
          <ul className="ui mt-3 space-y-1.5">
            {bookmarks.map((b) => {
              const l = labelFor(b)
              return (
                <li key={b}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
