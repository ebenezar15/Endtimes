import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Illum } from '../components/Badge'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { BookmarkButton, NoteBox } from '../components/Notes'
import { Refs } from '../components/Refs'
import { Sources } from '../components/Sources'
import { positionsById } from '../lib/content'
import { chapterByNumber, chapters, loadRevelationText, versesIn } from '../lib/data/revelation'
import { nivUrl } from '../lib/refs'
import { useApp, type Translation } from '../lib/store'
import { usePositionColors } from '../lib/theme'
import type { RevSymbol } from '../content/schema'
import NotFound from './NotFound'
import { t } from '../lib/i18n'

export const CATEGORY_LABEL: Record<string, string> = {
  number: t('Number'), colour: t('Colour'), creature: t('Creature'), person: t('Person'), place: t('Place'), object: t('Object'),
  action: t('Action'), time: t('Time'), title: t('Title'), cosmic: t('Cosmic sign'), worship: t('Worship'), body: t('Body'),
}

type Verse = { ref: string; text: string }

/** First verse number of an outline range such as "1–8", "1:9–20" or "vv. 12-17". */
function firstVerse(range: string) {
  const m = range.match(/(?:\d+:)?(\d+)/)
  return m ? +m[1] : -1
}

/** Wrap each symbol keyword found in a verse in a button that selects that symbol. */
function markVerse(text: string, syms: RevSymbol[], active: string | null, pick: (id: string) => void): ReactNode[] {
  const lower = text.toLowerCase()
  const hits: { start: number; end: number; id: string }[] = []
  for (const s of syms)
    for (const k of s.keywords) {
      const kw = k.toLowerCase().trim()
      if (kw.length < 2) continue
      let from = 0
      for (;;) {
        const at = lower.indexOf(kw, from)
        if (at < 0) break
        hits.push({ start: at, end: at + kw.length, id: s.id })
        from = at + kw.length
      }
    }
  hits.sort((a, b) => a.start - b.start || b.end - a.end)
  const out: ReactNode[] = []
  let last = 0
  for (const h of hits) {
    if (h.start < last) continue
    out.push(text.slice(last, h.start))
    out.push(
      <button
        key={h.start + h.id}
        type="button"
        onClick={() => pick(h.id)}
        className={`rounded px-0.5 text-left font-semibold underline decoration-2 underline-offset-4 transition-colors ${active === h.id ? 'bg-accent text-accent-ink decoration-transparent' : 'decoration-gold-bright hover:bg-surface-2'}`}
        aria-label={t('{phrase}: show its explanation', { phrase: text.slice(h.start, h.end) })}
      >
        {text.slice(h.start, h.end)}
      </button>,
    )
    last = h.end
  }
  out.push(text.slice(last))
  return out
}

function SymbolCard({ s, active, onToggle }: { s: RevSymbol; active: boolean; onToggle: () => void }) {
  const tabs = [
    { id: 'meaning', label: t('Meaning'), body: s.meaning },
    { id: 'jewish', label: t('Jewish background'), body: s.jewish },
    ...(s.cultural ? [{ id: 'cultural', label: t('Cultural context'), body: s.cultural }] : []),
    ...(s.readings.length ? [{ id: 'views', label: t('How the views read it'), body: '' }] : []),
  ]
  const [tab, setTab] = useState(tabs[0].id)
  const color = usePositionColors()
  const { lensOn, lens } = useApp()
  const mine = lensOn ? [lens.millennial, lens.hermeneutic] : []
  return (
    <li id={`sym-${s.id}`} className={`leaf scroll-mt-24 transition-shadow ${active ? 'ring-2 ring-accent' : ''}`}>
      <button type="button" className="flex w-full items-start gap-3 p-4 text-left" aria-expanded={active} onClick={onToggle}>
        <span className="mt-0.5 shrink-0 rounded-lg bg-surface-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft">{CATEGORY_LABEL[s.category] ?? s.category}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-snug">{s.phrase}</span>
          <span className="block text-xs text-ink-soft">{s.ref}</span>
        </span>
        <motion.span animate={{ rotate: active ? 45 : 0 }} className="shrink-0 text-accent">
          <Icon name="plus" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="border-t border-rule px-4 pb-4 pt-3">
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t('About {phrase}', { phrase: s.phrase })}>
                {tabs.map((t) => (
                  <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="btn min-h-8 px-2.5 py-1 text-xs" onClick={() => setTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="mt-3" role="tabpanel">
                  {tab === 'views' ? (
                    <ul className="space-y-3">
                      {s.readings.map((r) => (
                        <li key={r.position} className="border-l-4 pl-3" style={{ borderColor: color(r.position).base }}>
                          <p className="text-sm font-bold" style={{ color: color(r.position).text }}>
                            {mine.includes(r.position) && <span className="mr-1 text-gold">✦</span>}
                            {positionsById.get(r.position)?.name ?? r.position}
                          </p>
                          <p className="text-[0.95rem]">
                            <Gloss>{r.reading}</Gloss>
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[0.97rem] leading-relaxed">
                      <Gloss>{tabs.find((t) => t.id === tab)!.body}</Gloss>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Refs refs={s.texts} />
                <Sources ids={s.sources} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default function RevelationChapter() {
  const { n = '1' } = useParams()
  const num = Number(n)
  const c = chapterByNumber.get(num)
  const { translation, set, nivLink, visit, lensOn, lens } = useApp()
  const color = usePositionColors()
  const { hash } = useLocation()
  const [text, setText] = useState<Record<Translation, Verse[]> | null>(null)
  const [license, setLicense] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [pane, setPane] = useState<'symbols' | 'views' | 'context'>('symbols')
  const [cat, setCat] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadRevelationText().then((t) => {
      setText(t.chapters[String(num)] ?? null)
      setLicense(`${t.translations[translation]?.name}. ${t.translations[translation]?.license}`)
    })
  }, [num, translation])
  useEffect(() => {
    if (c) visit(`revelation/${c.chapter}`)
    setActive(hash.startsWith('#sym-') ? hash.slice(5) : null)
    setCat('')
    setPane('symbols')
  }, [c, visit, hash])
  useEffect(() => {
    if (active) document.getElementById(`sym-${active}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [active])

  const byVerse = useMemo(() => {
    const m = new Map<number, RevSymbol[]>()
    c?.symbols.forEach((s) => versesIn(s.ref, num).forEach((v) => m.set(v, [...(m.get(v) ?? []), s])))
    return m
  }, [c, num])

  if (!c) return chapters.length ? <NotFound /> : <p className="text-ink-soft">{t('The chapter studies are still being written.')}</p>
  const cats = [...new Set(c.symbols.map((s) => s.category))]
  const shown = c.symbols.filter((s) => !cat || s.category === cat)
  const pick = (id: string) => {
    setPane('symbols')
    setCat('')
    setActive(id)
  }
  const mine = lensOn ? [lens.millennial, lens.hermeneutic] : []
  const prev = chapterByNumber.get(num - 1)
  const next = chapterByNumber.get(num + 1)

  return (
    <article className="mx-auto max-w-7xl">
      <nav aria-label={t('Chapters')} className="scroll-x -mx-1 mb-6 flex gap-1.5 px-1 pb-2">
        {chapters.map((x) => (
          <Link key={x.chapter} to={`/revelation/${x.chapter}`} aria-current={x.chapter === num ? 'page' : undefined} className={`chip shrink-0 justify-center px-3 no-underline ${x.chapter === num ? 'border-accent bg-accent text-accent-ink' : 'hover:border-accent'}`}>
            {x.chapter}
          </Link>
        ))}
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-[60ch]">
          <p className="text-sm font-semibold">
            <Link to="/revelation">{t('Revelation')}</Link> <span className="text-ink-soft">/ {c.section}</span>
          </p>
          <motion.h1 key={num} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold md:text-5xl">
            {t('Revelation {n}', { n: c.chapter })}
          </motion.h1>
          <p className="mt-1 text-xl text-ink-soft">{c.title}</p>
        </div>
        <BookmarkButton k={`revelation/${c.chapter}`} label={t('Revelation {n}', { n: c.chapter })} />
      </header>
      <p className="prose-measure mt-4 text-lg">
        <Gloss>{c.summary}</Gloss>
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Text */}
        <section aria-label={t('Text of the chapter')} className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t('Translation')}>
            {(['BSB', 'KJV', 'WEB'] as Translation[]).map((t) => (
              <button key={t} type="button" className="btn min-h-8 px-3 py-1 text-sm" aria-pressed={translation === t} onClick={() => set({ translation: t })}>
                {t}
              </button>
            ))}
            {nivLink && (
              <a className="btn min-h-8 px-3 py-1 text-sm no-underline" href={nivUrl(`Revelation ${num}`)} target="_blank" rel="noreferrer">
                {t('Read in NIV')}
              </a>
            )}
          </div>
          <div className={`leaf mt-3 p-5 ${text ? '' : 'min-h-[60vh]'}`}>
            {!text ? (
              <p className="text-sm text-ink-soft">{t('Loading the text…')}</p>
            ) : (
              <div className="text-[1.02rem] leading-[1.85]">
                {text[translation].map((v) => {
                  const vn = +v.ref.split(':')[1]
                  const head = c.outline.find((o) => firstVerse(o.range) === vn)
                  const syms = byVerse.get(vn) ?? []
                  return (
                    <span key={v.ref}>
                      {head && (
                        <span className="mb-1 mt-4 block text-sm font-bold text-rubric first:mt-0">
                          {head.heading} <span className="font-semibold text-ink-soft">({head.range})</span>
                        </span>
                      )}
                      <sup className="mr-0.5 text-[0.7em] font-bold text-gold">{vn}</sup>
                      {translation === 'BSB' ? markVerse(v.text, syms, active, pick) : v.text}{' '}
                    </span>
                  )
                })}
              </div>
            )}
            <p className="mt-4 border-t border-rule pt-2 text-xs text-ink-soft">
              {translation === 'BSB' ? t('Underlined words open their explanation. ') : t('Switch to BSB to see the underlined phrases. ')}
              {license}
            </p>
          </div>
        </section>

        {/* Study */}
        <section aria-label={t('Study')} ref={listRef} className="min-w-0">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t('Study panes')}>
            {(
              [
                ['symbols', t('Phrases and images ({n})', { n: c.symbols.length })],
                ['views', t('How the views read it')],
                ['context', t('Background and outline')],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={pane === id} className="btn text-sm" onClick={() => setPane(id)}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={pane} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="mt-5" role="tabpanel">
              {pane === 'symbols' && (
                <>
                  <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label={t('Filter by kind')}>
                    <button type="button" className="chip cursor-pointer" aria-pressed={!cat} style={!cat ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined} onClick={() => setCat('')}>
                      {t('All')}
                    </button>
                    {cats.map((k) => (
                      <button key={k} type="button" className="chip cursor-pointer" aria-pressed={cat === k} style={cat === k ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined} onClick={() => setCat(k)}>
                        {CATEGORY_LABEL[k] ?? k}
                      </button>
                    ))}
                  </div>
                  <ul className="space-y-2.5">
                    {shown.map((s) => (
                      <SymbolCard key={s.id} s={s} active={active === s.id} onToggle={() => setActive(active === s.id ? null : s.id)} />
                    ))}
                  </ul>
                </>
              )}
              {pane === 'views' && (
                <ul className="space-y-4">
                  {c.readings.map((r, i) => {
                    const col = color(r.position)
                    return (
                      <motion.li key={r.position} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="leaf p-4" style={{ borderLeft: `5px solid ${col.base}` }}>
                        <div className="flex items-center gap-2.5">
                          <Illum id={r.position} size={30} />
                          <Link to={`/positions/${r.position}`} className="font-bold text-ink no-underline hover:text-accent">
                            {positionsById.get(r.position)?.name ?? r.position}
                          </Link>
                          {mine.includes(r.position) && <span className="text-xs text-gold">✦ {t('my view')}</span>}
                        </div>
                        <p className="mt-2">
                          <Gloss>{r.reading}</Gloss>
                        </p>
                      </motion.li>
                    )
                  })}
                </ul>
              )}
              {pane === 'context' && (
                <div className="space-y-6">
                  <Prose text={c.context} />
                  <div>
                    <h3 className="font-bold">{t('Outline')}</h3>
                    <ol className="mt-2 space-y-1">
                      {c.outline.map((o) => (
                        <li key={o.range} className="flex gap-3">
                          <span className="w-16 shrink-0 text-sm font-bold tabular-nums text-accent">{o.range}</span>
                          <span>{o.heading}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {c.questions.length > 0 && (
                    <div>
                      <h3 className="font-bold">{t('For reflection and discussion')}</h3>
                      <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                        {c.questions.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <Sources ids={c.sources} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 border-t border-rule pt-4">
            <NoteBox k={`revelation/${c.chapter}`} label={t('Revelation {n}', { n: c.chapter })} />
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-2">
            {prev ? (
              <Link to={`/revelation/${prev.chapter}`} className="btn no-underline">
                ← {prev.chapter}. {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/revelation/${next.chapter}`} className="btn btn-primary no-underline">
                {next.chapter}. {next.title} →
              </Link>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}
