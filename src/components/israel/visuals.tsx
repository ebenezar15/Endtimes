import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { IsraelStudy } from '../../content/schema'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'

/* A seeded random so the star field is the same on every render. */
const rand = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

/**
 * Countless seed → one Seed → a multitude from every nation.
 * Stars (Genesis 15:5) gather into a single star (Galatians 3:16) and burst out again as a ring of nations (Revelation 7:9).
 */
export function SeedHero() {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setPhase((p) => (p + 1) % 3), phase === 1 ? 2200 : 3400)
    return () => clearTimeout(id)
  }, [phase])
  const stars = useMemo(() => {
    const r = rand(7)
    return Array.from({ length: 64 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2
      return { x: 20 + r() * 360, y: 20 + r() * 220, rx: 200 + Math.cos(a) * (95 + (i % 3) * 18), ry: 130 + Math.sin(a) * (80 + (i % 3) * 14), s: 1 + r() * 2.2, d: r() * 0.6 }
    })
  }, [])
  const label = [t('“Count the stars: so shall your seed be”'), t('“And to your Seed, who is Christ”'), t('“A great multitude from every nation”')][phase]
  const ref = ['Genesis 15:5', 'Galatians 3:16', 'Revelation 7:9'][phase]
  return (
    <button type="button" onClick={() => setPhase((p) => (p + 1) % 3)} className="block w-full text-left" aria-label={`${label} (${refLabel(ref)})`}>
      <svg viewBox="0 0 400 260" className="h-auto w-full rounded-2xl bg-[#0d1530]">
        <defs>
          <radialGradient id="isr-glow">
            <stop offset="0" stopColor="#fff7d6" />
            <stop offset="0.4" stopColor="#f5c84c" stopOpacity="0.8" />
            <stop offset="1" stopColor="#f5c84c" stopOpacity="0" />
          </radialGradient>
        </defs>
        {stars.map((s, i) => {
          const at = phase === 0 ? { cx: s.x, cy: s.y, r: s.s, opacity: 0.9 } : phase === 1 ? { cx: 200, cy: 130, r: 0.6, opacity: 0.2 } : { cx: s.rx, cy: s.ry, r: s.s + 0.6, opacity: 1 }
          return <motion.circle key={i} initial={false} animate={at} transition={{ duration: 1.4, delay: s.d * (phase === 1 ? 0.4 : 1), ease: [0.4, 0, 0.2, 1] }} fill={phase === 2 ? ['#f5c84c', '#8fd3ff', '#ff9f8a', '#b9f5a6'][i % 4] : '#fff'} />
        })}
        <motion.circle cx={200} cy={130} initial={false} animate={{ r: phase === 1 ? 46 : phase === 2 ? 22 : 0, opacity: phase === 0 ? 0 : 1 }} transition={{ duration: 1.2 }} fill="url(#isr-glow)" />
        <motion.path d="M200 112 L200 148 M188 124 L212 124" stroke="#fff" strokeWidth={3} strokeLinecap="round" initial={false} animate={{ opacity: phase === 0 ? 0 : 1 }} transition={{ delay: 0.6 }} />
        <text x={200} y={246} textAnchor="middle" fontSize={11} fill="#cdd6ff" opacity={0.8}>
          {refLabel(ref)}
        </text>
      </svg>
      <AnimatePresence mode="wait">
        <motion.p key={phase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-center font-serif text-lg italic">
          {label}
        </motion.p>
      </AnimatePresence>
    </button>
  )
}

/** A radial mind map: tap a branch to grow its children and read them. */
export function MindMap({ map }: { map: IsraelStudy['mindmap'] }) {
  const [sel, setSel] = useState(map.branches[0]?.id)
  const n = map.branches.length
  const W = 520
  const C = W / 2
  const pos = (i: number, r: number, off = 0) => {
    const a = ((i + off) / n) * Math.PI * 2 - Math.PI / 2
    return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r }
  }
  const b = map.branches.find((x) => x.id === sel) ?? map.branches[0]
  const bi = map.branches.indexOf(b)
  const palette = ['#c2410c', '#0f766e', '#7c3aed', '#b45309', '#1d4ed8', '#be123c', '#15803d', '#6d28d9', '#0e7490']
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto h-auto w-full max-w-[34rem]" role="group" aria-label={map.center}>
        {map.branches.map((br, i) => {
          const p = pos(i, 150)
          const on = br.id === b.id
          return (
            <g key={br.id}>
              <motion.line x1={C} y1={C} x2={p.x} y2={p.y} stroke={palette[i % palette.length]} strokeWidth={on ? 5 : 2.5} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08 }} strokeLinecap="round" opacity={on ? 1 : 0.55} />
              {on &&
                br.children.map((ch, k) => {
                  const spread = br.children.length > 1 ? (k / (br.children.length - 1) - 0.5) * 0.9 : 0
                  const q = pos(i, 232, spread)
                  return (
                    <g key={k}>
                      <motion.line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={palette[i % palette.length]} strokeWidth={1.6} strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 + k * 0.08 }} />
                      <motion.circle cx={q.x} cy={q.y} r={7} fill={palette[i % palette.length]} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 + k * 0.08, type: 'spring' }} />
                      <motion.text x={q.x} y={q.y + (q.y > C ? 20 : -12)} textAnchor="middle" fontSize={11.5} fill="var(--ink)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + k * 0.08 }}>
                        {ch.label.length > 22 ? ch.label.slice(0, 21) + '…' : ch.label}
                      </motion.text>
                    </g>
                  )
                })}
            </g>
          )
        })}
        <motion.circle cx={C} cy={C} r={58} fill="var(--accent)" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120 }} />
        <foreignObject x={C - 54} y={C - 40} width={108} height={80}>
          <div className="flex h-full items-center justify-center text-center text-[13px] font-bold leading-tight text-[var(--accent-ink)]">{map.center}</div>
        </foreignObject>
        {map.branches.map((br, i) => {
          const p = pos(i, 150)
          const on = br.id === b.id
          return (
            <g key={br.id} role="button" tabIndex={0} aria-pressed={on} aria-label={br.label} onClick={() => setSel(br.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(br.id)} className="cursor-pointer outline-none">
              <motion.circle cx={p.x} cy={p.y} r={on ? 40 : 34} fill={palette[i % palette.length]} animate={{ scale: on ? 1.06 : 1 }} whileHover={{ scale: 1.1 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }} stroke="var(--surface)" strokeWidth={3} />
              <foreignObject x={p.x - 36} y={p.y - 30} width={72} height={60} pointerEvents="none">
                <div className="flex h-full items-center justify-center text-center text-[10.5px] font-bold leading-tight text-white">{br.label}</div>
              </foreignObject>
            </g>
          )
        })}
      </svg>
      <AnimatePresence mode="wait">
        <motion.div key={b.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="leaf p-5" style={{ borderTop: `5px solid ${palette[bi % palette.length]}` }}>
          <h3 className="text-2xl font-bold">{b.label}</h3>
          <p className="mt-2 leading-relaxed">
            <Gloss>{b.text}</Gloss>
          </p>
          <ol className="mt-4 space-y-3">
            {b.children.map((ch, k) => (
              <motion.li key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + k * 0.07 }} className="rounded-xl bg-surface-2 p-3">
                <p className="font-semibold">
                  {ch.label} <span className="text-xs font-normal text-ink-soft">· {refLabel(ch.ref)}</span>
                </p>
                <p className="mt-0.5 text-[0.95rem] text-ink-soft">
                  <Gloss>{ch.text}</Gloss>
                </p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Israel's story on one track, Jesus's on the other, joined one pair at a time. */
export function Recapitulation({ pairs }: { pairs: IsraelStudy['recapitulation'] }) {
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  useEffect(() => {
    if (!play) return
    const id = setInterval(() => setI((x) => (x + 1) % pairs.length), 3200)
    return () => clearInterval(id)
  }, [play, pairs.length])
  const p = pairs[i]
  return (
    <div className="leaf overflow-hidden p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={() => setPlay((v) => !v)} aria-pressed={play}>
          <Icon name={play ? 'pause' : 'play'} size={15} /> {play ? t('Pause') : t('Play the story')}
        </button>
        <span className="text-sm text-ink-soft">{t('{a} of {b}', { a: i + 1, b: pairs.length })}</span>
      </div>
      <div className="scroll-x mt-4 flex gap-1.5 pb-1" role="tablist">
        {pairs.map((x, k) => (
          <button key={x.id} type="button" role="tab" aria-selected={k === i} aria-label={x.israel} onClick={() => (setI(k), setPlay(false))} className={`h-2.5 min-w-6 flex-1 rounded-full transition-colors ${k === i ? 'bg-accent' : k < i ? 'bg-[var(--gold)]' : 'bg-surface-2 ring-1 ring-rule'}`} />
        ))}
      </div>
      <div className="relative mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] sm:items-stretch">
        <AnimatePresence mode="wait">
          <motion.div key={'a' + p.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-2xl bg-surface-2 p-4" style={{ borderLeft: '5px solid var(--gold)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">{t('Israel')}</p>
            <p className="mt-1 text-lg font-semibold leading-snug">
              <Gloss>{p.israel}</Gloss>
            </p>
            <p className="mt-1 text-sm text-ink-soft">{refLabel(p.israelRef)}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-center" aria-hidden>
          <motion.svg key={p.id} viewBox="0 0 48 48" className="size-12 rotate-90 sm:rotate-0">
            <motion.path d="M4 24 H40 M30 14 L40 24 L30 34" fill="none" stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.25 }} />
          </motion.svg>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={'b' + p.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.35 }} className="rounded-2xl bg-surface-2 p-4" style={{ borderLeft: '5px solid var(--accent)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Jesus')}</p>
            <p className="mt-1 text-lg font-semibold leading-snug">
              <Gloss>{p.jesus}</Gloss>
            </p>
            <p className="mt-1 text-sm text-ink-soft">{refLabel(p.jesusRef)}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-between">
        <button type="button" className="btn" onClick={() => (setI((i - 1 + pairs.length) % pairs.length), setPlay(false))}>
          ← {t('Previous')}
        </button>
        <button type="button" className="btn" onClick={() => (setI((i + 1) % pairs.length), setPlay(false))}>
          {t('Next')} →
        </button>
      </div>
    </div>
  )
}

/** The inheritance grows: concentric rings from Eden and Canaan out to the renewed earth. */
export function LandWidening({ stages }: { stages: IsraelStudy['landWidening'] }) {
  const [i, setI] = useState(0)
  const n = stages.length
  const s = stages[i]
  const hues = ['#15803d', '#b45309', '#c2410c', '#7c3aed', '#1d4ed8', '#0e7490', '#be123c', '#ca8a04']
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 300 300" className="mx-auto h-auto w-full max-w-sm" aria-hidden>
        {stages.map((st, k) => {
          const r = 22 + (k / Math.max(1, n - 1)) * 120
          return (
            <motion.circle key={st.id} cx={150} cy={150} fill={hues[k % hues.length]} stroke="var(--surface)" strokeWidth={2} initial={false} animate={{ r: k <= i ? r : 0, opacity: k <= i ? (k === i ? 0.95 : 0.35) : 0 }} transition={{ type: 'spring', stiffness: 60, damping: 14 }} style={{ mixBlendMode: 'multiply' }} />
          )
        })}
        {stages.map((st, k) =>
          k <= i ? (
            <motion.circle key={'o' + st.id} cx={150} cy={150} r={22 + (k / Math.max(1, n - 1)) * 120} fill="none" stroke={hues[k % hues.length]} strokeWidth={1.5} strokeDasharray="3 3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          ) : null,
        )}
        <text x={150} y={155} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">
          {i + 1}/{n}
        </text>
      </svg>
      <div>
        <input type="range" min={0} max={n - 1} value={i} onChange={(e) => setI(+e.target.value)} className="w-full accent-[var(--accent)]" aria-label={t('Stage')} />
        <div className="mt-1 flex justify-between text-xs text-ink-soft">
          <span>{stages[0].label}</span>
          <span>{stages[n - 1].label}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="leaf mt-4 p-5" style={{ borderLeft: `5px solid ${hues[i % hues.length]}` }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: hues[i % hues.length] }}>
              {refLabel(s.ref)}
            </p>
            <h3 className="mt-1 text-xl font-bold">{s.label}</h3>
            <p className="mt-2 leading-relaxed">
              <Gloss>{s.text}</Gloss>
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
            ← {t('Previous')}
          </button>
          <button type="button" className="btn btn-primary" disabled={i === n - 1} onClick={() => setI(i + 1)}>
            {t('Widen')} →
          </button>
        </div>
      </div>
    </div>
  )
}

/** David's throne, link by link, from the promise to the risen King. */
export function ThroneChain({ steps }: { steps: IsraelStudy['kingdom']['throne'] }) {
  const [n, setN] = useState(1)
  return (
    <div>
      <ol className="relative ml-4 border-l-4 border-dashed border-[var(--gold)] pl-6">
        {steps.slice(0, n).map((s, i) => (
          <motion.li key={s.ref} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} className="relative pb-5">
            <motion.span className="absolute -left-[2.35rem] top-0 inline-flex size-8 items-center justify-center rounded-full bg-[var(--gold)] text-white shadow" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}>
              {i === steps.length - 1 ? <Icon name="crown" size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
            </motion.span>
            <p className="font-bold text-accent">{refLabel(s.ref)}</p>
            <p className="mt-0.5 leading-relaxed">
              <Gloss>{s.text}</Gloss>
            </p>
          </motion.li>
        ))}
      </ol>
      <div className="mt-2 flex flex-wrap gap-2">
        {n < steps.length ? (
          <>
            <button type="button" className="btn btn-primary" onClick={() => setN(n + 1)}>
              {t('Next link')} →
            </button>
            <button type="button" className="btn" onClick={() => setN(steps.length)}>
              {t('Show the whole chain')}
            </button>
          </>
        ) : (
          <button type="button" className="btn" onClick={() => setN(1)}>
            {t('Start again')}
          </button>
        )}
      </div>
    </div>
  )
}
