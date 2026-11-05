import type { IsraelHistory } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/israel-history.json') : await import('../../generated/israel-history.json')).default

export const { israelHistory } = data as unknown as { israelHistory: IsraelHistory | null }
