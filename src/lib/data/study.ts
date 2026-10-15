import type { FlashDeck, QuizSet } from '../../content/schema'
import { LANG } from '../lang'
const data = (LANG === 'ta' ? await import('../../generated/ta/study.json') : await import('../../generated/study.json')).default
export const { quizzes, flashcards } = data as unknown as { quizzes: QuizSet[]; flashcards: FlashDeck[] }
