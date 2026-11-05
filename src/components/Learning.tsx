import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LEARNING_PATH, NAV, pageKey } from '../app/nav'
import { t } from '../lib/i18n'
import { useApp } from '../lib/store'
import { Icon } from './Icon'

const label = (to: string) => NAV.find((n) => n.to === to)?.label ?? to
const icon = (to: string) => NAV.find((n) => n.to === to)?.icon ?? 'book'

/** Records a visit to any page in the menu, so progress can be shown. */
export function useTrackVisit() {
  const loc = useLocation()
  const visit = useApp((s) => s.visit)
  useEffect(() => {
    if (NAV.some((n) => n.to === loc.pathname)) visit(pageKey(loc.pathname))
  }, [loc.pathname, visit])
}

/**
 * A floating outline of the current page: the section you are reading and how far through you are.
 * Tap it to see every section and jump to one.
 */
export function PageOutline() {
  const loc = useLocation()
  const [items, setItems] = useState<{ id: string; title: string }[]>([])
  const [cur, setCur] = useState('')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setItems([])
    setOpen(false)
    const scan = () =>
      setItems(
        [...document.querySelectorAll<HTMLElement>('#main section[id]')]
          .map((s) => ({ s, h: s.querySelector<HTMLElement>(':scope > h2') }))
          .filter((x) => x.h)
          .map(({ s, h }) => ({ id: s.id, title: h!.getAttribute('aria-label') || h!.textContent || s.id })),
      )
    const a = setTimeout(scan, 700)
    const b = setTimeout(scan, 2500)
    return () => (clearTimeout(a), clearTimeout(b))
  }, [loc.pathname])
  useEffect(() => {
    if (items.length < 3) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCur(e.target.id)), { rootMargin: '-35% 0px -60% 0px' })
    items.forEach((i) => {
      const el = document.getElementById(i.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [items])
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const t0 = setTimeout(() => window.addEventListener('scroll', close, { once: true, passive: true }), 900)
    return () => (clearTimeout(t0), window.removeEventListener('scroll', close))
  }, [open])
  if (items.length < 3) return null
  const idx = Math.max(0, items.findIndex((i) => i.id === cur))
  const go = (id: string) => (document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), setOpen(false))
  return (
    <div className="fixed bottom-4 left-4 z-30 lg:left-[17rem]">
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} aria-label={t('Outline of this page')} className="leaf scrollbar-thin mb-2 max-h-[60vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto p-2 shadow-2xl">
            <p className="px-2 py-1 text-xs uppercase tracking-[0.14em] text-ink-soft">{t('On this page')}</p>
            <ol>
              {items.map((x, k) => (
                <li key={x.id}>
                  <button type="button" onClick={() => go(x.id)} className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${x.id === cur ? 'bg-surface-2 font-bold text-ink' : 'text-ink-soft hover:bg-surface-2'}`}>
                    <span className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] ${k < idx ? 'bg-accent text-[var(--accent-ink)]' : x.id === cur ? 'bg-gold text-[var(--bg)]' : 'bg-surface-2'}`}>{k < idx ? <Icon name="check" size={11} /> : k + 1}</span>
                    <span className="leading-snug">{x.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </motion.nav>
        )}
      </AnimatePresence>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="leaf flex max-w-[min(18rem,calc(100vw-7rem))] items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm shadow-xl">
        <svg viewBox="0 0 36 36" className="size-8 shrink-0 -rotate-90" aria-hidden>
          <circle cx={18} cy={18} r={15} fill="none" stroke="var(--rule)" strokeWidth={4} />
          <motion.circle cx={18} cy={18} r={15} fill="none" stroke="var(--gold)" strokeWidth={4} strokeLinecap="round" strokeDasharray={94.2} animate={{ strokeDashoffset: 94.2 * (1 - (idx + 1) / items.length) }} />
        </svg>
        <span className="min-w-0">
          <span className="block text-[0.65rem] uppercase tracking-[0.14em] text-ink-soft">
            {t('Section {n} of {m}', { n: idx + 1, m: items.length })}
          </span>
          <span className="block truncate font-semibold">{items[idx]?.title}</span>
        </span>
      </button>
    </div>
  )
}

/** The learning path on the home page: every step, ticked when studied, with the next one highlighted. */
export function LearningPath() {
  const visited = useApp((s) => s.visited)
  const done = LEARNING_PATH.filter((p) => visited.includes(pageKey(p)))
  const next = LEARNING_PATH.find((p) => !visited.includes(pageKey(p))) ?? LEARNING_PATH[0]
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-10" aria-labelledby="path-h">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-gold">{t('Learning path')}</p>
          <h2 id="path-h" className="mt-1 text-3xl font-bold">
            {t('Study it in order')}
          </h2>
          <p className="mt-1 text-ink-soft">{t('From the views, to the evidence, to the big questions. Your progress is saved on this device.')}</p>
        </div>
        <Link to={next} className="btn btn-primary no-underline">
          <Icon name="play" size={15} /> {done.length ? t('Continue: {s}', { s: label(next) }) : t('Start: {s}', { s: label(next) })}
        </Link>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--gold))' }} initial={{ width: 0 }} whileInView={{ width: `${(done.length / LEARNING_PATH.length) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
      </div>
      <p className="mt-1 text-xs text-ink-soft">{t('{n} of {m} studies opened', { n: done.length, m: LEARNING_PATH.length })}</p>
      <ol className="scroll-x mt-4 flex gap-2 pb-2">
        {LEARNING_PATH.map((p, i) => {
          const seen = visited.includes(pageKey(p))
          const isNext = p === next
          return (
            <motion.li key={p} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 9) * 0.04 }} className="w-40 shrink-0">
              <Link to={p} className={`leaf flex h-full flex-col gap-2 p-3 no-underline transition hover:-translate-y-0.5 ${isNext ? 'ring-2 ring-[var(--gold)]' : ''}`}>
                <span className="flex items-center justify-between">
                  <span className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-bold ${seen ? 'bg-accent text-[var(--accent-ink)]' : isNext ? 'bg-gold text-[var(--bg)]' : 'bg-surface-2 text-ink-soft'}`}>{seen ? <Icon name="check" size={13} /> : i + 1}</span>
                  <Icon name={icon(p)} size={16} className="text-ink-soft" />
                </span>
                <span className="text-sm font-semibold leading-snug text-ink">{label(p)}</span>
              </Link>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}

/** At the end of a study on the path: the next study, one tap away. */
export function NextOnPath() {
  const loc = useLocation()
  const i = LEARNING_PATH.indexOf(loc.pathname)
  if (i < 0 || i === LEARNING_PATH.length - 1) return null
  const next = LEARNING_PATH[i + 1]
  return (
    <div className="mx-auto mt-16 max-w-6xl">
      <Link to={next} className="leaf group flex items-center gap-4 p-5 no-underline" style={{ background: 'radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 60%), var(--surface)' }}>
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-[var(--accent-ink)]">
          <Icon name={icon(next)} size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft">{t('Next on the learning path · step {n} of {m}', { n: i + 2, m: LEARNING_PATH.length })}</span>
          <span className="block text-xl font-bold text-ink">{label(next)}</span>
        </span>
        <motion.span className="text-accent" animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <Icon name="arrow" size={22} />
        </motion.span>
      </Link>
    </div>
  )
}
