import { LANG } from './lang'

/**
 * Interface strings. English text is the key; the Tamil dictionary (generated from i18n/ta/*.json,
 * interface strings only) is loaded before the app renders. Missing entries fall back to English.
 */
let dict: Record<string, string> = {}

export async function loadStrings() {
  if (LANG === 'ta') dict = (await import('../generated/ta/strings.json')).default as Record<string, string>
}

export function t(s: string, vars?: Record<string, string | number>): string {
  let out = dict[s] ?? s
  if (vars) for (const k in vars) out = out.split(`{${k}}`).join(String(vars[k]))
  return out
}
