import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Sources } from '../components/Sources'
import { UnveilHero } from '../components/spiritual/UnveilHero'
import { SymbolFlow } from '../components/spiritual/SymbolFlow'
import { TwoCities } from '../components/spiritual/TwoCities'
import { JourneyMap } from '../components/spiritual/JourneyMap'
import { ViewContrast } from '../components/spiritual/ViewContrast'
import { MethodPath } from '../components/spiritual/MethodPath'
import { OvercomerBridge } from '../components/spiritual/OvercomerBridge'
import { PatternKeys, LinesTicker } from '../components/spiritual/PatternKeys'
import { ChapterDepth } from '../components/spiritual/ChapterDepth'
import { TabernacleMap } from '../components/spiritual/TabernacleMap'
import { spiritual } from '../lib/data/revelation'

function Section({ id, title, lede, children }: { id: string; title: string; lede?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-20" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="text-2xl font-bold sm:text-3xl">
        {title}
      </h2>
      {lede && <p className="mt-1 max-w-[70ch] text-ink-soft">{lede}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

/** A chapter card that turns over to show how Christ is revealed in it. */
function ChapterFlip({ c }: { c: NonNullable<typeof spiritual>['chapters'][number] }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <li className="[perspective:1000px]">
      <motion.button
        type="button"
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
        aria-label={`Revelation ${c.chapter}: ${c.theme}. ${flipped ? 'Showing how Christ is revealed.' : 'Turn over to see how Christ is revealed.'}`}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative block h-48 w-full text-left [transform-style:preserve-3d]"
      >
        <span className="leaf absolute inset-0 flex flex-col p-4 [backface-visibility:hidden]">
          <span className="text-3xl font-bold tabular-nums text-accent">{c.chapter}</span>
          <span className="mt-1 font-bold leading-snug">{c.theme}</span>
          <span className="mt-auto text-xs text-ink-soft">Turn over</span>
        </span>
        <span className="leaf absolute inset-0 flex flex-col overflow-hidden border-gold p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Christ revealed</span>
          <span className="mt-1 line-clamp-5 text-sm">{c.christRevealed}</span>
          <Link to={`/revelation/${c.chapter}`} className="mt-auto text-sm" onClick={(e) => e.stopPropagation()}>
            Study chapter {c.chapter}
          </Link>
        </span>
      </motion.button>
    </li>
  )
}

export default function Spiritual() {
  if (!spiritual) return <p className="text-ink-soft">The Spiritual Understanding study is being written.</p>
  const s = spiritual
  const chapters = [...s.chapters].sort((a, b) => a.chapter - b.chapter)
  return (
    <div className="mx-auto max-w-6xl">
      <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <motion.p className="text-xs font-bold uppercase tracking-[0.3em] text-accent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            A Christ-centred reading of Revelation
          </motion.p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            Spiritual <span className="text-gradient">Understanding</span>
          </motion.h1>
          <Prose text={s.overview} className="mt-4 text-[1.05rem]" />
          <LinesTicker lines={s.lines} />
          <nav aria-label="On this page" className="mt-5 flex flex-wrap gap-2 text-sm">
            {[
              ['principles', 'Principles'],
              ['method', 'The way of seeing'],
              ['lens', 'The lens'],
              ['flow', 'Reading an image'],
              ['cities', 'Old and new'],
              ['patterns', 'Old Testament keys'],
              ['tabernacle', 'The tabernacle map'],
              ['journey', 'The journey'],
              ['overcomer', 'The overcomer'],
              ['chapters', 'All 22 chapters'],
              ['depth', 'Chapter studies'],
              ['critiques', 'Critiques'],
            ]
              .filter(([id]) => (id === 'method' ? s.method.length : id === 'lens' ? s.contrasts.length : id === 'patterns' ? s.patterns.length : id === 'overcomer' ? s.overcomer.length : id === 'depth' ? s.chapters.some((c) => c.depth.length) : true))
              .map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip no-underline hover:border-accent">
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="leaf overflow-hidden p-2 lg:sticky lg:top-24 lg:mt-6">
          <UnveilHero />
        </div>
      </section>

      <Section id="principles" title="How this view reads the book" lede="The reading principles that shape every chapter.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.principles.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08, type: 'spring', stiffness: 200, damping: 22 }} className="leaf glow-card p-5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface-2 font-bold text-accent ring-1 ring-rule">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-[0.95rem] text-ink-soft">
                <Gloss>{p.text}</Gloss>
              </p>
              {p.texts.length > 0 && <p className="mt-2 text-xs text-ink-soft">{p.texts.join('; ')}</p>}
            </motion.li>
          ))}
        </ul>
      </Section>

      {s.method.length > 0 && (
        <Section id="method" title="The way of seeing" lede="How this view says Revelation should be read: not by decoding the news, but by letting Scripture and the Spirit show Christ. Watch the path light up, then step through it.">
          <MethodPath steps={s.method} />
        </Section>
      )}

      {s.contrasts.length > 0 && (
        <Section id="lens" title="Through the lens" lede="The popular end-times reading on one side, this view on the other. Drag the slider or press the button to sweep the lens down the list.">
          <ViewContrast rows={s.contrasts} />
        </Section>
      )}

      <Section id="flow" title="From image to reality" lede="Pick an image. The flow shows how this view moves from its surface reading, to what it reveals of Christ, to what it means now.">
        <div className="leaf p-5">
          <SymbolFlow keys={s.keys} />
        </div>
      </Section>

      <Section id="cities" title="The old order and the new creation" lede="Revelation sets images against each other: two cities, two women, two marks, two trees. Select a pair to compare them.">
        <TwoCities keys={s.keys} />
      </Section>

      {s.patterns.length > 0 && (
        <Section id="patterns" title="Old Testament keys" lede="This view lets Scripture interpret Scripture. These are the patterns it uses to unlock the images. Pick a key to see how each one maps onto Revelation.">
          <PatternKeys patterns={s.patterns} />
        </Section>
      )}

      <Section id="tabernacle" title="The tabernacle map" lede="This view reads the believer's journey as a walk through the tabernacle: from the altar in the outer court to the presence behind the torn veil. Every piece of furniture reappears in Revelation. Select one.">
        <TabernacleMap />
      </Section>

      <Section id="journey" title="The journey through the book" lede="Read as one movement, from the unveiling of Christ to the tree of life. Scroll to follow the light.">
        <JourneyMap journey={s.journey} />
      </Section>

      {s.overcomer.length > 0 && (
        <Section id="overcomer" title="To the one who overcomes" lede="Every letter in chapters 2 and 3 ends with a promise to the overcomer, and every promise comes back in the closing vision. Select a promise to see how this view reads it.">
          <OvercomerBridge items={s.overcomer} />
        </Section>
      )}

      <Section id="chapters" title="Christ in every chapter" lede="Turn a card over to see how this view finds Christ in that chapter. Each chapter page shows this reading beside the other views.">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {chapters.map((c) => (
            <ChapterFlip key={c.chapter} c={c} />
          ))}
        </ul>
      </Section>

      {s.chapters.some((c) => c.depth.length) && (
        <Section id="depth" title="Chapter studies in depth" lede="Verse-by-verse notes on the chapters this view teaches most fully.">
          <ChapterDepth chapters={chapters.filter((c) => c.depth.length)} />
        </Section>
      )}

      <Section id="critiques" title="Critiques and responses" lede="As with every view in this app, the strongest objections come with the answers its proponents give.">
        <ol className="space-y-4">
          {s.critiques.map((c, i) => (
            <li key={i} className="leaf prose-measure grid gap-3 p-4">
              <div>
                <p className="text-sm font-bold text-rubric">Critique</p>
                <p>
                  <Gloss>{c.critique}</Gloss>
                </p>
              </div>
              <div className="border-t border-rule pt-3">
                <p className="text-sm font-bold text-accent">Response</p>
                <p>
                  <Gloss>{c.response}</Gloss>
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link to="/positions/spiritual" className="btn btn-primary no-underline">
            <Icon name="crown" /> The full position page
          </Link>
          <Link to="/compare?p=spiritual,idealism,futurism,partial-preterism" className="btn no-underline">
            <Icon name="layers" /> Compare with other views
          </Link>
          <Sources ids={s.sources} />
        </div>
      </Section>
    </div>
  )
}
