import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseFiles } from '../src/content/validate'
import { versesIn } from '../src/lib/data/revelationRefs'
import { loadRawContent } from './helpers'

const { bundle } = parseFiles(loadRawContent())
const text = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'src', 'generated', 'revelation-text.json'), 'utf8'))

describe('Revelation study', () => {
  it('covers all 22 chapters', () => {
    expect(bundle.revChapters.map((c) => c.chapter).sort((a, b) => a - b)).toEqual(Array.from({ length: 22 }, (_, i) => i + 1))
  })
  it('gives every phrase a Jewish background and a meaning', () => {
    for (const c of bundle.revChapters)
      for (const s of c.symbols) {
        expect(s.jewish.length, `${c.chapter}/${s.id}`).toBeGreaterThan(30)
        expect(s.meaning.length, `${c.chapter}/${s.id}`).toBeGreaterThan(30)
      }
  })
  it('reads every chapter through at least four views, and chapter 20 through all four millennial views', () => {
    for (const c of bundle.revChapters) expect(c.readings.length).toBeGreaterThanOrEqual(4)
    const ch20 = bundle.revChapters.find((c) => c.chapter === 20)!
    for (const v of ['postmil', 'amil', 'histpremil', 'disppremil']) expect(ch20.readings.map((r) => r.position)).toContain(v)
  })
  it('highlights words that really occur in the BSB text (at least 85% of keywords)', () => {
    let total = 0
    let found = 0
    for (const c of bundle.revChapters) {
      const verses: { ref: string; text: string }[] = text.chapters[c.chapter].BSB
      for (const s of c.symbols) {
        const nums = versesIn(s.ref, c.chapter)
        const hay = verses.filter((v) => nums.includes(+v.ref.split(':')[1])).map((v) => v.text.toLowerCase()).join(' ')
        for (const k of s.keywords) {
          total++
          if (hay.includes(k.toLowerCase())) found++
        }
      }
    }
    expect(found / Math.max(total, 1)).toBeGreaterThan(0.85)
  })
  it('parses verse references within a chapter', () => {
    expect(versesIn('Revelation 1:12-16', 1)).toEqual([12, 13, 14, 15, 16])
    expect(versesIn('Revelation 2:1–3:22', 3).length).toBeGreaterThan(20)
    expect(versesIn('Revelation 13:18', 12)).toEqual([])
  })
})
