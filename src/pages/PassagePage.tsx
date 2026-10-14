import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { Illum } from '../components/Badge'
import { Gloss, Prose } from '../components/Gloss'
import { BookmarkButton, NoteBox } from '../components/Notes'
import { Sources } from '../components/Sources'
import { loadBible, positionsById, topicsById } from '../lib/content'
import { passages, passagesById } from '../lib/data/passages'
import type { Bible } from '../content/schema'
import { nivUrl } from '../lib/refs'
import { useApp, type Translation } from '../lib/store'
import { usePositionColors } from '../lib/theme'
import NotFound from './NotFound'

export default function PassagePage() {
  const { id = '' } = useParams()
  const p = passagesById.get(id)
  const { translation, set, nivLink, lensOn, lens, visit } = useApp()
  const color = usePositionColors()
  const mine = lensOn ? [lens.millennial, lens.hermeneutic] : []
  const [tab, setTab] = useState<string>('all')
  const [bible, setBible] = useState<Bible | null>(null)
  useEffect(() => {
    loadBible().then(setBible)
  }, [])
  useEffect(() => {
    if (p) visit(`passage/${p.id}`)
    setTab('all')
  }, [p, visit])
  if (!p) return <NotFound />
  const verses = bible?.passages[p.id]?.[translation] ?? []
  const tr = bible?.translations[translation]
  const readings = tab === 'all' ? p.readings : p.readings.filter((r) => r.position === tab)
  const idx = passages.indexOf(p)
  const next = passages[idx + 1]

  let lastChapter = ''
  return (
    <article className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-3 pt-2">
        <div>
          <p className="ui text-sm text-ink-soft">
            <Link to="/passages">Passage Lab</Link>
          </p>
          <h1 className="text-4xl md:text-5xl">{p.ref}</h1>
          <p className="mt-1 text-xl italic text-ink-soft">{p.title}</p>
        </div>
        <BookmarkButton k={`passage/${p.id}`} label={p.ref} />
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        {/* Text column */}
        <section aria-label="Bible text" className="lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto">
          <div className="ui flex flex-wrap items-center gap-1.5" role="group" aria-label="Translation">
            {(['BSB', 'KJV', 'WEB'] as Translation[]).map((t) => (
              <button key={t} type="button" className="btn min-h-8 px-3 py-1 text-sm" aria-pressed={translation === t} onClick={() => set({ translation: t })}>
                {t}
              </button>
            ))}
            {nivLink && (
              <a className="btn min-h-8 px-3 py-1 text-sm no-underline" href={nivUrl(p.ranges.join('; '))} target="_blank" rel="noreferrer">
                Read in NIV
              </a>
            )}
          </div>
          <div className={`leaf mt-3 p-5 ${bible ? '' : 'min-h-[60vh]'}`}>
            {!bible ? (
              <p className="ui text-sm text-ink-soft">Loading the text…</p>
            ) : verses.length === 0 ? (
              <p className="ui text-sm text-ink-soft">Bible text has not been generated. Run “npm run bible”.</p>
            ) : (
              <p className="text-[1.05rem] leading-[1.75]">
                {verses.map((v) => {
                  const [, book, ch, vs] = v.ref.match(/^(.+) (\d+):(\d+)$/) ?? []
                  const head = `${book} ${ch}` !== lastChapter
                  lastChapter = `${book} ${ch}`
                  return (
                    <span key={v.ref}>
                      {head && (
                        <span className="ui mb-1 mt-3 block text-sm font-medium text-rubric first:mt-0">
                          {book} {ch}
                        </span>
                      )}
                      <sup className="ui mr-0.5 text-[0.7em] text-gold">{vs}</sup>
                      {v.text}{' '}
                    </span>
                  )
                })}
              </p>
            )}
            {tr && (
              <p className="ui mt-4 border-t border-rule pt-2 text-xs text-ink-soft">
                {tr.name}. {tr.license}
              </p>
            )}
          </div>
        </section>

        {/* Readings column */}
        <section aria-label="Readings" className="min-w-0">
          <Prose text={p.summary} />
          <aside className="leaf prose-measure mt-5 border-gold p-4">
            <h2 className="text-lg">The crux</h2>
            <p className="mt-1">
              <Gloss>{p.keyIssue}</Gloss>
            </p>
            {p.topics.length > 0 && (
              <p className="ui mt-2 text-sm text-ink-soft">
                Topics:{' '}
                {p.topics.map((t, i) => (
                  <span key={t}>
                    {i > 0 && ', '}
                    <Link to={`/compare?topic=${t}`}>{topicsById.get(t)?.name ?? t}</Link>
                  </span>
                ))}
              </p>
            )}
          </aside>

          <div className="ui mt-8 flex flex-wrap gap-1.5" role="tablist" aria-label="Choose a position's reading">
            <button type="button" role="tab" aria-selected={tab === 'all'} className="btn min-h-8 px-3 py-1 text-sm" onClick={() => setTab('all')}>
              All readings
            </button>
            {p.readings.map((r) => (
              <button key={r.position} type="button" role="tab" aria-selected={tab === r.position} className="btn min-h-8 px-3 py-1 text-sm" onClick={() => setTab(r.position)}>
                {mine.includes(r.position) && <span className="text-gold" aria-label="my view">✦</span>}
                {positionsById.get(r.position)?.shortName ?? r.position}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            {readings.map((r, i) => {
              const c = color(r.position)
              return (
                <motion.section
                  key={`${tab}-${r.position}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 6) * 0.06, type: 'spring', stiffness: 220, damping: 24 }}
                  className="leaf p-5"
                  style={{ borderLeft: `5px solid ${c.base}` }}
                >
                  <div className="flex items-center gap-3">
                    <Illum id={r.position} size={34} />
                    <h3 className="text-2xl">
                      <Link to={`/positions/${r.position}`} className="text-ink no-underline hover:text-accent">
                        {positionsById.get(r.position)?.name ?? r.position}
                      </Link>
                    </h3>
                    {mine.includes(r.position) && <span className="ui text-sm text-gold">✦ my view</span>}
                  </div>
                  <div className="prose-measure mt-3 space-y-4">
                    <p>
                      <Gloss>{r.reading}</Gloss>
                    </p>
                    <div>
                      <h4 className="ui text-sm font-medium" style={{ color: c.text }}>
                        Strongest support
                      </h4>
                      <p>
                        <Gloss>{r.support}</Gloss>
                      </p>
                    </div>
                    <div>
                      <h4 className="ui text-sm font-medium text-rubric">Main objection</h4>
                      <p>
                        <Gloss>{r.objection}</Gloss>
                      </p>
                    </div>
                    <Sources ids={r.sources} />
                  </div>
                </motion.section>
              )
            })}
          </div>

          <div className="prose-measure mt-8 space-y-3 border-t border-rule pt-4">
            <Sources ids={p.sources} label="Passage sources" />
            <NoteBox k={`passage/${p.id}`} label={p.ref} />
          </div>
          {next && (
            <Link to={`/passages/${next.id}`} className="btn ui mt-8 no-underline">
              Next passage: {next.ref}
            </Link>
          )}
        </section>
      </div>
    </article>
  )
}
