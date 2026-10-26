import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProphecyQAStudy } from '../content/schema'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Quiz } from '../components/israel/interactive'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { Flow } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { CountUp } from '../components/ui'
import { t } from '../lib/i18n'
import { refLabel } from '../lib/refLabel'
import { prophecyQA } from '../lib/data/qa'

type P = ProphecyQAStudy

/** Every dated prediction, on one line of years; each one stamped as it failed. */
function Graveyard({ items }: { items: P['predictions'] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.year - b.year), [items])
  const [i, setI] = useState(sorted.length - 1)
  const min = sorted[0]?.year ?? 0
  const max = sorted[sorted.length - 1]?.year ?? 2025
  const x = (y: number) => ((y - min) / Math.max(1, max - min)) * 100
  const e = sorted[i]
  return (
    <div className="leaf p-4 sm:p-5">
      <div className="relative mx-3 mb-12 mt-8 h-1.5 rounded-full bg-[var(--rule)]">
        {sorted.map((s, k) => (
          <button key={k} type="button" onClick={() => setI(k)} aria-label={`${s.year}: ${s.who}`} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x(s.year)}%` }}>
            <motion.span className="block rotate-45 border-2 border-[var(--surface)]" animate={{ width: k === i ? 18 : 11, height: k === i ? 18 : 11, background: k === i ? 'var(--rubric)' : 'var(--ink-soft)' }} />
          </button>
        ))}
        {[min, max].map((y) => (
          <span key={y} className="absolute top-5 -translate-x-1/2 text-xs text-ink-soft" style={{ left: `${x(y)}%` }}>
            {y}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative">
          <motion.span initial={{ scale: 2.2, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 0.9, rotate: -10 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 15 }} className="pointer-events-none absolute right-0 top-0 rounded border-2 border-[var(--rubric)] px-2 text-xs font-black uppercase tracking-wider text-rubric">
            {t('Did not happen')}
          </motion.span>
          <p className="font-serif text-3xl font-bold text-rubric">{e.year}</p>
          <h3 className="pr-28 text-lg font-bold">{e.who}</h3>
          <p className="mt-1 leading-relaxed">
            <Gloss>{e.claim}</Gloss>
          </p>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            <span className="font-bold">{t('What happened:')} </span>
            <Gloss>{e.outcome}</Gloss>
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex gap-2">
        <button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          ← {t('Earlier')}
        </button>
        <button type="button" className="btn btn-primary" disabled={i === sorted.length - 1} onClick={() => setI(i + 1)}>
          {t('Later')} →
        </button>
      </div>
    </div>
  )
}

/** The many people named as "the" Antichrist: a wall of cards. */
function Candidates({ items }: { items: P['candidates'] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((c, k) => (
        <motion.li key={k} initial={{ opacity: 0, rotate: -3, y: 10 }} whileInView={{ opacity: 1, rotate: (k % 3) - 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (k % 8) * 0.04 }}>
          <button type="button" onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k} className="leaf block h-full w-full p-3 text-left">
            <p className="font-bold leading-snug">{c.name}</p>
            <p className="text-xs text-ink-soft">{c.era}</p>
            <AnimatePresence initial={false}>
              {open === k && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="mt-2 text-xs">
                    <span className="font-bold">{t('Named by:')} </span>
                    {c.by}
                  </p>
                  <p className="mt-1 text-[0.85rem]">
                    <Gloss>{c.basis}</Gloss>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.li>
      ))}
    </ul>
  )
}

const JUMP = [
  ['principles', () => t('Reading keys')],
  ['questions', () => t('Every question answered')],
  ['predictions', () => t('Failed predictions')],
  ['candidates', () => t('Named as Antichrist')],
  ['path', () => t('Read a prophecy')],
  ['quiz', () => t('Quiz')],
] as const

export default function ProphecyQA() {
  const s = prophecyQA
  const [group, setGroup] = useState('all')
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Ask, search, read')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Prophecy questions answered')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            [s.questions.length, t('questions answered')],
            [s.groups.length, t('topics')],
            [s.predictions.length, t('failed predictions')],
            [s.candidates.length, t('“Antichrists” named')],
          ].map(([n, l], k) => (
            <motion.div key={k} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * k }} className="leaf p-4 text-center">
              <p className="font-serif text-4xl font-bold text-accent">
                <CountUp to={n as number} />
              </p>
              <p className="mt-1 text-sm font-semibold">{l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <nav aria-label={t('On this page')} className="scroll-x mt-8 flex gap-1.5 py-2">
        {JUMP.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip shrink-0 no-underline">
            {label()}
          </a>
        ))}
      </nav>

      <Section id="principles" title={t('Keys for reading prophecy')} lede={t('The principles every answer below relies on.')}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.principles.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="leaf glow-card p-5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent font-bold text-[var(--accent-ink)]">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-[0.95rem] text-ink-soft">
                <Gloss>{p.text}</Gloss>
              </p>
              {p.refs.length > 0 && <p className="mt-2 text-xs text-ink-soft">{refLabel(p.refs.join('; '))}</p>}
            </motion.li>
          ))}
        </ul>
      </Section>

      <Section id="questions" title={t('Every question, answered from Scripture')} lede={t('Pick a topic or search. Each question shows a crisp answer; open it for the full answer, examples and other views.')}>
        <QAExplorer items={s.questions} groups={s.groups} group={group} setGroup={setGroup} />
      </Section>

      <Section id="predictions" title={t('Two thousand years of failed predictions')} lede={t('Dated predictions of the end, each on the line of years. Step through them.')}>
        <Graveyard items={s.predictions} />
        <Link to="/signs" className="btn mt-4 no-underline">
          <Icon name="hourglass" /> {t('Signs of the times')}
        </Link>
      </Section>

      <Section id="candidates" title={t('Everyone who was “the Antichrist”')} lede={t('People named as the Antichrist or the beast through history. Tap a card for who named them and why.')}>
        <Candidates items={s.candidates} />
      </Section>

      <Section id="path" title={t('How to read a prophecy: a decision path')} lede={t('Work through any prophetic text with these questions.')}>
        <Flow flow={s.flow} />
      </Section>

      <Section id="quiz" title={t('Test yourself')} lede={t('Questions drawn from every topic.')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/fulfilled" className="btn btn-primary no-underline">
            <Icon name="scroll" /> {t('Matthew 24 verse by verse')}
          </Link>
          <Link to="/new-creation" className="btn no-underline">
            <Icon name="sparkles" /> {t('New heavens and new earth')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
