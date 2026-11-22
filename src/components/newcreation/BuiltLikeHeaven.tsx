import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'
import { useReducedMotion } from '../../lib/theme'

const PAIRS = () => [
  { a: t('The heavens and the earth were finished'), ar: 'Genesis 2:1', b: t('All the work of the tabernacle was finished'), br: 'Exodus 39:32' },
  { a: t('God saw all he had made, and it was very good'), ar: 'Genesis 1:31', b: t('Moses saw all the work, and they had done it'), br: 'Exodus 39:43' },
  { a: t('On the seventh day God finished his work'), ar: 'Genesis 2:2', b: t('So Moses finished the work'), br: 'Exodus 40:33' },
  { a: t('God blessed the seventh day'), ar: 'Genesis 2:3', b: t('Moses blessed them'), br: 'Exodus 39:43' },
  { a: t('Six days of making, then the Sabbath'), ar: 'Genesis 2:2-3', b: t('Seven speeches of instructions; the seventh is about the Sabbath'), br: 'Exodus 31:12-17' },
  { a: t('God rests in his finished world'), ar: 'Genesis 2:2', b: t('The glory of the LORD filled the tabernacle'), br: 'Exodus 40:34' },
]

function Tabs({ tab, setTab }: { tab: string; setTab: (s: string) => void }) {
  const tabs: [string, string][] = [
    ['built', t('Built like creation')],
    ['olives', t('The view from the Mount of Olives')],
    ['torn', t('Torn, shaken, fallen')],
    ['cube', t('A city with no temple')],
  ]
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {tabs.map(([k, l]) => (
        <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="chip cursor-pointer" style={tab === k ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
          {l}
        </button>
      ))}
    </div>
  )
}

/** Genesis 1-2 and Exodus 39-40 side by side, each pair joined as it appears. */
function Built() {
  const ps = PAIRS()
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? ps.length : 0)
  useEffect(() => {
    if (n >= ps.length) return
    const id = setTimeout(() => setN((k) => k + 1), 700)
    return () => clearTimeout(id)
  }, [n, ps.length])
  return (
    <div>
      <p className="text-[0.98rem]">{t('God “built his sanctuary like the high heavens, like the earth”. Read the end of the creation story beside the end of the tabernacle story and the same words come back.')}</p>
      <p className="mt-1 text-xs font-semibold text-ink-soft">{refLabel('Psalm 78:69')}</p>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-center gap-y-2 text-sm sm:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)]">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gold">{t('Creation')}</p>
        <span />
        <p className="text-center text-xs font-bold uppercase tracking-widest text-accent">{t('Tabernacle')}</p>
        {ps.map((p, i) => (
          <div key={i} className="contents">
            <motion.div initial={false} animate={{ opacity: i < n ? 1 : 0.15, x: i < n ? 0 : -12 }} className="rounded-lg border border-rule p-2.5" style={{ borderLeft: '4px solid var(--gold)' }}>
              {p.a}
              <span className="mt-0.5 block text-[0.7rem] font-semibold text-ink-soft">{refLabel(p.ar)}</span>
            </motion.div>
            <svg viewBox="0 0 40 20" className="h-5 w-full" aria-hidden>
              <motion.path d="M2 10 H38" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="3 3" initial={false} animate={{ pathLength: i < n ? 1 : 0 }} transition={{ duration: 0.4 }} />
              <motion.circle cx={20} cy={10} r={4} fill="var(--gold)" initial={false} animate={{ scale: i < n ? 1 : 0 }} transition={{ delay: 0.3 }} />
            </svg>
            <motion.div initial={false} animate={{ opacity: i < n ? 1 : 0.15, x: i < n ? 0 : 12 }} className="rounded-lg border border-rule p-2.5" style={{ borderLeft: '4px solid var(--accent)' }}>
              {p.b}
              <span className="mt-0.5 block text-[0.7rem] font-semibold text-ink-soft">{refLabel(p.br)}</span>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="rounded-xl border border-rule p-3 text-sm" style={{ borderLeft: '4px solid var(--gold)' }}>
          <b>{t('Read the same way in Jesus’ day')}: </b>
          {t('Josephus, a Jerusalem priest, called the tabernacle an imitation of the world: the inner room a heaven for God, the outer court as sea and land. He called the temple curtain an image of the universe.')}
        </p>
        <p className="rounded-xl border border-rule p-3 text-sm" style={{ borderLeft: '4px solid var(--accent)' }}>
          <b>{t('And in Hebrews')}: </b>
          {t('The priests served a copy and shadow of heavenly things; Christ entered not a holy place made with hands, but heaven itself.')}
          <span className="mt-1 block text-xs font-semibold text-ink-soft">{['Hebrews 8:5', 'Hebrews 9:24'].map(refLabel).join(' · ')}</span>
        </p>
      </div>
    </div>
  )
}

/** Jesus on the Mount of Olives, the temple across the valley; press for AD 70 and the stones fall. */
function Olives() {
  const [fallen, setFallen] = useState(false)
  const [say, setSay] = useState(0)
  const sayings = [
    { s: t('“Not one stone here will be left on another.”'), r: 'Matthew 24:2' },
    { s: t('“This generation will not pass away until all these things take place.”'), r: 'Matthew 24:34' },
    { s: t('“Heaven and earth will pass away, but my words will not pass away.”'), r: 'Matthew 24:35' },
  ]
  const stones = Array.from({ length: 24 }, (_, i) => ({ x: 330 + (i % 6) * 22, y: 90 + Math.floor(i / 6) * 16 }))
  return (
    <div>
      <svg viewBox="0 0 520 230" className="mx-auto h-auto w-full max-w-[720px]" role="img" aria-label={t('Jesus on the Mount of Olives, facing the temple across the valley')}>
        <defs>
          <linearGradient id="blh-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="color-mix(in srgb, var(--gold) 18%, transparent)" />
            <stop offset="1" stopColor="transparent" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={520} height={230} fill="url(#blh-sky)" />
        <path d="M0 230 L0 120 C60 80 140 80 200 140 L250 200 L300 160 C330 150 470 150 520 160 L520 230 Z" fill="color-mix(in srgb, var(--accent) 16%, transparent)" stroke="var(--accent)" strokeWidth={1.5} />
        <text x={70} y={210} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--accent)">
          {t('Mount of Olives')}
        </text>
        <text x={250} y={222} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
          {t('Kidron valley')}
        </text>
        <text x={420} y={222} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--gold)">
          {t('The temple')}
        </text>
        {/* Jesus and the disciples */}
        <circle cx={92} cy={92} r={8} fill="var(--gold)" />
        {[70, 110, 80, 104].map((x, i) => (
          <circle key={i} cx={x} cy={102 + (i % 2) * 6} r={5} fill="var(--ink-soft)" />
        ))}
        <motion.path d="M100 88 Q240 20 340 80" fill="none" stroke="var(--gold)" strokeWidth={1.5} strokeDasharray="4 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }} />
        {/* the temple: stones */}
        {stones.map((st, i) => (
          <motion.rect key={i} width={20} height={14} rx={2} fill="color-mix(in srgb, var(--gold) 55%, var(--bg))" stroke="var(--gold)" initial={false} animate={fallen ? { x: st.x + ((i * 37) % 60) - 30, y: 175 + ((i * 13) % 12), rotate: ((i * 47) % 90) - 45, opacity: 0.7 } : { x: st.x, y: st.y, rotate: 0, opacity: 1 }} transition={{ duration: 1.1, delay: fallen ? (23 - i) * 0.04 : i * 0.02, type: fallen ? 'tween' : 'spring' }} />
        ))}
        {!fallen && (
          <motion.path d="M326 90 L395 58 L464 90 Z" fill="color-mix(in srgb, var(--gold) 35%, transparent)" stroke="var(--gold)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        )}
        {fallen && (
          <motion.text x={395} y={70} textAnchor="middle" fontSize={14} fontWeight={800} fill="var(--rubric)" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 70 }} transition={{ delay: 1.2 }}>
            {t('AD 70')}
          </motion.text>
        )}
      </svg>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {sayings.map((x, i) => (
          <button key={i} type="button" onClick={() => setSay(i)} className="chip cursor-pointer" style={say === i ? { background: 'var(--gold)', color: 'var(--bg)', borderColor: 'transparent' } : undefined}>
            {refLabel(x.r)}
          </button>
        ))}
        <button type="button" className="btn btn-primary ml-auto py-1.5 text-sm" onClick={() => setFallen(!fallen)}>
          {fallen ? t('Rebuild') : t('Forty years later')}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.blockquote key={say} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl border border-rule p-3 text-lg font-semibold" style={{ borderLeft: '4px solid var(--gold)' }}>
          {sayings[say].s}
        </motion.blockquote>
      </AnimatePresence>
      <p className="mt-3 text-[0.95rem]">{t('He sat on the Mount of Olives opposite the temple, and that building stood across the valley through the whole sermon. He spoke of heaven and earth passing away in front of a house Scripture says was built like the heavens and the earth, in a sermon that began with that house coming down.')}</p>
      <p className="mt-1 text-xs font-semibold text-ink-soft">{['Mark 13:3', 'Psalm 78:69'].map(refLabel).join(' · ')}</p>
    </div>
  )
}

/** The curtain tears at the cross, the shaking of Hebrews 12, and the fall forty years later. */
function Torn() {
  const [step, setStep] = useState(0)
  const steps = [
    { y: t('AD 30'), h: t('The curtain torn'), x: t('When Jesus died the temple curtain tore from top to bottom. The way in was opened through his flesh.'), r: ['Matthew 27:51', 'Hebrews 10:19-20'] },
    { y: t('AD 60s'), h: t('Heaven and earth shaken'), x: t('Hebrews warned that God would shake not only earth but heaven, removing what was made, so that what cannot be shaken would remain.'), r: ['Hebrews 12:26-28', 'Haggai 2:6'] },
    { y: t('AD 70'), h: t('The house falls'), x: t('Forty years after the curtain tore, the whole building was gone. The holy places made with hands had served their time.'), r: ['Matthew 24:2', 'Hebrews 9:8-11'] },
    { y: t('Now'), h: t('A kingdom that cannot be shaken'), x: t('Believers are receiving a kingdom that cannot be shaken: so let us be grateful and worship.'), r: ['Hebrews 12:28'] },
  ]
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 260 220" className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label={steps[step].h}>
        <rect x={40} y={20} width={180} height={180} rx={6} fill="color-mix(in srgb, var(--gold) 10%, transparent)" stroke="var(--rule)" />
        {/* curtain halves */}
        <motion.path d="M60 30 H130 V190 H60 Z" fill="color-mix(in srgb, var(--rubric) 55%, var(--accent))" initial={false} animate={{ x: step >= 0 ? -6 : 0, skewY: step >= 0 ? -3 : 0 }} transition={{ duration: 0.8 }} />
        <motion.path d="M130 30 H200 V190 H130 Z" fill="color-mix(in srgb, var(--rubric) 55%, var(--accent))" initial={false} animate={{ x: step >= 0 ? 6 : 0, skewY: step >= 0 ? 3 : 0 }} transition={{ duration: 0.8 }} />
        <motion.path d="M130 30 L130 190" stroke="var(--gold)" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
        <motion.circle cx={130} cy={110} r={step >= 3 ? 70 : 18} fill="var(--gold)" initial={false} animate={{ opacity: step >= 3 ? 0.35 : 0.6, r: step >= 3 ? 70 : 18 }} transition={{ duration: 1 }} />
        <motion.g animate={step === 1 ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.7, repeat: step === 1 ? Infinity : 0, repeatDelay: 0.6 }}>
          <motion.rect x={40} y={20} width={180} height={180} rx={6} fill="none" stroke="var(--gold)" strokeWidth={3} initial={false} animate={{ opacity: step >= 2 ? 0 : 1, y: step >= 2 ? 30 : 0 }} transition={{ duration: 0.9 }} />
        </motion.g>
        <text x={130} y={214} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--ink-soft)">
          {t('Top to bottom')}
        </text>
      </svg>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {steps.map((s, i) => (
            <button key={i} type="button" onClick={() => setStep(i)} className="chip cursor-pointer" style={step === i ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
              {s.y}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-3">
            <h3 className="text-xl font-bold">{steps[step].h}</h3>
            <p className="mt-1 text-[0.98rem]">{steps[step].x}</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">{steps[step].r.map(refLabel).join(' · ')}</p>
          </motion.div>
        </AnimatePresence>
        <button type="button" className="btn mt-3 py-1.5 text-sm" onClick={() => setStep((step + 1) % steps.length)}>
          {t('Next')} →
        </button>
      </div>
    </div>
  )
}

/** The Most Holy Place, a cube, grows into the city: no temple, for God and the Lamb are its temple. */
function Cube() {
  const [big, setBig] = useState(false)
  const s = big ? 1 : 0.32
  const cube = (k: number) => {
    const w = 120 * k
    const d = 50 * k
    const x = 150 - w / 2
    const y = 120 - w / 2 + d / 2
    return { front: `M${x} ${y} h${w} v${w} h${-w} Z`, top: `M${x} ${y} l${d} ${-d} h${w} l${-d} ${d} Z`, side: `M${x + w} ${y} l${d} ${-d} v${w} l${-d} ${d} Z` }
  }
  const c = cube(s)
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <svg viewBox="0 0 320 230" className="mx-auto h-auto w-full max-w-[380px]" role="img" aria-label={big ? t('The New Jerusalem, a cube') : t('The Most Holy Place, a cube')}>
          <motion.path d={c.top} initial={false} animate={{ d: c.top }} transition={{ duration: 1.2 }} fill="color-mix(in srgb, var(--gold) 55%, transparent)" stroke="var(--gold)" />
          <motion.path d={c.side} initial={false} animate={{ d: c.side }} transition={{ duration: 1.2 }} fill="color-mix(in srgb, var(--gold) 35%, transparent)" stroke="var(--gold)" />
          <motion.path d={c.front} initial={false} animate={{ d: c.front }} transition={{ duration: 1.2 }} fill="color-mix(in srgb, var(--gold) 22%, transparent)" stroke="var(--gold)" strokeWidth={2} />
          <motion.circle cx={150} cy={145} initial={false} animate={{ r: big ? 46 : 10, opacity: big ? 0.5 : 0.9 }} transition={{ duration: 1.2 }} fill="var(--gold)" />
          {big &&
            [0, 1, 2, 3, 4, 5].map((i) => <motion.circle key={i} r={4} fill="var(--accent)" initial={{ cx: 20 + i * 50, cy: 225, opacity: 0 }} animate={{ cx: 110 + (i % 3) * 40, cy: 170 + Math.floor(i / 3) * 22, opacity: 1 }} transition={{ delay: 1 + i * 0.12, duration: 0.8 }} />)}
        </svg>
        <p className="text-center text-sm font-bold">{big ? t('The city: twelve thousand stadia each way') : t('The Most Holy Place: twenty cubits each way')}</p>
      </div>
      <div>
        <p className="text-[0.98rem]">{big ? t('The city John saw is a cube, its length, width and height equal. And he saw no temple in it, for its temple is the Lord God the Almighty and the Lamb.') : t('The inner room of Solomon’s temple was a perfect cube. Only one priest could enter it, once a year.')}</p>
        <p className="mt-1 text-xs font-semibold text-ink-soft">{(big ? ['Revelation 21:16, 22', 'Revelation 21:3'] : ['1 Kings 6:20', 'Hebrews 9:7']).map(refLabel).join(' · ')}</p>
        <button type="button" className="btn btn-primary mt-3 py-1.5 text-sm" onClick={() => setBig(!big)}>
          {big ? t('Back to the inner room') : t('Grow it into the city')}
        </button>
        <motion.p initial={false} animate={{ opacity: big ? 1 : 0 }} transition={{ delay: 1.2 }} className="mt-4 rounded-xl p-3 text-center font-bold" style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}>
          {t('The room no one could enter became the whole city: God dwells with his people.')}
        </motion.p>
      </div>
    </div>
  )
}

/**
 * "Israel built heaven and earth": the tabernacle built in the words of creation, Jesus on the Mount of Olives facing
 * the temple, the curtain torn and the house fallen, and the cube of the Most Holy Place grown into the city.
 */
export function BuiltLikeHeaven() {
  const [tab, setTab] = useState('built')
  return (
    <div className="leaf p-4 sm:p-6">
      <Tabs tab={tab} setTab={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
          {tab === 'built' ? <Built /> : tab === 'olives' ? <Olives /> : tab === 'torn' ? <Torn /> : <Cube />}
        </motion.div>
      </AnimatePresence>
      <p className="mt-5 rounded-xl border border-rule p-3 text-sm text-ink-soft" style={{ borderLeft: '4px solid var(--gold)' }}>
        {t('None of this makes Genesis 1 about a building: God made the real sky and ground, and Moses built a copy. Good readers differ on how far “heaven and earth” in Matthew 24:35 points to the temple. Scholars far from preterism also see the temple as a model of the cosmos; the difference here is the timing, inside “this generation”.')}
      </p>
    </div>
  )
}
