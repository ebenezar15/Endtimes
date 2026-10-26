import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Objections } from '../components/fulfilled/parts'
import { Quiz } from '../components/israel/interactive'
import { Atlas, Bridge, Echoes, ScrollHero, Tabernacle, Views, Words, Worlds } from '../components/newcreation/parts'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { Flow } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { newCreation } from '../lib/data/studies'

const JUMP = [
  ['views', () => t('The views')],
  ['questions', () => t('Every question answered')],
  ['tabernacle', () => t('The tabernacle cosmos')],
  ['echoes', () => t('Creation echoes')],
  ['atlas', () => t('Passage map')],
  ['worlds', () => t('Covenant worlds')],
  ['words', () => t('Word studies')],
  ['bridge', () => t('Isaiah and Revelation')],
  ['objections', () => t('Objections')],
  ['path', () => t('Find your view')],
  ['quiz', () => t('Quiz')],
] as const

export default function NewCreation() {
  const s = newCreation
  const [group, setGroup] = useState('all')
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('From Genesis 1 to Revelation 21')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('New heavens and new earth')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="chip">{t('{n} questions answered', { n: s.questions.length })}</span>
            <span className="chip">{t('{n} passages mapped', { n: s.atlas.length })}</span>
            <span className="chip">{t('{n} views compared', { n: s.views.length })}</span>
          </div>
        </div>
        <div className="leaf p-4">
          <ScrollHero />
          <p className="mt-1 text-center text-xs text-ink-soft">{t('Tap to step from the first creation to the new')}</p>
        </div>
      </section>

      <nav aria-label={t('On this page')} className="scroll-x mt-8 flex gap-1.5 py-2">
        {JUMP.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip shrink-0 no-underline">
            {label()}
          </a>
        ))}
      </nav>

      <Section id="views" title={t('Six ways to read “heaven and earth”')} lede={t('From a renewed physical cosmos to a covenant world that passed away. Pick a view.')}>
        <Views views={s.views} />
      </Section>

      <Section id="questions" title={t('Every question, answered from Scripture')} lede={t('Each question has a crisp answer; open it for the full answer, examples and other views.')}>
        <QAExplorer items={s.questions} groups={s.groups} group={group} setGroup={setGroup} />
      </Section>

      <Section id="tabernacle" title={t('The tabernacle as heaven and earth')} lede={t('Why ancient readers saw the sanctuary as a small cosmos. Tap each part.')}>
        <Tabernacle parts={s.tabernacle} />
      </Section>

      <Section id="echoes" title={t('Creation words, used again')} lede={t('When God forms, judges or remakes his people, Scripture reaches for the words of Genesis 1.')}>
        <Echoes items={s.echoes} />
      </Section>

      <Section id="atlas" title={t('A map of every “heaven and earth” passage')} lede={t('Placed from Genesis to Revelation, coloured by how the phrase is used. Read each one through both lenses.')}>
        <Atlas items={s.atlas} />
      </Section>

      <Section id="worlds" title={t('Covenant worlds, from Eden to the new Jerusalem')} lede={t('Step through the stages, and switch between the covenantal and the traditional lens.')}>
        <Worlds items={s.worlds} />
      </Section>

      <Section id="words" title={t('The words behind the debate')} lede={t('Hebrew and Greek terms that decide how these passages are read.')}>
        <Words items={s.words} />
      </Section>

      <Section id="bridge" title={t('Isaiah 65 and Revelation 21, side by side')} lede={t('The promise and its vision, theme by theme.')}>
        <Bridge items={s.parallels} />
      </Section>

      <Section id="objections" title={t('Objections, answered')} lede={t('The strongest challenges to the covenantal reading, and its replies.')}>
        <Objections items={s.objections} />
      </Section>

      <Section id="path" title={t('Find your view: a decision path')} lede={t('Answer the key questions in order and see where they lead.')}>
        <Flow flow={s.flow} />
      </Section>

      <Section id="quiz" title={t('Test yourself')} lede={t('Questions on the texts, the words and the views.')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/fulfilled" className="btn btn-primary no-underline">
            <Icon name="scroll" /> {t('Matthew 24 verse by verse')}
          </Link>
          <Link to="/revelation/21" className="btn no-underline">
            <Icon name="seal" /> {t('Revelation 21')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
