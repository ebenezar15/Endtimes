import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/index.css'
import { LANG } from './lib/lang'
import { loadStrings } from './lib/i18n'

registerSW({ immediate: true })
document.documentElement.lang = LANG

// The interface dictionary must be in place before any module that calls t() at load time.
await loadStrings()
const { App } = await import('./app/App')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
