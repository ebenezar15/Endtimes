import type { DatingStudy, IsraelStudy, JosephusStory, OlivetStudy, SignsStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/studies.json') : await import('../../generated/studies.json')).default

export const { olivet, signs, dating, josephus, israel } = data as unknown as { olivet: OlivetStudy | null; signs: SignsStudy | null; dating: DatingStudy | null; josephus: JosephusStory | null; israel: IsraelStudy | null }
