import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { ensureContrast, inkOn } from './color'
import { useApp } from './store'
import { positionsById } from './core'
import { schemeById } from './schemes'

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

export type ActiveTheme = { scheme: string; dark: boolean; contrast: boolean; surface: string; bg: string }

export function useActiveTheme(): ActiveTheme {
  const { scheme, mode, highContrast } = useApp()
  const sysDark = useSyncExternalStore(subscribeDark, getDark, () => false)
  const dark = highContrast || mode === 'dark' || (mode === 'system' && sysDark)
  const s = schemeById(scheme)
  return {
    scheme: s.id,
    dark,
    contrast: highContrast,
    surface: highContrast ? '#000000' : s.surface[dark ? 'dark' : 'light'],
    bg: highContrast ? '#000000' : s.bg[dark ? 'dark' : 'light'],
  }
}

export function useReducedMotion() {
  const pref = useApp((s) => s.reduceMotion)
  const os = useSyncExternalStore(subscribeMotion, getMotion, () => false)
  return pref || os
}

/** Applies scheme, mode, contrast, accent and font scale to <html>. */
export function useThemeEffect() {
  const t = useActiveTheme()
  const { accent, fontScale } = useApp()
  const reduce = useReducedMotion()
  useEffect(() => {
    document.documentElement.dataset.motion = reduce ? 'reduce' : 'full'
  }, [reduce])
  useEffect(() => {
    const root = document.documentElement
    root.dataset.scheme = t.scheme
    root.dataset.theme = t.dark ? 'dark' : 'light'
    if (t.contrast) root.dataset.contrast = 'high'
    else delete root.dataset.contrast
    root.style.setProperty('--font-scale', String(fontScale))
    if (accent && !t.contrast) {
      // Accent is used for text and for filled buttons; keep both readable.
      const a = ensureContrast(accent, t.surface, 4.5)
      root.style.setProperty('--accent-user', a)
      root.style.setProperty('--accent-ink-user', inkOn(a))
    } else {
      root.style.removeProperty('--accent-user')
      const base = getComputedStyle(root).getPropertyValue('--accent-base').trim() || '#000000'
      root.style.setProperty('--accent-ink-user', inkOn(base))
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.bg)
  }, [t.scheme, t.dark, t.contrast, t.surface, t.bg, accent, fontScale])
}

/** Run a theme change inside a View Transition that reveals it as a circle growing from the click. */
export function withReveal(e: { clientX: number; clientY: number }, change: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
  const reduced = document.documentElement.dataset.motion === 'reduce'
  if (!doc.startViewTransition || reduced) return change()
  const { clientX: x, clientY: y } = e
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const tr = doc.startViewTransition(() => flushSync(change))
  tr.ready
    .then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.6,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => {})
}

export type PositionPalette = { base: string; text: string; ink: string; soft: string }

/** Position colours: the configured base plus contrast-safe variants for the active theme. */
export function usePositionColors(): (id: string) => PositionPalette {
  const t = useActiveTheme()
  const overrides = useApp((s) => s.colorOverrides)
  return useMemo(() => {
    const cache = new Map<string, PositionPalette>()
    return (id: string) => {
      if (cache.has(id)) return cache.get(id)!
      const base = overrides[id] ?? positionsById.get(id)?.color ?? '#777777'
      const fill = t.dark ? ensureContrast(base, t.surface, 3) : base
      const pal = {
        base: fill,
        text: ensureContrast(base, t.surface, 4.5),
        ink: inkOn(fill),
        soft: t.dark ? `${fill}33` : `${base}22`,
      }
      cache.set(id, pal)
      return pal
    }
  }, [t.dark, t.surface, overrides])
}
