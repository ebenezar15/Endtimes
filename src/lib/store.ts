import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStorage } from './storage'
import type { Mode, SchemeId } from './schemes'

export type Translation = 'BSB' | 'KJV' | 'WEB'

export type Settings = {
  scheme: SchemeId
  mode: Mode
  highContrast: boolean
  accent: string | null
  fontScale: number
  reduceMotion: boolean
  translation: Translation
  /** Show the "Read in NIV" link beside passages. */
  nivLink: boolean
  lensOn: boolean
  lens: { millennial: string; hermeneutic: string }
  colorOverrides: Record<string, string>
  introSeen: boolean
}

type Study = {
  notes: Record<string, string>
  pins: string[]
  bookmarks: string[]
  /** Positions queued in the floating compare tray. */
  compareTray: string[]
  visited: string[]
  quizBest: Record<string, number>
  /** Leitner box per card key "deck/card" (0–4). */
  cardBox: Record<string, number>
}

type Actions = {
  set: (p: Partial<Settings>) => void
  setNote: (key: string, text: string) => void
  togglePin: (key: string) => void
  toggleBookmark: (key: string) => void
  toggleCompare: (id: string) => void
  clearCompare: () => void
  visit: (key: string) => void
  recordQuiz: (set: string, score: number) => void
  setCardBox: (key: string, box: number) => void
  resetStudy: () => void
}

export const DEFAULT_SETTINGS: Settings = {
  scheme: 'sea',
  mode: 'system',
  highContrast: false,
  accent: null,
  fontScale: 1,
  reduceMotion: false,
  translation: 'BSB',
  nivLink: true,
  lensOn: true,
  lens: { millennial: 'postmil', hermeneutic: 'partial-preterism' },
  colorOverrides: {},
  introSeen: false,
}
const EMPTY_STUDY: Study = { notes: {}, pins: [], bookmarks: [], compareTray: [], visited: [], quizBest: {}, cardBox: {} }

const toggle = (arr: string[], k: string) => (arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k])

export const useApp = create<Settings & Study & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      ...EMPTY_STUDY,
      set: (p) => set(p),
      setNote: (key, text) =>
        set((s) => {
          const notes = { ...s.notes }
          if (text.trim()) notes[key] = text
          else delete notes[key]
          return { notes }
        }),
      togglePin: (key) => set((s) => ({ pins: toggle(s.pins, key) })),
      toggleBookmark: (key) => set((s) => ({ bookmarks: toggle(s.bookmarks, key) })),
      toggleCompare: (id) => set((s) => ({ compareTray: s.compareTray.includes(id) ? s.compareTray.filter((x) => x !== id) : [...s.compareTray, id].slice(-4) })),
      clearCompare: () => set({ compareTray: [] }),
      visit: (key) => set((s) => (s.visited.includes(key) ? s : { visited: [...s.visited, key] })),
      recordQuiz: (k, score) => set((s) => ({ quizBest: { ...s.quizBest, [k]: Math.max(score, s.quizBest[k] ?? 0) } })),
      setCardBox: (key, box) => set((s) => ({ cardBox: { ...s.cardBox, [key]: box } })),
      resetStudy: () => set(EMPTY_STUDY),
    }),
    {
      name: 'last-things',
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      // v1 stored a single "theme"; map it onto scheme + mode.
      migrate: (old, version) => {
        const o = (old ?? {}) as Record<string, unknown>
        if (version < 2) {
          const t = o.theme as string | undefined
          o.scheme = t === 'parchment' ? 'scroll' : 'sea'
          o.mode = o.themeAuto !== false ? 'system' : t === 'night' ? 'dark' : 'light'
          o.highContrast = t === 'contrast'
          o.compareTray = []
          delete o.theme
          delete o.themeAuto
        }
        return o as never
      },
    },
  ),
)
