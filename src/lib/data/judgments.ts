import type { JudgmentsStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/judgments.json') : await import('../../generated/judgments.json')).default

export const { judgments } = data as unknown as { judgments: JudgmentsStudy | null }
