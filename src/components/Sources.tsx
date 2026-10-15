import { useState } from 'react'
import { sourcesById } from '../lib/content'
import { t } from '../lib/i18n'

/** Compact citation list: "Sources (3)" disclosure with titles, authors and links. */
export function Sources({ ids, label = t('Sources') }: { ids: string[]; label?: string }) {
  const [open, setOpen] = useState(false)
  const list = [...new Set(ids)].map((id) => sourcesById.get(id)).filter(Boolean)
  if (!list.length) return null
  return (
    <div className="ui text-sm">
      <button type="button" className="text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink" aria-expanded={open} onClick={() => setOpen(!open)}>
        {label} ({list.length})
      </button>
      {open && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
          {list.map((s) => (
            <li key={s!.id}>
              {s!.url ? (
                <a href={s!.url} target="_blank" rel="noreferrer">
                  {s!.title}
                </a>
              ) : (
                <cite className="not-italic text-ink">{s!.title}</cite>
              )}
              , {s!.author}
              {s!.year ? ` (${s!.year})` : ''}
              {!s!.verified && <span title={t('Not verified online during research')} className="ml-1 text-rubric"> · {t('unverified')}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
