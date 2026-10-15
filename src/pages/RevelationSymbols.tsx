import { motion } from 'framer-motion'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { chapters } from '../lib/data/revelation'
import { CATEGORY_LABEL } from './RevelationChapter'
import { t } from '../lib/i18n'

export default function RevelationSymbols() {
  const all = useMemo(() => chapters.flatMap((c) => c.symbols.map((s) => ({ ...s, chapter: c.chapter }))), [])
  const fuse = useMemo(() => new Fuse(all, { keys: [{ name: 'phrase', weight: 3 }, 'meaning', 'jewish', 'cultural', 'keywords'], threshold: 0.32, ignoreLocation: true }), [all])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const list = (q.trim() ? fuse.search(q).map((r) => r.item) : all).filter((s) => !cat || s.category === cat)
  const cats = [...new Set(all.map((s) => s.category))].sort()
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={t('Phrases and images of Revelation')}
        lede={t('An index of all {n} phrases, numbers, colours, creatures and places in the study. Search by word or theme. Each entry opens in its chapter with its Jewish background, cultural context and readings.', { n: all.length })}
      />
      <div className="flex flex-wrap items-end gap-4">
        <label className="block w-full max-w-md text-sm text-ink-soft">
          {t('Search')}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('lampstand, Babylon, 666, white stone, Ezekiel…')} className="mt-1 block w-full rounded-xl border border-rule bg-surface px-3 py-2.5 text-base text-ink" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label={t('Filter by kind')}>
        <button type="button" className="chip cursor-pointer" aria-pressed={!cat} style={!cat ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined} onClick={() => setCat('')}>
          {t('All kinds')}
        </button>
        {cats.map((k) => (
          <button key={k} type="button" className="chip cursor-pointer" aria-pressed={cat === k} style={cat === k ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined} onClick={() => setCat(k)}>
            {CATEGORY_LABEL[k] ?? k}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-soft">{t('{n} shown', { n: list.length })}</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, 240).map((s, i) => (
          <motion.li key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.025 }}>
            <Link to={`/revelation/${s.chapter}#sym-${s.id}`} className="leaf glow-card block h-full p-4 text-ink no-underline transition-transform hover:-translate-y-0.5 hover:border-accent">
              <span className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                <span>{CATEGORY_LABEL[s.category] ?? s.category}</span>
                <span className="tabular-nums">{s.ref.replace('Revelation ', 'Rev ')}</span>
              </span>
              <span className="mt-1 block font-bold leading-snug">{s.phrase}</span>
              <span className="mt-1 line-clamp-3 text-sm text-ink-soft">{s.meaning}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
      {list.length > 240 && <p className="mt-4 text-sm text-ink-soft">{t('Showing the first 240. Narrow the search to see more.')}</p>}
      {list.length === 0 && <p className="mt-6 text-ink-soft">{t('No entries match. Try a shorter word, or clear the filter.')}</p>}
    </div>
  )
}
