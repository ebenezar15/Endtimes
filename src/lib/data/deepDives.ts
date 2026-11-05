import type { DeepDive } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/deep-dives.json') : await import('../../generated/deep-dives.json')).default

export const deepDives = ((data as unknown as { deepDives: { dives: DeepDive[] } | null }).deepDives?.dives ?? []) as DeepDive[]
