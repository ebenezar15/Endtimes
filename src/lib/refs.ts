import { content } from './content'

const parse = (r: string) => {
  const m = r.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?(?:\s*[-–]\s*(?:(\d+):)?(\d+))?/)
  if (!m) return null
  const [, book, c1, v1, c2, v2] = m
  const sc = +c1
  const ec = c2 ? +c2 : sc
  return { book: book.replace(/^Psalm$/, 'Psalms'), sc, sv: v1 ? +v1 : 1, ec, ev: v2 ? +v2 : v1 ? +v1 : 999 }
}

/** Find the Passage Lab entry that covers a reference, if any. */
export function passageForRef(ref: string) {
  const r = parse(ref)
  if (!r) return undefined
  const key = (c: number, v: number) => c * 1000 + v
  return content.index.passages.find((p) =>
    p.ranges.some((range) => {
      const q = parse(range)
      if (!q || q.book !== r.book) return false
      return key(r.sc, r.sv) <= key(q.ec, q.ev) && key(q.sc, q.sv) <= key(r.ec, r.ev)
    }),
  )
}

export const nivUrl = (ref: string) =>
  `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.replace(/–/g, '-'))}&version=NIV`
