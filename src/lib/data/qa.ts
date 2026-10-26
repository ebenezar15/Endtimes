import type { ProphecyQAStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/qa.json') : await import('../../generated/qa.json')).default

export const { prophecyQA } = data as unknown as { prophecyQA: ProphecyQAStudy | null }
