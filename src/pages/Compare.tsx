import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Mark } from '../components/Mark'
import { Gloss } from '../components/Gloss'
import { Refs } from '../components/Refs'
import { Sources } from '../components/Sources'
import { agreement, cell, content, positionsById, stanceLabel, views, type Agreement } from '../lib/content'
import { useApp } from '../lib/store'
import { usePositionColors } from '../lib/theme'


export default function Compare() {
  const [params, setParams] = useSearchParams()
  const { lensOn, lens } = useApp()
  const color = usePositionColors()
  const initial = params.get('p')?.split(',').filter((x) => positionsById.has(x)) ?? []
  const [picked, setPicked] = useState<string[]>(
    initial.length >= 2 ? initial.slice(0, 4) : initial.length === 1 ? [initial[0], lensOn ? lens.millennial : 'amil'].filter((v, i, a) => a.indexOf(v) === i) : ['postmil', 'amil', 'histpremil', 'disppremil'],
  )
  const [diffOnly, setDiffOnly] = useState(false)
  const [refId, setRefId] = useState<string | null>(null)
  const focusTopic = params.get('topic')

  useEffect(() => {
    setParams((p) => {
      p.set('p', picked.join(','))
      return p
    }, { replace: true })
  }, [picked, setParams])
  useEffect(() => {
    if (focusTopic) document.getElementById(`row-${focusTopic}`)?.scrollIntoView({ block: 'center' })
  }, [focusTopic])

  // Reference column: My View (if selected and the lens is on), else the first picked view.
  const lensPick = lensOn ? picked.find((p) => p === lens.millennial || p === lens.hermeneutic) : undefined
  const ref = refId && picked.includes(refId) ? refId : lensPick ?? picked[0]

  const toggle = (id: string) =>
    setPicked((cur) => (cur.includes(id) ? (cur.length > 2 ? cur.filter((x) => x !== id) : cur) : cur.length < 4 ? [...cur, id] : cur))

  const rows = useMemo(
    () =>
      content.topics.map((t) => {
        const cells = picked.map((p) => cell(p, t.id))
        const refStance = cell(ref, t.id)?.stance
        const marks = picked.map((p, i) => (p === ref ? 'agree' : agreement(t.id, cells[i]?.stance, refStance)))
        return { t, cells, marks, allAgree: marks.every((m) => m === 'agree') }
      }),
    [picked, ref],
  )
  const shown = diffOnly ? rows.filter((r) => !r.allAgree) : rows

  return (
    <div className="mx-auto max-w-[90rem]">
      <PageHeader
        title="Compare views"
        lede="Choose two to four positions. Each row is a topic. The marks show agreement with the reference view: a full circle agrees, a half circle partly agrees, an open circle differs."
      />

      <fieldset className="ui">
        <legend className="mb-2 text-sm text-ink-soft">Positions to compare ({picked.length} of 4)</legend>
        <div className="flex flex-wrap gap-1.5">
          {views.map((v) => {
            const on = picked.includes(v.id)
            const c = color(v.id)
            return (
              <button
                key={v.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(v.id)}
                disabled={!on && picked.length >= 4}
                className="chip cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={on ? { background: c.base, color: c.ink, borderColor: c.base } : undefined}
              >
                {v.shortName}
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
            Show only differences
          </label>
          <label className="flex items-center gap-2">
            Compare against
            <select className="rounded-md border border-rule bg-surface px-2 py-1" value={ref} onChange={(e) => setRefId(e.target.value)}>
              {picked.map((p) => (
                <option key={p} value={p}>
                  {positionsById.get(p)?.shortName}
                  {lensPick === p ? ' (my view)' : ''}
                </option>
              ))}
            </select>
          </label>
          <span className="flex gap-3 text-ink-soft" aria-hidden>
            {(['agree', 'partial', 'disagree'] as const).map((a) => (
              <span key={a} className="flex items-center gap-1">
                <Mark kind={a} label={false} /> {a === 'agree' ? 'agrees' : a === 'partial' ? 'partly agrees' : 'differs'}
              </span>
            ))}
          </span>
        </div>
      </fieldset>

      <div className="scroll-x leaf mt-6" role="region" aria-label="Comparison table" tabIndex={0}>
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <caption className="sr-only">
            Comparison of {picked.map((p) => positionsById.get(p)?.name).join(', ')} across {shown.length} topics, marked against {positionsById.get(ref)?.name}
          </caption>
          <thead>
            <tr className="ui">
              <th scope="col" className="sticky left-0 z-10 w-48 border-b border-rule bg-surface p-3 text-sm font-medium text-ink-soft">
                Topic
              </th>
              {picked.map((p) => {
                const c = color(p)
                return (
                  <th key={p} scope="col" className="border-b border-rule p-3 align-bottom">
                    <Link to={`/positions/${p}`} className="block text-lg font-medium no-underline" style={{ color: c.text }}>
                      {positionsById.get(p)?.shortName}
                    </Link>
                    <span className="block h-1 rounded-full" style={{ background: c.base }} aria-hidden />
                    {p === ref && <span className="mt-1 block text-xs font-normal text-ink-soft">reference{lensPick === p ? ' · my view' : ''}</span>}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {shown.map(({ t, cells, marks }) => (
              <tr key={t.id} id={`row-${t.id}`} className={`align-top ${focusTopic === t.id ? 'bg-surface-2/60' : ''}`}>
                <th scope="row" className="sticky left-0 z-10 w-48 border-b border-rule bg-surface p-3 font-normal">
                  <span className="block text-lg leading-tight">{t.name}</span>
                  <span className="ui mt-1 block text-xs text-ink-soft">{t.question}</span>
                </th>
                {cells.map((c, i) =>
                  c ? (
                    <td key={picked[i]} className="border-b border-rule p-3">
                      <CellView topic={t.id} c={c} mark={marks[i] as Agreement} />
                    </td>
                  ) : (
                    <td key={picked[i]} className="ui border-b border-rule p-3 text-sm text-ink-soft">
                      Not yet written
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="ui p-6 text-ink-soft">These views agree on every topic. Turn off “Show only differences” to see the full table.</p>}
      </div>
    </div>
  )
}

function CellView({ topic, c, mark }: { topic: string; c: NonNullable<ReturnType<typeof cell>>; mark: Agreement }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-w-[13rem] max-w-[24rem]">
      <p className="ui flex items-start gap-1.5 text-[0.95rem] font-medium">
        <span className="mt-1">
          <Mark kind={mark} />
        </span>
        {stanceLabel(topic, c.stance)}
      </p>
      <p className={`mt-1 text-[0.95rem] ${open ? '' : 'line-clamp-3'}`}>
        <Gloss>{c.statement}</Gloss>
      </p>
      <button type="button" className="ui mt-1 text-xs text-accent underline underline-offset-2" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Less' : 'More'}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {c.note && <p className="ui text-sm text-ink-soft">{c.note}</p>}
          <p className="ui text-xs text-ink-soft">
            Consensus within the camp: <strong className="font-medium text-ink">{c.consensus}</strong>
          </p>
          <Refs refs={c.keyTexts} />
          <Sources ids={c.sources} />
        </div>
      )}
    </div>
  )
}
