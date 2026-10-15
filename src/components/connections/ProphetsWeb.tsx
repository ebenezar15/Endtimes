import { refLabel } from '../../lib/refLabel'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SourceBook } from '../../content/schema'
import { Gloss } from '../Gloss'
import { t } from '../../lib/i18n'

export const revChapterOf = (ref: string) => {
  const m = /Revelation\s+(\d+)/.exec(ref)
  return m ? Number(m[1]) : null
}

/**
 * Revelation at the centre of the books it draws on. Line weight shows how many echoes this study
 * lists; light travels inward along each line. Select a book to open its echoes.
 */
export function ProphetsWeb({ books }: { books: SourceBook[] }) {
  const [sel, setSel] = useState(books.find((b) => b.id === 'ezekiel')?.id ?? books[0]?.id)
  const b = books.find((x) => x.id === sel)
  const max = Math.max(1, ...books.map((x) => x.links.length))
  const C = 260
  const R = 200
  const nodes = books.map((x, i) => {
    const a = (i / books.length) * Math.PI * 2 - Math.PI / 2
    return { ...x, x: C + Math.cos(a) * R, y: C + Math.sin(a) * R, a }
  })
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="leaf self-start p-2 lg:sticky lg:top-24">
        <svg viewBox="0 0 520 520" className="h-auto w-full" role="group" aria-label={t('Books Revelation draws on')}>
          <defs>
            <radialGradient id="web-core">
              <stop offset="0%" stopColor="var(--gold-bright)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--gold-bright)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <motion.circle cx={C} cy={C} r={90} fill="url(#web-core)" animate={{ r: [80, 96, 80] }} transition={{ duration: 5, repeat: Infinity }} />
          {nodes.map((n, i) => {
            const on = n.id === sel
            const w = 1 + (n.links.length / max) * 6
            return (
              <g key={n.id + 'e'}>
                <motion.line x1={n.x} y1={n.y} x2={C} y2={C} stroke={on ? 'var(--gold-bright)' : 'var(--accent)'} strokeWidth={on ? w + 2 : w} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: on ? 0.95 : 0.4 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.05 }} />
                <motion.circle r={on ? 5 : 3} fill="var(--gold-bright)" initial={{ cx: n.x, cy: n.y, opacity: 0 }} animate={{ cx: [n.x, C], cy: [n.y, C], opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: (i * 0.37) % 2.2, ease: 'easeIn' }} />
              </g>
            )
          })}
          <circle cx={C} cy={C} r={52} fill="var(--surface)" stroke="var(--gold-bright)" strokeWidth={3} />
          <text x={C} y={C + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill="var(--ink)">
            {t('Revelation')}
          </text>
          {nodes.map((n) => {
            const on = n.id === sel
            const r = 20 + (n.links.length / max) * 10
            return (
              <g key={n.id} role="button" tabIndex={0} aria-pressed={on} aria-label={t('{book}: {count} echoes', { book: n.book, count: n.links.length })} className="cursor-pointer" onClick={() => setSel(n.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(n.id))}>
                <motion.circle cx={n.x} cy={n.y} r={r} fill={on ? 'var(--accent)' : 'var(--surface)'} stroke="var(--accent)" strokeWidth={2} whileHover={{ scale: 1.08 }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.book.length > 9 ? 9.5 : 11} fontWeight={700} fill={on ? 'var(--accent-ink)' : 'var(--ink)'} pointerEvents="none">
                  {n.book.replace(' Thessalonians', ' Thess.')}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <AnimatePresence mode="wait">
        {b && (
          <motion.div key={b.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="leaf self-start p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{b.era}</p>
            <h3 className="text-2xl font-bold">{b.book}</h3>
            <p className="mt-2 text-[0.95rem] text-ink-soft">
              <Gloss>{b.setting}</Gloss>
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {b.themes.map((t) => (
                <span key={t} className="chip text-xs">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 leading-relaxed">
              <Gloss>{b.summary}</Gloss>
            </p>
            <ul className="mt-4 max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {b.links.map((l, i) => {
                const ch = revChapterOf(l.rev)
                return (
                  <motion.li key={l.ot + l.rev} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-xl bg-surface-2 p-3 text-sm">
                    <p className="font-bold">{l.image}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="rounded-md bg-surface px-1.5 py-0.5 ring-1 ring-rule">{refLabel(l.ot)}</span>
                      <span aria-hidden className="text-gold-bright">→</span>
                      {ch ? (
                        <Link to={`/revelation/${ch}`} className="rounded-md bg-surface px-1.5 py-0.5 no-underline ring-1 ring-accent">
                          {refLabel(l.rev)}
                        </Link>
                      ) : (
                        <span>{refLabel(l.rev)}</span>
                      )}
                    </p>
                    <p className="mt-1 text-ink-soft">
                      <Gloss>{l.note}</Gloss>
                    </p>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
