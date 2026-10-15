/** Interface and content language. Chosen once at start-up; switching reloads the app. */
export type Lang = 'en' | 'ta'
export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'ta', label: 'தமிழ்', short: 'த' },
]
const KEY = 'last-things-lang'

export const LANG: Lang = (() => {
  try {
    return localStorage.getItem(KEY) === 'ta' ? 'ta' : 'en'
  } catch {
    return 'en'
  }
})()

export function setLang(l: Lang) {
  if (l === LANG) return
  try {
    localStorage.setItem(KEY, l)
  } catch {
    /* storage blocked: the switch lasts for this load only */
  }
  location.reload()
}
