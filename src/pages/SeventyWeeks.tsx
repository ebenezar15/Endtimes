import { motion } from 'framer-motion'
import { StudyMap } from '../components/StudyMap'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { WeeksStudy } from '../content/schema'
import { Prose } from '../components/Gloss'
import { Objections } from '../components/fulfilled/parts'
import { Icon } from '../components/Icon'
import { Quiz } from '../components/israel/interactive'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { Flow, StrawList } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { DecreeCalc, Fallacies, GoalsChecklist, MasterTimeline, PassageMap, PhraseWalk, WeeksGrid } from '../components/weeks/parts'
import { t } from '../lib/i18n'
import { weeks } from '../lib/data/weeks'


function Questions({ s }: { s: WeeksStudy }) {
  const [group, setGroup] = useState('all')
  return <QAExplorer items={s.questions} groups={s.groups} group={group} setGroup={setGroup} />
}

/** A hero strip: 7 + 62 + 1 squares that assemble as the page opens. */
function HeroWeeks() {
  return (
    <div className="leaf p-5">
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 70 }, (_, i) => (
          <motion.span key={i} className="aspect-square rounded-[3px]" style={{ background: i < 7 ? 'hsl(40 80% 45%)' : i < 69 ? 'hsl(205 65% 40%)' : 'hsl(0 65% 45%)' }} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.012 }} />
        ))}
      </div>
      <p className="mt-3 text-center text-sm font-semibold">{t('70 weeks × 7 = 490 years')}</p>
      <p className="text-center text-xs text-ink-soft">{t('7 + 62 weeks to the Anointed One · 1 week to confirm the covenant')}</p>
    </div>
  )
}

export default function SeventyWeeks() {
  const s = weeks
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Daniel 9:24-27 and the end-time passages')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Daniel’s seventy weeks')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <HeroWeeks />
      </section>

      <StudyMap />

      <div className="leaf mt-6 p-5" style={{ borderLeft: '5px solid var(--gold)' }}>
        <p className="flex items-center gap-2 font-bold text-[var(--gold)]">
          <Icon name="scales" /> {t('Where this reading stands')}
        </p>
        <Prose text={s.orthodoxy} className="mt-2" />
      </div>

      <Section id="text" title={t('The prophecy, phrase by phrase')} lede={t('Walk through Daniel 9:24-27. Each phrase shows the fulfilled reading; compare the futurist reading beside it.')}>
        <PhraseWalk items={s.phrases} />
      </Section>
      <Section id="goals" title={t('Six goals, all accomplished')} lede={t('Daniel 9:24 names six things the seventy weeks would achieve. Tick each one to see where the New Testament says it was done.')}>
        <GoalsChecklist goals={s.goals} />
      </Section>
      <Section id="count" title={t('Run the count yourself')} lede={t('Pick a starting decree and a year length, and see where 483 and 490 years end.')}>
        <DecreeCalc decrees={s.decrees} timeline={s.timeline} />
      </Section>
      <Section id="views" title={t('Four ways to count the weeks')} lede={t('The same seventy squares, drawn as each view counts them, with its strongest point and main difficulty.')}>
        <WeeksGrid models={s.models} />
      </Section>
      <Section id="timeline" title={t('From the exile to the fall of Jerusalem')} lede={t('Every dated event from 605 BC to AD 73 on one track. The centuries before Christ are compressed so his generation has room. Tap any dot.')}>
        <MasterTimeline items={s.timeline} />
      </Section>
      <Section id="passages" title={t('The end-time passages, mapped')} lede={t('Each passage marked as fulfilled, still future, or both, with its own time words. Tap a tile for both readings.')}>
        <PassageMap items={s.passages} />
      </Section>
      <Section id="fallacies" title={t('Fallacies and inconsistencies in other readings')} lede={t('Logical fallacies, scriptural problems and inconsistencies, named fairly. Filter by view; tap a card for the better reading.')}>
        <Fallacies items={s.fallacies} />
      </Section>
      <Section id="strawmen" title={t('Strawmen on every side')} lede={t('What each view is accused of, and what it really holds. Fair reading cuts both ways.')}>
        <StrawList items={s.strawmen} />
      </Section>
      <Section id="objections" title={t('Objections to the fulfilled reading, answered')}>
        <Objections items={s.objections} />
      </Section>
      <Section id="questions" title={t('Every question answered')}>
        <Questions s={s} />
      </Section>
      <Section id="path" title={t('Find your reading: a decision path')} lede={t('Answer four questions about Daniel 9 and see which view they lead to.')}>
        <Flow flow={s.flow} />
      </Section>
      <Section id="quiz" title={t('Test yourself')} lede={t('Questions on the text, the count and the timeline.')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/fulfilled" className="btn btn-primary no-underline">
            <Icon name="compass" /> {t('Matthew 24, verse by verse')}
          </Link>
          <Link to="/dating" className="btn no-underline">
            <Icon name="scales" /> {t('Weigh all the dating evidence')}
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
