import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Fuse from 'fuse.js'
import { PageHeader } from '../components/PageHeader'
import { content, glossaryById } from '../lib/content'

export default function Glossary() {
  const [q, setQ] = useState('')
  const { hash } = useLocation()
  const fuse = useMemo(() => new Fuse(content.glossary, { keys: ['term', 'aliases', 'definition'], threshold: 0.3, ignoreLocation: true }), [])
  const list = q.trim() ? fuse.search(q).map((r) => r.item) : [...content.glossary].sort((a, b) => a.term.localeCompare(b.term))
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'center' }), 50)
  }, [hash])
  const letters = [...new Set(list.map((g) => g.term[0].toUpperCase()))]
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Glossary" lede="Every technical term in the app. Throughout the app, terms with a dotted gold underline show their definition on hover, focus or tap." />
      <label className="ui block max-w-md text-sm text-ink-soft">
        Filter terms
        <input value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 block w-full rounded-md border border-rule bg-surface px-3 py-2 text-base text-ink" placeholder="parousia, genea, chiliasm…" />
      </label>
      {!q && (
        <nav aria-label="Jump to letter" className="ui mt-5 flex flex-wrap gap-1 text-sm">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} onClick={(e) => (e.preventDefault(), document.getElementById(`letter-${l}`)?.scrollIntoView())} className="chip px-2.5 no-underline">
              {l}
            </a>
          ))}
        </nav>
      )}
      <dl className="mt-8">
        {list.map((g, i) => {
          const first = !q && (i === 0 || list[i - 1].term[0].toUpperCase() !== g.term[0].toUpperCase())
          return (
            <div key={g.id}>
              {first && (
                <p id={`letter-${g.term[0].toUpperCase()}`} aria-hidden className="mt-8 font-serif text-4xl text-rubric">
                  {g.term[0].toUpperCase()}
                </p>
              )}
              <div id={g.id} className={`scroll-mt-24 border-b border-rule py-4 ${hash === `#${g.id}` ? 'bg-surface-2/60' : ''}`}>
                <dt className="text-xl font-medium">
                  {g.term}
                  {g.aliases.length > 0 && <span className="ui ml-2 text-sm font-normal text-ink-soft">also {g.aliases.join(', ')}</span>}
                </dt>
                {g.origin && <dd className="italic text-ink-soft">{g.origin}</dd>}
                <dd className="prose-measure mt-1">{g.definition}</dd>
                {g.related.length > 0 && (
                  <dd className="ui mt-1 text-sm text-ink-soft">
                    See also:{' '}
                    {g.related.map((r, j) => (
                      <span key={r}>
                        {j > 0 && ', '}
                        <Link to={`/glossary#${r}`}>{glossaryById.get(r)?.term ?? r}</Link>
                      </span>
                    ))}
                  </dd>
                )}
              </div>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
