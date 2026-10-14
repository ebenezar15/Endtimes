import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PositionChip } from '../components/Badge'
import { Gloss } from '../components/Gloss'
import { Sources } from '../components/Sources'
import { content, positionName } from '../lib/content'

const TABS = [
  { id: 'debates', label: 'Debates & books' },
  { id: 'scholars', label: 'Scholars' },
  { id: 'sources', label: 'Sources registry' },
] as const
type Tab = (typeof TABS)[number]['id']
const KIND: Record<string, string> = { debate: 'Public debate', 'multi-view-book': 'Multi-view book', book: 'Book', 'lecture-series': 'Lecture series' }

export default function Library() {
  const [params, setParams] = useSearchParams()
  const { hash } = useLocation()
  const tab = (params.get('tab') as Tab) || 'debates'
  const [camp, setCamp] = useState('')
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' }), 50)
  }, [hash, tab])
  const setTab = (t: Tab) => setParams({ tab: t })

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Debates & Library" lede="Published debates, multi-view books and the major works on each side, with the scholars behind them and every source cited in the app." />
      <div className="ui flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Library sections">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} aria-pressed={tab === t.id} className="btn" onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm">
          Camp
          <select className="rounded-md border border-rule bg-surface px-2 py-1.5" value={camp} onChange={(e) => setCamp(e.target.value)}>
            <option value="">All</option>
            {content.positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tab === 'debates' && (
        <ul className="mt-8 space-y-5">
          {content.library
            .filter((e) => !camp || e.positions.includes(camp))
            .sort((a, b) => a.year.localeCompare(b.year))
            .map((e) => (
              <li key={e.id} id={e.id} className="leaf scroll-mt-20 p-5">
                <p className="ui text-sm text-ink-soft">
                  {KIND[e.kind]}, {e.year}
                  {!e.verified && <span className="text-rubric"> (details not verified online)</span>}
                </p>
                <h2 className="mt-0.5 text-2xl">{e.title}</h2>
                <p className="ui mt-1 text-sm">{e.participants.join('; ')}</p>
                <p className="prose-measure mt-3">
                  <Gloss>{e.summary}</Gloss>
                </p>
                <ul className="prose-measure mt-3 list-disc space-y-1 pl-5 marker:text-gold">
                  {e.keyPoints.map((k) => (
                    <li key={k}>
                      <Gloss>{k}</Gloss>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {e.positions.map((p) => (
                    <PositionChip key={p} id={p} />
                  ))}
                </div>
                <div className="mt-3">
                  <Sources ids={e.sources} />
                </div>
              </li>
            ))}
        </ul>
      )}

      {tab === 'scholars' && (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {content.scholars
            .filter((s) => !camp || s.positions.includes(camp))
            .sort((a, b) => a.name.split(' ').at(-1)!.localeCompare(b.name.split(' ').at(-1)!))
            .map((s) => (
              <li key={s.id} id={s.id} className="leaf scroll-mt-20 p-5">
                <h2 className="text-2xl">{s.name}</h2>
                <p className="ui text-sm text-ink-soft">
                  {s.dates}, {s.tradition}
                </p>
                <p className="mt-2">
                  <Gloss>{s.bio}</Gloss>
                </p>
                {s.works.length > 0 && (
                  <p className="mt-2 text-[0.95rem] text-ink-soft">
                    <span className="ui text-sm">Works: </span>
                    <em>{s.works.join('; ')}</em>
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.positions.map((p) => (
                    <Link key={p} to={`/positions/${p}`} className="no-underline">
                      <PositionChip id={p} />
                    </Link>
                  ))}
                </div>
              </li>
            ))}
        </ul>
      )}

      {tab === 'sources' && (
        <div className="mt-8">
          <p className="ui text-sm text-ink-soft">
            {content.sources.length} sources. Those marked unverified could not be confirmed online during research. Their bibliographic details come from the
            researchers’ knowledge and should be checked.
          </p>
          <ol className="ui mt-4 divide-y divide-rule text-[0.95rem]">
            {content.sources
              .filter((s) => !camp || s.camp === camp)
              .sort((a, b) => a.author.localeCompare(b.author))
              .map((s) => (
                <li key={s.id} id={s.id} className="py-2.5">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className="font-serif text-base">
                      {s.title}
                    </a>
                  ) : (
                    <cite className="font-serif text-base not-italic">{s.title}</cite>
                  )}
                  <span className="block text-ink-soft">
                    {s.author}
                    {s.year ? `, ${s.year}` : ''}. {s.type}. Camp: {['multi', 'reference', 'critic'].includes(s.camp) ? s.camp : positionName(s.camp)}.{' '}
                    {s.verified ? `Accessed ${s.accessed}.` : <span className="text-rubric">Unverified.</span>}
                  </span>
                  {s.summary && <span className="block">{s.summary}</span>}
                  {s.note && <span className="block text-xs text-ink-soft">{s.note}</span>}
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  )
}
