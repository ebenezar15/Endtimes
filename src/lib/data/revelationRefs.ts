/** Verse numbers covered by a reference such as "Revelation 1:12-16" or "Revelation 2:1–3:22" within chapter `ch`. */
export function versesIn(ref: string, ch: number): number[] {
  const m = ref.match(/(\d+):(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?/)
  if (!m) return []
  const [c1, v1] = [+m[1], +m[2]]
  const c2 = m[3] ? +m[3] : c1
  const v2 = m[4] ? +m[4] : v1
  if (ch < c1 || ch > c2) return []
  const start = ch === c1 ? v1 : 1
  const end = ch === c2 ? v2 : 60
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
