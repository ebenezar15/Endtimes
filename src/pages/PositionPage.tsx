import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Illum, PositionChip } from '../components/Badge'
import { Prose, Gloss } from '../components/Gloss'
import { LensCompare } from '../components/LensCompare'
import { BookmarkButton, NoteBox } from '../components/Notes'
import { CompareToggle } from '../components/CompareToggle'
import { Refs } from '../components/Refs'
import { Sources } from '../components/Sources'
import { cell, content, positionsById, scholarIndex, stanceLabel, topicsById } from '../lib/content'
import { useApp } from '../lib/store'
import { usePositionColors } from '../lib/theme'
import { TOPIC_IDS } from '../content/ids'
import NotFound from './NotFound'
import { t } from '../lib/i18n'

function H2({ children }: { children: string }) {
  return <h2 className="mt-10 border-b border-rule pb-1 text-2xl">{children}</h2>
}

export default function PositionPage() {
  const { id = '' } = useParams()
  const p = positionsById.get(id)
  const visit = useApp((s) => s.visit)
  const color = usePositionColors()
  useEffect(() => {
    if (p) visit(`position/${p.id}`)
  }, [p, visit])
  if (!p) return <NotFound />
  const c = color(p.id)
  const combos = content.combinations.filter((x) => x.millennial === p.id || x.hermeneutic === p.id)
  const cells = TOPIC_IDS.map((tp) => cell(p.id, tp)).filter(Boolean)
  const args = content.index.arguments.filter((a) => a.positions.includes(p.id))
  const passages = content.index.passages.filter((x) => x.readers.includes(p.id))
  const k = `position/${p.id}`

  return (
    <article className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start gap-5 pt-2">
        <Illum id={p.id} size={84} />
        <div className="min-w-0 flex-1 basis-full sm:basis-auto">
          <p className="ui text-sm" style={{ color: c.text }}>
            {p.axis === 'millennial' ? t('Millennial view') : p.axis === 'hermeneutic' ? t('Reading of Revelation') : t('Framework')}
          </p>
          <h1 className="text-4xl md:text-5xl">{p.name}</h1>
          <p className="mt-1 text-xl italic text-ink-soft">{p.tagline}</p>
        </div>
        <div className="flex gap-2">
          {p.axis !== 'framework' && <CompareToggle id={p.id} className="min-h-10 text-sm" />}
          <BookmarkButton k={k} label={p.name} />
        </div>
      </header>
      <div className="mt-2 h-1.5 max-w-md rounded-full" style={{ background: c.base }} aria-hidden />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <blockquote className="prose-measure border-l-4 pl-4 text-lg italic" style={{ borderColor: c.base }}>
            <Gloss>{p.selfDescription}</Gloss>
            <footer className="ui mt-1 text-sm not-italic text-ink-soft">{t('In proponents’ own terms')}</footer>
          </blockquote>
          <Prose text={p.summary} className="mt-6 text-[1.08rem]" dropcap />

          {p.orthodoxyNote && (
            <aside className="leaf prose-measure mt-6 border-rubric p-4" role="note">
              <h2 className="text-lg text-rubric">{t('Relationship to the historic creeds')}</h2>
              <Prose text={p.orthodoxyNote} className="mt-1" />
            </aside>
          )}

          <H2>{t('Core beliefs')}</H2>
          <ul className="prose-measure mt-4 list-none space-y-2.5">
            {p.coreBeliefs.map((b) => (
              <li key={b} className="relative pl-6">
                <span aria-hidden className="absolute left-0 top-0 text-gold">❧</span>
                <Gloss>{b}</Gloss>
              </li>
            ))}
          </ul>

          {p.subViews.length > 0 && (
            <>
              <H2>{t('Varieties within the view')}</H2>
              <dl className="prose-measure mt-4 space-y-4">
                {p.subViews.map((s) => (
                  <div key={s.id}>
                    <dt className="text-lg font-medium">{s.name}</dt>
                    <dd className="mt-0.5">
                      <Gloss>{s.summary}</Gloss>
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <H2>{t('History')}</H2>
          <ol className="prose-measure relative mt-5 space-y-5 border-l-2 pl-6" style={{ borderColor: c.base }}>
            {p.history.map((h) => (
              <li key={h.era} className="relative">
                <span aria-hidden className="absolute -left-[31px] top-1.5 size-3 rotate-45 border-2 bg-surface" style={{ borderColor: c.base }} />
                <h3 className="text-lg font-medium">{h.era}</h3>
                <p className="mt-0.5">
                  <Gloss>{h.text}</Gloss>
                </p>
              </li>
            ))}
          </ol>

          <H2>{t('Strengths, as proponents see them')}</H2>
          <ul className="prose-measure mt-4 list-disc space-y-2 pl-5 marker:text-gold">
            {p.strengths.map((s) => (
              <li key={s}>
                <Gloss>{s}</Gloss>
              </li>
            ))}
          </ul>

          <H2>{t('Critiques and responses')}</H2>
          <ol className="mt-4 space-y-4">
            {p.critiques.map((cr, i) => (
              <li key={i} className="leaf prose-measure grid gap-3 p-4">
                <div>
                  <p className="ui text-sm text-rubric">{t('Critique')}</p>
                  <p>
                    <Gloss>{cr.critique}</Gloss>
                  </p>
                </div>
                <div className="border-t border-rule pt-3">
                  <p className="ui text-sm" style={{ color: c.text }}>
                    {t('Response from proponents')}
                  </p>
                  <p>
                    <Gloss>{cr.response}</Gloss>
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {cells.length > 0 && (
            <>
              <H2>{t('Across the topics')}</H2>
              <dl className="prose-measure mt-4 divide-y divide-rule">
                {cells.map((x) => (
                  <div key={x!.topic} className="py-3">
                    <dt className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link to={`/compare?topic=${x!.topic}&p=${p.id}`} className="text-lg text-ink">
                        {topicsById.get(x!.topic)?.name}
                      </Link>
                      <span className="chip">{stanceLabel(x!.topic, x!.stance)}</span>
                    </dt>
                    <dd className="mt-1">
                      <Gloss>{x!.statement}</Gloss>
                      {x!.note && <span className="ui mt-1 block text-sm text-ink-soft">{x!.note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="prose-measure mt-10 space-y-3 border-t border-rule pt-4">
            <Sources ids={p.sources} />
            <NoteBox k={k} label={p.name} />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-4 lg:self-start">
          <LensCompare position={p} />
          <section>
            <h2 className="text-xl">{t('Key texts')}</h2>
            <Refs refs={p.keyTexts} className="mt-2" />
          </section>
          {p.scholars.length > 0 && (
            <section>
              <h2 className="text-xl">{t('Key scholars')}</h2>
              <ul className="ui mt-2 space-y-1 text-[0.95rem]">
                {p.scholars.map((s) => {
                  const sc = scholarIndex.get(s)
                  return (
                    <li key={s}>
                      <Link to={`/library?tab=scholars#${s}`}>{sc?.name ?? s}</Link>
                      {sc && <span className="text-ink-soft"> ({sc.dates})</span>}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
          {combos.length > 0 && (
            <section>
              <h2 className="text-xl">{t('Common pairings')}</h2>
              <ul className="ui mt-2 space-y-2 text-sm">
                {combos
                  .filter((x) => x.frequency !== 'incompatible')
                  .sort((a, b) => ['common', 'occasional', 'rare'].indexOf(a.frequency) - ['common', 'occasional', 'rare'].indexOf(b.frequency))
                  .map((x) => (
                    <li key={x.millennial + x.hermeneutic}>
                      <PositionChip id={x.millennial === p.id ? x.hermeneutic : x.millennial} /> <span className="text-ink-soft">{x.frequency}</span>
                    </li>
                  ))}
              </ul>
            </section>
          )}
          {p.related.length > 0 && (
            <section>
              <h2 className="text-xl">{t('Related')}</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {p.related.map((r) => (
                  <li key={r}>
                    <Link to={`/positions/${r}`} className="no-underline">
                      <PositionChip id={r} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {(args.length > 0 || passages.length > 0) && (
            <section>
              <h2 className="text-xl">{t('Go deeper')}</h2>
              <ul className="ui mt-2 space-y-1 text-sm">
                {passages.slice(0, 6).map((x) => (
                  <li key={x.id}>
                    <Link to={`/passages/${x.id}`}>{t('Passage: {ref}', { ref: x.ref })}</Link>
                  </li>
                ))}
                {args.slice(0, 6).map((a) => (
                  <li key={a.id}>
                    <Link to={`/arena/${a.id}`}>{t('Debate: {title}', { title: a.title })}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Link to={`/timelines?a=${p.id}`} className="btn ui no-underline">
            {t('See this view’s timeline')}
          </Link>
        </aside>
      </div>
    </article>
  )
}
