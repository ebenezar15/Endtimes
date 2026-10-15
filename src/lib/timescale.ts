import { scaleLinear } from 'd3-scale'
import { t } from './i18n'

/**
 * The shared timeline scale used by every timeline (see content schema):
 * 0 = the Cross (c. AD 30), 10 = AD 70, 10–60 = church history to today, 60–100 = the future.
 * The first century and the future get room; church history is compressed.
 */
export function timeScale(width: number, pad = 24) {
  return scaleLinear()
    .domain([0, 10, 60, 100])
    .range([pad, pad + (width - 2 * pad) * 0.19, pad + (width - 2 * pad) * 0.47, width - pad])
    .clamp(true)
}

const NOW = new Date().getFullYear()

/** A readable date for a point on the scale. */
export function yearLabel(at: number) {
  if (at <= 10) return t('AD {year}', { year: Math.round(30 + at * 4) })
  if (at < 58) return t('AD {year}', { year: Math.round(70 + ((at - 10) / 50) * (NOW - 70)) })
  if (at <= 62) return t('Today')
  if (at < 99) return t('Still to come')
  return t('The new creation')
}

export function stageLabel(at: number) {
  if (at < 1.5) return t('The Cross and the empty tomb')
  if (at < 9.5) return t('The apostolic generation')
  if (at <= 11) return t('The fall of Jerusalem')
  if (at < 57) return t('The age of the church')
  if (at <= 62) return t('Today')
  if (at < 97) return t('What is still to come')
  return t('All things made new')
}
