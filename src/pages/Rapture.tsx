import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Quiz } from '../components/israel/interactive'
import { KingdomSpectrum, MillDebates, MillSequences, RaptureHistory, ShapeOfHistory, Stewardship, TextLens, TimingMachine, TRIB_COLOR } from '../components/rapture/visuals'
import { Sources } from '../components/Sources'
import { Flow, Rounds, StrawList } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { refLabel } from '../lib/refLabel'
import { rapture } from '../lib/data/studies'

const JUMP = [
  ['timing', () => t('Rapture timing')],
  ['texts', () => t('Key texts')],
  ['arguments', () => t('Arguments')],
  ['history', () => t('History')],
  ['millennium', () => t('The millennium')],
  ['shape', () => t('Shape of history')],
  ['questions', () => t('Millennium questions')],
  ['kingdom', () => t('Establish or steward?')],
  ['stewardship', () => t('Stewardship texts')],
  ['kingdom-debate', () => t('Kingdom debate')],
  ['strawmen', () => t('Strawmen')],
  ['path', () => t('Find your view')],
  ['quiz', () => t('Quiz')],
] as const

const EST = { label: t('Established at the return'), color: 'hsl(215 70% 42%)' }
const STW = { label: t('Stewarded now'), color: 'hsl(15 75% 45%)' }

export default function Rapture() {
  if (!rapture) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const s = rapture
  const tribSides = Object.fromEntries(s.tribViews.map((v) => [v.id, { label: v.name, color: TRIB_COLOR[v.id] }]))
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('When, how long, and what now?')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Rapture, millennium and kingdom')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="chip">{t('{n} rapture views', { n: s.tribViews.length })}</span>
            <span className="chip">{t('{n} millennial views', { n: s.millViews.length })}</span>
            <span className="chip">{t('{n} kingdom models', { n: s.kingdomModels.length })}</span>
          </div>
        </div>
        <div className="leaf p-5">
          <p className="text-sm font-bold text-ink-soft">{t('Three questions this study weighs')}</p>
          <ol className="mt-3 space-y-3">
            {[
              ['trumpet', t('When are believers gathered to Christ: before, in the middle of, or after a great tribulation, or at his one return?')],
              ['crown', t('Is the thousand-year reign of Revelation 20 now, or after Christ returns?')],
              ['compass', t('Will Christ establish his kingdom on earth at his return, or are we stewarding a kingdom already established?')],
            ].map(([icon, q], i) => (
              <motion.li key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }} className="flex gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-[var(--accent-ink)]">
                  <Icon name={icon as 'trumpet'} size={17} />
                </span>
                <span className="min-w-0 font-semibold leading-snug [overflow-wrap:break-word]">{q}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <nav aria-label={t('On this page')} className="scroll-x mt-8 flex gap-1.5 py-2">
        {JUMP.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip shrink-0 no-underline">
            {label()}
          </a>
        ))}
      </nav>

      <Section id="timing" title={t('Where each view places the rapture')} lede={t('Daniel’s seventieth week drawn as seven years. Tap a view to see where it puts the gathering of believers, the outpouring of wrath, and the return.')}>
        <TimingMachine views={s.tribViews} />
      </Section>

      <Section id="texts" title={t('The key texts, read by every view')} lede={t('Pick a passage, read the question it raises, then compare the readings one at a time or all together.')}>
        <TextLens texts={s.texts} views={s.tribViews} />
      </Section>

      <Section id="arguments" title={t('Rapture arguments: argument, counter, answer')} lede={t('Each view’s strongest arguments, the best counter from the others, and its reply.')}>
        <Rounds items={s.arguments.map((a) => ({ ...a, by: a.view }))} sides={tribSides} />
      </Section>

      <Section id="history" title={t('How the doctrine developed')} lede={t('From the early church to today. Filter by view.')}>
        <RaptureHistory items={s.history} views={s.tribViews} />
      </Section>

      <Section id="millennium" title={t('The millennium: four views in order')} lede={t('Each view’s order of events from now to the eternal state. Tap a view to read how it handles Revelation 20.')}>
        <MillSequences views={s.millViews} />
      </Section>

      <Section id="shape" title={t('The shape of history before the return')} lede={t('How far each view expects the gospel to spread, and the world to change, before Christ comes.')}>
        <ShapeOfHistory views={s.millViews} />
      </Section>

      <Section id="questions" title={t('The millennium debates')} lede={t('Twelve questions that divide the views, each answered by all four.')}>
        <MillDebates items={s.millDebates} />
      </Section>

      <Section id="kingdom" title={t('Establishing the kingdom, or stewarding it?')} lede={t('Christians agree Christ is King. They differ on whether his kingdom on earth is established at his return or already established and now stewarded. Nine models, placed along the spectrum.')}>
        <KingdomSpectrum models={s.kingdomModels} />
      </Section>

      <Section id="stewardship" title={t('Stewardship texts, read both ways')} lede={t('The parables of the waiting servants and other texts, read as waiting for the King and as serving the reigning King.')}>
        <Stewardship items={s.stewardship} />
      </Section>

      <Section id="kingdom-debate" title={t('The kingdom debate, round by round')} lede={t('The case for a kingdom established at Christ’s return, and the case for one already established, each with a counter and an answer.')}>
        <Rounds items={s.exchanges} sides={{ establish: EST, steward: STW }} counterLabel={(by) => (by === 'establish' ? STW : EST)} />
      </Section>

      <Section id="strawmen" title={t('Strawmen on every side')} lede={t('Caricatures each view hears about itself. Knock each one down to see what is really held.')}>
        <StrawList items={s.strawmen} />
      </Section>

      <Section id="path" title={t('Find your view: a decision path')} lede={t('Answer the key questions in order and see where they lead.')}>
        <Flow flow={s.flow} />
      </Section>

      <Section id="common" title={t('What every view can affirm')} lede={t('However the details fall, these hopes are shared.')}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.commonGround.map((c, i) => (
            <motion.li key={c.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="leaf glow-card p-5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface-2 font-bold text-accent ring-1 ring-rule">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
              <p className="mt-1 text-[0.95rem] text-ink-soft">
                <Gloss>{c.text}</Gloss>
              </p>
              {c.refs.length > 0 && <p className="mt-2 text-xs text-ink-soft">{refLabel(c.refs.join('; '))}</p>}
            </motion.li>
          ))}
        </ul>
      </Section>

      <Section id="quiz" title={t('Test yourself')} lede={t('Questions on Scripture, history and the debates.')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/israel" className="btn btn-primary no-underline">
            <Icon name="star" /> {t('Israel in prophecy')}
          </Link>
          <Link to="/revelation/20" className="btn no-underline">
            <Icon name="seal" /> {t('Revelation 20')}
          </Link>
          <Link to="/timelines" className="btn no-underline">
            <Icon name="timeline" /> {t('Timelines')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
