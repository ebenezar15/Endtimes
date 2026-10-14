import Fuse from 'fuse.js'
import { content } from './content'

export type SearchItem = { kind: string; title: string; text: string; to: string; extra?: string }

let fuse: Fuse<SearchItem> | null = null
export function searchIndex() {
  if (fuse) return fuse
  const items: SearchItem[] = [
    ...content.positions.map((p) => ({ kind: 'Position', title: p.name, text: p.summary, to: `/positions/${p.id}`, extra: [p.shortName, p.selfDescription, ...p.subViews.map((s) => s.name)].join(' ') })),
    ...content.topics.map((t) => ({ kind: 'Topic', title: t.name, text: t.question, to: `/compare?topic=${t.id}` })),
    ...content.passages.map((p) => ({ kind: 'Passage', title: `${p.ref} — ${p.title}`, text: p.summary, to: `/passages/${p.id}`, extra: p.keyIssue })),
    ...content.arguments.map((a) => ({ kind: 'Argument', title: a.title, text: a.question, to: `/arena/${a.id}`, extra: a.summary })),
    ...content.glossary.map((g) => ({ kind: 'Glossary', title: g.term, text: g.definition, to: `/glossary#${g.id}`, extra: g.aliases.join(' ') })),
    ...content.scholars.map((s) => ({ kind: 'Scholar', title: s.name, text: s.bio, to: `/library?tab=scholars#${s.id}`, extra: s.works.join(' ') })),
    ...content.library.map((e) => ({ kind: 'Library', title: e.title, text: e.summary, to: `/library#${e.id}`, extra: e.participants.join(' ') })),
  ]
  fuse = new Fuse(items, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'extra', weight: 1.2 },
      { name: 'text', weight: 1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
  return fuse
}
