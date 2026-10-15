import type { Bible, RevChapter, RevIntroSection, SpiritualStudy } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/revelation.json') : await import('../../generated/revelation.json')).default

export const { intro, chapters, spiritual } = data as unknown as { intro: RevIntroSection[]; chapters: RevChapter[]; spiritual: SpiritualStudy | null }
export const chapterByNumber = new Map(chapters.map((c) => [c.chapter, c]))

type RevText = { translations: Bible['translations']; chapters: Record<string, Record<'BSB' | 'KJV' | 'WEB', { ref: string; text: string }[]>> }
let textPromise: Promise<RevText> | null = null
/** The full text of Revelation is large, so it loads on demand. */
export const loadRevelationText = () => (textPromise ??= import('../../generated/revelation-text.json').then((m) => m.default as unknown as RevText))

export { versesIn } from './revelationRefs'
