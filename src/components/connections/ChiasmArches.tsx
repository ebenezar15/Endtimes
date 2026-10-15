import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { ChiasmOutline } from '../../content/schema'
import { Icon } from '../Icon'

const base = (l: string) => l.replace(/[′']/g, '')
const TINTS = ['var(--accent)', 'var(--gold-bright)', 'var(--rubric)', 'var(--agree)', 'var(--accent)', 'var(--gold-bright)']

/**
 * A chiastic outline drawn two ways: as nested arches over the chapters of the book
 * (each pair joined, the centre glowing), or as a ladder that steps in to the centre and back out.
 */
export function ChiasmArches({ outlines, chapters = 22, book = 'Revelation' }: { outlines: ChiasmOutline[]; chapters?: number; book?: string }) {
  const [oi, setOi] = useState(0)
  const [mode, setMode] = useState<'arches' | 'ladder'>('arches')
  const [sel, setSel] = useState<string | null>(null)
  const o = outlines[oi]
  const groups = useMemo(() => {
    if (!o) return []
    const order: string[] = []
    o.segments.forEach((s) => !order.includes(base(s.label)) && order.push(base(s.label)))
    return order
  }, [o])
  if (!o) return null
  const W = 1000
  const pad = 20
  const x = (ch: number) => pad + ((ch - 1) / chapters) * (W - 2 * pad)
  const depth = (l: string) => groups.indexOf(base(l))
  const tint = (l: string) => TINTS[depth(l) % TINTS.length]
  const H = 70 + groups.length * 34
  const barY = H - 46
  const selSegs = sel ? o.segments.filter((s) => base(s.label) === sel) : []

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="scroll-x flex gap-1.5" role="tablist" aria-label="Proposed outline">
          {outlines.map((x2, i) => (
            <button key={x2.id} type="button" role="tab" aria-selected={i === oi} onClick={() => (setOi(i), setSel(null))} className={`chip shrink-0 cursor-pointer ${i === oi ? 'border-accent' : ''}`} style={i === oi ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
              {x2.name}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <button type="button" className={`btn text-sm ${mode === 'arches' ? 'btn-primary' : ''}`} onClick={() => setMode('arches')}>
            <Icon name="motion" size={14} /> Arches
          </button>
          <button type="button" className={`btn text-sm ${mode === 'ladder' ? 'btn-primary' : ''}`} onClick={() => setMode('ladder')}>
            <Icon name="layers" size={14} /> Ladder
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-ink-soft">Proposed by {o.proposer}. Select a pair to see how its two halves answer each other.</p>

      <AnimatePresence mode="wait">
        {mode === 'arches' ? (
          <motion.div key={'a' + o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="leaf mt-4 p-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${o.name}: concentric outline of ${book}`}>
              {/* chapter ticks */}
              {Array.from({ length: chapters }, (_, i) => (
                <g key={i}>
                  <line x1={x(i + 1)} x2={x(i + 1)} y1={barY + 22} y2={barY + 28} stroke="var(--rule)" />
                  <text x={x(i + 1) + (W - 2 * pad) / chapters / 2} y={barY + 42} textAnchor="middle" fontSize={13} fill="var(--ink-soft)">
                    {i + 1}
                  </text>
                </g>
              ))}
              {/* arches between partners */}
              {groups.map((g, gi) => {
                const segs = o.segments.filter((s) => base(s.label) === g)
                if (segs.length < 2) return null
                const [a, b] = segs
                const x1 = (x(a.startCh) + x(a.endCh + 1)) / 2
                const x2 = (x(b.startCh) + x(b.endCh + 1)) / 2
                const top = barY - 18 - (groups.length - gi) * 30
                const on = !sel || sel === g
                return (
                  <motion.path
                    key={g}
                    d={`M${x1},${barY - 4} C${x1},${top} ${x2},${top} ${x2},${barY - 4}`}
                    fill="none"
                    stroke={tint(g)}
                    strokeWidth={sel === g ? 5 : 3}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: on ? 1 : 0.2 }}
                    transition={{ pathLength: { duration: 0.9, delay: 0.15 + gi * 0.18 }, opacity: { duration: 0.25 } }}
                    className="cursor-pointer"
                    onClick={() => setSel(sel === g ? null : g)}
                  />
                )
              })}
              {/* segments on the bar */}
              {o.segments.map((s, i) => {
                const isC = s.label === o.centre
                const on = !sel || base(s.label) === sel
                return (
                  <g key={s.label + i} className="cursor-pointer" onClick={() => setSel(sel === base(s.label) ? null : base(s.label))}>
                    <motion.rect
                      x={x(s.startCh) + 1}
                      y={barY - 4}
                      width={Math.max(6, x(s.endCh + 1) - x(s.startCh) - 2)}
                      height={24}
                      rx={6}
                      fill={tint(s.label)}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: on ? (isC ? 1 : 0.85) : 0.25 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      style={{ transformOrigin: `${x(s.startCh)}px ${barY}px` }}
                    />
                    <text x={(x(s.startCh) + x(s.endCh + 1)) / 2} y={barY + 13} textAnchor="middle" fontSize={13} fontWeight={800} fill="var(--surface)" pointerEvents="none">
                      {s.label}
                    </text>
                    {isC && (
                      <motion.circle cx={(x(s.startCh) + x(s.endCh + 1)) / 2} cy={barY + 8} r={18} fill="none" stroke="var(--gold-bright)" strokeWidth={2} animate={{ r: [16, 30], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
                    )}
                  </g>
                )
              })}
              <text x={pad} y={18} fontSize={12} fontWeight={700} fill="var(--ink-soft)">
                CHAPTERS OF {book.toUpperCase()}
              </text>
            </svg>
          </motion.div>
        ) : (
          <motion.ol key={'l' + o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 space-y-1.5">
            {o.segments.map((s, i) => {
              const d = depth(s.label)
              const on = !sel || base(s.label) === sel
              return (
                <motion.li key={s.label + i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: on ? 1 : 0.35, x: 0 }} transition={{ delay: i * 0.08 }} style={{ marginLeft: `${Math.min(d, 6) * 6}%` }}>
                  <button type="button" onClick={() => setSel(sel === base(s.label) ? null : base(s.label))} className={`leaf flex w-full items-start gap-3 p-3 text-left ${s.label === o.centre ? 'ring-2 ring-[var(--gold-bright)]' : ''}`} style={{ borderLeft: `5px solid ${tint(s.label)}` }}>
                    <span className="w-8 shrink-0 text-lg font-bold" style={{ color: tint(s.label) }}>
                      {s.label}
                    </span>
                    <span>
                      <span className="block font-bold">{s.title}</span>
                      <span className="text-sm text-ink-soft">{s.range}</span>
                    </span>
                  </button>
                </motion.li>
              )
            })}
          </motion.ol>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selSegs.length > 0 && (
          <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 grid gap-3 md:grid-cols-2">
            {selSegs.map((s) => (
              <div key={s.label} className="rounded-xl bg-surface-2 p-3" style={{ borderTop: `3px solid ${tint(s.label)}` }}>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">
                  {s.label} · {s.range}
                </p>
                <p className="font-bold">{s.title}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-3 max-w-[75ch] text-[0.95rem] text-ink-soft">{o.note}</p>
    </div>
  )
}
