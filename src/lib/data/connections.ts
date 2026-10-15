import type { CanonThread, RevStructure, SourceBook } from '../../content/schema'
import data from '../../generated/connections.json'

export const { threads, books, structure } = data as unknown as { threads: CanonThread[]; books: SourceBook[]; structure: RevStructure | null }
