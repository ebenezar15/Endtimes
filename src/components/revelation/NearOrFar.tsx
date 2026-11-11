import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { useReducedMotion } from '../../lib/theme'

type Zone = 'past' | 'now' | 'future'
type Book = 'mt' | 'rev'

const ZONES = (): Record<Zone, { name: string; sub: string; color: string; x: [number, number] }> => ({
  past: { name: t('Fulfilled'), sub: t('AD 30-70, and the fall of pagan Rome'), color: 'var(--rubric)', x: [0, 0.42] },
  now: { name: t('Christ reigns'), sub: t('The thousand years: the present age'), color: 'var(--accent)', x: [0.42, 0.8] },
  future: { name: t('Still future'), sub: t('Return, judgement, all things new'), color: 'var(--violet, var(--gold))', x: [0.8, 1] },
})

const CLUES = (): { id: string; book: Book; zone: Zone; pos: number; title: string; text: string; other?: string; refs: string[] }[] => [
  { id: 'stones', book: 'mt', zone: 'past', pos: 0.05, title: t('Not one stone on another'), text: t('Jesus pointed to the temple standing in front of them, the Second Temple, not one thousands of years away.'), refs: ['Matthew 24:1-2', 'Luke 19:41-44'] },
  { id: 'abom', book: 'mt', zone: 'past', pos: 0.12, title: t('The abomination in that temple'), text: t('The desolation was tied to the very stones he said would fall. Missing this is why many feel they must invent a third temple.'), refs: ['Matthew 24:15', 'Daniel 9:26-27', 'Luke 21:20'] },
  { id: 'flee', book: 'mt', zone: 'past', pos: 0.19, title: t('Flee Judea'), text: t('The warning was local: those in Judea were to run to the mountains. No one on the other side of the world was told to prepare.'), refs: ['Matthew 24:16-20'] },
  { id: 'gen', book: 'mt', zone: 'past', pos: 0.26, title: t('This generation'), text: t('All these things would happen before Jesus’ hearers passed away.'), refs: ['Matthew 24:34'] },
  { id: 'pella', book: 'mt', zone: 'past', pos: 0.33, title: t('The flight to Pella'), text: t('Early Christians remembered the warning and left for Pella, across the Jordan, before the siege. Those who heeded Christ escaped.'), refs: ['Luke 21:20-22'] },
  { id: 'companion', book: 'rev', zone: 'past', pos: 0.08, title: t('“Your companion in the tribulation”'), text: t('John was already sharing in the tribulation he wrote about; it was not thousands of years away.'), refs: ['Revelation 1:9'] },
  { id: 'churches', book: 'rev', zone: 'past', pos: 0.15, title: t('Seven real churches'), text: t('The book was sent to congregations of John’s day, who were expected to read it, understand it and keep it.'), refs: ['Revelation 1:3, 11'] },
  { id: 'soon', book: 'rev', zone: 'past', pos: 0.22, title: t('Shortly; the time is near'), text: t('The opening and closing verses stress that these things must soon take place.'), refs: ['Revelation 1:1-3', 'Revelation 22:6, 10'] },
  { id: 'dragon', book: 'rev', zone: 'past', pos: 0.02, title: t('The dragon thrown down'), text: t('The dragon falls after the child is born and caught up to God’s throne: Christ’s first coming, cross and ascension.'), refs: ['Revelation 12:5-10', 'John 12:31'] },
  { id: 'heads', book: 'rev', zone: 'past', pos: 0.3, title: t('Five fallen, one is'), text: t('When John wrote, five kings had fallen, one was reigning, and one would come for a little while. The prophecy sits in his own day.'), refs: ['Revelation 17:10'] },
  { id: 'city', book: 'rev', zone: 'past', pos: 0.37, title: t('The city that rules the kings'), text: t('For John’s readers, the great city reigning over the kings of the earth pointed to Rome.'), other: t('Many partial preterists see the harlot as Jerusalem, the city “where their Lord was crucified” (11:8), riding the Roman beast.'), refs: ['Revelation 17:18', 'Revelation 17:9'] },
  { id: 'rider', book: 'rev', zone: 'now', pos: 0.47, title: t('The rider on the white horse'), text: t('One reading: Christ conquers the old pagan world with the sword from his mouth, the word of God, until Rome bows and the gospel fills the empire.'), other: t('Many read it as the second coming; others as Christ’s judgement in AD 70.'), refs: ['Revelation 19:11-21', 'Hebrews 4:12'] },
  { id: 'thousand', book: 'rev', zone: 'now', pos: 0.62, title: t('The thousand years'), text: t('Satan bound, Christ reigning, and the martyrs on thrones with him. The text places their thrones with Christ, not on earth.'), refs: ['Revelation 20:1-6'] },
  { id: 'after', book: 'rev', zone: 'future', pos: 0.85, title: t('After the thousand years'), text: t('The part still future to John: Christ’s bodily return and the final judgement.'), refs: ['Revelation 20:7-15', 'Acts 1:11'] },
  { id: 'newjer', book: 'rev', zone: 'future', pos: 0.94, title: t('The New Jerusalem'), text: t('God dwells with his people for ever, and his glory makes the sun unnecessary.'), other: t('Many see the new creation begun already in Christ and the church, and completed at the end.'), refs: ['Revelation 21:1-4, 23', '2 Corinthians 5:17'] },
]

/** Revelation 17:10 in a common count, starting from Julius Caesar. */
const HEADS = () => [
  { n: t('Julius'), s: 'fallen' },
  { n: t('Augustus'), s: 'fallen' },
  { n: t('Tiberius'), s: 'fallen' },
  { n: t('Gaius'), s: 'fallen' },
  { n: t('Claudius'), s: 'fallen' },
  { n: t('Nero'), s: 'is' },
  { n: t('Galba'), s: 'little' },
]

function Axis({ sel, setSel, book, shown }: { sel: string; setSel: (s: string) => void; book: 'all' | Book; shown: number }) {
  const z = ZONES()
  const clues = CLUES()
  const W = 600
  const px = (v: number) => 12 + v * (W - 24)
  return (
    <svg viewBox={`0 40 ${W} 120`} className="h-auto w-full" role="img" aria-label={t('Where each clue falls: fulfilled, now, or still future')}>
      {(Object.keys(z) as Zone[]).map((k, i) => (
        <motion.g key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.25 }}>
          <rect x={px(z[k].x[0])} y={110} width={px(z[k].x[1]) - px(z[k].x[0]) - 3} height={22} rx={11} fill={z[k].color} fillOpacity={0.3} stroke={z[k].color} />
        </motion.g>
      ))}
      <text x={px(0.42)} y={152} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ink-soft)">
        {t('AD 70')}
      </text>
      <text x={px(0.8)} y={152} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ink-soft)">
        {t('Return')}
      </text>
      {clues.map((c, i) => {
        const on = i < shown && (book === 'all' || c.book === book)
        const y = c.book === 'mt' ? 56 : 86
        const active = c.id === sel
        return (
          <motion.g key={c.id} initial={false} animate={{ opacity: on ? 1 : 0.08, y: on ? 0 : -40 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }} onClick={() => on && setSel(c.id)} style={{ cursor: on ? 'pointer' : 'default' }}>
            <line x1={px(c.pos)} x2={px(c.pos)} y1={y} y2={110} stroke={ZONES()[c.zone].color} strokeOpacity={0.6} strokeDasharray="2 3" />
            <circle cx={px(c.pos)} cy={y} r={active ? 10 : 7} fill={c.book === 'mt' ? 'var(--gold)' : ZONES()[c.zone].color} stroke={active ? 'var(--ink)' : 'none'} strokeWidth={2} />
          </motion.g>
        )
      })}
    </svg>
  )
}

function Heads() {
  const hs = HEADS()
  return (
    <div className="leaf p-4">
      <p className="font-bold">{t('Seven heads: “five have fallen, one is, the other has not yet come”')}</p>
      <div className="mt-3 grid grid-cols-4 gap-x-1 gap-y-3 sm:grid-cols-7 sm:gap-2">
        {hs.map((h, i) => {
          const fallen = h.s === 'fallen'
          const is = h.s === 'is'
          return (
            <div key={h.n} className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                whileInView={fallen ? { y: 14, opacity: 0.35, rotate: -25 } : is ? { scale: [1, 1.18, 1] } : { opacity: [0.3, 1, 0.3] }}
                viewport={{ once: !is && fallen }}
                transition={fallen ? { delay: 0.4 + i * 0.25, duration: 0.6 } : { delay: 1.8, duration: 1.6, repeat: Infinity }}
                className="flex size-9 items-center justify-center rounded-full text-sm font-black sm:size-11"
                style={{ background: is ? 'var(--accent)' : fallen ? 'var(--ink-soft)' : 'transparent', color: is ? 'var(--accent-ink)' : 'var(--bg)', border: h.s === 'little' ? '2px dashed var(--gold)' : 'none' }}
                aria-hidden
              >
                <span style={{ color: h.s === 'little' ? 'var(--gold)' : undefined }}>{i + 1}</span>
              </motion.div>
              <span className="text-center text-[0.7rem] font-semibold leading-tight sm:text-xs">{h.n}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span>{t('Grey: fallen')}</span>
        <span style={{ color: 'var(--accent)' }}>{t('Glowing: “one is”, reigning as John writes')}</span>
        <span style={{ color: 'var(--gold)' }}>{t('Dashed: “a little while”, seven months')}</span>
      </div>
      <p className="mt-2 text-xs text-ink-soft">{t('One common count, starting from Julius Caesar. Counting from Augustus, or reading the heads as kingdoms, gives other lists; but on any count John stands among the kings he describes.')}</p>
    </div>
  )
}

function Pella() {
  return (
    <div className="leaf p-4">
      <p className="font-bold">{t('Those who heeded Christ escaped')}</p>
      <svg viewBox="0 0 300 200" className="mt-2 h-auto w-full" role="img" aria-label={t('The flight from Jerusalem to Pella')}>
        <rect x={0} y={0} width={300} height={200} rx={12} fill="color-mix(in srgb, var(--gold) 8%, transparent)" />
        <path d="M195 10 C190 50 200 90 192 130 C186 160 196 180 190 196" stroke="var(--accent)" strokeWidth={4} fill="none" opacity={0.6} />
        <text x={202} y={24} fontSize={10} fill="var(--accent)">
          {t('Jordan')}
        </text>
        <circle cx={140} cy={150} r={9} fill="var(--rubric)" />
        <text x={140} y={176} textAnchor="middle" fontSize={11} fontWeight={800} fill="var(--ink)">
          {t('Jerusalem')}
        </text>
        <circle cx={225} cy={60} r={8} fill="var(--accent)" />
        <text x={225} y={44} textAnchor="middle" fontSize={11} fontWeight={800} fill="var(--ink)">
          {t('Pella')}
        </text>
        <motion.path d="M145 140 C170 110 200 90 220 66" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6 5" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false }} transition={{ duration: 1.6, delay: 0.3 }} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.circle key={i} r={4} fill="var(--rubric)" initial={{ cx: 10 + i * 6, cy: 60 + i * 18 }} whileInView={{ cx: 110 + (i % 3) * 10, cy: 130 + (i % 2) * 22 }} viewport={{ once: false }} transition={{ duration: 2, delay: 1.6 + i * 0.1 }} />
        ))}
        <motion.text x={40} y={196} fontSize={10} fontWeight={700} fill="var(--rubric)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 2.6 }}>
          {t('Rome’s armies arrive, AD 70')}
        </motion.text>
      </svg>
      <p className="mt-1 text-xs text-ink-soft">{t('The church historian Eusebius records the flight to Pella.')}</p>
    </div>
  )
}

/**
 * Matthew 24 and Revelation laid on one line: every clue in the text flies to where it falls, fulfilled in John's day,
 * fulfilled now in Christ's reign, or still future. With the seven heads of Revelation 17 and the flight to Pella.
 */
export function NearOrFar() {
  const clues = CLUES()
  const z = ZONES()
  const reduce = useReducedMotion()
  const [book, setBook] = useState<'all' | Book>('all')
  const [sel, setSel] = useState('stones')
  const [shown, setShown] = useState(reduce ? clues.length : 0)
  useEffect(() => {
    if (shown >= clues.length) return
    const id = setTimeout(() => setShown((n) => n + 1), 220)
    return () => clearTimeout(id)
  }, [shown, clues.length])
  const c = clues.find((x) => x.id === sel) ?? clues[0]
  const list = clues.filter((x) => book === 'all' || x.book === book)
  return (
    <div className="space-y-4">
      <div className="leaf p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist">
          {(
            [
              ['all', t('Both')],
              ['mt', t('Matthew 24')],
              ['rev', t('Revelation')],
            ] as const
          ).map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={book === k} onClick={() => setBook(k)} className="chip cursor-pointer" style={book === k ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
              {l}
            </button>
          ))}
          <button type="button" className="chip ml-auto cursor-pointer" onClick={() => setShown(0)}>
            ↻ {t('Replay')}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full" style={{ background: 'var(--gold)' }} /> {t('Matthew 24 (upper row)')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full border-2 border-[var(--ink-soft)]" /> {t('Revelation (lower row, coloured by when)')}
          </span>
        </div>
        <Axis sel={sel} setSel={setSel} book={book} shown={shown} />
        <div className="mt-1 grid grid-cols-3 gap-2 text-center">
          {(Object.keys(z) as Zone[]).map((k) => (
            <div key={k}>
              <p className="text-[0.8rem] font-bold [overflow-wrap:normal] sm:text-base" style={{ color: z[k].color }}>
                {z[k].name}
              </p>
              <p className="text-[0.72rem] leading-snug text-ink-soft sm:text-xs">{z[k].sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-2">
          {list.map((x) => (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} className="chip shrink-0 cursor-pointer" style={sel === x.id ? { borderColor: z[x.zone].color, boxShadow: `inset 0 0 0 1px ${z[x.zone].color}` } : undefined}>
              {x.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl border border-rule p-4" style={{ borderLeft: `5px solid ${z[c.zone].color}` }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: z[c.zone].color }}>
              {c.book === 'mt' ? t('Matthew 24') : t('Revelation')} · {z[c.zone].name}
            </p>
            <h3 className="mt-1 text-lg font-bold">{c.title}</h3>
            <p className="mt-1 text-[0.98rem]">{c.text}</p>
            {c.other && (
              <p className="mt-2 text-sm text-ink-soft">
                <b>{t('Other readings')}: </b>
                {c.other}
              </p>
            )}
            <p className="mt-1 text-xs font-semibold text-ink-soft">{c.refs.map(refLabel).join(' · ')}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Heads />
        <Pella />
      </div>
      <p className="rounded-xl border border-rule p-3 text-sm text-ink-soft" style={{ borderLeft: '4px solid var(--gold)' }}>
        {t('What was still future to John: only what follows the thousand years. Christ’s bodily return, the final judgement and the renewal of all things are the hope every orthodox reading shares.')}
      </p>
    </div>
  )
}
