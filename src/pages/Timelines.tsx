import { scaleLinear } from 'd3-scale'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Gloss } from '../components/Gloss'
import { Refs } from '../components/Refs'
import { Sources } from '../components/Sources'
import { content, positionsById, views } from '../lib/content'
import { usePositionColors, type PositionPalette } from '../lib/theme'
import type { Timeline, TimelineEvent } from '../content/schema'

/** Piecewise scale: the first century and the future get room; church history is compressed. */
const W = 1000
const x = scaleLinear().domain([0, 10, 60, 100]).range([24, 210, 470, W - 24]).clamp(true)
const ERA_TICKS = [
  { at: 0, label: 'The Cross', sub: 'c. AD 30' },
  { at: 10, label: 'AD 70', sub: 'Fall of Jerusalem' },
  { at: 35, label: 'Church history', sub: '' },
  { at: 60, label: 'Today', sub: '' },
  { at: 80, label: 'Future', sub: '' },
  { at: 100, label: 'New creation', sub: '' },
]
const MILESTONE_LABEL: Record<string, string> = {
  cross: 'The Cross', pentecost: 'Pentecost', ad70: 'AD 70', 'church-age': 'Church age', 'great-tribulation': 'Great Tribulation',
  antichrist: 'Antichrist', rapture: 'Rapture', 'satan-bound': 'Satan bound', millennium: 'Millennium', 'israel-conversion': 'Israel’s conversion',
  apostasy: 'Apostasy', parousia: 'Second Coming', resurrection: 'Resurrection', judgment: 'Final judgment', 'new-creation': 'New creation', other: 'Other',
}

type Placed = { e: TimelineEvent; lane: number }

function place(events: TimelineEvent[]) {
  const spans = events.filter((e) => e.end != null).sort((a, b) => a.at - b.at)
  const points = events.filter((e) => e.end == null).sort((a, b) => a.at - b.at)
  const laneEnd: number[] = []
  const sp: Placed[] = spans.map((e) => {
    let lane = laneEnd.findIndex((end) => x(e.at) > end + 4)
    if (lane === -1) lane = laneEnd.length
    laneEnd[lane] = x(e.end!)
    return { e, lane }
  })
  const labelEnd: number[] = []
  const pt: Placed[] = points.map((e) => {
    const px = x(e.at)
    const w = Math.min(150, e.label.length * 6.6 + 10)
    let lane = labelEnd.findIndex((end) => px - 4 > end)
    if (lane === -1) lane = labelEnd.length
    labelEnd[lane] = px + w
    return { e, lane }
  })
  return { sp, pt, spanLanes: laneEnd.length, pointLanes: labelEnd.length }
}

function Track({
  t, color, flip = false, onPick, picked, delay = 0, mark,
}: {
  t: Timeline; color: PositionPalette; flip?: boolean; onPick: (e: TimelineEvent) => void; picked?: string; delay?: number; mark: Set<string>
}) {
  const { sp, pt, spanLanes, pointLanes } = useMemo(() => place(t.events), [t])
  const dir = flip ? 1 : -1
  const spanY = (lane: number) => dir * (22 + lane * 22)
  const pointY = (lane: number) => dir * (22 + spanLanes * 22 + 14 + lane * 30)
  return (
    <g>
      {sp.map(({ e, lane }, i) => {
        const y = spanY(lane)
        const sel = picked === e.id
        return (
          <motion.g
            key={e.id}
            role="button"
            tabIndex={0}
            aria-label={`${e.label}, ${MILESTONE_LABEL[e.milestone]}`}
            onClick={() => onPick(e)}
            onKeyDown={(k) => (k.key === 'Enter' || k.key === ' ') && (k.preventDefault(), onPick(e))}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--accent)]"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: delay + 0.5 + i * 0.12 }}
            style={{ transformOrigin: `${x(e.at)}px ${y}px` }}
          >
            <rect x={x(e.at)} y={y - 8} width={Math.max(6, x(e.end!) - x(e.at))} height={16} rx={8} fill={color.soft} stroke={sel || mark.has(e.milestone) ? 'var(--ink)' : color.base} strokeWidth={sel ? 2.5 : mark.has(e.milestone) ? 1.8 : 1.2} strokeDasharray={mark.has(e.milestone) && !sel ? '4 3' : undefined} />
            <text x={x(e.at) + 8} y={y + 4} fontSize={12} fontFamily="Alegreya Sans, sans-serif" fill="var(--ink)">
              {e.label}
            </text>
          </motion.g>
        )
      })}
      {pt.map(({ e, lane }, i) => {
        const px = x(e.at)
        const y = pointY(lane)
        const sel = picked === e.id
        return (
          <motion.g
            key={e.id}
            role="button"
            tabIndex={0}
            aria-label={`${e.label}, ${MILESTONE_LABEL[e.milestone]}`}
            onClick={() => onPick(e)}
            onKeyDown={(k) => (k.key === 'Enter' || k.key === ' ') && (k.preventDefault(), onPick(e))}
            className="cursor-pointer outline-none [&:focus-visible>text]:underline"
            initial={{ opacity: 0, y: dir * -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay + 0.9 + i * 0.1 }}
          >
            <line x1={px} x2={px} y1={0} y2={y} stroke={color.base} strokeWidth={1} strokeDasharray="2 3" />
            <rect x={px - 6} y={-6} width={12} height={12} transform={`rotate(45 ${px} 0)`} fill={sel ? 'var(--ink)' : color.base} stroke="var(--gold-bright)" strokeWidth={1.5} />
            <text x={px + 5} y={y + (flip ? 12 : -2)} fontSize={12.5} fontFamily="Alegreya Sans, sans-serif" fontWeight={sel || mark.has(e.milestone) ? 700 : 500} fill={sel ? 'var(--accent)' : 'var(--ink)'}>
              {e.label}
            </text>
          </motion.g>
        )
      })}
    </g>
  )
}

function trackHeight(t?: Timeline) {
  if (!t) return 0
  const { spanLanes, pointLanes } = place(t.events)
  return 22 + spanLanes * 22 + 14 + pointLanes * 30 + 24
}

/** Milestones both views place, compared. */
function divergences(a: Timeline, b: Timeline) {
  const out: { m: string; a?: TimelineEvent; b?: TimelineEvent; kind: 'moved' | 'only-a' | 'only-b' | 'same' }[] = []
  const ms = [...new Set([...a.events, ...b.events].map((e) => e.milestone))].filter((m) => m !== 'other')
  for (const m of ms) {
    const ea = a.events.find((e) => e.milestone === m)
    const eb = b.events.find((e) => e.milestone === m)
    if (ea && eb) {
      const moved = Math.abs(ea.at - eb.at) > 2 || Math.abs((ea.end ?? ea.at) - (eb.end ?? eb.at)) > 2
      out.push({ m, a: ea, b: eb, kind: moved ? 'moved' : 'same' })
    } else out.push({ m, a: ea, b: eb, kind: ea ? 'only-a' : 'only-b' })
  }
  const order = { moved: 0, 'only-a': 1, 'only-b': 1, same: 2 }
  return out.sort((p, q) => order[p.kind] - order[q.kind] || (p.a?.at ?? p.b!.at) - (q.a?.at ?? q.b!.at))
}

export default function Timelines() {
  const [params, setParams] = useSearchParams()
  const color = usePositionColors()
  const ids = views.map((v) => v.id).filter((id) => content.timelines.some((t) => t.position === id))
  const a = params.get('a') && ids.includes(params.get('a')!) ? params.get('a')! : ids[0]
  const b = params.get('b') && ids.includes(params.get('b')!) ? params.get('b')! : ''
  const [picked, setPicked] = useState<{ e: TimelineEvent; pos: string } | null>(null)
  const ta = content.timelines.find((t) => t.position === a)
  const tb = b ? content.timelines.find((t) => t.position === b) : undefined
  const div = ta && tb ? divergences(ta, tb) : []
  const moved = new Set(div.filter((d) => d.kind !== 'same').map((d) => d.m))
  const setSel = (k: 'a' | 'b', v: string) =>
    setParams((p) => {
      if (v) p.set(k, v)
      else p.delete(k)
      return p
    })

  if (!ta) return <p className="ui">No timelines yet.</p>
  const hA = trackHeight(ta)
  const hB = trackHeight(tb)
  const axisY = hA + 30
  const H = axisY + 46 + (tb ? hB : 10)

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Timelines"
        lede="From the Cross to the new creation, as each view sees it. Overlay a second view and the places where they part ways are outlined and listed underneath."
      />
      <div className="ui flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="block text-ink-soft">View</span>
          <select className="mt-1 rounded-md border border-rule bg-surface px-3 py-2" value={a} onChange={(e) => (setSel('a', e.target.value), setPicked(null))}>
            {ids.map((id) => (
              <option key={id} value={id}>
                {positionsById.get(id)?.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-ink-soft">Overlay with</span>
          <select className="mt-1 rounded-md border border-rule bg-surface px-3 py-2" value={b} onChange={(e) => (setSel('b', e.target.value), setPicked(null))}>
            <option value="">None</option>
            {ids.filter((id) => id !== a).map((id) => (
              <option key={id} value={id}>
                {positionsById.get(id)?.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="scroll-x leaf mt-6 p-2" role="region" aria-label="Timeline chart" tabIndex={0}>
        <svg key={a + b} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[46rem]" role="img" aria-labelledby="tl-title">
          <title id="tl-title">
            Timeline of {positionsById.get(a)?.name}
            {tb ? ` overlaid with ${positionsById.get(b)?.name}` : ''}. A text version follows the chart.
          </title>
          {/* era bands */}
          <rect x={x(0)} y={0} width={x(10) - x(0)} height={H} fill="var(--surface-2)" opacity={0.55} />
          <rect x={x(60)} y={0} width={x(100) - x(60)} height={H} fill="var(--surface-2)" opacity={0.25} />
          <g transform={`translate(0 ${axisY})`}>
            <Track t={ta} color={color(a)} onPick={(e) => setPicked({ e, pos: a })} picked={picked?.e.id} mark={moved} />
            <motion.line x1={x(0)} x2={x(100)} y1={0} y2={0} stroke="var(--gold-bright)" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
            {ERA_TICKS.map((t) => (
              <g key={t.at}>
                <line x1={x(t.at)} x2={x(t.at)} y1={-5} y2={5} stroke="var(--ink-soft)" />
                {!tb && (
                  <text x={x(t.at)} y={24} textAnchor={t.at === 0 ? 'start' : t.at === 100 ? 'end' : 'middle'} fontSize={12} fontFamily="Alegreya Sans, sans-serif" fill="var(--ink-soft)">
                    {t.label}
                  </text>
                )}
              </g>
            ))}
            {tb && (
              <g transform="translate(0 46)">
                <line x1={x(0)} x2={x(100)} y1={0} y2={0} stroke="var(--rule)" strokeWidth={1} />
                {ERA_TICKS.map((t) => (
                  <text key={t.at} x={x(t.at)} y={-28} textAnchor={t.at === 0 ? 'start' : t.at === 100 ? 'end' : 'middle'} fontSize={11.5} fontFamily="Alegreya Sans, sans-serif" fill="var(--ink-soft)">
                    {t.label}
                  </text>
                ))}
                <motion.line x1={x(0)} x2={x(100)} y1={0} y2={0} stroke={color(b).base} strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.3 }} />
                <Track t={tb} color={color(b)} flip onPick={(e) => setPicked({ e, pos: b })} picked={picked?.e.id} delay={0.4} mark={moved} />
              </g>
            )}
          </g>
        </svg>
      </div>

      <div className="ui mt-3 flex flex-wrap gap-4 text-sm text-ink-soft">
        <span>
          <span className="inline-block h-1 w-6 align-middle" style={{ background: color(a).base }} /> {positionsById.get(a)?.shortName}
          {tb && ' (above)'}
        </span>
        {tb && (
          <span>
            <span className="inline-block h-1 w-6 align-middle" style={{ background: color(b).base }} /> {positionsById.get(b)?.shortName} (below)
          </span>
        )}
        <span>Shaded: the first century, and the future. Select any event for details.</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-live="polite">
          {picked ? (
            <div className="leaf p-5">
              <p className="ui text-sm" style={{ color: color(picked.pos).text }}>
                {positionsById.get(picked.pos)?.name}, {MILESTONE_LABEL[picked.e.milestone].toLowerCase()}
              </p>
              <h2 className="mt-1 text-2xl">{picked.e.label}</h2>
              <p className="mt-2">
                <Gloss>{picked.e.description}</Gloss>
              </p>
              <Refs refs={picked.e.texts} className="mt-3" />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl">{positionsById.get(a)?.name}</h2>
              <p className="mt-2 prose-measure">
                <Gloss>{ta.summary}</Gloss>
              </p>
              <div className="mt-3">
                <Sources ids={ta.sources} />
              </div>
            </div>
          )}
        </section>

        {tb ? (
          <section>
            <h2 className="text-2xl">Where they diverge</h2>
            <ul className="mt-3 divide-y divide-rule">
              {div
                .filter((d) => d.kind !== 'same')
                .map((d) => (
                  <li key={d.m} className="py-2.5">
                    <p className="font-medium">{MILESTONE_LABEL[d.m]}</p>
                    <p className="ui text-sm text-ink-soft">
                      {d.kind === 'moved' && (
                        <>
                          {positionsById.get(a)?.shortName}: {d.a!.label}; {positionsById.get(b)?.shortName}: {d.b!.label} (placed {Math.abs(d.a!.at - d.b!.at) < 3 ? 'over a different span' : d.a!.at < d.b!.at ? `earlier by ${positionsById.get(a)?.shortName}` : `earlier by ${positionsById.get(b)?.shortName}`})
                        </>
                      )}
                      {d.kind === 'only-a' && <>Only {positionsById.get(a)?.shortName} places this: {d.a!.label}</>}
                      {d.kind === 'only-b' && <>Only {positionsById.get(b)?.shortName} places this: {d.b!.label}</>}
                    </p>
                  </li>
                ))}
            </ul>
            {div.some((d) => d.kind === 'same') && (
              <p className="ui mt-3 text-sm text-ink-soft">
                Shared: {div.filter((d) => d.kind === 'same').map((d) => MILESTONE_LABEL[d.m]).join(', ')}.
              </p>
            )}
          </section>
        ) : (
          <section>
            <h2 className="text-2xl">The sequence</h2>
            <ol className="mt-3 space-y-1.5">
              {[...ta.events].sort((p, q) => p.at - q.at).map((e) => (
                <li key={e.id}>
                  <button type="button" className="text-left hover:text-accent" onClick={() => setPicked({ e, pos: a })}>
                    <span className="font-medium">{e.label}</span>
                    {e.end != null && <span className="ui text-sm text-ink-soft"> (a span)</span>}
                  </button>
                </li>
              ))}
            </ol>
            <Link to={`/positions/${a}`} className="ui mt-4 inline-block text-sm">
              Read about {positionsById.get(a)?.shortName}
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}
