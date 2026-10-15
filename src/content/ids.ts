/** Zod-free constants and helpers shared by the app and the validator. */
import type { ArgNode } from './schema'

export const POSITION_IDS = [
  'postmil', 'amil', 'histpremil', 'disppremil',
  'partial-preterism', 'full-preterism', 'historicism', 'futurism', 'idealism', 'eclectic', 'spiritual',
  'covenant-theology', 'dispensationalism', 'progressive-covenantalism',
] as const
/** Positions covered by the comparison matrix and timelines. */
export const VIEW_IDS = POSITION_IDS.slice(0, 11)
export const TOPIC_IDS = [
  'millennium', 'satan-binding', 'first-resurrection', 'second-coming', 'rapture',
  'great-tribulation', 'antichrist', 'olivet-generation', 'seventy-weeks', 'revelation-date',
  'israel', 'optimism', 'kingdom', 'final-judgment', 'church-history',
] as const

export function walkArg(node: ArgNode, fn: (n: ArgNode, parent?: ArgNode) => void, parent?: ArgNode) {
  fn(node, parent)
  node.children.forEach((c) => walkArg(c, fn, node))
}
