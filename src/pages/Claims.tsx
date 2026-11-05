import { motion } from 'framer-motion'
import { DeepDives } from '../components/DeepDives'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ClaimsStudy } from '../content/schema'
import { ClaimsArena, CosmicDecoder, DarknessSpotlight, LiteralScorecard } from '../components/claims/parts'
import { Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Quiz } from '../components/israel/interactive'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { Flow } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { claims } from '../lib/data/claims'

const JUMP = [
  ['darkness', () => t('Darkness at the cross')],
  ['cosmic', () => t('Cosmic decoder')],
  ['arena', () => t('All objections')],
  ['literal', () => t('Literalism scorecard')],
  ['questions', () => t('Questions')],
  ['path', () => t('Answer any objection')],
  ['quiz', () => t('Quiz')],
] as const

function Questions({ s }: { s: ClaimsStudy }) {
  const [group, setGroup] = useState('all')
  return <QAExplorer items={s.questions} groups={s.groups} group={group} setGroup={setGroup} />
}

export default function Claims() {
  const s = claims
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Dispensational and premillennial objections')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Objections answered')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <div className="leaf grid grid-cols-2 gap-3 p-5 text-center">
          {[
            [s.claims.filter((c) => c.kind === 'preterism').length, t('objections to partial preterism')],
            [s.claims.filter((c) => c.kind === 'postmil').length, t('objections to postmillennialism')],
            [s.cosmic.length, t('cosmic signs decoded')],
            [s.literal.length, t('time words tested')],
          ].map(([n, l], i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.12 }} className="rounded-xl bg-surface-2 p-3">
              <p className="font-serif text-4xl font-bold text-accent">{n}</p>
              <p className="text-xs text-ink-soft">{l}</p>
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
          <Icon name="scales" /> {t('Where this reading stands')}
        </p>
        <Prose text={s.orthodoxy} className="mt-2" />
      </div>

      <Section id="darkness" title={t('That occurred: darkness over the land')} lede={t('A “cosmic” sign fulfilled on a known day in history. Move the slider through the hours of the crucifixion.')}>
        <DarknessSpotlight d={s.darkness} />
      </Section>
      <Section id="cosmic" title={t('The cosmic-language decoder')} lede={t('Sun, moon and stars in the prophets, and the nation that fell each time. Tap a card to decode it.')}>
        <CosmicDecoder items={s.cosmic} />
      </Section>
      <Section id="arena" title={t('Every objection, answered')} lede={t('Tap a slice of the wheel to filter by category, switch between objections to preterism and to postmillennialism, or search. Each card opens to the answer, the key point and the other side’s rejoinder.')}>
        <ClaimsArena items={s.claims} />
      </Section>
      <Section id="literal" title={t('Who reads it literally? A scorecard')} lede={t('Eight time phrases. Tap a row to compare the plain sense with the usual futurist reading.')}>
        <LiteralScorecard rows={s.literal} />
      </Section>
      <Section id="questions" title={t('Every question answered')}>
        <Questions s={s} />
      </Section>
      <Section id="path" title={t('How to answer any objection: a decision path')}>
        <Flow flow={s.flow} />
      </Section>
      <DeepDives topic="claims" />
      <Section id="quiz" title={t('Test yourself')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/kingdom-hope" className="btn btn-primary no-underline">
            <Icon name="crown" /> {t('The kingdom, Israel and a world getting worse?')}
          </Link>
          <Link to="/seventy-weeks" className="btn no-underline">
            <Icon name="timeline" /> {t('Daniel’s seventy weeks')}
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
