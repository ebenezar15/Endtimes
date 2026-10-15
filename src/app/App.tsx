import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { PageLoader, Shell } from './Shell'
import { useReducedMotion, useThemeEffect } from '../lib/theme'
import Home from '../pages/Home'

const Positions = lazy(() => import('../pages/Positions'))
const PositionPage = lazy(() => import('../pages/PositionPage'))
const Compare = lazy(() => import('../pages/Compare'))
const Fit = lazy(() => import('../pages/Fit'))
const Timelines = lazy(() => import('../pages/Timelines'))
const Passages = lazy(() => import('../pages/Passages'))
const PassagePage = lazy(() => import('../pages/PassagePage'))
const Arena = lazy(() => import('../pages/Arena'))
const ArenaPage = lazy(() => import('../pages/ArenaPage'))
const Library = lazy(() => import('../pages/Library'))
const Glossary = lazy(() => import('../pages/Glossary'))
const Study = lazy(() => import('../pages/Study'))
const Settings = lazy(() => import('../pages/Settings'))
const Revelation = lazy(() => import('../pages/Revelation'))
const RevelationChapter = lazy(() => import('../pages/RevelationChapter'))
const RevelationSymbols = lazy(() => import('../pages/RevelationSymbols'))
const Spiritual = lazy(() => import('../pages/Spiritual'))
const NotFound = lazy(() => import('../pages/NotFound'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

export function App() {
  useThemeEffect()
  const reduce = useReducedMotion()
  return (
    <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Shell>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/positions/:id" element={<PositionPage />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/fit" element={<Fit />} />
              <Route path="/timelines" element={<Timelines />} />
              <Route path="/passages" element={<Passages />} />
              <Route path="/passages/:id" element={<PassagePage />} />
              <Route path="/arena" element={<Arena />} />
              <Route path="/arena/:id" element={<ArenaPage />} />
              <Route path="/library" element={<Library />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/study" element={<Study />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/revelation" element={<Revelation />} />
              <Route path="/spiritual" element={<Spiritual />} />
              <Route path="/revelation/symbols" element={<RevelationSymbols />} />
              <Route path="/revelation/:n" element={<RevelationChapter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Shell>
      </HashRouter>
    </MotionConfig>
  )
}
