import { Link } from 'react-router-dom'
import { t } from '../lib/i18n'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16">
      <h1 className="text-4xl">{t('This page isn’t in the codex')}</h1>
      <p className="mt-3 text-ink-soft">{t('The link may be out of date, or the content may have been renamed.')}</p>
      <Link to="/" className="btn btn-primary ui mt-6 no-underline">
        {t('Back to the overview')}
      </Link>
    </div>
  )
}
