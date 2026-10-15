import { refLabel } from '../lib/refLabel'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Sources } from '../components/Sources'
import { Section, ProgressBar } from '../components/studies/Section'
import { StonesHero } from '../components/studies/StonesHero'
import { ViewReadings } from '../components/studies/ViewReadings'
import { t } from '../lib/i18n'
import { olivet } from '../lib/data/studies'
import { useApp } from '../lib/store'

const SIDE = {
  ad70: { label: () => t('Points to AD 70'), color: 'var(--rubric)' },
  future: { label: () => t('Points to the future'), color: 'var(--accent)' },
  both: { label: () => t('Read both ways'), color: 'var(--gold)' },
} as const

/** Walks the discourse one unit at a time, with each view's reading and the historical evidence. */
function DiscourseWalk() {
  const o = olivet!
  const lens = useApp((s) => s.lens.hermeneutic)
  const [i, setI] = useState(0)
  const u = o.units[i]
  return (
    <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <ol className="scroll-x flex gap-1.5 lg:max-h-[75vh] lg:flex-col lg:overflow-y-auto lg:pr-1" aria-label={t('Units of the discourse')}>
        {o.units.map((x, j) => (
          <li key={x.id} className="shrink-0">
            <button type="button" onClick={() => setI(j)} aria-current={j === i} className={`w-56 rounded-xl px-3 py-2 text-left text-sm transition-colors lg:w-full ${j === i ? 'bg-accent text-[var(--accent-ink)]' : 'hover:bg-surface-2'}`}>
              <span className="block text-xs font-bold opacity-80">{refLabel(x.ref)}</span>
              <span className="block font-semibold leading-snug">{x.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="min-w-0">
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[var(--gold-bright)] to-[var(--accent)]" animate={{ width: `${((i + 1) / o.units.length) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.article key={u.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="leaf p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              {refLabel(u.ref)}
              {u.parallels.length > 0 && <span className="ml-2 font-semibold normal-case tracking-normal text-ink-soft">{t('Parallels: {refs}', { refs: refLabel(u.parallels.join('; ')) })}</span>}
            </p>
            <h3 className="text-2xl font-bold">{u.title}</h3>
            <p className="mt-2 leading-relaxed">
              <Gloss>{u.summary}</Gloss>
            </p>
            <div className="mt-4 rounded-xl bg-surface-2 p-4 text-[0.95rem]">
              <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('First-century setting')}</p>
              <p className="mt-1">
                <Gloss>{u.context}</Gloss>
              </p>
            </div>
            <p className="mt-4 rounded-xl border border-dashed border-[var(--gold)] p-3 text-[0.95rem]">
              <span className="font-bold">{t('Key issue:')} </span>
              <Gloss>{u.keyIssue}</Gloss>
            </p>
            <h4 className="mt-5 font-bold">{t('How the views read it')}</h4>
            <div className="mt-2">
              <ViewReadings key={u.id} readings={u.readings} initial={lens} />
            </div>
            {u.evidence.length > 0 && (
              <>
                <h4 className="mt-5 font-bold">{t('The evidence')}</h4>
                <ul className="mt-2 grid gap-2 md:grid-cols-2">
                  {u.evidence.map((e, k) => (
                    <motion.li key={e.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + k * 0.06 }} className="rounded-xl p-3 text-sm ring-1 ring-rule" style={{ borderTop: `3px solid ${SIDE[e.side].color}` }}>
                      <p className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: SIDE[e.side].color }}>
                        {SIDE[e.side].label()}
                      </p>
                      <p className="font-bold">{e.title}</p>
                      <p className="mt-1">
                        <Gloss>{e.text}</Gloss>
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">{e.source}</p>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button type="button" className="btn text-sm" disabled={i === 0} onClick={() => setI(i - 1)}>
                {t('Previous')}
              </button>
              <button type="button" className="btn btn-primary text-sm" disabled={i === o.units.length - 1} onClick={() => setI(i + 1)}>
                {t('Next')} <Icon name="arrow" size={14} />
              </button>
              <span className="ml-auto text-xs text-ink-soft">{t('{n} of {total}', { n: i + 1, total: o.units.length })}</span>
              <Sources ids={u.sources} />
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** AD 30–73 on one axis; plays through the events. */
function WarTimeline() {
  const o = olivet!
  const ev = [...o.timeline].sort((a, b) => a.year - b.year)
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  useEffect(() => {
    if (!play) return
    if (i >= ev.length - 1) return setPlay(false)
    const id = setTimeout(() => setI(i + 1), 2200)
    return () => clearTimeout(id)
  }, [play, i, ev.length])
  const y0 = ev[0].year
  const y1 = ev.at(-1)!.year
  const x = (y: number) => 30 + ((y - y0) / Math.max(1, y1 - y0)) * 940
  const e = ev[i]
  return (
    <div className="leaf p-4">
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-primary text-sm" onClick={() => (i >= ev.length - 1 && setI(0), setPlay((v) => !v))}>
          <Icon name={play ? 'pause' : 'play'} size={14} /> {play ? t('Pause') : t('Play AD 30–73')}
        </button>
      </div>
      <svg viewBox="0 0 1000 110" className="mt-3 h-auto w-full" role="group" aria-label={t('Timeline from the prophecy to the fall of Jerusalem')}>
        <line x1={30} x2={970} y1={60} y2={60} stroke="var(--rule)" strokeWidth={3} strokeLinecap="round" />
        <motion.line x1={30} y1={60} y2={60} stroke="var(--rubric)" strokeWidth={4} strokeLinecap="round" animate={{ x2: x(e.year) }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} />
        {[30, 40, 50, 60, 70].filter((y) => y >= y0 && y <= y1).map((y) => (
          <text key={y} x={x(y)} y={100} textAnchor="middle" fontSize={14} fill="var(--ink-soft)">
            {t('AD {y}', { y })}
          </text>
        ))}
        {ev.map((v, j) => (
          <g key={j} className="cursor-pointer" onClick={() => (setI(j), setPlay(false))}>
            <motion.circle cx={x(v.year)} cy={60} animate={{ r: j === i ? 11 : 7 }} fill={j <= i ? 'var(--rubric)' : 'var(--surface)'} stroke="var(--rubric)" strokeWidth={2.5} />
            {j === i && <motion.circle cx={x(v.year)} cy={60} r={11} fill="none" stroke="var(--gold-bright)" strokeWidth={2} initial={{ scale: 1, opacity: 1 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity }} style={{ transformOrigin: `${x(v.year)}px 60px` }} />}
          </g>
        ))}
        <motion.text key={i} x={Math.min(900, Math.max(100, x(e.year)))} y={30} textAnchor="middle" fontSize={16} fontWeight={800} fill="var(--ink)" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {e.label}
        </motion.text>
      </svg>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 rounded-xl bg-surface-2 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-rubric">{t('AD {y}', { y: e.year })}</p>
          <p className="font-bold">{e.label}</p>
          <p className="mt-1">
            <Gloss>{e.text}</Gloss>
          </p>
          <p className="mt-1 text-xs text-ink-soft">{e.source}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Olivet() {
  const lens = useApp((s) => s.lens.hermeneutic)
  const [ctx, setCtx] = useState<string | null>(null)
  const [rel, setRel] = useState<string | null>(null)
  if (!olivet) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const o = olivet
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t('Matthew 24 · Mark 13 · Luke 21')}</p>
          <motion.h1 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {t('The Olivet Discourse')}
          </motion.h1>
          <Prose text={o.intro} className="mt-4 text-[1.05rem]" />
          <nav aria-label={t('On this page')} className="mt-5 flex flex-wrap gap-2 text-sm">
            {([
              ['setting', t('The setting')],
              ['questions', t('The questions')],
              ['discourse', t('Verse by verse')],
              ['history', t('AD 30–73')],
              ['fulfilments', t('Prophecy and history')],
              ['generation', t('“This generation”')],
              ['related', t('Related passages')],
            ] as const).map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip no-underline hover:border-accent">
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="leaf p-3">
          <StonesHero />
        </div>
      </section>

      <Section id="setting" title={t('The world Jesus was speaking to')} lede={t('Who heard these words, what they could see from the Mount of Olives, and how the next forty years unfolded.')}>
        <ul className="grid gap-3 md:grid-cols-2">
          {o.context.map((c, i) => {
            const open = ctx === c.id
            return (
              <motion.li key={c.id} layout initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }} className={`leaf glow-card p-4 ${open ? 'md:col-span-2' : ''}`}>
                <button type="button" aria-expanded={open} onClick={() => setCtx(open ? null : c.id)} className="flex w-full items-center justify-between gap-3 text-left">
                  <span className="text-lg font-bold">{c.title}</span>
                  <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-accent">
                    <Icon name="plus" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <Prose text={c.text} className="mt-2" />
                      {c.refs.length > 0 && <p className="mt-2 text-sm text-ink-soft">{refLabel(c.refs.join('; '))}</p>}
                      <div className="mt-2">
                        <Sources ids={c.sources} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!open && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{c.text}</p>}
              </motion.li>
            )
          })}
        </ul>
      </Section>

      <Section id="questions" title={t('Three questions, one answer?')} lede={t('The disciples asked about the temple, the sign of Jesus’ coming and the end of the age. How the views divide the discourse depends on how those questions relate.')}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <p className="mb-3 text-[0.95rem]">
              <Gloss>{o.questions.text}</Gloss>
            </p>
            <ol className="space-y-2">
              {o.questions.items.map((q, i) => (
                <motion.li key={q.ref + i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex items-start gap-3 rounded-2xl bg-surface-2 p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-[var(--accent-ink)]">{i + 1}</span>
                  <span>
                    <span className="block font-semibold">{q.q}</span>
                    <span className="text-xs text-ink-soft">{refLabel(q.ref)}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
          <div className="leaf p-4">
            <ViewReadings readings={o.questions.mappings} initial={lens} />
          </div>
        </div>
      </Section>

      <Section id="discourse" title={t('Matthew 24 verse by verse')} lede={t('Step through the discourse. For each unit read the first-century setting, the key issue, every view’s reading and the evidence each side offers.')}>
        <DiscourseWalk />
      </Section>

      <Section id="history" title={t('From the Mount of Olives to the fall of Jerusalem')} lede={t('The forty years between the prophecy and AD 70, with the ancient sources for each event.')}>
        <WarTimeline />
      </Section>

      <Section id="fulfilments" title={t('Prophecy and history side by side')} lede={t('What Jesus said, and what Josephus, Tacitus and others record. Notes mark where scholars dispute the match.')}>
        <ol className="space-y-3">
          {o.fulfilments.map((f, i) => (
            <motion.li key={f.prophecy + i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: (i % 3) * 0.06 }} className="grid items-stretch gap-2 md:grid-cols-[1fr_3.5rem_1fr]">
              <div className="leaf p-3" style={{ borderLeft: '4px solid var(--accent)' }}>
                <p className="text-xs font-bold text-accent">{refLabel(f.prophecy)}</p>
                <p className="font-semibold">{f.prophecyText}</p>
              </div>
              <div className="hidden items-center justify-center md:flex" aria-hidden>
                <svg viewBox="0 0 56 24" className="w-full">
                  <motion.path d="M4,12 H44 M36,5 L48,12 L36,19" fill="none" stroke="var(--gold-bright)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} />
                </svg>
              </div>
              <div className="leaf p-3" style={{ borderLeft: '4px solid var(--rubric)' }}>
                <p className="text-xs font-bold text-rubric">
                  {f.year} · {f.source}
                </p>
                <p className="font-semibold">{f.event}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  <Gloss>{f.note}</Gloss>
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Section>

      <Section id="generation" title={t('“This generation will not pass away”')} lede={t('Matthew 24:34 is the hinge of the whole debate. How Matthew uses the phrase elsewhere, and how each view answers.')}>
        <Prose text={o.generation.text} className="max-w-[75ch]" />
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {o.generation.uses.map((u, i) => (
            <motion.li key={u.ref} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-surface-2 p-3 text-sm">
              <p className="font-bold text-accent">{refLabel(u.ref)}</p>
              <p>{u.text}</p>
            </motion.li>
          ))}
        </ul>
        <div className="leaf mt-4 p-4">
          <ViewReadings readings={o.generation.readings} initial={lens} />
        </div>
      </Section>

      <Section id="related" title={t('Related passages in the Gospels')} lede={t('Other sayings with a time element, read through each view.')}>
        <div className="divide-y divide-rule border-y border-rule">
          {o.related.map((r) => {
            const open = rel === r.id
            return (
              <div key={r.id}>
                <button type="button" aria-expanded={open} onClick={() => setRel(open ? null : r.id)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
                  <span>
                    <span className="block text-xs font-bold text-accent">{refLabel(r.ref)}</span>
                    <span className="text-lg font-bold">{r.title}</span>
                  </span>
                  <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-accent">
                    <Icon name="plus" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pb-5">
                        <Prose text={r.text} className="mb-3" />
                        <ViewReadings readings={r.readings} initial={lens} />
                        <div className="mt-2">
                          <Sources ids={r.sources} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/signs" className="btn btn-primary no-underline">
            <Icon name="hourglass" /> {t('Signs of the times through history')}
          </Link>
          <Link to="/dating" className="btn no-underline">
            <Icon name="scroll" /> {t('When was Revelation written?')}
          </Link>
          <Sources ids={o.sources} />
        </div>
      </Section>
    </div>
  )
}
