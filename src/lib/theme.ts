import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { ensureContrast, inkOn } from './color'
import { useApp, type ThemeName } from './store'
import { positionsById } from './content'

const BG: Record<ThemeName, string> = { vellum: '#f2efe6', parchment: '#e8d9bc', night: '#121726', contrast: '#000000' }
const SURFACE: Record<ThemeName, string> = { vellum: '#fbf9f3', parchment: '#f1e5cc', night: '#1a2033', contrast: '#000000' }

function subscribeDark(cb: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useActiveTheme(): ThemeName {
  const { theme, themeAuto } = useApp()
  const dark = useSyncExternalStore(subscribeDark, getDark, () => false)
  return themeAuto ? (dark ? 'night' : 'vellum') : theme
}

export function useReducedMotion() {
  const pref = useApp((s) => s.reduceMotion)
  const os = useSyncExternalStore(subscribeMotion, getMotion, () => false)
  return pref || os
}

/** Applies theme, accent and font scale to <html>. */
export function useThemeEffect() {
  const theme = useActiveTheme()
  const { accent, fontScale } = useApp()
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.setProperty('--font-scale', String(fontScale))
    if (accent && theme !== 'contrast') {
      // Accent is used for text and for filled buttons; keep both readable.
      const a = ensureContrast(accent, SURFACE[theme], 4.5)
      root.style.setProperty('--accent-user', a)
      root.style.setProperty('--accent-ink-user', inkOn(a))
    } else {
      root.style.removeProperty('--accent-user')
      root.style.setProperty('--accent-ink-user', theme === 'night' ? '#121726' : theme === 'contrast' ? '#000000' : '#ffffff')
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[theme])
  }, [theme, accent, fontScale])
}

export type PositionPalette = { base: string; text: string; ink: string; soft: string }

/** Position colours: the configured base plus contrast-safe variants for the active theme. */
export function usePositionColors(): (id: string) => PositionPalette {
  const theme = useActiveTheme()
  const overrides = useApp((s) => s.colorOverrides)
  return useMemo(() => {
    const cache = new Map<string, PositionPalette>()
    return (id: string) => {
      if (cache.has(id)) return cache.get(id)!
      const base = overrides[id] ?? positionsById.get(id)?.color ?? '#777777'
      const bg = SURFACE[theme]
      const fill = theme === 'contrast' ? ensureContrast(base, bg, 3) : theme === 'night' ? ensureContrast(base, bg, 3) : base
      const pal = {
        base: fill,
        text: ensureContrast(base, bg, 4.5),
        ink: inkOn(fill),
        soft: theme === 'night' || theme === 'contrast' ? `${fill}33` : `${base}22`,
      }
      cache.set(id, pal)
      return pal
    }
  }, [theme, overrides])
}
