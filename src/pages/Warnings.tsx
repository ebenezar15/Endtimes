import { motion } from 'framer-motion'
import { StudyMap } from '../components/StudyMap'
import { DeepDives } from '../components/DeepDives'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { WarningsStudy } from '../content/schema'
import { Prose } from '../components/Gloss'
import { Objections } from '../components/fulfilled/parts'
import { Icon } from '../components/Icon'
import { Quiz } from '../components/israel/interactive'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { Flow } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { CaseChain, DaysLine, EchoMap, HinnomMap, MisreadCards, TeachingCards } from '../components/warnings/parts'
import { t } from '../lib/i18n'
import { refLabel } from '../lib/refLabel'
import { warnings } from '../lib/data/warnings'


function Questions({ s }: { s: WarningsStudy }) {
  const [group, setGroup] = useState('all')
  return <QAExplorer items={s.questions} groups={s.groups} group={group} setGroup={setGroup} />
}

/** Hero: the two cries side by side, Hosea and Matthew. */
function HeroCries() {
  return (
    <div className="leaf space-y-3 p-5">
      {[
        ['Hosea 8:2', t('“My God, we know you!”'), 'hsl(30 60% 38%)'],
        ['Matthew 7:22-23', t('“Lord, Lord …” — “I never knew you.”'), 'hsl(205 65% 38%)'],
        ['Matthew 23:36', t('“All these things will come upon this generation.”'), 'hsl(0 65% 42%)'],
      ].map(([r, q, c], i) => (
        <motion.div key={r} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.3 }} className="rounded-xl p-3" style={{ borderLeft: `5px solid ${c}`, background: 'var(--surface-2)' }}>
          <p className="text-xs font-bold" style={{ color: c }}>
            {refLabel(r)}
          </p>
          <p className="font-serif text-lg font-bold leading-snug">{q}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default function Warnings() {
  const s = warnings
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Warnings heard in their setting')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Warnings misread')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <HeroCries />
      </section>

      <StudyMap />

      <div className="leaf mt-6 p-5" style={{ borderLeft: '5px solid var(--gold)' }}>
        <p className="flex items-center gap-2 font-bold text-[var(--gold)]">
          <Icon name="scales" /> {t('Where this reading stands')}
        </p>
        <Prose text={s.orthodoxy} className="mt-2" />
      </div>

      <Section id="chain" title={t('From Hosea to AD 70: one warning, link by link')} lede={t('Follow the chain from the prophets, through Jesus, to the history. Reveal one link at a time.')}>
        <CaseChain items={s.chain} />
      </Section>
      <Section id="echoes" title={t('The echo map: prophets and Jesus')} lede={t('Each Old Testament warning joined to the New Testament words that echo it. Tap a pair.')}>
        <EchoMap items={s.echoes} />
      </Section>
      <Section id="hinnom" title={t('Gehenna: the valley beside Jerusalem')} lede={t('Tap the numbers to follow the Valley of Hinnom from boundary line to Valley of Slaughter.')}>
        <HinnomMap items={s.hinnom} />
      </Section>
      <Section id="misread" title={t('Warnings often applied to the afterlife')} lede={t('Switch each card from the usual reading to the reading in its setting, with the clues. Coloured by whether it points to AD 70, the final judgement, or both.')}>
        <MisreadCards items={s.misread} />
      </Section>
      <Section id="days" title={t('The “day of the LORD” in history')} lede={t('The prophets announced days of the LORD on nations, each fulfilled in history. Malachi’s great day followed Elijah.')}>
        <DaysLine items={s.days} />
      </Section>
      <Section id="teaching" title={t('A teaching series on the last days')} lede={t('The main points of a four-part video series, summarised. Details that go beyond the historical sources have been corrected or left out.')}>
        <TeachingCards items={s.teaching} />
      </Section>
      <Section id="guardrails" title={t('What this reading does not say')}>
        <Objections items={s.guardrails} />
      </Section>
      <Section id="questions" title={t('Every question answered')}>
        <Questions s={s} />
      </Section>
      <Section id="path" title={t('Is this warning about AD 70 or the end? A decision path')}>
        <Flow flow={s.flow} />
      </Section>
      <DeepDives topic="warnings" />
      <Section id="quiz" title={t('Test yourself')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/josephus" className="btn btn-primary no-underline">
            <Icon name="book" /> {t('Josephus: the fall of Jerusalem')}
          </Link>
          <Link to="/fulfilled" className="btn no-underline">
            <Icon name="compass" /> {t('Matthew 24, verse by verse')}
          </Link>
          <Link to="/judgments" className="btn no-underline">
            <Icon name="seal" /> {t('The seals, trumpets and bowls')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
