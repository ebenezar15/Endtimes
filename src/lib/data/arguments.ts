import type { ArgumentTree } from '../../content/schema'
import data from '../../generated/arguments.json'
export const argumentTrees = data as unknown as ArgumentTree[]
export const argumentsById = new Map(argumentTrees.map((a) => [a.id, a]))
