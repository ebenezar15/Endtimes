import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CANON } from '../content/schema'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Sources } from '../components/Sources'
import { CanonThreads } from '../components/connections/CanonThreads'
import { ProphetsWeb } from '../components/connections/ProphetsWeb'
import { SequenceTracks } from '../components/connections/SequenceTracks'
import { EchoHeatmap } from '../components/connections/EchoHeatmap'
import { ChiasmArches } from '../components/connections/ChiasmArches'
import { Bookends } from '../components/connections/Bookends'
import { PropheticChiasms } from '../components/connections/PropheticChiasms'
import { CompositeBeast } from '../components/connections/CompositeBeast'
import { AtlasMap } from '../components/connections/AtlasMap'
import { atlas, books, structure, threads } from '../lib/data/connections'
import { t } from '../lib/i18n'

function Section({ id, title, lede, children }: { id: string; title: string; lede?: string; children: React.ReactNode }) {
  const words = title.split(' ')
  return (
    <section id={id} className="mt-20 scroll-mt-20" aria-labelledby={`${id}-h`}>
      <motion.h2 id={`${id}-h`} className="text-2xl font-bold sm:text-3xl" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ staggerChildren: 0.06 }} aria-label={title}>
        {words.map((w, i) => (
          <motion.span key={i} aria-hidden className="mr-[0.28em] inline-block" variants={{ hidden: { opacity: 0, y: 18, rotateX: -60 }, show: { opacity: 1, y: 0, rotateX: 0 } }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
            {w}
          </motion.span>
        ))}
      </motion.h2>
      <motion.span aria-hidden className="mt-2 block h-[3px] w-24 origin-left rounded-full bg-gradient-to-r from-[var(--gold-bright)] to-[var(--accent)]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
      {lede && (
        <motion.p className="mt-2 max-w-[70ch] text-ink-soft" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
          {lede}
        </motion.p>
      )}
      <motion.div className="mt-5" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: 0.1 }}>
        {children}
      </motion.div>
    </section>
  )
}

/** Every book of the Bible as a bar; lines from the books Revelation draws on converge on the last bar. */
function CanonHero() {
  const W = 600
  const N = CANON.length
  const x = (i: number) => 8 + (i + 0.5) * ((W - 16) / N)
  const used: string[] = [...new Set<string>([...books.map((b) => b.book), ...threads.flatMap((t) => t.stops.map((s) => s.book))])].filter((b) => b !== "Revelation")
  const rx = x(N - 1)
  return (
    <svg viewBox={`0 0 ${W} 230`} className="h-auto w-full" role="img" aria-label={t('{n} books of the Bible feeding into Revelation', { n: used.length })}>
      {CANON.map((b, i) => {
        const on = used.includes(b) || b === 'Revelation'
        return (
          <motion.rect key={b} x={x(i) - 3} width={6} rx={2} fill={b === 'Revelation' ? 'var(--gold-bright)' : i < 39 ? 'var(--rubric)' : 'var(--accent)'} initial={{ y: 200, height: 0 }} animate={{ y: on ? 150 : 172, height: on ? 50 : 28, opacity: on ? 1 : 0.3 }} transition={{ delay: i * 0.012, type: 'spring', stiffness: 140, damping: 16 }}>
            <title>{b}</title>
          </motion.rect>
        )
      })}
      {used.map((b, i) => {
        const bx = x(CANON.indexOf(b as (typeof CANON)[number]))
        const h = 20 + ((rx - bx) / W) * 120
        const d = `M${bx},148 C${bx},${148 - h} ${rx},${148 - h} ${rx},148`
        return (
          <g key={b}>
            <motion.path d={d} fill="none" stroke="var(--gold-bright)" strokeWidth={1.4} strokeOpacity={0.7} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 + i * 0.05, duration: 1.1 }} />
            <motion.circle r={2.6} fill="var(--gold-bright)" style={{ offsetPath: `path("${d}")` }} initial={{ offsetDistance: '0%', opacity: 0 }} animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 1, 0] }} transition={{ delay: 2 + i * 0.21, duration: 2.2, repeat: Infinity, repeatDelay: 3 }} />
          </g>
        )
      })}
      <text x={8} y={222} fontSize={11} fill="var(--ink-soft)">{t('Genesis')}</text>
      <text x={x(38)} y={222} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">{t('Malachi')}</text>
      <text x={W - 8} y={222} textAnchor="end" fontSize={11} fontWeight={700} fill="var(--ink)">{t('Revelation')}</text>
    </svg>
  )
}

const NAVS: [string, string][] = [
  ['atlas', t('The atlas')],
  ['map', t('Where it surfaces')],
  ['threads', t('Golden threads')],
  ['books', t('The books behind it')],
  ['sequences', t('Shared sequences')],
  ['chiasm', t('Chiastic structure')],
  ['bookends', t('Bookends')],
  ['prophets', t('Chiasms in the prophets')],
]

export default function RevelationConnections() {
  const [params] = useSearchParams()
  const progress = useSpring(useScroll().scrollYProgress, { stiffness: 120, damping: 24 })
  const linked = params.get('thread')
  useEffect(() => {
    if (linked) setTimeout(() => document.getElementById('threads')?.scrollIntoView({ behavior: 'smooth' }), 350)
  }, [linked])
  const linkCount = books.reduce((n, b) => n + b.links.length, 0)
  const stopCount = threads.reduce((n, t) => n + t.stops.length, 0)
  const st = structure
  return (
    <div className="mx-auto max-w-6xl">
      <motion.div aria-hidden className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[var(--rubric)] via-[var(--gold-bright)] to-[var(--accent)]" style={{ scaleX: progress }} />
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <Link to="/revelation" className="text-sm no-underline">
            ← {t('Revelation Study')}
          </Link>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('Revelation and the')} <span className="text-gradient">{t('whole Bible')}</span>
          </motion.h1>
          <p className="mt-4 text-[1.05rem] leading-relaxed">
            {st?.intro ?? t('Revelation hardly ever quotes the Old Testament outright, yet almost every line echoes it. Trace its images, symbols, phrases and structure back through the prophets to Genesis.')}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="chip">{t('{n} threads traced', { n: threads.length })}</span>
            <span className="chip">{t('{n} stops across the canon', { n: stopCount })}</span>
            <span className="chip">{t('{n} source books', { n: books.length })}</span>
            <span className="chip">{t('{n} specific echoes', { n: linkCount })}</span>
          </div>
          <nav aria-label={t('On this page')} className="mt-5 flex flex-wrap gap-2 text-sm">
            {NAVS.map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip no-underline hover:border-accent">
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="leaf p-3">
          <CanonHero />
        </div>
      </section>

      {atlas && (
        <Section id="atlas" title={t('Atlas of Revelation')} lede={t('The places behind the book, from Ur to Patmos. Play through the eras or pick one: the places of each age light up and its journeys draw themselves. Zoom into the seven churches, the Holy Land or Mesopotamia, and select any place.')}>
          <AtlasMap atlas={atlas} threads={threads} />
        </Section>
      )}

      {books.length > 0 && (
        <Section id="map" title={t('Where the Old Testament surfaces')} lede={t('Each row is a book Revelation draws on; each column a chapter of Revelation. Select a cell to see the echoes.')}>
          <EchoHeatmap books={books} threads={threads} />
        </Section>
      )}

      {threads.length > 0 && (
        <Section id="threads" title={t('Golden threads through the canon')} lede={t('Choose an image, symbol, number, phrase or title. A thread is drawn from its first appearance to Revelation; then read its meaning, its cultural setting, how Revelation reshapes it, and how the different views take it.')}>
          <CanonThreads threads={threads} initial={params.get('thread')} />
        </Section>
      )}

      {books.length > 0 && (
        <Section id="books" title={t('The books behind the book')} lede={t('Revelation at the centre, the books it echoes around it. Thicker lines mean more echoes in this study. Select a book.')}>
          <ProphetsWeb books={books} />
        </Section>
      )}

      {st && (
        <>
          <Section id="sequences" title={t('Sequences Revelation follows')} lede={t('Sometimes John borrows not just an image but a whole order of events. Play each sequence to see the steps line up.')}>
            <SequenceTracks sequences={st.sequences} />
            <h3 className="mt-10 text-xl font-bold">{t('Four beasts become one')}</h3>
            <div className="mt-3">
              <CompositeBeast />
            </div>
          </Section>

          <Section id="chiasm" title={t('Revelation’s chiastic structure')} lede={t('Many scholars hear Revelation as a ring: its parts mirror each other around a centre. These are proposals, not facts, and they differ. Compare them as arches or as a ladder.')}>
            <Prose text={st.chiasmIntro} className="mb-5 max-w-[75ch]" />
            <ChiasmArches outlines={st.outlines} />
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {st.critiques.map((c, i) => (
                <div key={i} className="leaf p-4 text-[0.95rem]">
                  <p className="text-sm font-bold text-rubric">{t('Caution')}</p>
                  <p>
                    <Gloss>{c.critique}</Gloss>
                  </p>
                  <p className="mt-2 border-t border-rule pt-2 text-sm font-bold text-accent">{t('Response')}</p>
                  <p>
                    <Gloss>{c.response}</Gloss>
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="bookends" title={t('The two covers: chapter 1 and chapter 22')} lede={t('The opening and the close answer each other almost line for line, which is one of the strongest signs that the book was shaped as a whole.')}>
            <Bookends pairs={st.bookends} />
          </Section>

          <Section id="prophets" title={t('Chiasms in the prophets')} lede={t('Revelation was not the first prophetic book built in rings. These concentric structures in earlier prophets, as proposed by scholars, show the form John inherited.')}>
            <PropheticChiasms items={st.prophetic} />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/revelation" className="btn btn-primary no-underline">
                <Icon name="seal" /> {t('Back to the Revelation Study')}
              </Link>
              <Sources ids={st.sources} />
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
