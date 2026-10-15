import type { ArgumentTree } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/arguments.json') : await import('../../generated/arguments.json')).default
export const argumentTrees = data as unknown as ArgumentTree[]
export const argumentsById = new Map(argumentTrees.map((a) => [a.id, a]))
