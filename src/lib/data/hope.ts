import type { HopeStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/hope.json') : await import('../../generated/hope.json')).default

export const { hope } = data as unknown as { hope: HopeStudy | null }
