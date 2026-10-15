import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo, useState } from 'react'
import type { ArgNode } from '../content/schema'
import { positionName } from '../lib/content'
import { usePositionColors } from '../lib/theme'
import { Gloss } from './Gloss'
import { Refs } from './Refs'
import { t } from '../lib/i18n'

const KIND = { claim: t('Claim'), objection: t('Objection'), rebuttal: t('Rebuttal'), 'counter-rebuttal': t('Counter-rebuttal') }
const NODE_W = 230
const GAP_X = 30
const GAP_Y = 150

/** Tidy tree layout: each leaf gets a column; parents centre over their children. */
function tidy(root: ArgNode) {
  const pos = new Map<string, { x: number; y: number }>()
  let col = 0
  const go = (n: ArgNode, d: number): number => {
    if (!n.children.length) {
      const x = col++ * (NODE_W + GAP_X)
      pos.set(n.id, { x, y: d * GAP_Y })
      return x
    }
    const xs = n.children.map((c) => go(c, d + 1))
    const x = (xs[0] + xs[xs.length - 1]) / 2
    pos.set(n.id, { x, y: d * GAP_Y })
    return x
  }
  go(root, 0)
  return pos
}

export default function ArgGraph({ root, focus }: { root: ArgNode; focus: string }) {
  const color = usePositionColors()
  const [sel, setSel] = useState<ArgNode | null>(null)
  const { nodes, edges, byId } = useMemo(() => {
    const pos = tidy(root)
    const nodes: Node[] = []
    const edges: Edge[] = []
    const byId = new Map<string, ArgNode>()
    const go = (n: ArgNode) => {
      byId.set(n.id, n)
      const c = color(n.position)
      nodes.push({
        id: n.id,
        position: pos.get(n.id)!,
        data: {
          label: (
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c.text }}>
                {KIND[n.kind]}: {positionName(n.position, true)}
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.text}</div>
            </div>
          ),
        },
        style: {
          width: NODE_W,
          
          background: 'var(--surface)',
          color: 'var(--ink)',
          borderRadius: 8,
          border: `1px solid ${c.base}`,
          borderLeft: `5px solid ${c.base}`,
          opacity: focus && focus !== n.position ? 0.4 : 1,
          cursor: 'pointer',
        },
      })
      n.children.forEach((ch) => {
        edges.push({
          id: `${n.id}-${ch.id}`,
          source: n.id,
          target: ch.id,
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--ink-soft)' },
          style: { stroke: ch.kind === 'objection' || ch.kind === 'counter-rebuttal' ? 'var(--rubric)' : 'var(--ink-soft)', strokeWidth: 1.5 },
        })
        go(ch)
      })
    }
    go(root)
    return { nodes, edges, byId }
  }, [root, focus, color])

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="leaf h-[70vh] min-h-[26rem] overflow-hidden" aria-hidden>
        <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.15} nodesDraggable={false} nodesConnectable={false} onNodeClick={(_, n) => setSel(byId.get(n.id) ?? null)} proOptions={{ hideAttribution: true }}>
          <Background gap={24} size={1} color="var(--rule)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <aside className="leaf p-4" aria-live="polite">
        {sel ? (
          <>
            <p className="ui text-sm font-medium" style={{ color: color(sel.position).text }}>
              {KIND[sel.kind]}, {positionName(sel.position)}
            </p>
            <p className="mt-2">
              <Gloss>{sel.text}</Gloss>
            </p>
            <Refs refs={sel.passages} className="mt-3" />
          </>
        ) : (
          <p className="ui text-sm text-ink-soft">{t('Select a node to read it in full. Red arrows lead to objections and counter-rebuttals.')}</p>
        )}
      </aside>
    </div>
  )
}
