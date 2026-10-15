import { Link } from 'react-router-dom'
import { nivUrl, passageForRef } from '../lib/refs'
import { useApp } from '../lib/store'
import { t } from '../lib/i18n'

/** A list of Bible references; each links to the Passage Lab when covered, plus an optional NIV link. */
export function Refs({ refs, className = '' }: { refs: string[]; className?: string }) {
  const niv = useApp((s) => s.nivLink)
  if (!refs.length) return null
  return (
    <ul className={`ui flex flex-wrap gap-1.5 text-sm ${className}`} aria-label={t('Key texts')}>
      {refs.map((r) => {
        const p = passageForRef(r)
        return (
          <li key={r} className="chip gap-1 py-0.5">
            {p ? (
              <Link to={`/passages/${p.id}`} title={t('Open {title} in the Passage Lab', { title: p.title })}>
                {r}
              </Link>
            ) : (
              <span>{r}</span>
            )}
            {niv && (
              <a href={nivUrl(r)} target="_blank" rel="noreferrer" className="text-xs text-ink-soft" aria-label={t('Read {ref} in the NIV on BibleGateway', { ref: r })}>
                NIV
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}
