import { useEffect, useState } from 'react'
import { useApp } from '../lib/store'

/** Bookmark toggle for any card key. */
export function BookmarkButton({ k, label }: { k: string; label: string }) {
  const on = useApp((s) => s.bookmarks.includes(k))
  const toggle = useApp((s) => s.toggleBookmark)
  return (
    <button type="button" className="btn min-h-8 px-2.5 py-1 text-sm" aria-pressed={on} onClick={() => toggle(k)} aria-label={`${on ? 'Remove bookmark' : 'Bookmark'}: ${label}`}>
      <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      {on ? 'Saved' : 'Save'}
    </button>
  )
}

/** Personal note attached to a card. Saved as you type. */
export function NoteBox({ k, label }: { k: string; label: string }) {
  const saved = useApp((s) => s.notes[k] ?? '')
  const setNote = useApp((s) => s.setNote)
  const pinned = useApp((s) => s.pins.includes(k))
  const togglePin = useApp((s) => s.togglePin)
  const [open, setOpen] = useState(!!saved)
  const [text, setText] = useState(saved)
  useEffect(() => setText(saved), [saved])
  useEffect(() => {
    const t = setTimeout(() => text !== saved && setNote(k, text), 400)
    return () => clearTimeout(t)
  }, [text, saved, k, setNote])
  if (!open)
    return (
      <button type="button" className="ui text-sm text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink" onClick={() => setOpen(true)}>
        Add a note
      </button>
    )
  return (
    <div className="ui space-y-1.5">
      <label className="block text-sm text-ink-soft">
        My note on {label}
        <textarea
          className="mt-1 block w-full rounded-md border border-rule bg-bg p-2 font-serif text-base text-ink"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setNote(k, text)}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={pinned} onChange={() => togglePin(k)} />
        Pin this note to my Study page
      </label>
    </div>
  )
}
