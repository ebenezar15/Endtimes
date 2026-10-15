import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import { Icon, type IconName } from './Icon'
import { SCHEMES, type Mode } from '../lib/schemes'
import { useApp } from '../lib/store'
import { withReveal } from '../lib/theme'
import { t } from '../lib/i18n'

/** Scheme swatches + light/dark/system + contrast + motion. Used in the header popover and on Settings. */
export function AppearanceControls() {
  const { scheme, mode, highContrast, reduceMotion, set } = useApp()
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-ink-soft">{t('Colour scheme')}</p>
        <div className="grid gap-1.5" role="radiogroup" aria-label={t('Colour scheme')}>
          {SCHEMES.map((s, i) => (
            <motion.button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={scheme === s.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={(e) => withReveal(e, () => set({ scheme: s.id, highContrast: false }))}
              className={`flex items-center gap-3 rounded-xl border p-2 text-left transition ${scheme === s.id && !highContrast ? 'border-accent bg-surface-2' : 'border-transparent hover:bg-surface-2'}`}
            >
              <span className="relative flex size-9 shrink-0 overflow-hidden rounded-full border border-rule">
                <span className="h-full w-1/2" style={{ background: s.swatch[0] }} />
                <span className="h-full w-1/2" style={{ background: s.swatch[1] }} />
                <span className="absolute inset-[30%] rounded-full" style={{ background: s.swatch[2] }} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{s.name}</span>
                <span className="block truncate text-xs text-ink-soft">{s.blurb}</span>
              </span>
              {scheme === s.id && !highContrast && <Icon name="check" className="ml-auto text-accent" />}
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-ink-soft">{t('Mode')}</p>
        <Segmented<Mode>
          id="mode"
          value={mode}
          options={[
            { v: 'light', l: t('Light'), i: 'sun' },
            { v: 'dark', l: t('Dark'), i: 'moon' },
            { v: 'system', l: t('System'), i: 'layers' },
          ]}
          onPick={(v, e) => withReveal(e, () => set({ mode: v, highContrast: false }))}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn flex-1 text-sm" aria-pressed={highContrast} onClick={(e) => withReveal(e, () => set({ highContrast: !highContrast }))}>
          <Icon name="contrast" /> {t('High contrast')}
        </button>
        <button type="button" className="btn flex-1 text-sm" aria-pressed={reduceMotion} onClick={() => set({ reduceMotion: !reduceMotion })}>
          <Icon name="motion" /> {t('Reduce motion')}
        </button>
      </div>
    </div>
  )
}

function Segmented<T extends string>({ id, value, options, onPick }: { id: string; value: T; options: { v: T; l: string; i: IconName }[]; onPick: (v: T, e: React.MouseEvent) => void }) {
  return (
    <div className="flex rounded-xl border border-rule bg-surface-2 p-1" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={(e) => onPick(o.v, e)}
          className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-semibold ${value === o.v ? 'text-accent-ink' : 'text-ink'}`}
        >
          {value === o.v && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-lg bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <span className="relative flex items-center gap-1.5">
            <Icon name={o.i} size={14} /> {o.l}
          </span>
        </button>
      ))}
    </div>
  )
}

export function AppearanceButton() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])
  return (
    <div className="relative">
      <motion.button whileHover={{ rotate: 20 }} whileTap={{ scale: 0.9 }} type="button" className="btn px-2.5" aria-label={t('Colour scheme and display')} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="palette" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              role="dialog"
              aria-label={t('Appearance')}
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="leaf fixed right-3 top-16 z-50 max-h-[80vh] w-[min(92vw,380px)] origin-top-right overflow-y-auto p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold">{t('Appearance')}</h2>
                <button type="button" className="text-ink-soft hover:text-ink" onClick={() => setOpen(false)} aria-label={t('Close')}>
                  <Icon name="close" />
                </button>
              </div>
              <AppearanceControls />
              <p className="mt-4 text-xs leading-relaxed text-ink-soft">
                {t('Set in {font} where installed (macOS, iOS), with Nunito Sans as the open fallback.')
                  .split('{font}')
                  .map((part, i) => (i ? <Fragment key={i}><b className="text-ink">Avenir Next</b>{part}</Fragment> : part))}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
