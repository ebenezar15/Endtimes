import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { JudgmentsStudy } from '../content/schema'
import { Prose } from '../components/Gloss'
import { Objections } from '../components/fulfilled/parts'
import { Icon } from '../components/Icon'
import { Quiz } from '../components/israel/interactive'
import { Bookends, Escalation, ExodusTable, Interludes, JudgmentBoard, SET, Structures, SymbolDeck } from '../components/judgments/parts'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { Flow } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { Fallacies } from '../components/weeks/parts'
import { t } from '../lib/i18n'
import { judgments } from '../lib/data/judgments'

const JUMP = [
  ['bookends', () => t('Time frame')],
  ['board', () => t('All 21 judgements')],
  ['escalation', () => t('Escalation')],
  ['structure', () => t('How they fit')],
  ['exodus', () => t('New exodus')],
  ['interludes', () => t('Interludes')],
  ['symbols', () => t('Symbols')],
  ['problems', () => t('Problems in other views')],
  ['objections', () => t('Objections')],
  ['questions', () => t('Questions')],
  ['path', () => t('Decision path')],
  ['quiz', () => t('Quiz')],
] as const

function Questions({ s }: { s: JudgmentsStudy }) {
  const [group, setGroup] = useState('all')
  return <QAExplorer items={s.questions} groups={s.groups} group={group} setGroup={setGroup} />
}

/** Hero: three rows of seven tokens dropping into place. */
function HeroBoard() {
  return (
    <div className="leaf space-y-2 p-5">
      {(['seal', 'trumpet', 'bowl'] as const).map((r, k) => (
        <div key={r} className="flex items-center gap-1.5">
          <span className="w-20 shrink-0 text-xs font-bold" style={{ color: SET[r].c }}>
            {SET[r].l()}
          </span>
          {Array.from({ length: 7 }, (_, i) => (
            <motion.span key={i} className="flex aspect-square flex-1 items-center justify-center rounded-lg font-serif text-sm font-bold text-white" style={{ background: SET[r].c }} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + k * 0.35 + i * 0.05 }}>
              {i + 1}
            </motion.span>
          ))}
        </div>
      ))}
      <p className="pt-1 text-center text-xs text-ink-soft">{t('A fourth → a third → all')}</p>
    </div>
  )
}

export default function Judgments() {
  const s = judgments
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Revelation 6-16')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('The seals, trumpets and bowls')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <HeroBoard />
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
          <Icon name="scales" /> {t('Where this reading stands')}
        </p>
        <Prose text={s.orthodoxy} className="mt-2" />
      </div>

      <Section id="bookends" title={t('The time frame: “soon” at both ends')} lede={t('Every vision sits between these words.')}>
        <Bookends items={s.bookends} />
      </Section>
      <Section id="board" title={t('All twenty-one judgements')} lede={t('Tap any seal, trumpet or bowl for its image, the fulfilled reading, the futurist reading and its Old Testament background.')}>
        <JudgmentBoard items={s.series} />
      </Section>
      <Section id="escalation" title={t('A fourth, a third, then everything')} lede={t('The judgements rise in intensity, as the Law warned: “seven times” for covenant breaking (Leviticus 26).')}>
        <Escalation />
      </Section>
      <Section id="structure" title={t('How the three series fit together')} lede={t('Three models, drawn. Each has a strong point and a difficulty.')}>
        <Structures items={s.structures} />
      </Section>
      <Section id="exodus" title={t('A new exodus: the plagues of Egypt return')} lede={t('Jerusalem is “symbolically called Sodom and Egypt, where their Lord was crucified” (11:8).')}>
        <ExodusTable rows={s.exodus} />
      </Section>
      <Section id="interludes" title={t('The interludes between the judgements')} lede={t('Before and between the blows, God seals and protects his people.')}>
        <Interludes items={s.interludes} />
      </Section>
      <Section id="symbols" title={t('The beast, 666, Babylon and other symbols')} lede={t('Tap a symbol for both readings.')}>
        <SymbolDeck items={s.symbols} />
      </Section>
      <Section id="problems" title={t('Why other views have problems')} lede={t('Logical, scriptural and consistency problems in futurist, historicist, idealist and full preterist readings. Filter by view; tap a card for the better reading.')}>
        <Fallacies items={s.problems} />
      </Section>
      <Section id="objections" title={t('Objections to the fulfilled reading, answered')}>
        <Objections items={s.objections} />
      </Section>
      <Section id="questions" title={t('Every question answered')}>
        <Questions s={s} />
      </Section>
      <Section id="path" title={t('Find your reading: a decision path')}>
        <Flow flow={s.flow} />
      </Section>
      <Section id="quiz" title={t('Test yourself')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/revelation" className="btn btn-primary no-underline">
            <Icon name="seal" /> {t('Revelation Study')}
          </Link>
          <Link to="/dating" className="btn no-underline">
            <Icon name="scales" /> {t('Weigh all the dating evidence')}
          </Link>
          <Link to="/seventy-weeks" className="btn no-underline">
            <Icon name="timeline" /> {t('Daniel’s seventy weeks')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
