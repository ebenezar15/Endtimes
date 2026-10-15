import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../lib/i18n'

/** Patmos and the seven churches, in the order a courier would carry the letters (Revelation 2–3). */
const CITIES = [
  { name: t('Ephesus'), lat: 37.94, lon: 27.34, ch: 2, note: t('Port and provincial hub; temple of Artemis; an imperial temple. The church that left its first love.') },
  { name: t('Smyrna'), lat: 38.42, lon: 27.14, ch: 2, note: t('Loyal to Rome, with a temple to Tiberius; a suffering, poor but rich church. No rebuke.') },
  { name: t('Pergamum'), lat: 39.12, lon: 27.18, ch: 2, note: t('“Where Satan’s throne is”: the great altar of Zeus and the imperial cult. Antipas was martyred here.') },
  { name: t('Thyatira'), lat: 38.92, lon: 27.84, ch: 2, note: t('A city of trade guilds (dyers, bronze-smiths), with their feasts and idols; “Jezebel” tolerated.') },
  { name: t('Sardis'), lat: 38.49, lon: 28.04, ch: 3, note: t('An old royal capital twice taken by surprise. “Wake up”: alive in name, but dead.') },
  { name: t('Philadelphia'), lat: 38.35, lon: 28.52, ch: 3, note: t('Earthquake-prone and renamed after imperial gifts; an “open door” and a new name. No rebuke.') },
  { name: t('Laodicea'), lat: 37.84, lon: 29.11, ch: 3, note: t('Banking, black wool and eye salve; tepid water piped in. “Lukewarm.”') },
]
const PATMOS = { name: t('Patmos'), lat: 37.31, lon: 26.55 }
const X = (lon: number) => ((lon - 26.3) / (29.4 - 26.3)) * 560 + 20
const Y = (lat: number) => ((39.3 - lat) / (39.3 - 37.1)) * 380 + 20

export function ChurchesMap() {
  const [sel, setSel] = useState(0)
  const route = CITIES.map((c, i) => `${i ? 'L' : 'M'}${X(c.lon)},${Y(c.lat)}`).join(' ')
  const c = CITIES[sel]
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 600 420" className="h-auto w-full" role="img" aria-label={t('Map of Patmos and the seven churches of Asia, linked in the order of the letters')}>
        <rect x={0} y={0} width={600} height={420} rx={16} fill="var(--surface-2)" />
        <path d={`M${X(26.75)},${Y(39.3)} C ${X(26.95)},${Y(38.8)} ${X(26.7)},${Y(38.3)} ${X(26.95)},${Y(37.95)} S ${X(27.05)},${Y(37.4)} ${X(27.35)},${Y(37.1)}`} stroke="var(--accent)" strokeOpacity={0.35} strokeWidth={2} fill="none" />
        <text x={X(26.35)} y={Y(38.6)} fontSize={11} fill="var(--ink-soft)" fontStyle="italic">
          {t('Aegean Sea')}
        </text>
        <motion.path d={`M${X(PATMOS.lon)},${Y(PATMOS.lat)} L${X(CITIES[0].lon)},${Y(CITIES[0].lat)}`} stroke="var(--rule)" strokeWidth={2} strokeDasharray="4 5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        <motion.path d={route} stroke="var(--gold-bright)" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 0.6, ease: 'easeInOut' }} />
        <circle cx={X(PATMOS.lon)} cy={Y(PATMOS.lat)} r={6} fill="var(--ink-soft)" />
        <text x={X(PATMOS.lon) + 9} y={Y(PATMOS.lat) + 4} fontSize={12} fontWeight={700} fill="var(--ink-soft)">
          {t('Patmos')} (1:9)
        </text>
        {CITIES.map((city, i) => (
          <motion.g
            key={city.name}
            role="button"
            tabIndex={0}
            aria-label={`${i + 1}. ${city.name}`}
            aria-pressed={sel === i}
            onClick={() => setSel(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(i))}
            className="cursor-pointer outline-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.28, type: 'spring' }}
            style={{ transformOrigin: `${X(city.lon)}px ${Y(city.lat)}px` }}
          >
            <circle cx={X(city.lon)} cy={Y(city.lat)} r={sel === i ? 13 : 10} fill={sel === i ? 'var(--accent)' : 'var(--surface)'} stroke="var(--accent)" strokeWidth={2.5} />
            <text x={X(city.lon)} y={Y(city.lat) + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill={sel === i ? 'var(--accent-ink)' : 'var(--accent)'}>
              {i + 1}
            </text>
            <text x={X(city.lon) + 16} y={Y(city.lat) + 4} fontSize={13} fontWeight={700} fill="var(--ink)">
              {city.name}
            </text>
          </motion.g>
        ))}
      </svg>
      <div aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">{t('Letter {n} of 7', { n: sel + 1 })}</p>
        <h3 className="mt-1 text-2xl font-bold">{c.name}</h3>
        <p className="mt-2">{c.note}</p>
        <Link to={`/revelation/${c.ch}`} className="btn btn-primary mt-4 no-underline">
          {t('Read the letter in Revelation {ch}', { ch: c.ch })}
        </Link>
        <p className="mt-4 text-xs text-ink-soft">{t('The letters follow a circular road. A courier landing at Ephesus would reach the cities in exactly this order.')}</p>
      </div>
    </div>
  )
}
