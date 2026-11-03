import type { WeeksStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/weeks.json') : await import('../../generated/weeks.json')).default

export const { weeks } = data as unknown as { weeks: WeeksStudy | null }
