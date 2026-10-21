import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { DoubleFulfilment, FiveKeys, FulfilmentTimeline, GenerationClock, Historians, Mandate, Objections, RevelationClues, SymbolDecoder, TimeTexts, VerseExplorer } from '../components/fulfilled/parts'
import { Quiz } from '../components/israel/interactive'
import { Sources } from '../components/Sources'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { refLabel } from '../lib/refLabel'
import { fulfilled } from '../lib/data/studies'

const JUMP = [
  ['keys', () => t('Five questions')],
  ['historians', () => t('The historians')],
  ['setting', () => t('The setting')],
  ['verses', () => t('Verse by verse')],
  ['symbols', () => t('Symbol decoder')],
  ['timeline', () => t('AD 30 to 73')],
  ['time', () => t('Time texts')],
  ['once', () => t('One fulfilment')],
  ['revelation', () => t('Revelation’s date')],
  ['objections', () => t('Objections')],
  ['now', () => t('What now?')],
  ['quiz', () => t('Quiz')],
] as const

/** Verse number of a reference like "Matthew 24:15-16", for matching timeline links to verses. */
const start = (ref: string) => ref.match(/(\d+):(\d+)/)?.slice(1).join(':') ?? ''

export default function Fulfilled() {
  const s = fulfilled
  const [sel, setSel] = useState(s?.verses[0]?.id ?? '')
  if (!s) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const openVerse = (ref: string) => {
    const v = s.verses.find((x) => start(x.ref) === start(ref)) ?? s.verses.find((x) => x.ref.startsWith(ref))
    if (v) setSel(v.id)
    document.getElementById('verses')?.scrollIntoView({ behavior: 'smooth' })
  }
  const dated = s.verses.filter((v) => v.year !== null).length
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('The fulfilled reading')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Matthew 24, verse by verse')}
          </motion.h1>
          <Prose text={s.intro} className="mt-4 text-[1.05rem]" />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="chip">{t('{n} verses and parables', { n: s.verses.length })}</span>
            <span className="chip">{t('{n} tied to a dated event', { n: dated })}</span>
            <span className="chip">{t('{n} symbols decoded', { n: s.symbols.length })}</span>
          </div>
        </div>
        <div className="leaf p-4">
          <GenerationClock />
          <p className="mt-1 text-center text-xs text-ink-soft">{t('Forty years from the prophecy to the fall of the temple · tap to replay')}</p>
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
        <Link to="/olivet" className="mt-2 inline-block text-sm font-semibold">
          {t('Compare every view of Matthew 24 in the Olivet study')} →
        </Link>
      </div>

      <Section id="keys" title={t('Five questions that unlock the passage')} lede={t('Who, what, where, when and why: ask them of any text before deciding what it means.')}>
        <FiveKeys keys={s.keys} />
      </Section>

      <Section id="historians" title={t('The historians who saw it happen')} lede={t('The writers whose records let us check the prophecies against events. Tap a card for how far to trust each one.')}>
        <Historians items={s.historians} />
      </Section>

      <Section id="setting" title={t('The setting: Matthew 21 to 23')} lede={t('What Jesus had just said and done when the disciples asked their question.')}>
        <ol className="grid gap-3 md:grid-cols-3">
          {s.context.map((c, i) => (
            <motion.li key={c.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="leaf p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">{refLabel(c.ref)}</p>
              <h3 className="mt-0.5 text-lg font-bold">{c.title}</h3>
              <p className="mt-1 text-[0.95rem] text-ink-soft">
                <Gloss>{c.text}</Gloss>
              </p>
            </motion.li>
          ))}
        </ol>
      </Section>

      <Section id="verses" title={t('Every verse, from the temple to the parables')} lede={t('Pick any verse. Read what it meant, how it was fulfilled, the evidence, and how other views read it. Your progress is remembered on this device.')}>
        <VerseExplorer verses={s.verses} chapters={s.chapters} sel={sel} setSel={setSel} />
      </Section>

      <Section id="symbols" title={t('Symbol decoder')} lede={t('The prophetic images of the discourse, and what this reading takes each one to mean.')}>
        <SymbolDecoder items={s.symbols} />
      </Section>

      <Section id="timeline" title={t('From the prophecy to the fall: AD 30 to 73')} lede={t('Step through the events. Where an event matches a verse, open that verse.')}>
        <FulfilmentTimeline items={s.timeline} onVerse={openVerse} />
      </Section>

      <Section id="time" title={t('The time texts')} lede={t('What the New Testament writers said about when. Tap each phrase.')}>
        <TimeTexts items={s.timeTexts} />
      </Section>

      <Section id="once" title={t('One fulfilment, not two')} lede={t('Why this reading rejects a second, future fulfilment, and the best case on the other side.')}>
        <DoubleFulfilment d={s.doubleFulfilment} />
      </Section>

      <Section id="revelation" title={t('Eight clues for an early Revelation')} lede={t('If Revelation was written before AD 70, it too points to the fall of Jerusalem. Each clue, and the late-date reply.')}>
        <RevelationClues items={s.revelationDate} />
        <Link to="/dating" className="btn mt-4 no-underline">
          <Icon name="scales" /> {t('Weigh all the dating evidence')}
        </Link>
      </Section>

      <Section id="objections" title={t('Common objections, answered')} lede={t('The questions people ask most, and how this reading responds.')}>
        <Objections items={s.objections} />
      </Section>

      <Section id="now" title={t('What now?')} lede={t('If the prophecies are fulfilled, what remains is the task given at the beginning.')}>
        <Mandate m={s.mandate} />
      </Section>

      <Section id="quiz" title={t('Test yourself')} lede={t('Questions on the verses, the history and the arguments.')}>
        <Quiz items={s.quiz} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/olivet" className="btn btn-primary no-underline">
            <Icon name="compass" /> {t('Matthew 24 and AD 70')}
          </Link>
          <Link to="/josephus" className="btn no-underline">
            <Icon name="book" /> {t('Josephus: the fall of Jerusalem')}
          </Link>
          <Link to="/rapture" className="btn no-underline">
            <Icon name="trumpet" /> {t('Rapture, millennium and kingdom')}
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
