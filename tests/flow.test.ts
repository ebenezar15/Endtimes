import { describe, expect, it } from 'vitest'
import type { Flowchart } from '../src/content/schema'
import { checkFlowchart, parseFiles } from '../src/content/validate'
import { allPaths, layout, walk } from '../src/lib/flow'
import { loadRawContent } from './helpers'

const toy: Flowchart = {
  start: 'a',
  nodes: [
    { id: 'a', question: 'A?', explanation: 'x', texts: [], options: [{ label: 'yes', next: 'b' }, { label: 'no', result: 'r1' }] },
    { id: 'b', question: 'B?', explanation: 'x', texts: [], options: [{ label: 'yes', result: 'r2' }, { label: 'no', next: 'c' }] },
    { id: 'c', question: 'C?', explanation: 'x', texts: [], options: [{ label: 'yes', result: 'r1' }, { label: 'no', result: 'r3' }] },
  ],
  results: [
    { id: 'r1', title: 'R1', positions: ['amil'], summary: 's' },
    { id: 'r2', title: 'R2', positions: ['postmil'], summary: 's' },
    { id: 'r3', title: 'R3', positions: ['disppremil'], summary: 's' },
  ],
}

describe('walk', () => {
  it('starts at the start node', () => {
    const w = walk(toy, [])
    expect(w.current?.id).toBe('a')
    expect(w.result).toBeNull()
  })
  it('follows answers to a result', () => {
    expect(walk(toy, [0, 0]).result?.id).toBe('r2')
    expect(walk(toy, [0, 1, 1]).result?.id).toBe('r3')
    expect(walk(toy, [1]).result?.id).toBe('r1')
  })
  it('records the trail of choices', () => {
    const w = walk(toy, [0, 1])
    expect(w.trail.map((t) => [t.node.id, t.choice])).toEqual([
      ['a', 0],
      ['b', 1],
    ])
    expect(w.current?.id).toBe('c')
  })
  it('ignores answers past a result and stops at invalid ones', () => {
    expect(walk(toy, [1, 0, 0]).result?.id).toBe('r1')
    expect(walk(toy, [7]).current?.id).toBe('a')
  })
})

describe('flowchart structure', () => {
  it('enumerates every path', () => {
    expect(allPaths(toy).map((p) => p.result).sort()).toEqual(['r1', 'r1', 'r2', 'r3'])
  })
  it('lays nodes out in layers', () => {
    const pos = layout(toy)
    expect(pos.get('a')!.y).toBeLessThan(pos.get('b')!.y)
    expect(pos.get('b')!.y).toBeLessThan(pos.get('c')!.y)
  })
  it('detects cycles, dangling links and unreachable nodes', () => {
    const bad: Flowchart = structuredClone(toy)
    bad.nodes[2].options[0] = { label: 'loop', next: 'a' }
    bad.nodes.push({ id: 'orphan', question: '?', explanation: 'x', texts: [], options: [{ label: 'x', next: 'nowhere' }, { label: 'y', result: 'r1' }] })
    const errs = checkFlowchart(bad).join('\n')
    expect(errs).toMatch(/cycle/)
    expect(errs).toMatch(/unknown next "nowhere"/)
    expect(errs).toMatch(/"orphan" unreachable/)
  })
  it('the real decision tree is sound and every path ends in a result', () => {
    const f = parseFiles(loadRawContent()).bundle.flowchart!
    expect(checkFlowchart(f)).toEqual([])
    const paths = allPaths(f)
    expect(paths.length).toBeGreaterThanOrEqual(f.results.length)
    for (const p of paths) expect(walk(f, p.answers).result?.id).toBe(p.result)
  })
})
