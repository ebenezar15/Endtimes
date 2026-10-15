import type { Passage } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/passages.json') : await import('../../generated/passages.json')).default
export const passages = data as unknown as Passage[]
export const passagesById = new Map(passages.map((p) => [p.id, p]))
