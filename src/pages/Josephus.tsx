import { refLabel } from '../lib/refLabel'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { JosephusStory } from '../content/schema'
import { Gloss, Prose } from '../components/Gloss'
import { Icon } from '../components/Icon'
import { Sources } from '../components/Sources'
import { JerusalemMap } from '../components/studies/JerusalemMap'
import { PortentIcon } from '../components/studies/Portent'
import { ProgressBar, Section } from '../components/studies/Section'
import { t } from '../lib/i18n'
import { josephus } from '../lib/data/studies'

type Scene = JosephusStory['scenes'][number]
const SIDE = {
  roman: { label: () => t('Roman'), color: 'var(--rubric)' },
  jewish: { label: () => t('Jewish'), color: 'var(--accent)' },
  christian: { label: () => t('Christian'), color: 'var(--gold)' },
  other: { label: () => t('Other'), color: 'var(--ink-soft)' },
} as const

/** One scene of the story; reports when it reaches the middle of the screen. */
function SceneCard({ s, i, onActive, active }: { s: Scene; i: number; onActive: (i: number) => void; active: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && onActive(i)), { rootMargin: '-45% 0px -45% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [i, onActive])
  return (
    <article ref={ref} id={`scene-${s.id}`} className="flex min-h-[70vh] scroll-mt-24 items-center py-6 lg:min-h-[85vh]">
      <motion.div animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.97 }} transition={{ duration: 0.4 }} className="leaf w-full p-5" style={{ borderLeft: `5px solid ${active ? 'var(--rubric)' : 'var(--rule)'}` }}>
        <p className="text-xs font-bold uppercase tracking-widest text-rubric">
          {s.date} · {s.place}
        </p>
        <h3 className="mt-1 text-2xl font-bold leading-tight">{s.title}</h3>
        <Prose text={s.narrative} className="mt-3" />
        <div className="mt-4 space-y-3">
          {s.quotes.map((q, k) => (
            <motion.blockquote key={k} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + k * 0.1 }} className="relative rounded-xl bg-surface-2 p-4 pl-10">
              <span aria-hidden className="absolute left-3 top-1 font-serif text-5xl leading-none text-gold">“</span>
              <p className="font-serif text-lg italic leading-snug">{q.text}</p>
              <footer className="mt-1 text-xs font-bold text-ink-soft">— {q.cite.includes(t('Josephus')) ? q.cite : `${t('Josephus')}, ${q.cite}`}</footer>
            </motion.blockquote>
          ))}
        </div>
        {s.prophecy.length > 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-[var(--accent)] p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{t('Gospel sayings readers link to this')}</p>
            <ul className="mt-1 space-y-1 text-sm">
              {s.prophecy.map((p) => (
                <li key={p.ref}>
                  <span className="font-bold">{refLabel(p.ref)}</span> — {p.text}
                </li>
              ))}
            </ul>
          </div>
        )}
        {s.sources.length > 0 && (
          <div className="mt-3">
            <Sources ids={s.sources} />
          </div>
        )}
      </motion.div>
    </article>
  )
}

/** The scroll-driven story: scenes on one side, the map on the other, a year scrubber above. */
function Story({ scenes }: { scenes: Scene[] }) {
  const [i, setI] = useState(0)
  const s = scenes[i]
  const y0 = Math.floor(scenes[0].at)
  const y1 = Math.ceil(scenes.at(-1)!.at)
  const go = (k: number) => document.getElementById(`scene-${scenes[k].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="order-2 lg:order-1">
        {scenes.map((x, k) => (
          <SceneCard key={x.id} s={x} i={k} onActive={setI} active={k === i} />
        ))}
      </div>
      <div className="sticky top-14 z-10 order-1 self-start bg-bg/90 pb-2 backdrop-blur lg:top-20 lg:order-2 lg:bg-transparent lg:pb-0 lg:backdrop-blur-none">
        <div className="space-y-2">
          {/* year scrubber */}
          <div className="leaf hidden p-3 sm:block">
            <div className="relative h-8">
              <div className="absolute left-2 right-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-rule" />
              <motion.div className="absolute left-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-rubric" animate={{ width: `calc(${((s.at - y0) / (y1 - y0)) * 100}% - 1rem)` }} />
              {scenes.map((x, k) => (
                <button key={x.id} type="button" onClick={() => go(k)} title={x.title} aria-label={`${x.date}: ${x.title}`} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `calc(0.5rem + (100% - 1rem) * ${(x.at - y0) / (y1 - y0)})` }}>
                  <motion.span className="block rounded-full border-2 border-[var(--rubric)]" animate={{ width: k === i ? 16 : 10, height: k === i ? 16 : 10, backgroundColor: k <= i ? 'var(--rubric)' : 'var(--surface)' }} />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>{t('AD {y}', { y: y0 })}</span>
              <AnimatePresence mode="wait">
                <motion.span key={s.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-bold text-ink">
                  {s.date}
                </motion.span>
              </AnimatePresence>
              <span>{t('AD {y}', { y: y1 })}</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[min(100%,40vh)] lg:max-w-none">
            <JerusalemMap state={s.map} caption={s.title} />
          </div>
          <div className="hidden gap-2 lg:flex">
            <button type="button" className="btn text-sm" disabled={i === 0} onClick={() => go(i - 1)}>
              {t('Previous')}
            </button>
            <button type="button" className="btn btn-primary text-sm" disabled={i === scenes.length - 1} onClick={() => go(i + 1)}>
              {t('Next scene')} <Icon name="arrow" size={14} />
            </button>
            <span className="ml-auto self-center text-xs text-ink-soft">{t('{n} of {total}', { n: i + 1, total: scenes.length })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Each dot is a fixed number of people; the dots fill in when the chart scrolls into view. */
function Numbers({ items }: { items: JosephusStory['numbers'] }) {
  const max = Math.max(...items.map((n) => n.value))
  const unit = max > 200000 ? 10000 : max > 20000 ? 1000 : 100
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((n, k) => {
        const dots = Math.max(1, Math.round(n.value / unit))
        return (
          <motion.div key={n.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (k % 2) * 0.08 }} className="leaf p-4">
            <p className="font-serif text-4xl font-bold text-rubric">{n.display}</p>
            <p className="font-bold">{n.label}</p>
            {dots <= 130 && n.value >= unit && (
              <div className="mt-2 flex flex-wrap gap-[3px]" aria-hidden>
                {Array.from({ length: dots }, (_, d) => (
                  <motion.span key={d} className="size-2 rounded-full bg-rubric" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: d * 0.012 }} />
                ))}
              </div>
            )}
            {dots <= 130 && n.value >= unit && <p className="mt-1 text-[0.7rem] text-ink-soft">{t('Each dot: {n} people', { n: unit.toLocaleString() })}</p>}
            <p className="mt-2 text-sm text-ink-soft">
              <span className="font-semibold">{n.cite}.</span> <Gloss>{n.note}</Gloss>
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function Josephus() {
  const [flipped, setFlipped] = useState<string | null>(null)
  const [side, setSide] = useState<'all' | keyof typeof SIDE>('all')
  if (!josephus) return <p className="text-ink-soft">{t('This study is being written.')}</p>
  const j = josephus
  const scenes = [...j.scenes].sort((a, b) => a.at - b.at)
  return (
    <div className="mx-auto max-w-6xl">
      <ProgressBar />
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10" style={{ background: 'radial-gradient(ellipse at 70% 20%, color-mix(in srgb, var(--rubric) 22%, transparent), transparent 60%), radial-gradient(ellipse at 10% 90%, color-mix(in srgb, var(--gold-bright) 20%, transparent), transparent 60%)' }}>
        {/* drifting embers */}
        {Array.from({ length: 18 }, (_, k) => (
          <motion.span key={k} aria-hidden className="absolute size-1.5 rounded-full bg-[var(--gold-bright)]" style={{ left: `${(k * 53) % 100}%`, bottom: -10 }} animate={{ y: [-10, -420], opacity: [0, 1, 0] }} transition={{ duration: 6 + (k % 5), repeat: Infinity, delay: k * 0.45, ease: 'easeOut' }} />
        ))}
        <p className="relative text-xs font-bold uppercase tracking-[0.3em] text-rubric">{t('AD 66–73 · an eyewitness account')}</p>
        <motion.h1 className="relative mt-2 text-4xl font-bold leading-[1.05] sm:text-6xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          {t('Josephus and the fall of Jerusalem')}
        </motion.h1>
        <Prose text={j.intro} className="relative mt-4 max-w-[70ch] text-[1.05rem]" />
        <div className="relative mt-5 flex flex-wrap gap-2 text-sm">
          <a href="#story" onClick={(e) => (e.preventDefault(), document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' }))} className="btn btn-primary no-underline">
            <Icon name="play" size={14} /> {t('Begin the story')}
          </a>
          {(
            [
              ['portents', t('The omens')],
              ['figures', t('Who’s who')],
              ['numbers', t('The numbers')],
              ['reading', t('Reading Josephus well')],
            ] as const
          ).map(([id, l]) => (
            <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))} className="chip no-underline hover:border-accent">
              {l}
            </a>
          ))}
        </div>
      </section>

      <Section id="about" title={t('Who was Josephus?')}>
        <div className="leaf p-5">
          <Prose text={j.about} />
        </div>
      </Section>

      <Section id="story" title={t('The war, scene by scene')} lede={t('Scroll through the story. The map follows: Roman camps appear, walls fall, the siege wall closes round the city and the temple burns.')}>
        <Story scenes={scenes} />
      </Section>

      <Section id="portents" title={t('Omens before the fall')} lede={t('Josephus lists signs that he says the people misread. Tap a card to read his words.')}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {j.portents.map((p, i) => {
            const open = flipped === p.id
            return (
              <motion.li key={p.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.07 }}>
                <button type="button" onClick={() => setFlipped(open ? null : p.id)} aria-expanded={open} className="block h-full w-full text-left [perspective:900px]">
                  <motion.div animate={{ rotateY: open ? 180 : 0 }} transition={{ duration: 0.55 }} className="grid h-full [transform-style:preserve-3d]">
                    <div className="leaf glow-card col-start-1 row-start-1 p-4 [backface-visibility:hidden]">
                      <PortentIcon icon={p.icon} />
                      <p className="mt-2 font-bold">{p.title}</p>
                      <p className="mt-1 text-xs text-accent">{t('Tap for Josephus’ words')}</p>
                    </div>
                    <div className="leaf col-start-1 row-start-1 overflow-auto p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="font-serif text-[0.95rem] italic leading-snug">“{p.quote}”</p>
                      <p className="mt-1 text-xs font-bold text-ink-soft">{p.cite}</p>
                      <p className="mt-2 text-xs text-ink-soft">
                        <Gloss>{p.note}</Gloss>
                      </p>
                    </div>
                  </motion.div>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </Section>

      <Section id="figures" title={t('Who’s who')} lede={t('The people of the war, Roman, Jewish and Christian.')}>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(['all', 'roman', 'jewish', 'christian', 'other'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setSide(k)} className={`chip cursor-pointer ${side === k ? 'border-accent text-accent' : ''}`}>
              {k === 'all' ? t('Everyone') : SIDE[k].label()}
            </button>
          ))}
        </div>
        <motion.ul layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {j.figures.filter((f) => side === 'all' || f.side === side).map((f) => (
              <motion.li key={f.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="leaf flex gap-3 p-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl font-serif text-2xl font-bold text-[var(--surface)]" style={{ background: SIDE[f.side].color }}>
                  {f.name.trim().charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold leading-tight">{f.name}</span>
                  <span className="block text-xs font-semibold" style={{ color: SIDE[f.side].color }}>
                    {f.role}
                  </span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    <Gloss>{f.text}</Gloss>
                  </span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </Section>

      <Section id="numbers" title={t('The numbers Josephus gives')} lede={t('Ancient figures are often rounded or inflated; each comes with a note on how far to trust it.')}>
        <Numbers items={j.numbers} />
      </Section>

      <Section id="reading" title={t('Reading Josephus well')} lede={t('He was there, but he was not neutral.')}>
        <ul className="grid gap-3 md:grid-cols-2">
          {j.caveats.map((c, i) => (
            <motion.li key={c.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }} className="leaf p-4" style={{ borderTop: '3px solid var(--gold)' }}>
              <p className="font-bold">{c.title}</p>
              <p className="mt-1 text-[0.95rem]">
                <Gloss>{c.text}</Gloss>
              </p>
            </motion.li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/olivet" className="btn btn-primary no-underline">
            <Icon name="compass" /> {t('Matthew 24 and AD 70')}
          </Link>
          <Link to="/dating" className="btn no-underline">
            <Icon name="scales" /> {t('When was Revelation written?')}
          </Link>
          <Sources ids={j.sources} />
        </div>
      </Section>
    </div>
  )
}
