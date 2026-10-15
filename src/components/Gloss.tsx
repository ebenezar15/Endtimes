import { Fragment, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { content } from '../lib/content'
import type { GlossaryEntry } from '../content/schema'
import { t } from '../lib/i18n'

type Matcher = { re: RegExp | null; lookup: Map<string, GlossaryEntry> }

let cached: Matcher | null = null
function matcher(): Matcher {
  if (cached) return cached
  const lookup = new Map<string, GlossaryEntry>()
  for (const g of content.glossary)
    for (const t of [g.term, ...g.aliases]) if (t.length > 2) lookup.set(t.toLowerCase(), g)
  const terms = [...lookup.keys()].sort((a, b) => b.length - a.length).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  cached = { re: terms.length ? new RegExp(`(?<![\\p{L}-])(${terms.join('|')})(?![\\p{L}-])`, 'giu') : null, lookup }
  return cached
}

/** Renders text, turning the first mention of each glossary term into a hover/focus definition. */
export function Gloss({ children, seen }: { children: string; seen?: Set<string> }) {
  const parts = useMemo(() => {
    const { re, lookup } = matcher()
    if (!re) return [children]
    const used = seen ?? new Set<string>()
    const out: ReactNode[] = []
    let last = 0
    for (const m of children.matchAll(re)) {
      const g = lookup.get(m[0].toLowerCase())
      if (!g || used.has(g.id)) continue
      used.add(g.id)
      out.push(children.slice(last, m.index), <Term key={m.index} entry={g} label={m[0]} />)
      last = m.index! + m[0].length
    }
    out.push(children.slice(last))
    return out
  }, [children, seen])
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  )
}

export function Term({ entry, label }: { entry: GlossaryEntry; label: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const timer = useRef<number>(undefined)
  const show = () => {
    window.clearTimeout(timer.current)
    setOpen(true)
  }
  const hide = () => {
    timer.current = window.setTimeout(() => setOpen(false), 120)
  }
  return (
    <span className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        className="gloss"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onFocus={show}
        onBlur={hide}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      >
        {label}
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="leaf ui absolute left-0 top-full z-50 mt-1 block w-72 max-w-[80vw] p-3 text-left text-sm leading-snug"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <span className="block font-serif text-base font-medium">{entry.term}</span>
          {entry.origin && <span className="block italic text-ink-soft">{entry.origin}</span>}
          <span className="mt-1 block">{entry.definition}</span>
          <Link className="mt-1 block text-xs" to={`/glossary#${entry.id}`}>
            {t('Open in glossary')}
          </Link>
        </span>
      )}
    </span>
  )
}

/** Paragraph(s) of prose with glossary hovers. */
export function Prose({ text, className = '', dropcap = false }: { text: string; className?: string; dropcap?: boolean }) {
  const seen = useMemo(() => new Set<string>(), [text])
  return (
    <div className={`prose-measure space-y-3 ${className}`}>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} className={dropcap && i === 0 ? 'dropcap' : ''}>
          <Gloss seen={seen}>{para}</Gloss>
        </p>
      ))}
    </div>
  )
}
