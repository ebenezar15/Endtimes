import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Illum } from '../components/Badge'
import { CompareToggle } from '../components/CompareToggle'
import { PageHeader } from '../components/PageHeader'
import { frameworkViews, hermeneuticViews, millennialViews } from '../lib/content'
import { useApp } from '../lib/store'
import type { CorePosition as Position } from '../lib/core'
import { t } from '../lib/i18n'

function Group({ title, intro, items }: { title: string; intro: string; items: Position[] }) {
  const { lensOn, lens } = useApp()
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-3xl">{title}</h2>
      <p className="mt-1 max-w-[65ch] text-ink-soft">{intro}</p>
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((p, i) => {
          const mine = lensOn && (lens.millennial === p.id || lens.hermeneutic === p.id)
          return (
            <motion.li key={p.id} className="relative" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.06, type: 'spring', stiffness: 200, damping: 22 }}>
              {p.axis !== 'framework' && <CompareToggle id={p.id} className="absolute bottom-3 right-3 z-10" />}
              <Link
                to={`/positions/${p.id}`}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
                  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
                }}
                className="leaf glow-card flex h-full gap-4 p-4 pb-12 text-ink no-underline transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent"
              >
                <Illum id={p.id} size={52} />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-xl font-bold">{p.name}</span>
                    {mine && <span className="ui text-sm text-gold">✦ {t('my view')}</span>}
                  </span>
                  <span className="mt-0.5 block italic text-ink-soft">{p.tagline}</span>
                  <span className="mt-2 line-clamp-3 text-[0.97rem]">{p.summary}</span>
                </span>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

export default function Positions() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={t('Positions')} lede={t('Two independent questions and the frameworks beneath them. Each page shows the view as its proponents would present it, then its critics, then the reply.')} />
      <Group title={t('When is the millennium?')} intro={t('The millennial views answer how Christ’s return relates to the “thousand years” of Revelation 20.')} items={millennialViews} />
      <Group title={t('How should Revelation be read?')} intro={t('The interpretive approaches answer when the visions of Revelation (and related prophecy) are fulfilled.')} items={hermeneuticViews} />
      <Group title={t('Frameworks')} intro={t('Whole-Bible systems that shape expectations about Israel, the church and the kingdom.')} items={frameworkViews} />
    </div>
  )
}
