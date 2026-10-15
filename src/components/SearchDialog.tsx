import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchIndex } from '../lib/search'
import { t } from '../lib/i18n'

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const nav = useNavigate()
  const input = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      setTimeout(() => input.current?.focus(), 0)
    } else if (!open && d.open) d.close()
  }, [open])

  const results = useMemo(() => (q.trim().length > 1 ? searchIndex().search(q, { limit: 24 }).map((r) => r.item) : []), [q])
  useEffect(() => setActive(0), [q])

  const go = (to: string) => {
    onClose()
    setQ('')
    nav(to)
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label={t('Search')}
      className="leaf m-auto mt-[10vh] w-[min(40rem,calc(100vw-2rem))] max-w-none bg-surface p-0 text-ink backdrop:bg-black/40"
    >
      <div className="ui p-3">
        <label htmlFor="search-input" className="sr-only">
          {t('Search positions, passages, arguments, terms and scholars')}
        </label>
        <input
          id="search-input"
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(a - 1, 0))
            } else if (e.key === 'Enter' && results[active]) go(results[active].to)
          }}
          placeholder={t('Search: genea, Riddlebarger, Revelation 20, rapture…')}
          className="w-full rounded-md border border-rule bg-bg px-3 py-2.5 text-lg"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `sr-${active}` : undefined}
        />
      </div>
      <ul id="search-results" role="listbox" className="ui max-h-[60vh] overflow-y-auto px-2 pb-2">
        {q.trim().length > 1 && results.length === 0 && <li className="p-3 text-ink-soft">{t('No matches. Try a shorter word or a Bible book.')}</li>}
        {results.map((r, i) => (
          <li
            key={r.kind + r.to + r.title}
            id={`sr-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => go(r.to)}
            className={`cursor-pointer rounded-md px-3 py-2 ${i === active ? 'bg-surface-2' : ''}`}
          >
            <span className="mr-2 text-xs text-ink-soft">{r.kind}</span>
            <span className="font-serif text-base">{r.title}</span>
            <span className="block truncate text-sm text-ink-soft">{r.text}</span>
          </li>
        ))}
      </ul>
    </dialog>
  )
}
