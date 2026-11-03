import type { WarningsStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/warnings.json') : await import('../../generated/warnings.json')).default

export const { warnings } = data as unknown as { warnings: WarningsStudy | null }
