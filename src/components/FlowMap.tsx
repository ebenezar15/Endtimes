import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo } from 'react'
import type { Flowchart } from '../content/schema'
import { layout } from '../lib/flow'
import { positionName } from '../lib/content'

/** Static, zoomable master flowchart of every fork, with a text outline for screen readers. */
export default function FlowMap({ flow, trail }: { flow: Flowchart; trail: string[] }) {
  const { nodes, edges } = useMemo(() => {
    const pos = layout(flow)
    const nodes: Node[] = [
      ...flow.nodes.map((n) => ({
        id: n.id,
        position: pos.get(n.id) ?? { x: 0, y: 0 },
        data: { label: n.question },
        style: {
          width: 240,
          fontFamily: 'Alegreya, serif',
          fontSize: 14,
          borderRadius: 8,
          borderWidth: trail.includes(n.id) ? 2.5 : 1,
          borderColor: trail.includes(n.id) ? 'var(--accent)' : 'var(--rule)',
          background: 'var(--surface)',
          color: 'var(--ink)',
        },
      })),
      ...flow.results.map((r) => ({
        id: r.id,
        position: pos.get(r.id) ?? { x: 0, y: 0 },
        data: { label: r.title },
        style: {
          width: 220,
          fontFamily: 'Alegreya Sans, sans-serif',
          fontWeight: 500,
          fontSize: 13,
          borderRadius: 999,
          border: '2px solid var(--gold-bright)',
          background: 'var(--surface-2)',
          color: 'var(--ink)',
        },
      })),
    ]
    const edges: Edge[] = flow.nodes.flatMap((n) =>
      n.options.map((o, i) => ({
        id: `${n.id}-${i}`,
        source: n.id,
        target: (o.next ?? o.result)!,
        label: o.label.length > 34 ? o.label.slice(0, 32) + '…' : o.label,
        labelStyle: { fontFamily: 'Alegreya Sans, sans-serif', fontSize: 11, fill: 'var(--ink)' },
        labelBgStyle: { fill: 'var(--bg)' },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--ink-soft)' },
        style: { stroke: 'var(--ink-soft)' },
      })),
    )
    return { nodes, edges }
  }, [flow, trail])

  return (
    <div>
      <div className="leaf h-[70vh] min-h-[28rem] overflow-hidden" aria-hidden>
        <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.2} nodesDraggable={false} nodesConnectable={false} proOptions={{ hideAttribution: true }}>
          <Background gap={24} size={1} color="var(--rule)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <details className="ui mt-4 text-sm">
        <summary className="cursor-pointer text-ink-soft">Read the flowchart as an outline</summary>
        <Outline flow={flow} id={flow.start} depth={0} />
      </details>
    </div>
  )
}

function Outline({ flow, id, depth }: { flow: Flowchart; id: string; depth: number }) {
  const n = flow.nodes.find((x) => x.id === id)
  if (!n || depth > 20) return null
  return (
    <ul className="mt-1 list-disc pl-5">
      <li>
        <span className="font-medium">{n.question}</span>
        <ul className="list-[circle] pl-5">
          {n.options.map((o) => {
            const r = o.result ? flow.results.find((x) => x.id === o.result) : null
            return (
              <li key={o.label}>
                {o.label} →{' '}
                {r ? (
                  <strong>
                    {r.title} ({r.positions.map((p) => positionName(p, true)).join(', ')})
                  </strong>
                ) : (
                  <Outline flow={flow} id={o.next!} depth={depth + 1} />
                )}
              </li>
            )
          })}
        </ul>
      </li>
    </ul>
  )
}
