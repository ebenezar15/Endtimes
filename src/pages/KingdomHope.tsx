import { motion } from 'framer-motion'
import { DeepDives } from '../components/DeepDives'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { HopeStudy } from '../content/schema'
import { Gloss, Prose } from '../components/Gloss'
import { ApostlesWall, ClaimCards, Compare, FathersMap, GrowthLadder, PromiseMap, Test1948, Trends, TwistTimeline } from '../components/hope/parts'
import { RiseBraid, Terms, TreeModels, ZionClaims } from '../components/hope/zion'
import { Icon, type IconName } from '../components/Icon'
import { Quiz } from '../components/israel/interactive'
import { QAExplorer } from '../components/qa/QAExplorer'
import { Sources } from '../components/Sources'
import { Flow } from '../components/studies/Debate'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { hope } from '../lib/data/hope'

const PART_LOOK: Record<string, { icon: IconName; color: string }> = {
  early: { icon: 'scroll', color: 'hsl(15 75% 45%)' },
  israel: { icon: 'star', color: 'hsl(215 70% 42%)' },
  worse: { icon: 'compass', color: 'hsl(160 60% 32%)' },
  zion: { icon: 'scales', color: 'hsl(265 45% 42%)' },
}

/** A full-width banner opening each of the three parts. */
function PartBanner({ part, n }: { part: HopeStudy['parts'][number]; n: number }) {
  const look = PART_LOOK[part.id] ?? PART_LOOK.early
  return (
    <motion.div id={`part-${part.id}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-24 scroll-mt-20 rounded-3xl p-6 text-white sm:p-8" style={{ background: `linear-gradient(135deg, ${look.color}, color-mix(in srgb, ${look.color} 55%, #111))` }}>
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] opacity-90">
        <Icon name={look.icon} size={16} /> {t('Part {n}', { n })}
      </p>
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{part.title}</h2>
      <p className="mt-3 text-lg font-semibold opacity-95">{part.question}</p>
      <p className="mt-3 max-w-[75ch] leading-relaxed opacity-90">{part.answer}</p>
    </motion.div>
  )
}

/** The question bank for one part, limited to that part's groups. */
function PartQuestions({ s, part }: { s: HopeStudy; part: string }) {
  const [group, setGroup] = useState('all')
  const groups = s.groups.filter((g) => g.part === part)
  const ids = new Set(groups.map((g) => g.id))
  return <QAExplorer items={s.questions.filter((q) => ids.has(q.group))} groups={groups} group={group} setGroup={setGroup} />
}

const JUMP = [
  ['part-early', () => t('Early church')],
  ['fathers', () => t('Early writers')],
  ['apostles', () => t('The apostles')],
  ['part-israel', () => t('Israel')],
  ['promises', () => t('Promises kept')],
  ['test-1948', () => t('Test 1948')],
  ['twist', () => t('How it changed')],
  ['part-worse', () => t('Getting worse?')],
  ['claims', () => t('Claims answered')],
  ['trends', () => t('The record')],
  ['growth', () => t('A growing kingdom')],
  ['part-zion', () => t('Zionism')],
  ['zion-rise', () => t('How Zionism rose')],
  ['zion-claims', () => t('Zionist claims')],
  ['olive', () => t('One olive tree')],
  ['attacks', () => t('Replacement charges')],
  ['path', () => t('Find your hope')],
  ['quiz', () => t('Quiz')],
] as const

export default function KingdomHope() {
  const s = hope
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Three questions, one hope')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('The kingdom, Israel and a world getting worse?')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
        </div>
        <ol className="space-y-3">
          {s.parts.map((p, i) => {
            const look = PART_LOOK[p.id] ?? PART_LOOK.early
            return (
              <motion.li key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
                <button type="button" onClick={() => go(`part-${p.id}`)} className="leaf glow-card flex w-full items-start gap-3 p-4 text-left">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: look.color }}>
                    <Icon name={look.icon} size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: look.color }}>
                      {t('Part {n}', { n: i + 1 })} · {p.title}
                    </span>
                    <span className="mt-0.5 block font-semibold leading-snug [overflow-wrap:break-word]">{p.question}</span>
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ol>
      </section>

      <nav aria-label={t('On this page')} className="scroll-x mt-8 flex gap-1.5 py-2">
        {JUMP.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), go(id))} className="chip shrink-0 no-underline">
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

      <PartBanner part={s.parts[0]} n={1} />
      <Section id="fathers" title={t('Who expected an earthly thousand years?')} lede={t('Twenty-five early writers from AD 90 to 420, placed by what they said about the thousand years. Gold lines join teacher and pupil. Tap a dot.')}>
        <FathersMap items={s.fathers} />
      </Section>
      <Section id="compare" title={t('Early chiliasm is not modern dispensationalism')} lede={t('Row by row, what the early writers expected and what the modern system teaches.')}>
        <Compare rows={s.compare} />
      </Section>
      <Section id="apostles" title={t('What the apostles said about the kingdom')} lede={t('Every saying, coloured by whether it speaks of the kingdom now, still to come, or both.')}>
        <ApostlesWall items={s.apostles} />
      </Section>
      <Section id="q-early" title={t('Questions on the early church')}>
        <PartQuestions s={s} part="early" />
      </Section>

      <PartBanner part={s.parts[1]} n={2} />
      <Section id="promises" title={t('Every promise, and where it was kept')} lede={t('Tap a promise to read it, where Scripture says it was kept, and how dispensationalists read it.')}>
        <PromiseMap items={s.promises} />
      </Section>
      <Section id="test-1948" title={t('Is 1948 prophecy? Five tests')} lede={t('Answer each question from the text and see where it leads.')}>
        <Test1948 items={s.test1948} />
      </Section>
      <Section id="twist" title={t('How the founding of Israel came to be read as prophecy')} lede={t('Four centuries of theology, politics and popular books. Filter by kind.')}>
        <TwistTimeline items={s.twist} />
      </Section>
      <Section id="q-israel" title={t('Questions on Israel')}>
        <PartQuestions s={s} part="israel" />
      </Section>

      <PartBanner part={s.parts[2]} n={3} />
      <Section id="claims" title={t('“Every prophecy is being fulfilled”: claims answered')} lede={t('Each card holds a common claim. Turn it over for the text in context, the data, and the other view.')}>
        <ClaimCards items={s.claims} />
      </Section>
      <Section id="trends" title={t('What the long record shows')} lede={t('Measures over one or two centuries. Green means the change is for the better.')}>
        <Trends items={s.trends} />
      </Section>
      <Section id="growth" title={t('Pictures of a growing kingdom')} lede={t('From a seed to a mountain: the Bible’s own images of the kingdom in this age.')}>
        <GrowthLadder items={s.growth} />
      </Section>
      <Section id="q-worse" title={t('Questions on the signs and the state of the world')}>
        <PartQuestions s={s} part="worse" />
      </Section>

      <PartBanner part={s.parts[3]} n={4} />
      <Section id="zion-terms" title={t('Words that matter')} lede={t('Theology is not politics, and neither is hostility to people. Start with clear terms.')}>
        <Prose text={s.zion.intro} className="mb-4" />
        <Terms items={s.zion.terms} />
      </Section>
      <Section id="zion-rise" title={t('How Zionism rose: three strands')} lede={t('Jewish national hopes, Christian restorationism and great-power politics, braided over four centuries. Filter by strand.')}>
        <RiseBraid items={s.zion.rise} />
      </Section>
      <Section id="zion-claims" title={t('Christian Zionist claims, tested')} lede={t('Pick a claim. Read it, then its strongest case, then the partial preterist answer.')}>
        <ZionClaims items={s.zion.claims} />
      </Section>
      <Section id="olive" title={t('Two peoples, replacement, or one olive tree?')} lede={t('Three pictures of Israel and the church. Paul draws the third. Tap the numbers on the tree.')}>
        <TreeModels models={s.zion.models} olive={s.zion.olive} />
      </Section>
      <Section id="attacks" title={t('“Replacement theology!”: the charges answered')} lede={t('Each card holds a charge against fulfilment theology. Turn it over for the answer, the key distinction, and the critics’ rejoinder.')}>
        <ClaimCards front={t('The charge')} items={s.zion.attacks.map((a) => ({ id: a.id, claim: a.attack, verse: a.verse, reply: a.reply, data: a.distinction, other: a.rejoinder }))} />
      </Section>
      <Section id="zion-path" title={t('Testing a Zionist claim: a decision path')} lede={t('Run any claim about Israel and prophecy through these questions.')}>
        <Flow flow={s.zion.flow} />
      </Section>
      <Section id="q-zion" title={t('Questions on Zionism and replacement theology')}>
        <PartQuestions s={s} part="zion" />
      </Section>

      <Section id="path" title={t('Find your hope: a decision path')} lede={t('Answer the key questions in order and see which hope they lead to.')}>
        <Flow flow={s.flow} />
      </Section>

      <DeepDives topic="hope" />
      <Section id="quiz" title={t('Test yourself')} lede={t('Questions on the early church, Israel, the signs and Zionism.')}>
        <Quiz items={s.quiz} />
        <p className="mt-6 text-sm text-ink-soft">
          <Gloss>{t('Go deeper in the related studies:')}</Gloss>
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link to="/rapture" className="btn btn-primary no-underline">
            <Icon name="crown" /> {t('Rapture, millennium and kingdom')}
          </Link>
          <Link to="/israel" className="btn no-underline">
            <Icon name="star" /> {t('Israel in prophecy')}
          </Link>
          <Link to="/fulfilled" className="btn no-underline">
            <Icon name="compass" /> {t('Matthew 24, verse by verse')}
          </Link>
          <Link to="/questions" className="btn no-underline">
            <Icon name="question" /> {t('Prophecy questions answered')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
