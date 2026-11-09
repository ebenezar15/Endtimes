import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { t } from '../../lib/i18n'
import { refLabel } from '../../lib/refLabel'

/** Positions on the time axis, 0 to 1. */
const AX = { ad30: 0.06, ad70: 0.3, now: 0.62, ret: 0.8 }

const READINGS = () => [
  { id: 'now', name: t('“We are in it now”'), color: 'var(--rubric)', thousand: [0.06, 0.55] as const, season: [0.55, 0.74] as const, dashed: true, text: t('A modern theory: the thousand years are over and the world now lies under a deception we can only wait out.'), plus: t('Takes seriously that evil is real and that Satan is released after the thousand years.'), minus: t('The release is “a little while”, and believers are told Satan will be crushed under their feet, not that they must wait him out.'), refs: ['Romans 16:20', 'James 4:7'] },
  { id: 'ad66', name: t('Released AD 66-70'), color: 'var(--gold)', thousand: [0.06, 0.26] as const, season: [0.26, 0.3] as const, dashed: false, text: t('The thousand years are the complete span from Christ’s victory to the Jewish war. The little season is the deception and siege of AD 66-70, ending in Jerusalem’s fall.'), plus: t('Fits Revelation’s “soon” and the armies surrounding the beloved city, as Jesus foretold.'), minus: t('Makes the thousand years about thirty-six, and ties the great white throne to AD 70, which most readers see as the final judgement.'), refs: ['Luke 21:20', 'Revelation 1:1-3'] },
  { id: 'age', name: t('The whole present age'), color: 'var(--accent)', thousand: [0.06, 0.76] as const, season: [0.76, 0.8] as const, dashed: false, text: t('Held by most partial preterists, postmillennialists and amillennialists: the thousand years are Christ’s reign from his ascension to near his return. A brief final rebellion comes at the end, then the return and the judgement.'), plus: t('Keeps the order of Revelation 20 and puts the final judgement at the end of history.'), minus: t('Leaves the little season still ahead; some preterists say this reads the chapter apart from Revelation’s time words.'), refs: ['Revelation 20:7-15', '1 Corinthians 15:24-26'] },
  { id: 'premill', name: t('After a future millennium'), color: 'var(--violet, var(--accent))', thousand: [0.8, 0.95] as const, season: [0.95, 0.99] as const, dashed: false, text: t('Christ returns first, then reigns a thousand years on earth; Satan is released at the end of that reign.'), plus: t('Reads Revelation 19 and 20 in straight order.'), minus: t('Needs a rebellion against Christ while he reigns visibly on earth, and splits the resurrection by a thousand years.'), refs: ['Revelation 19:11-20:6'] },
]

const NAMES = () => [
  { en: t('Dragon'), gr: 'drakōn', mean: t('A great serpent; from a root meaning “to look”, a watcher.'), ref: 'Revelation 12:3-9' },
  { en: t('Serpent'), gr: 'ophis', mean: t('A snake; the old picture of hidden, cunning deceit, from Eden onward.'), ref: 'Genesis 3:1-5' },
  { en: t('Devil'), gr: 'diabolos', mean: t('The slanderer: one who accuses falsely and calls God’s goodness into question.'), ref: 'John 8:44' },
  { en: t('Satan'), gr: 'satanas', mean: t('The adversary: whatever opposes God’s purpose. Jesus said it to Peter when Peter resisted the cross.'), ref: 'Matthew 16:21-23' },
]

const SCENE = () => [
  { id: 'gog', x: 70, y: 150, label: t('Gog and Magog'), bg: t('From Ezekiel 38-39: a coalition of nations coming against God’s people, then destroyed.'), ad70: t('The nations gathered in Rome’s armies under Titus, surrounding Jerusalem.'), other: t('A last worldwide rebellion against the church just before Christ returns.'), refs: ['Ezekiel 38:1-16', 'Revelation 20:8'] },
  { id: 'city', x: 260, y: 150, label: t('The beloved city'), bg: t('The camp of the saints and the beloved city are surrounded on the breadth of the earth.'), ad70: t('Jerusalem surrounded by armies, as Jesus warned, with the believers having fled.'), other: t('The church, God’s people spread through the world, under attack.'), refs: ['Luke 21:20-24', 'Revelation 20:9'] },
  { id: 'fire', x: 260, y: 40, label: t('Fire from heaven'), bg: t('In the prophets fire from God means judgement, as against Gog.'), ad70: t('The judgement that fell on the city in AD 70, when it burned.'), other: t('God’s final, direct judgement on the rebels at Christ’s return.'), refs: ['Ezekiel 38:22', 'Isaiah 66:15-16', 'Malachi 4:1'] },
  { id: 'lake', x: 460, y: 165, label: t('The lake of fire'), bg: t('The devil is thrown where the beast and false prophet already are.'), ad70: t('The end of Satan’s power to deceive the nations, completing Christ’s victory.'), other: t('The final, eternal defeat of Satan at the last judgement.'), refs: ['Revelation 20:10', 'Hebrews 2:14', '1 John 3:8'] },
]

function Tabs({ tab, setTab }: { tab: string; setTab: (s: string) => void }) {
  const tabs: [string, string][] = [
    ['time', t('Four timelines')],
    ['names', t('One enemy, four names')],
    ['scene', t('Decode Revelation 20:7-10')],
    ['evil', t('Why is there still evil?')],
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

function Timelines() {
  const rs = READINGS()
  const [sel, setSel] = useState('ad66')
  const r = rs.find((x) => x.id === sel) ?? rs[0]
  const W = 500
  const px = (v: number) => 10 + v * (W - 20)
  return (
    <div>
      <svg viewBox={`0 0 ${W} 250`} className="mx-auto h-auto w-full max-w-[680px]" role="img" aria-label={t('Where each reading places the thousand years and the little season')}>
        {(
          [
            [AX.ad30, t('AD 30')],
            [AX.ad70, t('AD 70')],
            [AX.now, t('Today')],
            [AX.ret, t('Return')],
          ] as const
        ).map(([v, l]) => (
          <g key={l}>
            <line x1={px(v)} x2={px(v)} y1={18} y2={222} stroke={l === t('Today') ? 'var(--gold)' : 'var(--rule)'} strokeDasharray={l === t('Today') ? undefined : '3 4'} strokeWidth={l === t('Today') ? 2 : 1} />
            <text x={px(v)} y={240} textAnchor="middle" fontSize={11} fontWeight={700} fill={l === t('Today') ? 'var(--gold)' : 'var(--ink-soft)'}>
              {l}
            </text>
          </g>
        ))}
        {rs.map((x, i) => {
          const y = 34 + i * 50
          const on = x.id === sel
          return (
            <g key={x.id} onClick={() => setSel(x.id)} style={{ cursor: 'pointer' }} opacity={on ? 1 : 0.4}>
              <text x={px(0.06)} y={y - 8} fontSize={11} fontWeight={800} fill="var(--ink)">
                {x.name}
              </text>
              <motion.rect y={y} height={14} rx={7} fill={x.color} fillOpacity={0.35} stroke={x.color} strokeDasharray={x.dashed ? '5 4' : undefined} initial={false} animate={{ x: px(x.thousand[0]), width: on ? px(x.thousand[1]) - px(x.thousand[0]) : 0 }} transition={{ duration: 0.9 }} />
              <motion.rect y={y - 3} height={20} rx={5} fill="var(--rubric)" initial={false} animate={{ x: px(x.season[0]), width: on ? Math.max(6, px(x.season[1]) - px(x.season[0])) : 0 }} transition={{ delay: on ? 0.8 : 0, duration: 0.5 }} />
              {!on && <rect x={px(x.thousand[0])} y={y} width={px(x.season[1]) - px(x.thousand[0])} height={14} rx={7} fill={x.color} fillOpacity={0.25} />}
            </g>
          )
        })}
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-6 rounded-full" style={{ background: 'color-mix(in srgb, var(--gold) 45%, transparent)' }} /> {t('The thousand years')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-3 rounded-sm" style={{ background: 'var(--rubric)' }} /> {t('The little season')}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {rs.map((x) => (
          <button key={x.id} type="button" onClick={() => setSel(x.id)} className="chip cursor-pointer" style={sel === x.id ? { borderColor: x.color, boxShadow: `inset 0 0 0 1px ${x.color}` } : undefined}>
            {x.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3">
          <p className="text-[0.98rem]">{r.text}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <p className="rounded-lg border border-rule p-2.5 text-sm" style={{ borderLeft: '4px solid var(--accent)' }}>
              <b>{t('Strength')}: </b>
              {r.plus}
            </p>
            <p className="rounded-lg border border-rule p-2.5 text-sm" style={{ borderLeft: '4px solid var(--rubric)' }}>
              <b>{t('Difficulty')}: </b>
              {r.minus}
            </p>
          </div>
          <p className="mt-1 text-xs font-semibold text-ink-soft">{r.refs.map(refLabel).join(' · ')}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Names() {
  const ns = NAMES()
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div>
      <p className="text-[0.98rem]">{t('Revelation 20:2 joins four names for one enemy: the dragon, that ancient serpent, who is the devil and Satan. Each name shows a different side of his work.')}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ns.map((n, i) => (
          <motion.button key={n.gr} type="button" onClick={() => setOpen(open === i ? null : i)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} whileHover={{ y: -3 }} className="leaf glow-card flex min-h-[150px] flex-col items-center justify-center gap-1 p-3 text-center">
            <motion.span animate={{ rotate: open === i ? 360 : 0 }} transition={{ duration: 0.6 }} className="inline-flex size-11 items-center justify-center rounded-full text-lg font-black" style={{ background: 'color-mix(in srgb, var(--rubric) 22%, transparent)', color: 'var(--rubric)' }} aria-hidden>
              {i + 1}
            </motion.span>
            <b className="text-lg">{n.en}</b>
            <i className="text-sm text-ink-soft">{n.gr}</i>
            <AnimatePresence>
              {open === i && (
                <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="block text-sm">
                  {n.mean}
                  <span className="mt-1 block text-xs font-semibold text-ink-soft">{refLabel(n.ref)}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <svg viewBox="0 0 500 70" className="mt-3 h-auto w-full" aria-hidden>
        <motion.path d="M60 8 C160 42 340 42 440 8" fill="none" stroke="var(--rubric)" strokeWidth={2.5} strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 1.2 }} />
        <text x={250} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
          {t('From the serpent of Eden to the dragon of Revelation')}
        </text>
      </svg>
      <p className="mt-2 rounded-xl border border-rule p-3 text-sm text-ink-soft" style={{ borderLeft: '4px solid var(--gold)' }}>
        {t('When Jesus told Peter “Get behind me, Satan”, Peter was voicing the adversary’s aim to turn him from the cross. Scripture presents the devil as a real, personal enemy, already defeated by Christ.')}
      </p>
    </div>
  )
}

function Scene() {
  const sc = SCENE()
  const [sel, setSel] = useState('city')
  const s = sc.find((x) => x.id === sel) ?? sc[0]
  const armies = Array.from({ length: 14 }, (_, i) => i)
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 520 220" className="h-auto w-full" role="img" aria-label={t('Revelation 20:7-10 as a scene: tap a part')}>
        <rect x={0} y={190} width={520} height={30} fill="color-mix(in srgb, var(--gold) 10%, transparent)" />
        {/* the city */}
        <g>
          <rect x={220} y={125} width={80} height={55} rx={4} fill="color-mix(in srgb, var(--accent) 20%, transparent)" stroke="var(--accent)" strokeWidth={2} />
          <path d="M220 125 l10 -14 l10 14 M260 125 l10 -18 l10 18" stroke="var(--accent)" strokeWidth={2} fill="none" />
          <rect x={250} y={155} width={20} height={25} fill="var(--accent)" opacity={0.6} />
        </g>
        {/* armies closing in */}
        {armies.map((i) => {
          const a = (i / armies.length) * Math.PI * 2
          return (
            <motion.circle key={i} r={5} fill="var(--rubric)" initial={{ cx: 260 + Math.cos(a) * 230, cy: 152 + Math.sin(a) * 90 }} animate={{ cx: 260 + Math.cos(a) * 70, cy: 152 + Math.sin(a) * 42 }} transition={{ duration: 2.4, delay: i * 0.05, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.2 }} />
          )
        })}
        {/* fire */}
        {[230, 260, 290].map((x, i) => (
          <motion.path key={x} d={`M${x} 20 q6 30 -2 60`} stroke="var(--gold)" strokeWidth={4} strokeLinecap="round" fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }} transition={{ duration: 1.6, delay: 1 + i * 0.25, repeat: Infinity, repeatDelay: 1.6 }} />
        ))}
        {/* lake */}
        <ellipse cx={460} cy={195} rx={50} ry={14} fill="color-mix(in srgb, var(--rubric) 45%, transparent)" />
        {sc.map((x) => (
          <g key={x.id} onClick={() => setSel(x.id)} style={{ cursor: 'pointer' }}>
            <circle cx={x.x} cy={x.y} r={14} fill={sel === x.id ? 'var(--accent)' : 'var(--bg-2, var(--bg))'} stroke="var(--accent)" strokeWidth={2} />
            <text x={x.x} y={x.y + 4} textAnchor="middle" fontSize={12} fontWeight={800} fill={sel === x.id ? 'var(--accent-ink)' : 'var(--accent)'}>
              {sc.indexOf(x) + 1}
            </text>
          </g>
        ))}
      </svg>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {sc.map((x, i) => (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} className="chip cursor-pointer" style={sel === x.id ? { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' } : undefined}>
              {i + 1}. {x.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={s.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-3 space-y-2 text-[0.95rem]">
            <p>{s.bg}</p>
            <p className="rounded-lg border border-rule p-2.5" style={{ borderLeft: '4px solid var(--gold)' }}>
              <b>{t('AD 70 reading')}: </b>
              {s.ad70}
            </p>
            <p className="rounded-lg border border-rule p-2.5" style={{ borderLeft: '4px solid var(--accent)' }}>
              <b>{t('End-of-the-age reading')}: </b>
              {s.other}
            </p>
            <p className="text-xs font-semibold text-ink-soft">{s.refs.map(refLabel).join(' · ')}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Evil() {
  const rows = [
    { k: t('Bound'), v: t('Jesus bound the strong man and plunders his house; the ruler of this world was cast out at the cross.'), r: ['Matthew 12:29', 'John 12:31-32'] },
    { k: t('Crushed'), v: t('The God of peace will soon crush Satan under your feet: under the church’s feet, not over its head.'), r: ['Romans 16:20'] },
    { k: t('Resisted'), v: t('Resist the devil and he will flee. Believers stand in Christ’s armour, not in fear.'), r: ['James 4:7', 'Ephesians 6:10-18'] },
    { k: t('Overcome'), v: t('The task given at creation and renewed in Christ: fill the earth, make disciples, overcome evil with good.'), r: ['Genesis 1:28', 'Matthew 28:18-20', 'Romans 12:21'] },
  ]
  return (
    <div>
      <p className="text-[0.98rem]">{t('Evil remains, but Scripture does not tell the church to wait helplessly in a season of deception. It describes a defeated enemy and a people sent to push back the darkness.')}</p>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((x, i) => (
          <motion.li key={x.k} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }} className="leaf p-4">
            <p className="flex items-center gap-2 text-lg font-bold">
              <span className="inline-flex size-8 items-center justify-center rounded-full text-sm font-black" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                {i + 1}
              </span>
              {x.k}
            </p>
            <p className="mt-1 text-[0.95rem]">{x.v}</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">{x.r.map(refLabel).join(' · ')}</p>
          </motion.li>
        ))}
      </ol>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-4 rounded-2xl p-4 text-center text-lg font-bold" style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}>
        {t('Not Satan’s little season, but Christ’s unending kingdom.')}
      </motion.p>
    </div>
  )
}

/**
 * "Satan's little season" (Revelation 20:3, 7-10) in four panels: where each reading puts the thousand years and the
 * release, the four names of the enemy, the battle scene decoded, and why evil remains.
 */
export function LittleSeason() {
  const [tab, setTab] = useState('time')
  return (
    <div className="leaf p-4 sm:p-6">
      <Tabs tab={tab} setTab={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
          {tab === 'time' ? <Timelines /> : tab === 'names' ? <Names /> : tab === 'scene' ? <Scene /> : <Evil />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
