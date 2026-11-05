import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../lib/i18n'
import { LANG } from '../lib/lang'
import { useReducedMotion } from '../lib/theme'
import { Icon, type IconName } from './Icon'

/** The questions people bring, each linking to the study that answers it. */
const QUESTIONS: { to: string; q: string; s: string; icon: IconName; tone: 'gold' | 'teal' | 'coral' | 'violet' }[] = [
  { to: '/fulfilled', q: t('Has Matthew 24 already happened?'), s: t('Every verse, from the temple to AD 70.'), icon: 'scroll', tone: 'gold' },
  { to: '/seventy-weeks', q: t('When are Daniel’s seventy weeks?'), s: t('Run the count from the decree to the Messiah.'), icon: 'timeline', tone: 'teal' },
  { to: '/judgments', q: t('Seals, trumpets and bowls: past or future?'), s: t('All twenty-one judgements on one board.'), icon: 'seal', tone: 'coral' },
  { to: '/israel', q: t('Is modern Israel a fulfilment of prophecy?'), s: t('Every promise, and where it was kept.'), icon: 'star', tone: 'violet' },
  { to: '/kingdom-hope', q: t('Is the world getting worse?'), s: t('What Scripture promises and the record shows.'), icon: 'compass', tone: 'teal' },
  { to: '/warnings', q: t('Does “I never knew you” describe hell?'), s: t('Warnings heard in their setting.'), icon: 'quote', tone: 'coral' },
  { to: '/rapture', q: t('Will there be a rapture?'), s: t('Every view of the rapture and the millennium.'), icon: 'trumpet', tone: 'gold' },
  { to: '/objections', q: t('How do I answer the objections?'), s: t('Twenty-nine claims, answered fairly.'), icon: 'scales', tone: 'violet' },
]

const TONE = { gold: 'var(--gold)', teal: 'var(--accent)', coral: 'var(--rubric)', violet: 'var(--violet, var(--accent))' }

/** A slow constellation: drifting points of light joined when they come near, like a living star map. */
function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const css = getComputedStyle(document.documentElement)
    const gold = css.getPropertyValue('--gold').trim() || '#e8b65a'
    const teal = css.getPropertyValue('--accent-base').trim() || '#5cc8b8'
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const N = Math.round(Math.min(70, Math.max(28, (w * h) / 9000)))
    const pts = Array.from({ length: N }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.6 + 0.6, c: i % 4 === 0 ? gold : teal, p: Math.random() * Math.PI * 2 }))
    let raf = 0
    let visible = true
    const draw = (step: boolean) => {
      ctx.clearRect(0, 0, w, h)
      for (const a of pts) {
        if (step) {
          a.x += a.vx
          a.y += a.vy
          a.p += 0.02
          if (a.x < 0 || a.x > w) a.vx *= -1
          if (a.y < 0 || a.y > h) a.vy *= -1
        }
      }
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i]
          const b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.strokeStyle = a.c
            ctx.globalAlpha = (1 - d / 120) * 0.35
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      for (const a of pts) {
        ctx.globalAlpha = 0.55 + 0.45 * Math.sin(a.p)
        ctx.fillStyle = a.c
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    const loop = () => {
      if (visible) draw(true)
      raf = requestAnimationFrame(loop)
    }
    if (reduce) draw(false)
    else raf = requestAnimationFrame(loop)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(c)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [reduce])
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}

/**
 * The opening of the app: a constellation of light behind the title, and the big questions people ask,
 * each a doorway into the study that answers it.
 */
export function ObservatoryHero() {
  return (
    <section className="px-4 pt-6 sm:px-6 lg:px-10">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[22px] border border-rule"
        style={{ background: 'radial-gradient(120% 90% at 80% 10%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 55%), radial-gradient(100% 80% at 0% 100%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%), var(--bg-2)' }}
      >
        <Constellation />
        <div className={`relative grid grid-cols-[minmax(0,1fr)] gap-6 p-6 sm:p-10 lg:items-center ${LANG === 'ta' ? '' : 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]'}`}>
          <div className="flex flex-col gap-4">
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-[0.12em] text-gold">
              {t('Views of the end · Scripture · History')}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.05]">
              {t('Last Things')}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="max-w-[52ch] text-[1.15rem] text-ink-soft">
              {t('Every view of the end, set out fairly, then traced through Scripture and history with living diagrams, maps and timelines. Start with a question.')}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-2">
              <Link to="/deep-dives" className="btn no-underline">
                <Icon name="layers" /> {t('Deep dives')}
              </Link>
              <Link to="/fit" className="btn btn-primary no-underline">
                <Icon name="fork" /> {t('Which view fits me?')}
              </Link>
              <a href="#after-road" className="btn no-underline" onClick={(e) => (e.preventDefault(), document.getElementById('road')?.scrollIntoView({ behavior: 'smooth' }))}>
                <Icon name="timeline" /> {t('Take the road to the end')}
              </a>
            </motion.div>
          </div>
          <ul className={`grid grid-cols-1 gap-2.5 sm:grid-cols-2 ${LANG === 'ta' ? 'xl:grid-cols-4' : ''}`}>
            {QUESTIONS.map((x, i) => (
              <motion.li key={x.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                <Link to={x.to} className="group flex h-full flex-col gap-1 rounded-xl border border-rule bg-surface/80 p-3.5 text-ink no-underline backdrop-blur-sm transition hover:-translate-y-0.5" style={{ ['--tone' as string]: TONE[x.tone] }}>
                  <span className="flex items-start gap-2">
                    <span className="relative mt-1 inline-flex size-2.5 shrink-0" aria-hidden>
                      <span className="obs-halo absolute inset-0 rounded-full" style={{ background: TONE[x.tone] }} />
                      <span className="relative size-2.5 rounded-full" style={{ background: TONE[x.tone] }} />
                    </span>
                    <b className="font-semibold leading-snug group-hover:underline">{x.q}</b>
                  </span>
                  <span className="pl-[18px] text-[0.84rem] leading-snug text-ink-soft">{x.s}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
