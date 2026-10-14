import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16">
      <h1 className="text-4xl">This page isn’t in the codex</h1>
      <p className="mt-3 text-ink-soft">The link may be out of date, or the content may have been renamed.</p>
      <Link to="/" className="btn btn-primary ui mt-6 no-underline">
        Back to the overview
      </Link>
    </div>
  )
}
