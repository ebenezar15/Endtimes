import { describe, expect, it } from 'vitest'
import { checkBundle, parseFiles, POSITION_IDS, TOPIC_IDS, VIEW_IDS, walkArg } from '../src/content/validate'
import { loadRawContent } from './helpers'

const { bundle, errors } = parseFiles(loadRawContent())

describe('content files', () => {
  it('parse against the schema', () => {
    expect(errors).toEqual([])
  })
  it('pass every cross-reference and completeness check', () => {
    expect(checkBundle(bundle)).toEqual([])
  })
  it('define every position and topic', () => {
    expect(bundle.positions.map((p) => p.id).sort()).toEqual([...POSITION_IDS].sort())
    expect(bundle.topics.map((t) => t.id).sort()).toEqual([...TOPIC_IDS].sort())
  })
  it('fill the whole comparison matrix', () => {
    expect(bundle.matrix.length).toBe(VIEW_IDS.length * TOPIC_IDS.length)
  })
  it('give every critique a response and every argument claim an objection and rebuttal', () => {
    for (const p of bundle.positions) for (const c of p.critiques) expect(c.response.length).toBeGreaterThan(20)
    for (const a of bundle.arguments)
      walkArg(a.root, (n) => {
        if (n.kind === 'claim') expect(n.children.some((c) => c.kind === 'objection')).toBe(true)
        if (n.kind === 'objection') expect(n.children.some((c) => c.kind === 'rebuttal')).toBe(true)
      })
  })
  it('mark full preterism’s relation to the creeds', () => {
    expect(bundle.positions.find((p) => p.id === 'full-preterism')?.orthodoxyNote).toBeTruthy()
  })
  it('only embeds public-domain or openly licensed Bible text', () => {
    expect(Object.keys(bundle.bible?.translations ?? {}).sort()).toEqual(['BSB', 'KJV', 'WEB'])
    for (const p of bundle.passages) {
      const t = bundle.bible?.passages[p.id]
      expect(t, `bible text for ${p.id}`).toBeTruthy()
      expect(t!.BSB.length).toBeGreaterThan(0)
      expect(t!.BSB.every((v) => v.text.length > 0)).toBe(true)
    }
  })
})

describe('checkBundle catches mistakes', () => {
  it('reports unknown sources, missing objections and bad stances', () => {
    const b = structuredClone(bundle)
    b.matrix[0] = { ...b.matrix[0], stance: 'no-such-stance', sources: ['no-such-source'] }
    b.arguments[0] = { ...b.arguments[0], root: { ...b.arguments[0].root, children: [] } }
    const errs = checkBundle(b).join('\n')
    expect(errs).toMatch(/stance "no-such-stance" not defined/)
    expect(errs).toMatch(/unknown source "no-such-source"/)
    expect(errs).toMatch(/claim has no objection/)
  })
  it('rejects malformed files', () => {
    const { errors } = parseFiles({ 'positions/x.json': [{ id: 'Bad Id' }], 'flowchart.json': {} })
    expect(errors.length).toBeGreaterThan(0)
  })
})
