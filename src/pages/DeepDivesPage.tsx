import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV } from '../app/nav'
import { Dive } from '../components/DeepDives'
import { Icon } from '../components/Icon'
import { deepDives } from '../lib/data/deepDives'
import { t } from '../lib/i18n'

/** Study keys used in deep-dive topics, mapped to their pages. */
const ROUTE: Record<string, string> = { fulfilled: '/fulfilled', judgments: '/judgments', dating: '/dating', warnings: '/warnings', hope: '/kingdom-hope', claims: '/objections', israel: '/israel', rapture: '/rapture', 'israel-history': '/israel-history', olivet: '/olivet', 'new-creation': '/new-creation' }
const label = (k: string) => NAV.find((n) => n.to === ROUTE[k])?.label ?? k

/** Every deep dive in one place, filterable by the study it belongs to. */
export default function DeepDivesPage() {
  const topics = [...new Set(deepDives.flatMap((d) => d.topics))]
  const [f, setF] = useState('all')
  const list = deepDives.filter((d) => f === 'all' || d.topics.includes(f))
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('One argument at a time')}</p>
      <motion.h1 className="mt-2 text-4xl font-bold sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        {t('Deep dives')}
      </motion.h1>
      <p className="mt-3 max-w-[65ch] text-[1.05rem] text-ink-soft">{t('Each deep dive takes one claim and walks it step by step through Scripture and history, then shows the other side and the conclusion. They also appear inside the studies they belong to.')}</p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        <button type="button" className="chip cursor-pointer" aria-pressed={f === 'all'} onClick={() => setF('all')} style={f === 'all' ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
          {t('All')} {deepDives.length}
        </button>
        {topics.map((k) => (
          <button key={k} type="button" className="chip cursor-pointer" aria-pressed={f === k} onClick={() => setF(k)} style={f === k ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : undefined}>
            {label(k)} {deepDives.filter((d) => d.topics.includes(k)).length}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {list.map((d) => (
          <motion.div key={d.id} layout>
            <Dive d={d} startOpen={false} />
            <p className="mt-1 flex flex-wrap gap-2 px-2 text-xs text-ink-soft">
              <Icon name="book" size={12} />
              {d.topics.map((k) => (
                <Link key={k} to={ROUTE[k] ?? '/'} className="underline-offset-2">
                  {label(k)}
                </Link>
              ))}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
