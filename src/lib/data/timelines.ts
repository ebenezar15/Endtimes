import type { Flowchart, Timeline } from '../../content/schema'
import data from '../../generated/timelines.json'
export const { timelines, flowchart } = data as unknown as { timelines: Timeline[]; flowchart: Flowchart | null }
