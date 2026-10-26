import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { t } from '../../lib/i18n'
import { Gloss } from '../Gloss'
import { Icon, type IconName } from '../Icon'
import { Refs } from '../Refs'

export type QAItem = { id: string; group: string; q: string; short: string; answer: string; examples: string[]; refs: string[]; other: string }
export type QAGroup = { id: string; title: string; summary: string; icon?: IconName }

const HUES = ['#0f766e', '#be123c', '#1d4ed8', '#b45309', '#7c3aed', '#15803d', '#c2410c', '#0e7490', '#a21caf', '#4d7c0f', '#9f1239', '#1e40af']
export const groupHue = (i: number) => HUES[i % HUES.length]

/** One question: the crisp answer always visible, the full answer, examples and other views one tap away. */
function QACard({ item, hue, open, onToggle }: { item: QAItem; hue: string; open: boolean; onToggle: () => void }) {
  const [tab, setTab] = useState<'answer' | 'examples' | 'other'>('answer')
  return (
    <motion.li layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="leaf overflow-hidden" style={{ borderLeft: `5px solid ${hue}` }}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left">
        <Icon name="question" size={18} className="mt-0.5 shrink-0" style={{ color: hue }} />
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-snug">{item.q}</span>
          <span className="mt-1 block text-[0.95rem] text-ink-soft">
            <Gloss>{item.short}</Gloss>
          </span>
        </span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="mt-1 shrink-0">
          <Icon name="arrow" size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-1.5" role="tablist">
                {(
                  [
                    ['answer', t('Full answer')],
                    ['examples', t('Examples')],
                    ['other', t('Other views')],
                  ] as const
                )
                  .filter(([k]) => k !== 'examples' || item.examples.length > 0)
                  .map(([k, label]) => (
                    <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="chip cursor-pointer" style={tab === k ? { background: hue, color: '#fff', borderColor: hue } : undefined}>
                      {label}
                    </button>
                  ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="mt-3">
                  {tab === 'answer' && (
                    <p className="leading-relaxed">
                      <Gloss>{item.answer}</Gloss>
                    </p>
                  )}
                  {tab === 'examples' && (
                    <ul className="space-y-2">
                      {item.examples.map((e, k) => (
                        <li key={k} className="flex gap-2 rounded-xl bg-surface-2 p-3 text-[0.95rem]">
                          <Icon name="sparkles" size={15} className="mt-0.5 shrink-0" style={{ color: hue }} />
                          <span>
                            <Gloss>{e}</Gloss>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {tab === 'other' && (
                    <p className="rounded-xl bg-surface-2 p-3 leading-relaxed" style={{ borderLeft: '4px solid var(--ink-soft)' }}>
                      <Gloss>{item.other}</Gloss>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
              {item.refs.length > 0 && <Refs refs={item.refs} className="mt-3" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

/**
 * Every question in a study: pick a group (or all), search, open any question.
 * Groups show as a tile map with counts; "surprise me" opens a random question.
 */
export function QAExplorer({ items, groups, group, setGroup }: { items: QAItem[]; groups: QAGroup[]; group: string; setGroup: (g: string) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const idx = useMemo(() => new Map(groups.map((g, i) => [g.id, i])), [groups])
  const q = query.trim().toLowerCase()
  const list = items.filter((x) => (group === 'all' || x.group === group) && (!q || (x.q + ' ' + x.short + ' ' + x.answer + ' ' + x.refs.join(' ')).toLowerCase().includes(q)))
  const cur = groups.find((g) => g.id === group)
  const surprise = () => {
    const pool = group === 'all' ? items : items.filter((x) => x.group === group)
    const pick = pool[Math.floor(Math.random() * pool.length)]
    if (pick) {
      setQuery('')
      setOpen(pick.id)
      setTimeout(() => document.getElementById(`qa-${pick.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
    }
  }
  return (
    <div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <li>
          <button type="button" onClick={() => setGroup('all')} aria-pressed={group === 'all'} className={`flex h-full w-full items-center gap-2 rounded-xl p-3 text-left text-sm ring-1 ${group === 'all' ? 'bg-accent text-[var(--accent-ink)] ring-transparent' : 'ring-rule hover:bg-surface-2'}`}>
            <Icon name="layers" size={16} className="shrink-0" />
            <span className="min-w-0 flex-1 font-bold">{t('All questions')}</span>
            <span className="tabular-nums opacity-80">{items.length}</span>
          </button>
        </li>
        {groups.map((g, i) => {
          const n = items.filter((x) => x.group === g.id).length
          const on = g.id === group
          return (
            <motion.li key={g.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 8) * 0.03 }}>
              <button type="button" onClick={() => setGroup(g.id)} aria-pressed={on} className={`flex h-full w-full items-center gap-2 rounded-xl p-3 text-left text-sm ring-1 ${on ? 'text-white ring-transparent' : 'ring-rule hover:bg-surface-2'}`} style={on ? { background: groupHue(i) } : undefined}>
                <Icon name={g.icon ?? 'question'} size={16} className="shrink-0" style={on ? undefined : { color: groupHue(i) }} />
                <span className="min-w-0 flex-1 font-semibold leading-snug">{g.title}</span>
                <span className="tabular-nums opacity-80">{n}</span>
              </button>
            </motion.li>
          )
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 ring-1 ring-rule">
          <Icon name="search" size={16} className="shrink-0 text-ink-soft" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search the questions and answers…')} className="min-w-0 flex-1 bg-transparent outline-none" aria-label={t('Search the questions and answers…')} />
        </label>
        <button type="button" className="btn" onClick={surprise}>
          <Icon name="shuffle" size={15} /> {t('Surprise me')}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {cur && (
          <motion.div key={cur.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl p-4" style={{ background: `color-mix(in srgb, ${groupHue(idx.get(cur.id) ?? 0)} 10%, var(--surface))` }}>
            <h3 className="text-lg font-bold" style={{ color: groupHue(idx.get(cur.id) ?? 0) }}>
              {cur.title}
            </h3>
            <p className="mt-1 text-[0.95rem]">
              <Gloss>{cur.summary}</Gloss>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-3 text-sm text-ink-soft">{t('{n} questions shown', { n: list.length })}</p>
      <ul className="mt-2 space-y-2">
        {list.map((x) => (
          <div key={x.id} id={`qa-${x.id}`} className="scroll-mt-24">
            <QACard item={x} hue={groupHue(idx.get(x.group) ?? 0)} open={open === x.id} onToggle={() => setOpen(open === x.id ? null : x.id)} />
          </div>
        ))}
      </ul>
    </div>
  )
}
