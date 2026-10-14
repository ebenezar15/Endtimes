import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PositionChip } from '../components/Badge'
import { Gloss } from '../components/Gloss'
import { BookmarkButton, NoteBox } from '../components/Notes'
import { Refs } from '../components/Refs'
import { Sources } from '../components/Sources'
import { positionsById, topicsById } from '../lib/content'
import { argumentsById } from '../lib/data/arguments'
import { useApp } from '../lib/store'
import { usePositionColors } from '../lib/theme'
import type { ArgNode } from '../content/schema'
import NotFound from './NotFound'

const ArgGraph = lazy(() => import('../components/ArgGraph'))

export const KIND_LABEL: Record<ArgNode['kind'], string> = {
  claim: 'Claim',
  objection: 'Objection',
  rebuttal: 'Rebuttal',
  'counter-rebuttal': 'Counter-rebuttal',
}

function NodeView({ n, depth, focus }: { n: ArgNode; depth: number; focus: string }) {
  const [open, setOpen] = useState(depth < 2)
  const color = usePositionColors()(n.position)
  const dim = focus && n.position !== focus
  return (
    <li className={`relative ${depth > 0 ? 'pl-5 md:pl-7' : ''}`}>
      {depth > 0 && <span aria-hidden className="absolute bottom-0 left-1.5 top-0 border-l border-dashed border-rule md:left-2.5" />}
      <div className={`leaf relative p-4 transition-opacity ${dim ? 'opacity-55' : ''}`} style={{ borderLeft: `4px solid ${color.base}` }}>
        <div className="ui flex flex-wrap items-center gap-2 text-sm">
          <span className={`font-medium ${n.kind === 'objection' || n.kind === 'counter-rebuttal' ? 'text-rubric' : ''}`} style={n.kind === 'claim' || n.kind === 'rebuttal' ? { color: color.text } : undefined}>
            {KIND_LABEL[n.kind]}
          </span>
          <PositionChip id={n.position} />
        </div>
        <p className="prose-measure mt-2">
          <Gloss>{n.text}</Gloss>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Refs refs={n.passages} />
          <Sources ids={n.sources} />
        </div>
        {n.children.length > 0 && (
          <button type="button" className="ui mt-2 text-sm text-accent underline underline-offset-2" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Hide replies' : `Show ${n.children.length} ${n.children.length === 1 ? 'reply' : 'replies'}`}
          </button>
        )}
      </div>
      {open && n.children.length > 0 && (
        <ul className="mt-3 space-y-3">
          {n.children.map((c) => (
            <NodeView key={c.id} n={c} depth={depth + 1} focus={focus} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function ArenaPage() {
  const { id = '' } = useParams()
  const a = argumentsById.get(id)
  const [view, setView] = useState<'tree' | 'graph'>('tree')
  const [focus, setFocus] = useState('')
  const visit = useApp((s) => s.visit)
  useEffect(() => {
    if (a) visit(`argument/${a.id}`)
  }, [a, visit])
  if (!a) return <NotFound />
  return (
    <article className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-3 pt-2">
        <div className="max-w-[60ch]">
          <p className="ui text-sm text-ink-soft">
            <Link to="/arena">Argument Arena</Link>, {topicsById.get(a.topic)?.name}
          </p>
          <h1 className="text-4xl md:text-5xl">{a.title}</h1>
          <p className="mt-1 text-xl italic text-ink-soft">{a.question}</p>
        </div>
        <BookmarkButton k={`argument/${a.id}`} label={a.title} />
      </header>
      <p className="prose-measure mt-5">
        <Gloss>{a.summary}</Gloss>
      </p>

      <div className="ui mt-6 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex gap-1.5" role="group" aria-label="View">
          <button type="button" className="btn min-h-8 px-3 py-1" aria-pressed={view === 'tree'} onClick={() => setView('tree')}>
            Tree
          </button>
          <button type="button" className="btn min-h-8 px-3 py-1" aria-pressed={view === 'graph'} onClick={() => setView('graph')}>
            Graph
          </button>
        </div>
        <label className="flex items-center gap-2">
          Highlight
          <select className="rounded-md border border-rule bg-surface px-2 py-1" value={focus} onChange={(e) => setFocus(e.target.value)}>
            <option value="">Every camp</option>
            {a.positions.map((p) => (
              <option key={p} value={p}>
                {positionsById.get(p)?.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        {view === 'tree' ? (
          <ul>
            <NodeView n={a.root} depth={0} focus={focus} />
          </ul>
        ) : (
          <Suspense fallback={<p className="ui text-ink-soft">Drawing the graph…</p>}>
            <ArgGraph root={a.root} focus={focus} />
            <p className="ui mt-2 text-sm text-ink-soft">The tree view holds the same exchange as readable text.</p>
          </Suspense>
        )}
      </div>
      <div className="prose-measure mt-10 border-t border-rule pt-4">
        <NoteBox k={`argument/${a.id}`} label={a.title} />
      </div>
    </article>
  )
}
