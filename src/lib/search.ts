import Fuse from 'fuse.js'
import { content } from './content'
import { passages } from './data/passages'
import { argumentTrees } from './data/arguments'
import { library, scholars } from './data/library'
import { t } from './i18n'

export type SearchItem = { kind: string; title: string; text: string; to: string; extra?: string }

let fuse: Fuse<SearchItem> | null = null
export function searchIndex() {
  if (fuse) return fuse
  const items: SearchItem[] = [
    ...content.positions.map((p) => ({ kind: t('Position'), title: p.name, text: p.summary, to: `/positions/${p.id}`, extra: [p.shortName, p.selfDescription, ...p.subViews.map((s) => s.name)].join(' ') })),
    ...content.topics.map((tp) => ({ kind: t('Topic'), title: tp.name, text: tp.question, to: `/compare?topic=${tp.id}` })),
    ...passages.map((p) => ({ kind: t('Passage'), title: `${p.ref} — ${p.title}`, text: p.summary, to: `/passages/${p.id}`, extra: p.keyIssue })),
    ...argumentTrees.map((a) => ({ kind: t('Argument'), title: a.title, text: a.question, to: `/arena/${a.id}`, extra: a.summary })),
    ...content.glossary.map((g) => ({ kind: t('Glossary'), title: g.term, text: g.definition, to: `/glossary#${g.id}`, extra: g.aliases.join(' ') })),
    ...scholars.map((s) => ({ kind: t('Scholar'), title: s.name, text: s.bio, to: `/library?tab=scholars#${s.id}`, extra: s.works.join(' ') })),
    ...content.index.revelation.map((c) => ({ kind: t('Revelation'), title: t('Revelation {n}: {title}', { n: c.chapter, title: c.title }), text: c.section, to: `/revelation/${c.chapter}` })),
    ...content.index.revelation.flatMap((c) => c.symbols.map((s) => ({ kind: t('Revelation image'), title: s.phrase, text: s.ref, to: `/revelation/${c.chapter}#sym-${s.id}` }))),
    ...content.index.threads.map((th) => ({ kind: t('Bible connection'), title: th.title, text: th.summary, to: `/revelation/connections?thread=${th.id}` })),
    ...content.index.spiritualKeys.map((k) => ({ kind: t('Spiritual understanding'), title: k.symbol, text: k.spiritual, to: '/spiritual#flow' })),
    ...library.map((e) => ({ kind: t('Library'), title: e.title, text: e.summary, to: `/library#${e.id}`, extra: e.participants.join(' ') })),
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
