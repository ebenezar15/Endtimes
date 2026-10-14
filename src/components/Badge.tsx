import { positionsById } from '../lib/core'
import { usePositionColors } from '../lib/theme'

/** An illuminated initial in the position's colour. */
export function Illum({ id, size = 40, className = '' }: { id: string; size?: number; className?: string }) {
  const color = usePositionColors()(id)
  const p = positionsById.get(id)
  return (
    <span
      aria-hidden
      className={`illum shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.72, ['--illum-color' as string]: color.base, color: color.ink }}
    >
      {p?.initial ?? '?'}
    </span>
  )
}

export function PositionChip({ id, short = true }: { id: string; short?: boolean }) {
  const color = usePositionColors()(id)
  const p = positionsById.get(id)
  return (
    <span className="chip" style={{ borderColor: color.base, background: color.soft }}>
      <span aria-hidden className="inline-block size-2.5 rounded-full" style={{ background: color.base }} />
      {p ? (short ? p.shortName : p.name) : id}
    </span>
  )
}
