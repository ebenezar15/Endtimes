import type { Flowchart, Timeline } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/timelines.json') : await import('../../generated/timelines.json')).default
export const { timelines, flowchart } = data as unknown as { timelines: Timeline[]; flowchart: Flowchart | null }
