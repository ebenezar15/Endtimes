import type { Atlas, CanonThread, RevStructure, SourceBook } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/connections.json') : await import('../../generated/connections.json')).default

export const { threads, books, structure, atlas } = data as unknown as { threads: CanonThread[]; books: SourceBook[]; structure: RevStructure | null; atlas: Atlas | null }
