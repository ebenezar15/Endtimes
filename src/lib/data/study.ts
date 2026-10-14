import type { FlashDeck, QuizSet } from '../../content/schema'
import data from '../../generated/study.json'
export const { quizzes, flashcards } = data as unknown as { quizzes: QuizSet[]; flashcards: FlashDeck[] }
