import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DeepDives } from '../components/DeepDives'
import { Icon } from '../components/Icon'
import { InThisWay } from '../components/israel/InThisWay'
import { Quiz } from '../components/israel/interactive'
import { QUIZ } from '../components/kingdomnow/data'
import { BeReady, DebateQs, OrderLine, Pillars, Related, ReignHero, RomansCase, Strains, Themes, ThreeOrders, Witnesses } from '../components/kingdomnow/parts'
import { StudyMap } from '../components/StudyMap'
import { HeroPanel } from '../components/studies/HeroPanel'
import { KeyIdeas } from '../components/studies/KeyIdeas'
import { KEY_IDEAS } from '../components/studies/keyIdeasData'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'

/** The kingdom now, consummated at his coming: the right view of the reign, set against the other orders. */
export default function KingdomNow() {
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <HeroPanel className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('The right view')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('The kingdom now, consummated at his coming')}
          </motion.h1>
          <p className="mt-4 text-[1.05rem]">{t('Christ has reigned since his ascension. The church is his body, the new Jerusalem, Zion and temple. The thousand years is the gospel age, not a future earthly period. At his coming come the resurrection, immortality in fullness and one judgement; then he hands the kingdom to the Father.')}</p>
          <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="mt-4 inline-block rounded-2xl px-4 py-2 text-lg font-bold" style={{ background: 'color-mix(in srgb, var(--gold) 20%, transparent)', color: 'var(--ink)' }}>
            {t('He comes to finish the reign, not to begin it.')}
          </motion.p>
        </div>
        <div className="leaf relative p-3">
          <ReignHero />
        </div>
      </HeroPanel>

      <StudyMap />
      <KeyIdeas items={KEY_IDEAS['kingdom-now']()} />

      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="leaf mt-6 p-5" style={{ borderLeft: '5px solid var(--gold)' }}>
        <p className="flex items-center gap-2 font-bold text-[var(--gold)]">
          <Icon name="question" /> {t('The test question for every view')}
        </p>
        <p className="mt-2 text-xl font-semibold">{t('Where does Scripture say Christ’s reign begins after he returns, rather than at his ascension?')}</p>
      </motion.div>

      <Section id="pillars" title={t('Six pillars')} lede={t('The case rests on six pillars under one roof. Tap a pillar.')}>
        <Pillars />
      </Section>

      <Section id="order" title={t('The order at a glance')} lede={t('From the ascension to the handover, in five steps. Play it, or tap a step.')}>
        <OrderLine />
      </Section>

      <Section id="orders" title={t('Three orders side by side')} lede={t('How premillennialism, amillennialism and the right view sequence the end, and where they collide.')}>
        <ThreeOrders />
      </Section>

      <Section id="themes" title={t('How the right view answers the text')} lede={t('The key themes and passages. Tap a card to open it.')}>
        <Themes />
      </Section>

      <Section id="strains" title={t('Where the other views strain the text')} lede={t('Tensions inside premillennialism and amillennialism. Tap a card to turn it over.')}>
        <Strains />
      </Section>

      <Section id="debate" title={t('Ask, anticipate the reply, follow up')} lede={t('Debate questions for premillennialists, for amillennialists, our friendly rivals, and on Romans 11.')}>
        <DebateQs />
      </Section>

      <Section id="romans11" title={t('Romans 11: “and so”, and one olive tree')} lede={t('Partial preterists and postmillennialists both reject a separate Jewish kingdom of land, temple and throne. They differ on whether a large Jewish turning to Christ comes within the age.')}>
        <InThisWay />
        <div className="mt-4">
          <RomansCase />
        </div>
      </Section>

      <Section id="ready" title={t('Be ready: the hard texts')} lede={t('Informed critics will press these. Each has a reasonable reply; some need careful handling.')}>
        <BeReady />
      </Section>

      <Section id="witnesses" title={t('Witnesses through church history')} lede={t('A present reign and one coming to raise the dead and judge has been taught from the creeds onward.')}>
        <Witnesses />
      </Section>

      <div className="leaf mt-10 p-5" style={{ borderLeft: '5px solid var(--accent)' }}>
        <p className="font-bold">{t('A fair note')}</p>
        <p className="mt-1 text-[0.98rem]">{t('Faithful, Bible-believing Christians hold premillennial, amillennial and partial preterist views. No view is free of tension, and serious scholars contest each reply above. Study and discuss with charity, and test every claim against the text yourself.')}</p>
      </div>

      <Section id="related" title={t('Connected studies')} lede={t('Where each part of this study is worked out in depth.')}>
        <Related />
      </Section>

      <DeepDives topic="kingdom-now" />
      <Section id="quiz" title={t('Test yourself')} lede={t('Questions on the reign, the order of events and Romans 11.')}>
        <Quiz items={QUIZ()} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/rapture" className="btn btn-primary no-underline">
            <Icon name="trumpet" /> {t('Rapture, millennium & kingdom')}
          </Link>
          <Link to="/kingdom-hope" className="btn no-underline">
            <Icon name="compass" /> {t('Early church, Israel and a world getting worse?')}
          </Link>
        </div>
      </Section>
    </div>
  )
}
