import type { Atlas, CanonThread, RevStructure, SourceBook } from '../../content/schema'
import data from '../../generated/connections.json'

export const { threads, books, structure, atlas } = data as unknown as { threads: CanonThread[]; books: SourceBook[]; structure: RevStructure | null; atlas: Atlas | null }
