import type { Flowchart, FlowNode } from '../content/schema'

export type Walk = {
  /** Nodes answered so far, with the option chosen at each. */
  trail: { node: FlowNode; choice: number }[]
  /** The question now being asked, or null once a result is reached. */
  current: FlowNode | null
  result: Flowchart['results'][number] | null
}

/** Follow a list of chosen option indexes from the start node. Invalid choices stop the walk there. */
export function walk(flow: Flowchart, answers: number[]): Walk {
  const nodes = new Map(flow.nodes.map((n) => [n.id, n]))
  const trail: Walk['trail'] = []
  let current: FlowNode | undefined = nodes.get(flow.start)
  for (const a of answers) {
    if (!current) break
    const opt = current.options[a]
    if (!opt) break
    trail.push({ node: current, choice: a })
    if (opt.result) return { trail, current: null, result: flow.results.find((r) => r.id === opt.result) ?? null }
    current = opt.next ? nodes.get(opt.next) : undefined
  }
  return { trail, current: current ?? null, result: null }
}

/** Every distinct answer path from the start to a result. */
export function allPaths(flow: Flowchart): { answers: number[]; result: string }[] {
  const nodes = new Map(flow.nodes.map((n) => [n.id, n]))
  const out: { answers: number[]; result: string }[] = []
  const go = (id: string, answers: number[], depth: number) => {
    const n = nodes.get(id)
    if (!n || depth > 50) return
    n.options.forEach((o, i) => {
      if (o.result) out.push({ answers: [...answers, i], result: o.result })
      else if (o.next) go(o.next, [...answers, i], depth + 1)
    })
  }
  go(flow.start, [], 0)
  return out
}

/** Layered layout for the master flowchart: depth = longest path from the start. */
export function layout(flow: Flowchart) {
  const depth = new Map<string, number>()
  const visit = (id: string, d: number) => {
    if ((depth.get(id) ?? -1) >= d) return
    depth.set(id, d)
    flow.nodes.find((n) => n.id === id)?.options.forEach((o) => visit(o.next ?? o.result!, d + 1))
  }
  visit(flow.start, 0)
  const isResult = new Set(flow.results.map((r) => r.id))
  const layers = new Map<number, string[]>()
  for (const [id, d] of depth) layers.set(d, [...(layers.get(d) ?? []), id])
  const pos = new Map<string, { x: number; y: number }>()
  for (const [d, ids] of layers) {
    // results last within a layer, keep node order stable
    ids.sort((a, b) => Number(isResult.has(a)) - Number(isResult.has(b)) || a.localeCompare(b))
    ids.forEach((id, i) => pos.set(id, { x: (i - (ids.length - 1) / 2) * 280, y: d * 190 }))
  }
  return pos
}
