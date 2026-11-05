import { motion } from 'framer-motion'
import { DeepDives } from '../components/DeepDives'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { IsraelHistory } from '../content/schema'
import { Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Bands, CovenantChain, ERA, Hourglass, IsraelTimeline, Vignette } from '../components/israelhistory/parts'
import { Quiz } from '../components/israel/interactive'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { israelHistory } from '../lib/data/israelHistory'

const JUMP = [
  ['timeline', () => t('Timeline')],
  ['bands', () => t('The big picture')],
  ['hourglass', () => t('One Seed')],
  ['covenants', () => t('Covenants')],
  ['questions', () => t('Questions')],
  ['quiz', () => t('Quiz')],
] as const

function Questions({ s }: { s: IsraelHistory }) {
  const [group, setGroup] = useState('all')
  return <QAExplorer items={s.questions} groups={s.groups} group={group} setGroup={setGroup} />
}

export default function IsraelHistoryPage() {
  const s = israelHistory
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const strip: [keyof typeof ERA, Parameters<typeof Vignette>[0]['icon']][] = [
    ['promise', 'tent'],
    ['sinai', 'tablets'],
    ['united', 'crown'],
    ['exile', 'chains'],
    ['christ', 'cross'],
    ['end', 'fall'],
  ]
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('From Abraham to AD 70')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('The history of Israel')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <div className="leaf grid grid-cols-3 gap-2 p-4">
          {strip.map(([era, icon], i) => (
            <motion.div key={era} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.12 }} className="flex flex-col items-center rounded-xl bg-surface-2 p-2">
              <Vignette icon={icon} c={ERA[era].c} size={84} />
              <span className="text-center text-[0.7rem] font-bold" style={{ color: ERA[era].c }}>
                {ERA[era].l()}
              </span>
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

      <div className="leaf mt-6 p-5" style={{ borderLeft: '5px solid var(--gold)' }}>
        <p className="flex items-center gap-2 font-bold text-[var(--gold)]">
          <Icon name="scales" /> {t('About the dates and the readings')}
        </p>
        <Prose text={s.orthodoxy} className="mt-2" />
      </div>

      <Section id="timeline" title={t('Four thousand years on one line')} lede={t('Press play to walk the story, or tap any event. The coloured axis marks the eras; the bands below mark the covenant periods.')}>
        <IsraelTimeline events={s.events} bands={s.bands} />
      </Section>
      <Section id="bands" title={t('The big picture in four spans')}>
        <Bands bands={s.bands} />
      </Section>
      <Section id="hourglass" title={t('The hourglass: from all nations to one Seed, and back to all nations')} lede={t('The promise narrows, step by step, to one person, then opens to the whole world. Tap a step.')}>
        <Hourglass steps={s.seed} />
      </Section>
      <Section id="covenants" title={t('The covenants, and where each was kept')}>
        <CovenantChain items={s.covenants} />
      </Section>
      <Section id="questions" title={t('Every question answered')}>
        <Questions s={s} />
      </Section>
      <DeepDives topic="israel-history" />
      <Section id="quiz" title={t('Test yourself')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/israel" className="btn btn-primary no-underline">
            <Icon name="star" /> {t('Israel in prophecy')}
          </Link>
          <Link to="/seventy-weeks" className="btn no-underline">
            <Icon name="timeline" /> {t('Daniel’s seventy weeks')}
          </Link>
          <Link to="/kingdom-hope" className="btn no-underline">
            <Icon name="crown" /> {t('The kingdom, Israel and a world getting worse?')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
