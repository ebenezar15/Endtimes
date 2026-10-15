import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { core, positionsById, views } from '../lib/core'
import { stageLabel, timeScale, yearLabel } from '../lib/timescale'
import { usePositionColors } from '../lib/theme'
import { Icon } from './Icon'
import { t } from '../lib/i18n'

const W = 1200
const LANE = 38
const GUTTER = 150

/**
 * "The Road to the End": scroll drives a playhead from the Cross to the new creation.
 * Each view is a lane; its events light up as the playhead passes, so the views visibly diverge.
 */
export function RoadHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const x = useMemo(() => timeScale(W, 10), [])
  const color = usePositionColors()
  const lanes = useMemo(
    () =>
      views
        .map((v) => ({ v, t: core.timelines.find((t) => t.position === v.id) }))
        .filter((l) => l.t)
        .map((l, i) => ({ ...l, y: i * LANE + LANE / 2, events: [...l.t!.events].sort((a, b) => a.at - b.at) })),
    [],
  )
  const H = lanes.length * LANE
  const clipW = useTransform(progress, [0, 0.92], [GUTTER + x(0), GUTTER + W + 20])
  const [at, setAt] = useState(0)
  useMotionValueEvent(progress, 'change', (p) => setAt(Math.round(x.invert(x(0) + (W - x(0)) * Math.min(1, p / 0.92)) * 2) / 2))

  // On narrow screens, zoom in and follow the playhead.
  const box = useRef<HTMLDivElement>(null)
  const [aspect, setAspect] = useState(2)
  useEffect(() => {
    if (!box.current) return
    const ro = new ResizeObserver(([e]) => setAspect(e.contentRect.width / Math.max(1, e.contentRect.height)))
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])
  const fullW = W + GUTTER + 20
  const vbH = H + 130
  const vbW = aspect < 1.3 ? Math.max(420, vbH * aspect) : fullW
  const vbX = vbW >= fullW ? -GUTTER : Math.max(-GUTTER, Math.min(W + 20 - vbW, x(at) - vbW * 0.55))

  const passed = useMemo(
    () =>
      lanes
        .flatMap((l) => l.events.filter((e) => e.at <= at && e.milestone !== 'cross').map((e) => ({ e, pos: l.v.id })))
        .sort((a, b) => b.e.at - a.e.at)
        .slice(0, 3),
    [lanes, at],
  )
  const stage = stageLabel(at)

  return (
    <section ref={ref} className="relative" style={{ height: '420vh' }} aria-label={t('The road to the end: scroll to travel from the Cross to the new creation and watch the views diverge')}>
      <div className="sticky top-14 flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
        <div className="relative z-10 px-5 pt-5 sm:px-10 lg:pt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('A study of Christian views of the end')}</p>
            <h1 className="max-w-4xl text-3xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              {t('One hope.')} <span className="text-gradient">{t('Ten readings.')}</span> {t('A thousand years.')}
            </h1>
          </motion.div>
          <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">{t('When')}</p>
              <p className="text-3xl font-bold tabular-nums text-accent sm:text-5xl">{yearLabel(at)}</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pb-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">{t('Stage')}</p>
                <p className="text-lg font-bold text-rubric">{stage}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div ref={box} className="relative min-h-0 flex-1 px-2 sm:px-6">
          <svg viewBox={`${vbX} -38 ${vbW} ${vbH}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={t('Ten lanes, one per view, from the Cross to the new creation. The Timelines page has a text version.')}>
            <defs>
              <clipPath id="road-clip">
                <motion.rect x={-GUTTER} y={-50} height={H + 100} style={{ width: clipW }} />
              </clipPath>
              <filter id="road-glow" x="-10%" y="-80%" width="120%" height="260%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            {/* era bands and ticks */}
            <rect x={x(0)} y={-14} width={x(10) - x(0)} height={H + 18} rx={8} fill="var(--surface-2)" opacity={0.6} />
            <rect x={x(60)} y={-14} width={x(100) - x(60)} height={H + 18} rx={8} fill="var(--surface-2)" opacity={0.35} />
            {[
              [0, t('Cross')],
              [10, t('AD 70')],
              [35, t('Church age')],
              [60, t('Today')],
              [80, t('Future')],
              [100, t('New creation')],
            ].map(([a, l]) => (
              <g key={l as string}>
                <line x1={x(a as number)} x2={x(a as number)} y1={-14} y2={H + 4} stroke="var(--rule)" strokeDasharray="2 6" />
                <text x={x(a as number)} y={-22} textAnchor={a === 0 ? 'start' : a === 100 ? 'end' : 'middle'} fontSize={12} fontWeight={600} fill="var(--ink-soft)">
                  {l}
                </text>
              </g>
            ))}

            {/* lane labels */}
            {lanes.map((l) => (
              <Link key={l.v.id} to={`/positions/${l.v.id}`} aria-label={t('Open {name}', { name: l.v.name })}>
                <text x={-12} y={l.y + 4} textAnchor="end" fontSize={13} fontWeight={700} fill={color(l.v.id).text}>
                  {l.v.shortName}
                </text>
              </Link>
            ))}

            <g clipPath="url(#road-clip)">
              <g filter="url(#road-glow)" opacity={0.35}>
                {lanes.map((l) => (
                  <line key={l.v.id} x1={x(0)} x2={x(100)} y1={l.y} y2={l.y} stroke={color(l.v.id).base} strokeWidth={6} strokeLinecap="round" />
                ))}
              </g>
              {lanes.map((l) => {
                const c = color(l.v.id)
                return (
                  <g key={l.v.id}>
                    <line x1={x(0)} x2={x(100)} y1={l.y} y2={l.y} stroke={c.base} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
                    {l.events
                      .filter((e) => e.end != null)
                      .map((e) => (
                        <rect key={e.id} x={x(e.at)} y={l.y - 7} width={Math.max(6, x(e.end!) - x(e.at))} height={14} rx={7} fill={c.base} opacity={0.32} stroke={c.base} strokeWidth={1}>
                          <title>{`${l.v.shortName}: ${e.label}`}</title>
                        </rect>
                      ))}
                  </g>
                )
              })}
            </g>

            {/* event nodes pop in as the playhead reaches them */}
            {lanes.map((l) => {
              const c = color(l.v.id)
              return l.events
                .filter((e) => e.end == null)
                .map((e) => {
                  const on = e.at <= at
                  return (
                    <circle
                      key={e.id}
                      cx={x(e.at)}
                      cy={l.y}
                      r={on ? 6 : 0}
                      fill={c.base}
                      stroke="var(--surface)"
                      strokeWidth={2}
                      style={{ transition: 'r .35s cubic-bezier(.3,1.6,.5,1)' }}
                    >
                      <title>{`${l.v.shortName}: ${e.label}`}</title>
                    </circle>
                  )
                })
            })}

            {/* playhead */}
            <g style={{ transform: `translateX(${x(at)}px)`, transition: 'transform .08s linear' }}>
              <line x1={0} x2={0} y1={-14} y2={H + 4} stroke="var(--accent)" strokeWidth={2} />
              {lanes.map((l) => (
                <circle key={l.v.id} cx={0} cy={l.y} r={4} fill="var(--surface)" stroke={color(l.v.id).base} strokeWidth={2} />
              ))}
              <circle cx={0} cy={-14} r={5} fill="var(--accent)" className="animate-pulse" />
            </g>
          </svg>

          <div className="pointer-events-none absolute inset-x-4 bottom-1 hidden justify-center gap-2 md:flex" aria-live="polite">
            {passed.map(({ e, pos }) => (
                <motion.div layout key={`${pos}-${e.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="leaf flex w-64 items-center gap-2 px-3 py-2 text-sm">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: color(pos).base }} />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold" style={{ color: color(pos).text }}>
                      {positionsById.get(pos)?.shortName}
                    </span>
                    <span className="block truncate font-semibold">{e.label}</span>
                  </span>
                </motion.div>
              ))}
          </div>
        </div>

        <motion.div className="flex items-center justify-center gap-4 pb-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink-soft" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <span>{at < 99 ? t('Scroll to travel through time ↓') : t('Explore below ↓')}</span>
          <a href="#after-road" className="normal-case tracking-normal" onClick={(ev) => (ev.preventDefault(), document.getElementById('after-road')?.scrollIntoView({ behavior: 'smooth' }))}>
            {t('Skip')} <Icon name="arrow" size={12} className="inline rotate-90" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
