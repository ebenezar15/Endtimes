import { motion } from 'framer-motion'
import { LANG, LANGS, setLang } from '../lib/lang'

/** English ⇄ தமிழ். The whole app (interface and study content) switches; the page reloads in the chosen language. */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex rounded-xl border border-rule bg-surface-2 p-0.5 text-sm font-bold ${className}`} role="radiogroup" aria-label="Language / மொழி">
      {LANGS.map((l) => {
        const on = l.id === LANG
        return (
          <button key={l.id} type="button" role="radio" aria-checked={on} lang={l.id} title={l.label} onClick={() => setLang(l.id)} className={`relative rounded-lg px-1.5 py-1 sm:px-2.5 ${on ? 'text-[var(--accent-ink)]' : 'text-ink hover:text-accent'}`}>
            {on && <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-lg bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span className="relative">{l.id === 'ta' ? (<><span className="sm:hidden">த</span><span className="hidden sm:inline">தமிழ்</span></>) : 'EN'}</span>
          </button>
        )
      })}
    </div>
  )
}
