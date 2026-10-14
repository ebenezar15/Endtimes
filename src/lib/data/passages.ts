import type { Passage } from '../../content/schema'
import data from '../../generated/passages.json'
export const passages = data as unknown as Passage[]
export const passagesById = new Map(passages.map((p) => [p.id, p]))
