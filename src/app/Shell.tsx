import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV } from './nav'
import { SearchDialog } from '../components/SearchDialog'
import { useApp } from '../lib/store'
import { positionName } from '../lib/content'

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-ink no-underline">
      <span aria-hidden className="illum size-9 text-2xl" style={{ fontFamily: 'Alegreya, serif', ['--illum-color' as string]: '#1f2d5c', color: '#e7c868' }}>
        Ω
      </span>
      <span className="leading-tight">
        <span className="block font-serif text-xl font-medium">Last Things</span>
        <span className="ui block text-xs text-ink-soft">A study of Christian eschatology</span>
      </span>
    </Link>
  )
}

function LensChip() {
  const { lensOn, lens } = useApp()
  if (!lensOn) return null
  return (
    <Link to="/settings#lens" className="chip no-underline hover:border-accent" title="Change your My View lens">
      <span aria-hidden className="text-gold">✦</span>
      My view: {positionName(lens.millennial, true)} + {positionName(lens.hermeneutic, true)}
    </Link>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const loc = useLocation()
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

  const nav = (
    <nav aria-label="Main" className="ui">
      <ul className="space-y-0.5">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `group flex flex-col rounded-md border-l-[3px] px-3 py-1.5 no-underline transition-colors ${
                  isActive ? 'border-rubric bg-surface-2 text-ink' : 'border-transparent text-ink hover:bg-surface-2/60'
                }`
              }
            >
              <span className="font-serif text-[1.05rem]">{n.label}</span>
              <span className="text-xs text-ink-soft">{n.hint}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 btn">
        Skip to content
      </a>

      {/* Desktop margin column */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-5 overflow-y-auto border-r border-rule px-4 py-5 lg:flex">
        <Brand />
        <button type="button" className="btn ui justify-between text-ink-soft" onClick={() => setSearch(true)}>
          <span className="flex items-center gap-2">
            <SearchIcon /> Search
          </span>
          <kbd className="text-xs">Ctrl K</kbd>
        </button>
        {nav}
        <p className="ui mt-auto text-xs leading-relaxed text-ink-soft">
          Every view is written as its own proponents would state it. Sources are cited on every card.
        </p>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-rule bg-bg/95 px-4 py-2 backdrop-blur lg:hidden">
        <Brand />
        <div className="flex gap-1.5">
          <button type="button" className="btn px-2.5" aria-label="Search" onClick={() => setSearch(true)}>
            <SearchIcon />
          </button>
          <button type="button" className="btn px-2.5" aria-label="Menu" aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </header>
      {menu && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-[57px] z-20 overflow-y-auto bg-bg px-4 py-4 lg:hidden">
          {nav}
        </div>
      )}

      <div className="min-w-0">
        <div className="flex justify-end px-4 pt-3 md:px-8">
          <LensChip />
        </div>
        <main id="main" tabIndex={-1} className="px-4 pb-24 pt-2 outline-none md:px-8">
          {children}
        </main>
      </div>
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </div>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}
