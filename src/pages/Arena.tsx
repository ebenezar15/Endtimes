import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PositionChip } from '../components/Badge'
import { content, topicsById, views } from '../lib/content'
import { argumentTrees } from '../lib/data/arguments'
import { walkArg } from '../content/ids'
import { t } from '../lib/i18n'

export default function Arena() {
  const [pos, setPos] = useState('')
  const [topic, setTopic] = useState('')
  const list = argumentTrees.filter((a) => (!pos || a.positions.includes(pos)) && (!topic || a.topic === topic))
  const count = (a: (typeof list)[number]) => {
    let n = 0
    walkArg(a.root, () => n++)
    return n
  }
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={t('Argument Arena')}
        lede={t('The debates that divide the views, mapped as claim, objection, rebuttal and counter-rebuttal. Each node names the camp that argues it, the texts it relies on and its sources.')}
      />
      <div className="ui flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          {t('Position')}
          <select className="rounded-md border border-rule bg-surface px-2 py-1.5" value={pos} onChange={(e) => setPos(e.target.value)}>
            <option value="">{t('Any')}</option>
            {views.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          {t('Topic')}
          <select className="rounded-md border border-rule bg-surface px-2 py-1.5" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">{t('Any')}</option>
            {content.topics.map((tp) => (
              <option key={tp.id} value={tp.id}>
                {tp.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {list.map((a) => (
          <li key={a.id}>
            <Link to={`/arena/${a.id}`} className="leaf block h-full p-5 text-ink no-underline hover:border-accent">
              <span className="ui text-sm text-ink-soft">{topicsById.get(a.topic)?.name}</span>
              <span className="mt-0.5 block text-2xl leading-tight">{a.title}</span>
              <span className="mt-1 block italic text-ink-soft">{a.question}</span>
              <span className="mt-3 flex flex-wrap gap-1">
                {a.positions.map((p) => (
                  <PositionChip key={p} id={p} />
                ))}
              </span>
              <span className="ui mt-2 block text-xs text-ink-soft">{t('{n} moves in the exchange', { n: count(a) })}</span>
            </Link>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="ui mt-6 text-ink-soft">{t('No debates match. Clear a filter to see more.')}</p>}
    </div>
  )
}
