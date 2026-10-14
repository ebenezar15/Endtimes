import type { Agreement } from '../lib/content'

export const AGREE_TEXT: Record<Agreement, string> = {
  agree: 'Agrees with the reference view',
  partial: 'Partly agrees with the reference view',
  disagree: 'Differs from the reference view',
  unknown: 'No data',
}
const COLOR: Record<Agreement, string> = { agree: 'var(--agree)', partial: 'var(--gold)', disagree: 'var(--rubric)', unknown: 'var(--ink-soft)' }

/** Agreement mark: full disc agrees, half disc partly agrees, ring differs. Shape carries meaning, not just colour. */
export function Mark({ kind, size = 13, label = true }: { kind: Agreement; size?: number; label?: boolean }) {
  const c = COLOR[kind]
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className="inline-block shrink-0 align-[-1px]" role={label ? 'img' : undefined} aria-label={label ? AGREE_TEXT[kind] : undefined} aria-hidden={label ? undefined : true}>
      {kind === 'agree' && <circle cx="7" cy="7" r="6" fill={c} />}
      {kind === 'partial' && (
        <>
          <circle cx="7" cy="7" r="5.25" fill="none" stroke={c} strokeWidth="1.5" />
          <path d="M7 1.75 A5.25 5.25 0 0 1 7 12.25 Z" fill={c} />
        </>
      )}
      {kind === 'disagree' && <circle cx="7" cy="7" r="5.25" fill="none" stroke={c} strokeWidth="1.5" />}
      {kind === 'unknown' && <circle cx="7" cy="7" r="2" fill={c} />}
    </svg>
  )
}
