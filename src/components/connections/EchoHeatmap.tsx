import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CanonThread, SourceBook } from '../../content/schema'
import { revChapterOf } from './ProphetsWeb'

type Echo = { from: string; ref: string; rev: string; label: string }

/**
 * Where each book surfaces in Revelation, chapter by chapter. Counts come from the echoes
 * and threads in this study, so they show this study's coverage, not a scholarly tally.
 */
export function EchoHeatmap({ books, threads }: { books: SourceBook[]; threads: CanonThread[] }) {
  const { rows, max } = useMemo(() => {
    const names = books.map((b) => b.book)
    const cells = new Map<string, Echo[]>()
    const add = (book: string, ch: number, e: Echo) => {
      const k = `${book}|${ch}`
      cells.set(k, [...(cells.get(k) ?? []), e])
    }
    for (const b of books) for (const l of b.links) {
      const ch = revChapterOf(l.rev)
      if (ch) add(b.book, ch, { from: b.book, ref: l.ot, rev: l.rev, label: l.image })
    }
    for (const t of threads) {
      const revStops = t.stops.filter((s) => s.book === 'Revelation')
      for (const s of t.stops) {
        if (s.book === 'Revelation' || !names.includes(s.book)) continue
        for (const r of revStops) {
          const ch = revChapterOf(r.ref)
          if (ch) add(s.book, ch, { from: s.book, ref: s.ref, rev: r.ref, label: t.title })
        }
      }
    }
    let max = 1
    cells.forEach((v) => (max = Math.max(max, v.length)))
    return { rows: names.map((n) => ({ book: n, cells: Array.from({ length: 22 }, (_, i) => cells.get(`${n}|${i + 1}`) ?? []) })), max }
  }, [books, threads])
  const [sel, setSel] = useState<{ book: string; ch: number } | null>(null)
  const echoes = sel ? rows.find((r) => r.book === sel.book)?.cells[sel.ch - 1] ?? [] : []
  const uniq = echoes.filter((e, i) => echoes.findIndex((x) => x.ref === e.ref && x.label === e.label) === i)

  return (
    <div>
      <div className="leaf scroll-x p-3">
        <table className="w-full min-w-[640px] border-separate border-spacing-[3px] text-xs">
          <thead>
            <tr>
              <th className="w-24 text-left font-semibold text-ink-soft">Book \ ch.</th>
              {Array.from({ length: 22 }, (_, i) => (
                <th key={i} scope="col" className="font-semibold text-ink-soft">
                  <Link to={`/revelation/${i + 1}`} className="text-ink-soft no-underline">
                    {i + 1}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.book}>
                <th scope="row" className="whitespace-nowrap pr-1 text-left font-semibold">
                  {r.book}
                </th>
                {r.cells.map((c, ci) => {
                  const v = c.length / max
                  const on = sel?.book === r.book && sel.ch === ci + 1
                  return (
                    <td key={ci} className="p-0">
                      <motion.button
                        type="button"
                        disabled={!c.length}
                        aria-label={`${r.book} in Revelation ${ci + 1}: ${c.length} echoes`}
                        onClick={() => setSel(on ? null : { book: r.book, ch: ci + 1 })}
                        initial={{ opacity: 0, scale: 0.4 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (ri + ci) * 0.012 }}
                        className={`block h-6 w-full rounded ${on ? 'ring-2 ring-[var(--ink)]' : ''} ${c.length ? 'cursor-pointer' : 'cursor-default'}`}
                        style={{ background: c.length ? `color-mix(in srgb, var(--accent) ${Math.round(20 + v * 80)}%, var(--surface))` : 'var(--surface-2)' }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-ink-soft">Darker cells mean more echoes in this study's data. Select a cell to list them.</p>
      </div>
      <AnimatePresence>
        {sel && uniq.length > 0 && (
          <motion.div key={sel.book + sel.ch} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-surface-2 p-4">
            <p className="font-bold">
              {sel.book} in Revelation {sel.ch}
            </p>
            <ul className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
              {uniq.map((e) => (
                <li key={e.ref + e.label}>
                  <span className="font-semibold">{e.label}</span> <span className="text-ink-soft">({e.ref} → {e.rev})</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
