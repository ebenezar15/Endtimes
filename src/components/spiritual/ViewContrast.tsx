import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { useState } from 'react'
import type { SpiritualStudy } from '../../content/schema'
import { Gloss } from '../Gloss'
import { Icon } from '../Icon'
import { t } from '../../lib/i18n'

type Row = SpiritualStudy['contrasts'][number]

/**
 * A lens slid across the popular end-times reading: drag it (or press play) and each row
 * changes, under the lens, into how this view reads the same thing.
 */
export function ViewContrast({ rows }: { rows: Row[] }) {
  const v = useMotionValue(0)
  const [pct, setPct] = useState(0)
  useMotionValueEvent(v, 'change', (x) => setPct(Math.round(x)))
  const play = () => animate(v, v.get() > 50 ? 0 : 100, { duration: 2.4, ease: [0.6, 0, 0.2, 1] })
  if (!rows.length) return null
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary text-sm" onClick={play}>
          <Icon name={pct > 50 ? 'eye' : 'sparkles'} size={15} /> {pct > 50 ? t('Back to the popular reading') : t('Look through the lens')}
        </button>
        <label className="flex min-w-[14rem] flex-1 items-center gap-3 text-sm text-ink-soft">
          <span className="shrink-0">{t('Popular')}</span>
          <input type="range" min={0} max={100} value={pct} onChange={(e) => v.set(Number(e.target.value))} className="w-full accent-[var(--accent)]" aria-label={t('Slide the lens across the readings')} />
          <span className="shrink-0">{t('Spiritual')}</span>
        </label>
      </div>
      <ul className="space-y-2.5">
        {rows.map((r, i) => (
          <LensRow key={r.topic} r={r} i={i} n={rows.length} v={v} />
        ))}
      </ul>
    </div>
  )
}

function LensRow({ r, i, n, v }: { r: Row; i: number; n: number; v: MotionValue<number> }) {
  // Rows lag one another slightly so the lens appears to sweep down the list.
  const local = useTransform(v, (x) => Math.max(0, Math.min(100, x * 1.25 - i * (25 / Math.max(1, n)))))
  const clip = useTransform(local, (x) => `inset(0 ${100 - x}% 0 0)`)
  const edge = useTransform(local, (x) => `${x}%`)
  const edgeOpacity = useTransform(local, (x) => (x > 0.5 && x < 99.5 ? 1 : 0))
  return (
    <motion.li initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.05 }} className="leaf overflow-hidden">
      <p className="px-4 pt-3 text-xs font-bold uppercase tracking-widest text-ink-soft">{r.topic}</p>
      <div className="relative grid">
        <p className="col-start-1 row-start-1 px-4 pb-3 pt-1 text-[0.95rem] text-ink-soft">
          <span className="mr-2 inline-block rounded-md bg-surface-2 px-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-rubric">{t('Popular')}</span>
          {r.popular}
        </p>
        <motion.p style={{ clipPath: clip }} className="col-start-1 row-start-1 bg-surface px-4 pb-3 pt-1 text-[0.95rem] font-semibold" aria-label={t('Spiritual Understanding: {text}', { text: r.spiritual })}>
          <span className="mr-2 inline-block rounded-md bg-accent px-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-[var(--accent-ink)]">{t('Spiritual')}</span>
          <Gloss>{r.spiritual}</Gloss>
        </motion.p>
        <motion.span aria-hidden style={{ left: edge, opacity: edgeOpacity }} className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-gold-bright shadow-[0_0_18px_4px_rgb(var(--glow)/0.6)]" />
      </div>
      {r.texts.length > 0 && <p className="px-4 pb-2 text-xs text-ink-soft">{r.texts.join('; ')}</p>}
    </motion.li>
  )
}
