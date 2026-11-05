import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { t } from '../lib/i18n'
import { Icon } from './Icon'

type Stop = { id: string; title: string }

/**
 * The page as a journey: every section is a station on an animated line, drawn in as the page opens.
 * A marker travels the line as you read; Deep dives (when present) get a glowing gold station
 * and a button of their own so they are easy to find. Tap any station to jump there.
 */
export function StudyMap() {
  const loc = useLocation()
  const [stops, setStops] = useState<Stop[]>([])
  const [cur, setCur] = useState('')
  useEffect(() => {
    const scan = () =>
      setStops(
        [...document.querySelectorAll<HTMLElement>('#main section[id]')]
          .map((s) => ({ s, h: s.querySelector<HTMLElement>(':scope > h2') }))
          .filter((x) => x.h)
          .map(({ s, h }) => ({ id: s.id, title: h!.getAttribute('aria-label') || h!.textContent || s.id })),
      )
    const a = setTimeout(scan, 400)
    const b = setTimeout(scan, 2000)
    return () => (clearTimeout(a), clearTimeout(b))
  }, [loc.pathname])
  useEffect(() => {
    if (!stops.length) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCur(e.target.id)), { rootMargin: '-35% 0px -60% 0px' })
    stops.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [stops])
  if (stops.length < 3) return <div className="h-6" />
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const dives = stops.some((s) => s.id === 'deep-dives')
  const idx = Math.max(0, stops.findIndex((s) => s.id === cur))
  const W = 120
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-soft">
          <Icon name="compass" size={14} /> {t('Your route through this study · {n} stops', { n: stops.length })}
        </p>
        {dives && (
          <motion.button type="button" onClick={() => go('deep-dives')} className="btn btn-primary py-1.5 text-sm" animate={{ boxShadow: ['0 0 0 0 rgba(232,182,90,.0)', '0 0 0 6px rgba(232,182,90,.35)', '0 0 0 0 rgba(232,182,90,.0)'] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <Icon name="layers" size={15} /> {t('Jump to the deep dives')}
          </motion.button>
        )}
      </div>
      <div className="scroll-x mt-2 pb-2">
        <svg width={Math.max(stops.length * W, 320)} height={96} className="block" role="navigation" aria-label={t('On this page')}>
          <defs>
            <linearGradient id="sm-line" x1="0" x2="1">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--gold)" />
            </linearGradient>
          </defs>
          <motion.path
            d={stops.map((_, i) => `${i ? 'L' : 'M'}${W / 2 + i * W} ${i % 2 ? 38 : 26}`).join(' ')}
            fill="none"
            stroke="var(--rule)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d={stops.map((_, i) => `${i ? 'L' : 'M'}${W / 2 + i * W} ${i % 2 ? 38 : 26}`).join(' ')}
            fill="none"
            stroke="url(#sm-line)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: stops.length > 1 ? idx / (stops.length - 1) || 0.02 : 1 }}
            transition={{ duration: 0.8 }}
          />
          {stops.map((s, i) => {
            const x = W / 2 + i * W
            const y = i % 2 ? 38 : 26
            const dive = s.id === 'deep-dives'
            const done = i < idx
            const here = i === idx
            return (
              <g key={s.id} role="link" tabIndex={0} aria-label={s.title} onClick={() => go(s.id)} onKeyDown={(e) => e.key === 'Enter' && go(s.id)} className="cursor-pointer">
                {(dive || here) && <circle cx={x} cy={y} r={11} fill={dive ? 'var(--gold)' : 'var(--accent)'} className="obs-halo" />}
                <motion.circle cx={x} cy={y} initial={{ r: 0 }} animate={{ r: here ? 11 : 8 }} transition={{ delay: i * 0.05, type: 'spring' }} fill={dive ? 'var(--gold)' : done || here ? 'var(--accent)' : 'var(--surface)'} stroke={dive ? 'var(--gold)' : 'var(--accent)'} strokeWidth={3} />
                <foreignObject x={x - W / 2 + 4} y={y + 14} width={W - 8} height={46}>
                  <div className={`line-clamp-2 text-center text-[11px] leading-tight ${here ? 'font-bold text-ink' : dive ? 'font-bold text-gold' : 'text-ink-soft'}`}>{s.title}</div>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
