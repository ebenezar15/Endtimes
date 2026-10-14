import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { content, topicsById } from '../lib/content'
import { useApp } from '../lib/store'

const CATS: { id: string; label: string }[] = [
  { id: 'revelation', label: 'Revelation' },
  { id: 'olivet', label: 'The Olivet Discourse' },
  { id: 'gospels', label: 'Gospels' },
  { id: 'acts', label: 'Acts' },
  { id: 'epistles', label: 'Epistles' },
  { id: 'daniel', label: 'Daniel' },
  { id: 'prophets', label: 'The Prophets' },
  { id: 'psalms', label: 'Psalms' },
]

export default function Passages() {
  const [topic, setTopic] = useState('')
  const [timeOnly, setTimeOnly] = useState(false)
  const visited = useApp((s) => s.visited)
  const list = content.index.passages.filter((p) => (!topic || p.topics.includes(topic)) && (!timeOnly || p.timeText))
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Passage Lab"
        lede="The texts the debate turns on. Read each one in a public-domain translation, then see how every position reads it, what supports that reading, and the main objection to it."
      />
      <div className="ui flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          Topic
          <select className="rounded-md border border-rule bg-surface px-2 py-1.5" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">All topics</option>
            {content.topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={timeOnly} onChange={(e) => setTimeOnly(e.target.checked)} />
          Only “time texts” (near, soon, this generation)
        </label>
      </div>
      {CATS.map((c) => {
        const items = list.filter((p) => p.category === c.id)
        if (!items.length) return null
        return (
          <section key={c.id} className="mt-10">
            <h2 className="text-2xl">{c.label}</h2>
            <ul className="mt-3 divide-y divide-rule border-y border-rule">
              {items.map((p) => (
                <li key={p.id}>
                  <Link to={`/passages/${p.id}`} className="group grid gap-1 py-3 text-ink no-underline sm:grid-cols-[11rem_1fr]">
                    <span className="font-medium text-accent">{p.ref}</span>
                    <span>
                      <span className="text-lg group-hover:text-accent">{p.title}</span>
                      {p.timeText && <span className="chip ml-2 py-0 text-xs">time text</span>}
                      {visited.includes(`passage/${p.id}`) && <span className="ui ml-2 text-xs text-ink-soft">read</span>}
                      <span className="block text-[0.95rem] text-ink-soft">{p.keyIssue}</span>
                      {topic === '' && p.topics.length > 0 && (
                        <span className="ui mt-1 block text-xs text-ink-soft">{p.topics.map((t) => topicsById.get(t)?.name ?? t).join(', ')}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {list.length === 0 && <p className="ui mt-8 text-ink-soft">No passages match. Clear the filters to see them all.</p>}
    </div>
  )
}
