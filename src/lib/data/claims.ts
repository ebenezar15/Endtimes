import type { ClaimsStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/claims.json') : await import('../../generated/claims.json')).default

export const { claims } = data as unknown as { claims: ClaimsStudy | null }
