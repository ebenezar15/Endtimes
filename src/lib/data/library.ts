import type { Exchange, Scholar } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/library.json') : await import('../../generated/library.json')).default
export const { scholars, library } = data as unknown as { scholars: Scholar[]; library: Exchange[] }
