import { Link } from 'react-router-dom'
import { Mark } from './Mark'
import { agreement, cell, positionName, stanceLabel, topicsById } from '../lib/content'
import { useApp } from '../lib/store'
import { TOPIC_IDS } from '../content/validate'
import type { Position } from '../content/schema'


/** "Where this view agrees and differs from My View" — compares against the lens position on the same axis. */
export function LensCompare({ position }: { position: Position }) {
  const { lensOn, lens } = useApp()
  if (!lensOn || position.axis === 'framework') return null
  const mineId = position.axis === 'millennial' ? lens.millennial : lens.hermeneutic
  if (mineId === position.id)
    return (
      <aside className="leaf border-gold p-4">
        <h2 className="text-xl">✦ This is your view</h2>
        <p className="ui mt-1 text-sm text-ink-soft">
          Your My View lens is set to this position. The <Link to="/compare">Compare</Link> page shows where every other view differs from it.
        </p>
      </aside>
    )
  const rows = TOPIC_IDS.map((t) => {
    const a = cell(position.id, t)
    const b = cell(mineId, t)
    return { t, a, b, ag: agreement(t, a?.stance, b?.stance) }
  }).filter((r) => r.a && r.b)
  if (!rows.length) return null
  const differ = rows.filter((r) => r.ag !== 'agree')
  return (
    <aside className="leaf p-4" aria-label="Comparison with my view">
      <h2 className="text-xl">Compared with my view</h2>
      <p className="ui mt-0.5 text-sm text-ink-soft">
        Against {positionName(mineId)}: agrees on {rows.length - differ.length} of {rows.length} topics.
      </p>
      <ul className="ui mt-3 space-y-2 text-sm">
        {differ.map(({ t, a, b, ag }) => (
          <li key={t}>
            <Mark kind={ag} />{' '}
            <span className="font-medium">{topicsById.get(t)?.name}</span>
            <span className="block text-ink-soft">This view: {stanceLabel(t, a!.stance)}</span>
            <span className="block text-ink-soft">My view: {stanceLabel(t, b!.stance)}</span>
          </li>
        ))}
      </ul>
      <Link className="ui mt-3 inline-block text-sm" to={`/compare?p=${position.id},${mineId}`}>
        Compare in full
      </Link>
    </aside>
  )
}
