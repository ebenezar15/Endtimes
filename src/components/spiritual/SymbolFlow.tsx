import { refLabel } from '../../lib/refLabel'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SpiritualKey } from '../../content/schema'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'
import { t } from '../../lib/i18n'

const STEPS = [
  { key: 'symbol', label: t('The image'), icon: 'eye' },
  { key: 'surface', label: t('Read on the surface'), icon: 'hourglass' },
  { key: 'christ', label: t('What it reveals of Christ'), icon: 'sparkles' },
  { key: 'spiritual', label: t('The reality now'), icon: 'star' },
] as const

/** An animated flowchart: how this view carries an image from its surface reading to Christ and to present experience. */
export function SymbolFlow({ keys }: { keys: SpiritualKey[] }) {
  const [id, setId] = useState(keys[0]?.id)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const k = keys.find((x) => x.id === id) ?? keys[0]
  useEffect(() => setStep(0), [id])
  useEffect(() => {
    if (!playing || step >= STEPS.length - 1) return
    const t = setTimeout(() => setStep((s) => s + 1), 1600)
    return () => clearTimeout(t)
  }, [playing, step])
  if (!k) return null
  const text = (s: (typeof STEPS)[number]['key']) => (s === 'symbol' ? t('{symbol} (Revelation {n})', { symbol: k.symbol, n: k.chapter }) : k[s])

  return (
    <div>
      <div className="scroll-x -mx-1 flex gap-1.5 px-1 pb-2" role="radiogroup" aria-label={t('Choose an image')}>
        {keys.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={x.id === k.id} className={`chip shrink-0 cursor-pointer ${x.id === k.id ? 'border-accent' : ''}`} style={x.id === k.id ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined} onClick={() => (setId(x.id), setPlaying(true))}>
            {x.symbol}
          </button>
        ))}
      </div>

      <ol className="relative mt-5 grid gap-4 md:grid-cols-4" aria-live="polite">
        {STEPS.map((s, i) => {
          const on = i <= step
          return (
            <li key={s.key} className="relative">
              {i > 0 && (
                <motion.span
                  aria-hidden
                  className="absolute -top-4 left-6 h-4 w-0.5 origin-top bg-gold-bright md:-left-4 md:top-1/2 md:h-0.5 md:w-4 md:origin-left"
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0, scaleY: on ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
              <motion.button
                type="button"
                onClick={() => (setStep(i), setPlaying(false))}
                initial={false}
                animate={{ opacity: on ? 1 : 0.35, y: on ? 0 : 8, scale: i === step ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className={`leaf block h-full w-full p-4 text-left ${i === step ? 'border-accent ring-2 ring-accent' : ''}`}
              >
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                  <Icon name={s.icon} size={15} /> {i + 1}. {s.label}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span key={k.id + s.key} initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.6 }} exit={{ opacity: 0 }} className="mt-2 block text-[0.95rem] leading-relaxed">
                    {on ? <Gloss>{text(s.key)}</Gloss> : '…'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </li>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <button type="button" className="btn text-sm" onClick={() => (setStep(0), setPlaying(true))}>
          <Icon name="play" size={14} /> {t('Replay')}
        </button>
        <Link to={`/revelation/${k.chapter}`} className="btn text-sm no-underline">
          {t('Open Revelation {n}', { n: k.chapter })}
        </Link>
        {k.texts.length > 0 && <span className="text-ink-soft">{t('See {refs}', { refs: refLabel(k.texts.join('; ')) })}</span>}
      </div>
    </div>
  )
}
