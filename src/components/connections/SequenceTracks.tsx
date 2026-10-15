import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RevStructure } from '../../content/schema'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

type Seq = RevStructure['sequences'][number]

/**
 * Two tracks side by side, an earlier book and Revelation, with each step joined to its echo.
 * Play walks through the pairs in order so the shared sequence shows.
 */
export function SequenceTracks({ sequences }: { sequences: Seq[] }) {
  const [si, setSi] = useState(0)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const s = sequences[si]
  const wrap = useRef<HTMLDivElement>(null)
  const left = useRef<(HTMLLIElement | null)[]>([])
  const right = useRef<(HTMLLIElement | null)[]>([])
  const [lines, setLines] = useState<{ y1: number; y2: number }[]>([])
  const [w, setW] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      const r = wrap.current?.getBoundingClientRect()
      if (!r || !s) return
      setW(r.width)
      setLines(s.pairs.map((_, i) => {
        const a = left.current[i]?.getBoundingClientRect()
        const b = right.current[i]?.getBoundingClientRect()
        return { y1: a ? a.top - r.top + a.height / 2 : 0, y2: b ? b.top - r.top + b.height / 2 : 0 }
      }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (wrap.current) ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [s])
  useEffect(() => setStep(0), [si])
  useEffect(() => {
    if (!playing || !s) return
    if (step >= s.pairs.length - 1) return setPlaying(false)
    const t = setTimeout(() => setStep((n) => n + 1), 1500)
    return () => clearTimeout(t)
  }, [playing, step, s])
  if (!s) return null
  const p = s.pairs[step]
  // Revelation's side, sorted by where it falls in the book, shows whether the order is kept.
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="scroll-x flex gap-1.5" role="tablist" aria-label="Sequence">
          {sequences.map((x, i) => (
            <button key={x.id} type="button" role="tab" aria-selected={i === si} onClick={() => setSi(i)} className={`chip shrink-0 cursor-pointer ${i === si ? 'border-accent' : ''}`} style={i === si ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
              {x.title}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary ml-auto text-sm" onClick={() => (step >= s.pairs.length - 1 && setStep(0), setPlaying((v) => !v))}>
          <Icon name={playing ? 'pause' : 'play'} size={14} /> {playing ? 'Pause' : 'Play the sequence'}
        </button>
      </div>
      <p className="mt-2 max-w-[75ch] text-ink-soft">
        <Gloss>{s.intro}</Gloss>
      </p>

      <div ref={wrap} className="relative mt-4 grid grid-cols-2 gap-x-[22%] sm:gap-x-[16%]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {lines.map((l, i) => {
            const x1 = w * (0.5 - 0.11)
            const x2 = w * (0.5 + 0.11)
            const on = i === step
            return (
              <motion.path
                key={s.id + i}
                d={`M${x1},${l.y1} C${w / 2},${l.y1} ${w / 2},${l.y2} ${x2},${l.y2}`}
                fill="none"
                stroke={on ? 'var(--gold-bright)' : 'var(--rule)'}
                strokeWidth={on ? 3.5 : 2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
              />
            )
          })}
        </svg>
        <div>
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-rubric">{s.book}</p>
          <ol className="space-y-2">
            {s.pairs.map((x, i) => (
              <li key={x.ot + i} ref={(el) => void (left.current[i] = el)}>
                <button type="button" onClick={() => (setStep(i), setPlaying(false))} className={`leaf w-full p-2.5 text-left text-sm transition-shadow ${i === step ? 'ring-2 ring-[var(--gold-bright)]' : ''}`} style={{ borderLeft: '4px solid var(--rubric)' }}>
                  <span className="block font-bold leading-snug">{x.otTitle}</span>
                  <span className="text-xs text-ink-soft">{x.ot}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-accent">Revelation</p>
          <ol className="space-y-2">
            {s.pairs.map((x, i) => (
              <li key={x.rev + i} ref={(el) => void (right.current[i] = el)}>
                <button type="button" onClick={() => (setStep(i), setPlaying(false))} className={`leaf w-full p-2.5 text-left text-sm transition-shadow ${i === step ? 'ring-2 ring-[var(--gold-bright)]' : ''}`} style={{ borderLeft: '4px solid var(--accent)' }}>
                  <span className="block font-bold leading-snug">{x.revTitle}</span>
                  <span className="text-xs text-ink-soft">{x.rev}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s.id + step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl bg-surface-2 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">
            Step {step + 1} of {s.pairs.length}: {p.ot} → {p.rev}
          </p>
          <p className="mt-1">
            <Gloss>{p.note}</Gloss>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
