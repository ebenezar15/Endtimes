import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Prose } from '../components/Gloss'
import { Sources } from '../components/Sources'
import { SevensDiagram } from '../components/SevensDiagram'
import { ChurchesMap } from '../components/ChurchesMap'
import { Icon } from '../components/Icon'
import { chapters, intro } from '../lib/data/revelation'

/** Colours for the movements of the book, assigned in order of first appearance. */
const SECTION_TINTS = ['var(--accent)', 'var(--gold-bright)', 'var(--rubric)', 'var(--accent)', 'var(--gold-bright)', 'var(--rubric)', 'var(--accent)', 'var(--gold-bright)']

export default function Revelation() {
  const [open, setOpen] = useState<string | null>(intro[0]?.id ?? null)
  const sections = [...new Set(chapters.map((c) => c.section))]
  const symbolCount = chapters.reduce((n, c) => n + c.symbols.length, 0)
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="The Book of Revelation"
        lede="A chapter-by-chapter study of the Apocalypse. Each phrase and image is traced to its Old Testament and Jewish roots and its setting in Roman Asia, then read through every major view."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/revelation/1" className="btn btn-primary no-underline">
            <Icon name="scroll" /> Begin at chapter 1
          </Link>
          <Link to="/revelation/symbols" className="btn no-underline">
            <Icon name="search" /> Index of {symbolCount || 'all'} phrases and images
          </Link>
        </div>
      </PageHeader>

      <section aria-labelledby="map-h">
        <h2 id="map-h" className="text-2xl font-bold">
          The book at a glance
        </h2>
        {chapters.length === 0 ? (
          <p className="mt-3 text-ink-soft">The chapter studies are being written. Run “npm run validate” once they are in place.</p>
        ) : (
          <div className="mt-5 space-y-6">
            {sections.map((sec, si) => (
              <div key={sec}>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: SECTION_TINTS[si % SECTION_TINTS.length] }}>
                  {sec}
                </p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {chapters
                    .filter((c) => c.section === sec)
                    .map((c, i) => (
                      <motion.li key={c.chapter} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                        <Link
                          to={`/revelation/${c.chapter}`}
                          onPointerMove={(e) => {
                            const r = e.currentTarget.getBoundingClientRect()
                            e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
                            e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
                          }}
                          className="leaf glow-card block h-full p-4 text-ink no-underline transition-transform hover:-translate-y-1 hover:border-accent"
                          style={{ borderTop: `3px solid ${SECTION_TINTS[si % SECTION_TINTS.length]}` }}
                        >
                          <span className="block text-3xl font-bold tabular-nums text-accent">{c.chapter}</span>
                          <span className="mt-1 block font-bold leading-snug">{c.title}</span>
                          <span className="mt-1 block text-xs text-ink-soft">{c.symbols.length} phrases and images</span>
                        </Link>
                      </motion.li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16" aria-labelledby="sevens-h">
        <h2 id="sevens-h" className="text-2xl font-bold">
          Seals, trumpets and bowls
        </h2>
        <p className="mt-1 max-w-[70ch] text-ink-soft">How the three sevens fit together shapes how a reader handles everything else. Switch between the two main readings.</p>
        <div className="leaf mt-5 p-5">
          <SevensDiagram />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="churches-h">
        <h2 id="churches-h" className="text-2xl font-bold">
          The seven churches
        </h2>
        <p className="mt-1 max-w-[70ch] text-ink-soft">Revelation was first a letter to real congregations in the Roman province of Asia. Select a city.</p>
        <div className="leaf mt-5 p-5">
          <ChurchesMap />
        </div>
      </section>

      {intro.length > 0 && (
        <section className="mt-16" aria-labelledby="intro-h">
          <h2 id="intro-h" className="text-2xl font-bold">
            Before you read
          </h2>
          <div className="mt-5 divide-y divide-rule border-y border-rule">
            {intro.map((s) => {
              const isOpen = open === s.id
              return (
                <div key={s.id} id={s.id}>
                  <h3>
                    <button type="button" className="flex w-full items-center justify-between gap-4 py-4 text-left text-lg font-bold hover:text-accent" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                      {s.title}
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-accent">
                        <Icon name="plus" />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pb-6">
                          <Prose text={s.body} />
                          {s.facts.length > 0 && (
                            <dl className="mt-4 grid max-w-3xl gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
                              {s.facts.map((f) => (
                                <div key={f.label} className="contents">
                                  <dt className="font-bold">{f.label}</dt>
                                  <dd className="text-ink-soft">{f.value}</dd>
                                </div>
                              ))}
                            </dl>
                          )}
                          <div className="mt-3">
                            <Sources ids={s.sources} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
