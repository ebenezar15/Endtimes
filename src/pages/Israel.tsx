import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { CampSpectrum, ClaimsDebate, DecisionFlow, Exchanges, Hermeneutics, KingdomArena, ModernTimeline, PromiseBoard, PromiseTracker, Quiz, Romans11, Strawmen } from '../components/israel/interactive'
import { LandWidening, MindMap, Recapitulation, SeedHero, ThroneChain } from '../components/israel/visuals'
import { Sources } from '../components/Sources'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { israel } from '../lib/data/studies'

const JUMP = [
  ['camps', () => t('The views')],
  ['map', () => t('Mind map')],
  ['jesus', () => t('Jesus the true Israel')],
  ['promises', () => t('The promises')],
  ['land', () => t('The land')],
  ['modern', () => t('Modern Israel')],
  ['kingdom', () => t('The kingdom')],
  ['romans11', () => t('Romans 11')],
  ['reading', () => t('How each side reads')],
  ['debate', () => t('Debate')],
  ['strawmen', () => t('Strawmen')],
  ['path', () => t('Find your view')],
  ['quiz', () => t('Quiz')],
] as const

export default function Israel() {
  if (!israel) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const s = israel
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Promise and fulfilment')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Israel in prophecy')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="chip">{t('{n} views compared', { n: s.camps.length })}</span>
            <span className="chip">{t('{n} promises traced', { n: s.promises.length })}</span>
            <span className="chip">{t('{n} arguments weighed', { n: s.kingdom.arguments.length + s.exchanges.length + s.modern.claims.length })}</span>
          </div>
        </div>
        <div className="leaf p-4">
          <SeedHero />
          <p className="mt-1 text-center text-xs text-ink-soft">{t('Tap to step through the promise')}</p>
        </div>
      </section>

      <nav aria-label={t('On this page')} className="scroll-x mt-8 flex gap-1.5 py-2">
        {JUMP.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip shrink-0 no-underline">
            {label()}
          </a>
        ))}
      </nav>

      <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {s.stakes.map((x, i) => (
          <motion.li key={x.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="leaf glow-card p-4">
            <h2 className="font-bold">{x.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">
              <Gloss>{x.text}</Gloss>
            </p>
          </motion.li>
        ))}
      </ul>

      <Section id="camps" title={t('The views, from fulfilment to a national future')} lede={t('Tap a view to read it; pick a second to compare them row by row.')}>
        <CampSpectrum camps={s.camps} />
      </Section>

      <Section id="map" title={t('Mind map: what “Israel” gathers up')} lede={t('Every thread of Israel’s story, and where the New Testament ties it. Tap a branch.')}>
        <MindMap map={s.mindmap} />
      </Section>

      <Section id="jesus" title={t('Jesus relives Israel’s story')} lede={t('The Gospels tell Jesus’ life in the shape of Israel’s history. Play the story or step through it.')}>
        <Recapitulation pairs={s.recapitulation} />
      </Section>

      <Section id="promises" title={t('Every promise, from first word to fulfilment')} lede={t('Pick a promise. Follow it from the Old Testament through its shadow, to Christ, to his people and the new creation; then read the history, what it means for us, and both camps’ arguments.')}>
        <PromiseBoard promises={s.promises} />
        <div className="mt-8">
          <PromiseTracker promises={s.promises} />
        </div>
      </Section>

      <Section id="land" title={t('The land grows into the world')} lede={t('How the inheritance widens through Scripture, from a garden to a whole renewed earth. Drag or step.')}>
        <LandWidening stages={s.landWidening} />
      </Section>

      <Section id="modern" title={t('The modern State of Israel: prophecy or politics?')} lede={t('Three questions that are easily confused: is 1948 a fulfilment of prophecy, how did the state come about, and how should Christians treat the Jewish people?')}>
        <Prose text={s.modern.intro} className="max-w-[70ch]" />
        <h3 className="mt-8 text-xl font-bold">{t('A timeline from AD 70 to today')}</h3>
        <p className="text-sm text-ink-soft">{t('Filter by kind of event; tap a year.')}</p>
        <div className="mt-3">
          <ModernTimeline items={s.modern.timeline} />
        </div>
        <h3 className="mt-10 text-xl font-bold">{t('What actually brought the state into being')}</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.modern.factors.map((f, i) => (
            <motion.li key={f.id} initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="leaf p-4" style={{ borderTop: '4px solid #1d4ed8' }}>
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-surface-2 font-bold text-[#1d4ed8] ring-1 ring-rule">{i + 1}</span>
              <h4 className="mt-2 font-bold">{f.title}</h4>
              <p className="mt-1 text-sm text-ink-soft">
                <Gloss>{f.text}</Gloss>
              </p>
            </motion.li>
          ))}
        </ul>
        <h3 className="mt-10 text-xl font-bold">{t('Texts said to predict 1948')}</h3>
        <p className="text-sm text-ink-soft">{t('The claim, the criticism, the response, and where each stands.')}</p>
        <div className="mt-3">
          <ClaimsDebate items={s.modern.claims} />
        </div>
        <div className="leaf mt-8 p-5" style={{ borderLeft: '5px solid var(--gold)' }}>
          <p className="flex items-center gap-2 font-bold text-[var(--gold)]">
            <Icon name="lamp" /> {t('A necessary word of care')}
          </p>
          <Prose text={s.modern.caution} className="mt-2" />
        </div>
      </Section>

      <Section id="kingdom" title={t('An already reigning kingdom, or a future earthly one?')} lede={t('Each argument comes with its best counter and an answer. Switch on the ones you find persuasive and watch the rope.')}>
        <Prose text={s.kingdom.intro} className="max-w-[70ch]" />
        <div className="mt-6">
          <KingdomArena args={s.kingdom.arguments} />
        </div>
        <h3 className="mt-12 text-xl font-bold">{t('The throne of David, link by link')}</h3>
        <p className="text-sm text-ink-soft">{t('Where does the Son of David sit, and since when?')}</p>
        <div className="mt-4">
          <ThroneChain steps={s.kingdom.throne} />
        </div>
      </Section>

      <Section id="romans11" title={t('Romans 11: “all Israel will be saved”')} lede={t('The most debated chapter. Five readings, each with its strengths and weaknesses.')}>
        <Romans11 r={s.romans11} />
      </Section>

      <Section id="reading" title={t('How each side reads the Old Testament')} lede={t('The disagreement is mostly about method. Open each principle to see both readings side by side.')}>
        <Hermeneutics items={s.hermeneutics} />
      </Section>

      <Section id="debate" title={t('Argument, counter-argument, answer')} lede={t('The debate as it actually runs. Reveal each round in turn.')}>
        <Exchanges items={s.exchanges} />
      </Section>

      <Section id="strawmen" title={t('Strawmen on both sides')} lede={t('Caricatures each camp hears about itself. Knock each one down to see what is really held.')}>
        <Strawmen items={s.strawmen} />
      </Section>

      <Section id="path" title={t('Find your view: a decision path')} lede={t('Answer the key questions in order and see where they lead.')}>
        <DecisionFlow flow={s.flow} camps={s.camps} />
      </Section>

      <Section id="best" title={t('Each side’s best case')} lede={t('In fairness, here is the strongest case each side makes.')}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="leaf glow-card p-5" style={{ borderTop: '5px solid var(--accent)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Fulfilment in Christ')}</p>
            <Prose text={s.bestCase.fulfilment} className="mt-2" />
          </div>
          <div className="leaf glow-card p-5" style={{ borderTop: '5px solid var(--rubric)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('A future for national Israel')}</p>
            <Prose text={s.bestCase.future} className="mt-2" />
          </div>
        </div>
      </Section>

      <Section id="quiz" title={t('Test yourself')} lede={t('Questions drawn from both camps and from history.')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/olivet" className="btn btn-primary no-underline">
            <Icon name="compass" /> {t('Matthew 24 and AD 70')}
          </Link>
          <Link to="/signs" className="btn no-underline">
            <Icon name="hourglass" /> {t('Signs of the times')}
          </Link>
          <Link to="/josephus" className="btn no-underline">
            <Icon name="book" /> {t('Josephus: the fall of Jerusalem')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
