import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { NAV, NAV_GROUP_LABEL } from './nav'
import { Icon } from '../components/Icon'
import { AppearanceButton } from '../components/Appearance'
import { LanguageSwitch } from '../components/LanguageSwitch'
import { useApp } from '../lib/store'
import { positionName } from '../lib/core'
import { usePositionColors } from '../lib/theme'
import { t } from '../lib/i18n'

const SearchDialog = lazy(() => import('../components/SearchDialog'))

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-ink no-underline" aria-label={t('Last Things home')}>
      <motion.svg width="34" height="34" viewBox="0 0 64 64" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} aria-hidden>
        <rect width="64" height="64" rx="16" fill="var(--accent)" />
        <motion.path
          d="M18 47h9v-5a15 15 0 1 1 10 0v5h9"
          stroke="var(--accent-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, delay: 0.3 }}
        />
      </motion.svg>
      <span className="leading-none">
        <span className="block text-[17px] font-bold tracking-tight">{t('Last Things')}</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-soft">{t('Views of the end')}</span>
      </span>
    </Link>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const groups = [...new Set(NAV.map((n) => n.group))]
  const saved = useApp((s) => s.bookmarks.length)
  return (
    <nav aria-label={t('Main')} className="space-y-5">
      {groups.map((g) => (
        <div key={g}>
          <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">{NAV_GROUP_LABEL[g] ?? g}</p>
          <ul className="space-y-0.5">
            {NAV.filter((n) => n.group === g).map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold no-underline transition-colors ${isActive ? 'text-accent' : 'text-ink hover:text-accent'}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl bg-surface-2 ring-1 ring-rule" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                      <motion.span className="relative" whileHover={{ scale: 1.2, rotate: -8 }}>
                        <Icon name={n.icon} />
                      </motion.span>
                      <span className="relative">{n.label}</span>
                      {n.to === '/study' && saved > 0 && <span className="relative ml-auto rounded-full bg-accent px-1.5 text-[10px] text-accent-ink">{saved}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left" style={{ scaleX: x, background: 'linear-gradient(90deg, var(--accent), var(--gold-bright), var(--rubric))' }} />
}

function LensChip() {
  const { lensOn, lens } = useApp()
  if (!lensOn) return null
  return (
    <Link to="/settings#lens" className="chip hidden no-underline hover:border-accent md:inline-flex" title={t('Change your My View lens')}>
      <Icon name="star" size={13} className="text-gold" />
      {positionName(lens.millennial, true)} + {positionName(lens.hermeneutic, true)}
    </Link>
  )
}

/** Floating tray of positions queued for comparison (add them from any position card or page). */
function CompareTray() {
  const { compareTray, toggleCompare, clearCompare } = useApp()
  const color = usePositionColors()
  const nav = useNavigate()
  const loc = useLocation()
  if (loc.pathname === '/compare') return null
  return (
    <AnimatePresence>
      {compareTray.length > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="leaf fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-2xl flex-wrap items-center gap-2 p-3 shadow-2xl"
          role="region"
          aria-label={t('Compare tray')}
        >
          <Icon name="layers" className="text-accent" />
          <AnimatePresence initial={false}>
            {compareTray.map((id) => (
              <motion.button layout key={id} type="button" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="chip" style={{ borderColor: color(id).base }} onClick={() => toggleCompare(id)} aria-label={t('Remove {name} from comparison', { name: positionName(id) })}>
                <span aria-hidden className="size-2 rounded-full" style={{ background: color(id).base }} />
                {positionName(id, true)} <Icon name="close" size={11} />
              </motion.button>
            ))}
          </AnimatePresence>
          <div className="ml-auto flex gap-2">
            <button type="button" className="btn min-h-9 py-1 text-sm" onClick={clearCompare}>
              {t('Clear')}
            </button>
            <button type="button" className="btn btn-primary min-h-9 py-1 text-sm" disabled={compareTray.length < 2} onClick={() => nav(`/compare?p=${compareTray.join(',')}`)}>
              {t('Compare {n}', { n: compareTray.length })} <Icon name="arrow" size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false)
  const [search, setSearchRaw] = useState(false)
  const [searchUsed, setSearchUsed] = useState(false)
  const setSearch = (v: boolean) => {
    if (v) setSearchUsed(true)
    setSearchRaw(v)
  }
  const loc = useLocation()
  const tray = useApp((s) => s.compareTray.length)
  const isHome = loc.pathname === '/'
  useEffect(() => setMenu(false), [loc.pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea|select/i.test((e.target as HTMLElement).tagName))) {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-dvh">
      <ScrollProgress />
      <a href="#main" className="btn sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80]">
        {t('Skip to content')}
      </a>

      <aside className="scrollbar-thin fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto border-r border-rule bg-bg/80 px-3 py-5 backdrop-blur-xl lg:block">
        <div className="mb-6 px-2">
          <Logo />
        </div>
        <NavList />
        <p className="mt-8 px-3 text-[11px] leading-relaxed text-ink-soft">
          {t('Every view is written as its own proponents would state it. No view is declared correct; each speaks for itself first.')}
        </p>
      </aside>

      <header className="sticky top-0 z-30 border-b border-rule bg-bg/75 backdrop-blur-xl lg:ml-64">
        <div className="flex h-14 items-center gap-2 px-4">
          <button type="button" className="btn px-2.5 lg:hidden" onClick={() => setMenu(true)} aria-label={t('Open menu')} aria-expanded={menu}>
            <Icon name="menu" />
          </button>
          <div className="lg:hidden">
            <Logo />
          </div>
          <button type="button" onClick={() => setSearch(true)} className="btn ml-auto justify-start whitespace-nowrap text-ink-soft sm:w-80 lg:ml-0" aria-label={t('Search (Ctrl+K)')}>
            <Icon name="search" />
            <span className="hidden sm:inline">{t('Search positions, texts, terms…')}</span>
            <kbd className="chip ml-auto hidden py-0 sm:inline-flex">Ctrl K</kbd>
          </button>
          <div className="flex items-center gap-2 lg:ml-auto">
            <LensChip />
            <LanguageSwitch />
            <AppearanceButton />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} />
            <motion.aside
              className="scrollbar-thin fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-rule bg-bg px-3 py-5 lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              aria-label={t('Menu')}
            >
              <div className="mb-6 flex items-center justify-between px-2">
                <Logo />
                <button type="button" onClick={() => setMenu(false)} aria-label={t('Close menu')}>
                  <Icon name="close" />
                </button>
              </div>
              <NavList onNavigate={() => setMenu(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main id="main" tabIndex={-1} className="outline-none overflow-x-clip lg:ml-64">
        {/* Entry-only page transition: the outgoing route is replaced at once, so no stale content shows. */}
        <motion.div
            key={loc.pathname}
            initial={{ opacity: 0, x: 24, rotateY: -4 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformPerspective: 1600, transformOrigin: 'left center' }}
            className={isHome ? '' : 'px-4 pb-28 pt-8 sm:px-6 lg:px-10'}
          >
            {children}
        </motion.div>
        <footer className="border-t border-rule px-6 py-8 text-center text-xs text-ink-soft">
          {t('Last Things. Every position, reading and argument cites its sources. Bible text: Berean Study Bible, KJV, World English Bible.')}
        </footer>
      </main>

      {loc.pathname !== '/fit' && tray === 0 && (
        <motion.div className="fixed bottom-4 right-4 z-30" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.6 }}>
          <Link to="/fit" className="btn btn-primary rounded-full px-4 py-3 no-underline shadow-xl" aria-label={t('Which view fits me?')}>
            <Icon name="fork" /> <span className="hidden sm:inline">{t('Which view fits me?')}</span>
          </Link>
        </motion.div>
      )}
      <CompareTray />
      {searchUsed && (
        <Suspense fallback={null}>
          <SearchDialog open={search} onClose={() => setSearch(false)} />
        </Suspense>
      )}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label={t('Loading')}>
      <motion.div className="text-accent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}>
        <Icon name="wheel" size={40} />
      </motion.div>
    </div>
  )
}
